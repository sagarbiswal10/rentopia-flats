
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Home, Building, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const UserDashboardPage = () => {
  const { 
    user, 
    loading, 
    token, 
    userProperties, 
    userRentals, 
    getUserProperties, 
    getUserRentals, 
    cancelRental,
    logout 
  } = useUser();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  
  useEffect(() => {
    if (!loading && !token) {
      toast.error("You must be logged in to view your dashboard");
      navigate('/login');
    } else if (token) {
      // Refresh user properties and rentals when dashboard loads
      getUserProperties();
      getUserRentals();
    }
  }, [loading, token, navigate, getUserProperties, getUserRentals]);
  
  // Function to handle rental cancellation
  const handleCancelRental = async (rentalId) => {
    if (!token) return;
    
    setIsCancelling(true);
    try {
      // Use the cancelRental method from UserContext
      await cancelRental(rentalId);
      
      // Navigate to properties page to see all available properties
      // Refresh the properties page to see the updated list
      setTimeout(() => {
        navigate('/properties');
      }, 1000);
    } catch (error) {
      console.error('Error cancelling rental from dashboard:', error);
    } finally {
      setIsCancelling(false);
    }
  };
  
  // Function to handle the pay rent button click
  const handlePayRent = (rental) => {
    // Ensure we have a valid property ID before navigating
    if (rental && rental.property) {
      // Check if property is an object or just an ID
      const propertyId = typeof rental.property === 'object' ? rental.property._id : rental.property;
      
      if (propertyId) {
        console.log(`Navigating to payment for property: ${propertyId}`);
        navigate(`/payment/${propertyId}`, { state: { rentalId: rental._id } });
      } else {
        toast.error("Cannot process payment: Missing property ID");
      }
    } else {
      toast.error("Cannot process payment: Missing property information");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - User Info */}
            <div className="lg:col-span-1">
              <Card>
                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    
                    {userProperties.length > 0 && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/landlord')}
                      >
                        <Building className="mr-2 h-4 w-4" />
                        Landlord Dashboard
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/post-property')}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      List New Property
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => {
                        logout();
                        navigate('/');
                        toast.success("Logged out successfully");
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <Tabs defaultValue="rentals">
                  <div className="border-b px-6 py-3">
                    <TabsList className="grid w-full md:w-auto grid-cols-1">
                      <TabsTrigger value="rentals">
                        <Home className="h-4 w-4 mr-2" />
                        My Rentals
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="rentals" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Properties You've Rented</h3>
                    
                    {userRentals.length === 0 ? (
                      <div className="text-center py-8">
                        <Home className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <h4 className="text-lg font-medium mb-2">No Rentals Yet</h4>
                        <p className="text-gray-500 mb-4">
                          You haven't rented any properties yet.
                        </p>
                        <Button onClick={() => navigate('/properties')}>
                          Browse Properties
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userRentals.map((rental) => (
                          <Card key={rental._id} className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-4">
                              <div className="md:col-span-1">
                                <img 
                                  src={rental.property?.thumbnailUrl || '/placeholder.svg'} 
                                  alt={rental.property?.title || "Property"}
                                  className="w-full h-full object-cover md:h-40"
                                />
                              </div>
                              <div className="p-4 md:col-span-3">
                                <h4 className="font-semibold mb-2">{rental.property?.title || "Property"}</h4>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {rental.property?.locality || "N/A"}, {rental.property?.city || "N/A"}
                                </div>
                                <div className="text-sm mb-1">
                                  <span>From: {new Date(rental.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="text-sm mb-3">
                                  <span>To: {new Date(rental.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="text-sm mb-3">
                                  <span className="font-medium">Payment Status: </span>
                                  <Badge className={rental.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>
                                    {rental.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                  </Badge>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      const propId = typeof rental.property === 'object' ? rental.property._id : rental.property;
                                      navigate(`/property/${propId}`);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                  
                                  {rental.paymentStatus === 'pending' && (
                                    <>
                                      <Button 
                                        size="sm"
                                        onClick={() => handlePayRent(rental)}
                                      >
                                        Pay Rent
                                      </Button>
                                      
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            variant="destructive" 
                                            size="sm"
                                            disabled={isCancelling}
                                          >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Cancel
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This will permanently cancel your rental request for this property.
                                              The property will be available for others to rent.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleCancelRental(rental._id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              {isCancelling ? 'Cancelling...' : 'Yes, Cancel Rental'}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboardPage;

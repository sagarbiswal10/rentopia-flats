
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Home, Building, User, IndianRupee, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const LandlordDashboardPage = () => {
  const { user, loading, token, userProperties, getUserProperties } = useUser();
  const [propertyRenters, setPropertyRenters] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !token) {
      toast.error("You must be logged in to view your dashboard");
      navigate('/login');
    } else if (token) {
      // Refresh user properties
      getUserProperties();
      
      // Fetch users who have rented properties
      fetchPropertyRenters();
    }
  }, [loading, token, navigate, getUserProperties]);
  
  const fetchPropertyRenters = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/rentals/property-owners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPropertyRenters(data);
      }
    } catch (error) {
      console.error('Error fetching property renters:', error);
      toast.error('Failed to load rental information');
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
                      User Dashboard
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/landlord')}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Landlord Dashboard
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/post-property')}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      List New Property
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <Tabs defaultValue="properties">
                  <div className="border-b px-6 py-3">
                    <TabsList className="grid w-full md:w-auto grid-cols-2">
                      <TabsTrigger value="properties">
                        <Building className="h-4 w-4 mr-2" />
                        My Properties
                      </TabsTrigger>
                      <TabsTrigger value="renters">
                        <User className="h-4 w-4 mr-2" />
                        My Renters
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="properties" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Properties You've Listed</h3>
                    
                    {userProperties.length === 0 ? (
                      <div className="text-center py-8">
                        <Building className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <h4 className="text-lg font-medium mb-2">No Properties Listed Yet</h4>
                        <p className="text-gray-500 mb-4">
                          You haven't listed any properties for rent.
                        </p>
                        <Button onClick={() => navigate('/post-property')}>
                          List a Property
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userProperties.map((property) => (
                          <Card key={property._id} className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-4">
                              <div className="md:col-span-1">
                                <img 
                                  src={property.thumbnailUrl || '/placeholder.svg'} 
                                  alt={property.title}
                                  className="w-full h-full object-cover md:h-40"
                                />
                              </div>
                              <div className="p-4 md:col-span-3">
                                <div className="flex justify-between mb-2">
                                  <h4 className="font-semibold">{property.title}</h4>
                                  <Badge className={property.available ? 'bg-green-500' : 'bg-red-500'}>
                                    {property.available ? 'Available' : 'Rented'}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {property.locality}, {property.city}
                                </div>
                                <div className="flex items-center font-medium mb-3">
                                  <IndianRupee className="h-4 w-4" />
                                  <span>{property.rent.toLocaleString()}</span>
                                  <span className="text-gray-500 font-normal text-sm ml-1">/month</span>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/property/${property._id}`)}
                                  >
                                    View Details
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/edit-property/${property._id}`)}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="renters" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Users Renting Your Properties</h3>
                    
                    {propertyRenters.length === 0 ? (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <h4 className="text-lg font-medium mb-2">No Renters Yet</h4>
                        <p className="text-gray-500 mb-4">
                          None of your properties have been rented yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {propertyRenters.map((rental) => (
                          <Card key={rental._id} className="overflow-hidden">
                            <div className="p-4">
                              <div className="flex justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">{rental.property.title}</h4>
                                  <p className="text-sm text-gray-500">
                                    Rented by: {rental.user.name} ({rental.user.email})
                                  </p>
                                </div>
                                <Badge className={rental.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>
                                  {rental.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-3">
                                <div className="text-sm">
                                  <p>From: {new Date(rental.startDate).toLocaleDateString()}</p>
                                  <p>To: {new Date(rental.endDate).toLocaleDateString()}</p>
                                </div>
                                <div className="font-medium">
                                  <IndianRupee className="h-4 w-4 inline" />
                                  <span>{rental.totalAmount?.toLocaleString() || "N/A"}</span>
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

export default LandlordDashboardPage;

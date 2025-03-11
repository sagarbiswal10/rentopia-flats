
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, IndianRupee, Calendar, Building, Home } from 'lucide-react';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rental, paymentMethod } = location.state || {};
  
  if (!rental) {
    // Redirect to dashboard if no rental data is available
    React.useEffect(() => {
      navigate('/dashboard');
    }, [navigate]);
    
    return null;
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="overflow-hidden">
            <div className="bg-primary text-white p-8 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-xl opacity-90">
                Your booking has been confirmed
              </p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Property Details
                  </h2>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium">{rental.property.title}</h3>
                      <p className="text-gray-600">{rental.property.locality}, {rental.property.city}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Property Type:</span>
                      <span>{rental.property.type}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Furnishing:</span>
                      <span>{rental.property.furnishing}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Rental Period
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">From:</span>
                      <span>{formatDate(rental.rentStartDate)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">To:</span>
                      <span>{formatDate(rental.rentEndDate)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Duration:</span>
                      <span>1 Month</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2 text-primary" />
                  Payment Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">TXN{Math.floor(Math.random() * 1000000)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{paymentMethod}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium">{formatDate(rental.paymentDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="font-medium text-green-600">Paid</span>
                  </div>
                  
                  <div className="flex justify-between md:col-span-2 pt-2 border-t">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold">₹{rental.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')}>
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Download Receipt
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;

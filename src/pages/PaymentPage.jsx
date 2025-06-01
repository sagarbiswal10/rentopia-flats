import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CheckCircle2, IndianRupee, CreditCard, Wallet, Building, Calendar } from 'lucide-react';

const paymentSchema = z.object({
  cardName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
  paymentMethod: z.enum(["card", "upi", "wallet"], { message: "Please select a payment method" }),
});

const PaymentPage = () => {
  const { rentalId } = useParams();
  const location = useLocation();
  const { user, token, getUserRentals, getUserProperties } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rental, setRental] = useState(null);
  const [property, setProperty] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get property data from navigation state if available
  const propertyFromState = location.state?.property;
  
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      paymentMethod: "card",
    },
  });
  
  useEffect(() => {
    console.log('PaymentPage mounted');
    console.log('Rental ID from params:', rentalId);
    console.log('Property from state:', propertyFromState);
    console.log('User:', user);
    console.log('Token:', token ? 'Present' : 'Missing');

    if (!user) {
      console.log('User not logged in, redirecting to login');
      toast.error("You must be logged in to make a payment");
      navigate('/login');
      return;
    }

    if (!token) {
      console.error('Authentication token is missing');
      toast.error("Authentication token is missing. Please log in again.");
      navigate('/login');
      return;
    }

    // If we have a property from navigation state but no rental ID, 
    // we need to create a rental first
    if (propertyFromState && !rentalId) {
      console.log('Creating rental for property:', propertyFromState._id);
      createRentalForProperty(propertyFromState);
      return;
    }

    // If we have a rental ID, fetch the rental details
    if (rentalId) {
      fetchRentalAndProperty();
      return;
    }

    // If we have neither rental ID nor property, redirect to properties
    console.error('No rental ID or property data available');
    setError('No rental or property information available');
    toast.error("Please select a property to rent first");
    navigate('/properties');
  }, [rentalId, user, token, navigate, propertyFromState]);

  const createRentalForProperty = async (propertyData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Creating rental for property:', propertyData._id);
      
      // Calculate rental dates (example: 1 month from now)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      // Calculate total amount (rent + deposit)
      const calculatedTotal = (propertyData.rent || 0) + (propertyData.deposit || 0);
      
      const rentalData = {
        propertyId: propertyData._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalAmount: calculatedTotal,
        selectedServices: {
          packing: false,
          moving: false,
          cleaning: false,
          painting: false
        }
      };
      
      const response = await fetch('http://localhost:5000/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(rentalData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create rental');
      }
      
      const newRental = await response.json();
      console.log('Rental created successfully:', newRental);
      
      // Update the URL with the new rental ID
      navigate(`/payment/${newRental._id}`, { replace: true });
      
    } catch (error) {
      console.error('Error creating rental:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to create rental. Please try again.');
      setIsLoading(false);
    }
  };
  
  const fetchRentalAndProperty = async () => {
    try {
      console.log(`Fetching rental with ID: ${rentalId}`);
      setIsLoading(true);
      setError(null);
      
      // Fetch the rental details
      const rentalResponse = await fetch(`http://localhost:5000/api/rentals/${rentalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Rental fetch response status:', rentalResponse.status);
      
      if (!rentalResponse.ok) {
        const errorData = await rentalResponse.json().catch(() => ({}));
        console.error('Failed to fetch rental:', errorData);
        
        if (rentalResponse.status === 404) {
          throw new Error('Rental not found. Please create a new rental.');
        }
        
        throw new Error(errorData.message || `Failed to fetch rental details: ${rentalResponse.status}`);
      }
      
      const rentalData = await rentalResponse.json();
      console.log('Rental data fetched successfully:', rentalData);
      
      if (!rentalData || !rentalData._id) {
        throw new Error('Invalid rental data received');
      }
      
      setRental(rentalData);
      
      // Check if payment is already completed
      if (rentalData.paymentStatus === 'paid') {
        toast.info("This rental has already been paid for");
        setTimeout(() => navigate('/dashboard'), 1500);
        return;
      }
      
      // Fetch property details
      const propertyId = rentalData.property._id || rentalData.property;
      console.log('Fetching property with ID:', propertyId);
      
      const propertyResponse = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!propertyResponse.ok) {
        const errorData = await propertyResponse.json().catch(() => ({}));
        console.error('Failed to fetch property:', errorData);
        throw new Error(errorData.message || 'Failed to fetch property details');
      }
      
      const propertyData = await propertyResponse.json();
      console.log('Property data fetched successfully:', propertyData);
      setProperty(propertyData);
      
      // Set total amount from rental
      setTotalAmount(rentalData.totalAmount || 0);
      
    } catch (error) {
      console.error('Error in fetchRentalAndProperty:', error);
      setError(error.message);
      toast.error(error.message || 'Unable to load payment details. Please try again.');
      
      // If rental not found, redirect to properties after delay
      if (error.message.includes('not found')) {
        setTimeout(() => navigate('/properties'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (values) => {
    if (!user || !rental || !property) {
      toast.error("Unable to process payment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Processing payment with values:', values);
      console.log('Rental:', rental);
      
      // Create payment
      const paymentResponse = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rentalId: rental._id,
          amount: totalAmount,
          paymentMethod: values.paymentMethod,
          cardDetails: values.paymentMethod === 'card' ? {
            name: values.cardName,
            number: values.cardNumber,
            expiry: values.expiryDate,
            cvv: values.cvv,
          } : null,
        }),
      });
      
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Payment failed');
      }
      
      const paymentData = await paymentResponse.json();
      console.log('Payment created successfully:', paymentData);
      
      // Update the rental with payment information
      const updateResponse = await fetch(`http://localhost:5000/api/rentals/${rental._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentId: paymentData._id,
        }),
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update rental payment status');
      }
      
      const updatedRental = await updateResponse.json();
      console.log('Rental updated with payment:', updatedRental);
      
      // Refresh user rentals and properties
      getUserRentals();
      getUserProperties();
      
      toast.success("Payment successful! Property rented successfully.");
      
      // Redirect to success page after delay
      setTimeout(() => {
        navigate('/payment-success', { 
          state: { 
            rental: {
              ...updatedRental,
              property: property,
              paymentDate: new Date().toISOString(),
              amount: totalAmount
            },
            paymentMethod: values.paymentMethod 
          } 
        });
      }, 1000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-2">Loading payment details...</p>
            <p className="text-sm text-gray-600">
              {rentalId ? `Rental ID: ${rentalId}` : 'Creating rental...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              {rentalId ? `Rental ID: ${rentalId}` : 'No rental ID provided'}
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/properties')} 
                className="w-full"
              >
                Browse Properties
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!rental || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-2">Rental not found</p>
            <p className="text-sm text-gray-600">
              {rentalId ? `Rental ID: ${rentalId}` : 'No rental ID provided'}
            </p>
            <Button 
              onClick={() => navigate('/properties')} 
              className="mt-4"
            >
              Browse Properties
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Secure Payment</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Select Payment Method</h2>
                        
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                              >
                                <FormItem className="flex flex-col items-center space-y-3 rounded-md border p-4 cursor-pointer [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                  <FormControl>
                                    <RadioGroupItem value="card" className="sr-only" />
                                  </FormControl>
                                  <CreditCard className="h-6 w-6" />
                                  <FormLabel className="font-normal cursor-pointer">
                                    Credit/Debit Card
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex flex-col items-center space-y-3 rounded-md border p-4 cursor-pointer [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                  <FormControl>
                                    <RadioGroupItem value="upi" className="sr-only" />
                                  </FormControl>
                                  <span className="text-xl font-semibold">UPI</span>
                                  <FormLabel className="font-normal cursor-pointer">
                                    UPI Payment
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex flex-col items-center space-y-3 rounded-md border p-4 cursor-pointer [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                  <FormControl>
                                    <RadioGroupItem value="wallet" className="sr-only" />
                                  </FormControl>
                                  <Wallet className="h-6 w-6" />
                                  <FormLabel className="font-normal cursor-pointer">
                                    Wallet
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Card details form - only shown if card payment method is selected */}
                      {form.watch('paymentMethod') === 'card' && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Card Details</h2>
                          
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234 5678 9012 3456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                      
                      {form.watch('paymentMethod') === 'upi' && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">UPI Details</h2>
                          <p className="text-gray-600 mb-4">
                            Enter your UPI ID to proceed with the payment.
                          </p>
                          
                          <FormItem>
                            <FormLabel>UPI ID</FormLabel>
                            <FormControl>
                              <Input placeholder="yourname@upi" />
                            </FormControl>
                          </FormItem>
                        </div>
                      )}
                      
                      {form.watch('paymentMethod') === 'wallet' && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Wallet</h2>
                          <p className="text-gray-600 mb-4">
                            Choose your preferred wallet provider to proceed with the payment.
                          </p>
                          
                          <div className="grid grid-cols-3 gap-4">
                            {["Paytm", "PhonePe", "Amazon Pay"].map((wallet) => (
                              <div 
                                key={wallet} 
                                className="border rounded-md p-4 text-center cursor-pointer hover:border-primary"
                              >
                                {wallet}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Processing Payment..." : `Pay ₹${totalAmount.toLocaleString()}`}
                      </Button>
                    </form>
                  </Form>
                </div>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">{property.title}</h3>
                        <p className="text-sm text-gray-500">{property.locality}, {property.city}</p>
                        <p className="text-xs text-gray-400">Rental ID: {rentalId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          {new Date(rental.startDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                          {' - '}
                          {new Date(rental.endDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monthly Rent</span>
                        <span>₹{property.rent?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security Deposit</span>
                        <span>₹{property.deposit?.toLocaleString() || '0'}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bg-primary/10 p-3 rounded-md text-sm mt-4">
                      <p>
                        <span className="font-medium">Note:</span> This payment includes your first month's rent and the security deposit.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;

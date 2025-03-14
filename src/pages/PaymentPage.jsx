
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { user, token, addRental } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [existingRental, setExistingRental] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  
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
    if (!user) {
      toast.error("You must be logged in to make a payment");
      navigate('/login');
      return;
    }
    
    const fetchProperty = async () => {
      try {
        console.log(`Fetching property with ID: ${rentalId}`);
        
        // Fetch the property that the user wants to rent
        const response = await fetch(`http://localhost:5000/api/properties/${rentalId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch property details: ${response.status}`);
        }
        
        const propertyData = await response.json();
        console.log('Property data fetched:', propertyData);
        setProperty(propertyData);
        
        // Calculate total amount (rent + deposit)
        setTotalAmount(propertyData.rent + propertyData.deposit);
        
        // Check if user already has a rental for this property
        const rentalsResponse = await fetch('http://localhost:5000/api/rentals/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (rentalsResponse.ok) {
          const userRentals = await rentalsResponse.json();
          const rental = userRentals.find(r => r.property._id === rentalId && r.status === 'active');
          
          if (rental) {
            console.log('Existing rental found:', rental);
            setExistingRental(rental);
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Unable to load property details. Please try again.');
        setTimeout(() => navigate('/properties'), 1500);
      }
    };
    
    if (rentalId) {
      fetchProperty();
    } else {
      toast.error('Property ID is missing');
      navigate('/dashboard');
    }
  }, [rentalId, user, navigate, token]);
  
  const onSubmit = async (values) => {
    if (!user || !property) {
      toast.error("Unable to process payment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If there's an existing rental with pending payment, update it instead of creating a new one
      let rentalData;
      
      if (existingRental && existingRental.paymentStatus === 'pending') {
        console.log('Updating existing rental with payment information');
        
        // Create payment first
        const paymentResponse = await fetch('http://localhost:5000/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId: property._id,
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
        
        // Update the existing rental with payment information
        const updateResponse = await fetch(`http://localhost:5000/api/rentals/${existingRental._id}`, {
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
        
        rentalData = await updateResponse.json();
      } else {
        // Create a new payment
        const paymentResponse = await fetch('http://localhost:5000/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId: property._id,
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
        
        // Create a rental record after successful payment
        const rentalResponse = await fetch('http://localhost:5000/api/rentals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId: property._id,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 11)).toISOString(), // 12 months rental
            totalAmount,
          }),
        });
        
        if (!rentalResponse.ok) {
          const errorData = await rentalResponse.json();
          throw new Error(errorData.message || 'Failed to create rental record');
        }
        
        rentalData = await rentalResponse.json();
      }
      
      toast.success("Payment successful! Property rented successfully.");
      
      // Redirect to success page after delay
      setTimeout(() => {
        navigate('/payment-success', { 
          state: { 
            rental: rentalData,
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
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading payment details...</p>
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
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          {new Date().toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                          {' - '}
                          {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-US', { 
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
                        <span>₹{property.rent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security Deposit</span>
                        <span>₹{property.deposit.toLocaleString()}</span>
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

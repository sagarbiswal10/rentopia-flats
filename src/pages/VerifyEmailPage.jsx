
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUser } from '@/contexts/UserContext';

// Validation schema
const verifySchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  code: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { login } = useUser();
  
  // Get email and code from query parameters
  const queryParams = new URLSearchParams(search);
  const emailParam = queryParams.get('email');
  const codeParam = queryParams.get('code');
  
  // Verification form
  const verifyForm = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailParam || "",
      code: codeParam || "",
    },
  });

  useEffect(() => {
    // If both email and code are provided in URL, verify automatically
    if (emailParam && codeParam) {
      verifyForm.setValue('email', emailParam);
      verifyForm.setValue('code', codeParam);
      onVerify({ email: emailParam, code: codeParam });
    }
  }, [emailParam, codeParam]);

  const onVerify = async (values) => {
    setIsLoading(true);
    
    try {
      // API call to backend for verification
      const response = await fetch('http://localhost:5000/api/users/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          code: values.code,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      // Verification successful
      setIsVerified(true);
      toast.success("Email verified successfully!");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-6">
          {isVerified ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">Your email has been successfully verified. Redirecting to login...</p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
              
              <Form {...verifyForm}>
                <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-4">
                  <FormField
                    control={verifyForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input placeholder="Enter your email" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={verifyForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifyEmailPage;

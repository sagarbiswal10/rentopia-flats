
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUser } from '@/contexts/UserContext';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  
  const [verificationCode, setVerificationCode] = useState(code || '');
  const [emailAddress, setEmailAddress] = useState(email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const { user, login } = useUser();
  
  // Handle auto-verification if code and email are in URL
  useEffect(() => {
    if (code && email) {
      handleVerification();
    }
  }, [code, email]);
  
  const handleVerification = async () => {
    if (!emailAddress || !verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid verification code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // API call to backend for verification
      const response = await fetch('http://localhost:5000/api/users/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          code: verificationCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      // Verification successful
      setVerificationStatus('success');
      toast.success("Email verified successfully!");
      
      // Update user data if logged in
      if (user) {
        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // If not logged in, redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setVerificationStatus('error');
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
          {verificationStatus === 'pending' && (
            <>
              <div className="text-center mb-6">
                <div className="bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Verify Your Email</h2>
                <p className="text-gray-600 mt-2">
                  Enter the 6-digit code sent to your email address
                </p>
              </div>
              
              <div className="space-y-4">
                {!email && (
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your email"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Code</label>
                  <div className="flex justify-center">
                    <InputOTP 
                      value={verificationCode} 
                      onChange={setVerificationCode}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <Button 
                  onClick={handleVerification} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>
              </div>
            </>
          )}
          
          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Email Verified</h2>
              <p className="text-gray-600 mt-2 mb-6">
                Your email has been verified successfully.
              </p>
              <Button 
                onClick={() => navigate(user ? '/dashboard' : '/login')} 
                className="w-full"
              >
                {user ? "Go to Dashboard" : "Login"}
              </Button>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold">Verification Failed</h2>
              <p className="text-gray-600 mt-2 mb-6">
                The verification code is invalid or has expired.
              </p>
              <Button 
                onClick={() => setVerificationStatus('pending')} 
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifyEmailPage;

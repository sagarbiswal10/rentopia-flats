
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for phone verification
 * @param {string} token - User authentication token
 * @returns {Object} - Functions and state for phone verification
 */
const usePhoneVerification = (token) => {
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  /**
   * Request phone verification code
   * @param {string} phoneNumber - Phone number to verify
   */
  const requestVerification = async (phoneNumber) => {
    if (!token) {
      toast.error('You must be logged in to verify your phone number');
      return false;
    }

    try {
      setIsVerifying(true);
      
      const response = await fetch('http://localhost:5000/api/users/verify-phone-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }
      
      // Show code for testing
      if (data.code) {
        console.log('Verification code:', data.code);
        setVerificationCode(data.code);
        toast.info(`Your OTP is: ${data.code}`, { 
          duration: 10000,
          description: "Use this code for verification" 
        });
      }
      
      setIsVerificationSent(true);
      toast.success('Verification code generated successfully');
      return true;
    } catch (error) {
      console.error('Error in phone verification:', error);
      toast.error(error.message || 'An error occurred during phone verification');
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Verify phone number with code
   * @param {string} code - Verification code
   */
  const verifyPhone = async (code) => {
    if (!token) {
      toast.error('You must be logged in to verify your phone number');
      return false;
    }

    try {
      setIsVerifying(true);
      
      const response = await fetch('http://localhost:5000/api/users/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify phone number');
      }
      
      toast.success('Phone number verified successfully');
      return true;
    } catch (error) {
      console.error('Error verifying phone:', error);
      toast.error(error.message || 'Failed to verify phone number');
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isVerificationSent,
    isVerifying,
    verificationCode,
    requestVerification,
    verifyPhone,
    setVerificationCode,
  };
};

export default usePhoneVerification;

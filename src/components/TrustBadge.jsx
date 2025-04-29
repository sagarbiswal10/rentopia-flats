
import React from 'react';
import { Shield, User, Phone, CreditCard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TrustBadge = ({ user }) => {
  const {
    emailVerified = false,
    phoneVerified = false,
    identityVerified = false,
    listingCount = 0,
    rentalCompletedCount = 0,
    memberSince = new Date(),
  } = user;
  
  // Calculate trust score based on verifications and activity
  const calculateTrustScore = () => {
    let score = 0;
    
    // Base points for verification
    if (emailVerified) score += 10;
    if (phoneVerified) score += 20;
    if (identityVerified) score += 40;
    
    // Points for activity
    score += Math.min(listingCount * 2, 10); // Max 10 points for listings
    score += Math.min(rentalCompletedCount * 5, 20); // Max 20 points for completed rentals
    
    // Longevity bonus
    const accountAgeInMonths = (new Date() - new Date(memberSince)) / (1000 * 60 * 60 * 24 * 30);
    score += Math.min(Math.floor(accountAgeInMonths), 10); // Up to 10 points for account age
    
    return Math.min(score, 100); // Cap at 100
  };
  
  const trustScore = calculateTrustScore();
  
  // Determine badge level based on trust score
  const getBadgeLevel = () => {
    if (trustScore >= 80) return { level: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (trustScore >= 50) return { level: 'Silver', color: 'text-gray-500', bg: 'bg-gray-100' };
    return { level: 'Bronze', color: 'text-amber-700', bg: 'bg-amber-50' };
  };
  
  const badge = getBadgeLevel();

  // Get verification icons
  const getVerificationIcons = () => {
    return (
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <User className={`h-4 w-4 ${emailVerified ? 'text-green-500' : 'text-gray-300'}`} />
            </TooltipTrigger>
            <TooltipContent>
              {emailVerified ? 'Email Verified' : 'Email Not Verified'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Phone className={`h-4 w-4 ${phoneVerified ? 'text-green-500' : 'text-gray-300'}`} />
            </TooltipTrigger>
            <TooltipContent>
              {phoneVerified ? 'Phone Verified' : 'Phone Not Verified'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CreditCard className={`h-4 w-4 ${identityVerified ? 'text-green-500' : 'text-gray-300'}`} />
            </TooltipTrigger>
            <TooltipContent>
              {identityVerified ? 'Identity Verified' : 'Identity Not Verified'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };
  
  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full ${badge.bg}`}>
      <Shield className={`h-4 w-4 mr-1.5 ${badge.color}`} />
      <span className={`text-sm font-medium ${badge.color}`}>{badge.level} Trust</span>
      <div className="ml-2 pl-2 border-l border-gray-300">
        {getVerificationIcons()}
      </div>
    </div>
  );
};

export default TrustBadge;

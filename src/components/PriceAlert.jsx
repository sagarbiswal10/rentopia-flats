
import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PriceAlert = ({ averagePrice, currentPrice }) => {
  // Only show if the price is significantly lower than average
  if (currentPrice > averagePrice * 0.7) {
    return null; // Price is within reasonable range
  }
  
  const percentLower = Math.round(((averagePrice - currentPrice) / averagePrice) * 100);
  
  return (
    <Alert variant="warning" className="mt-4 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 font-medium">Price Alert</AlertTitle>
      <AlertDescription className="text-amber-700">
        This property is priced {percentLower}% below similar properties in this area.
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-1 underline cursor-help">Why am I seeing this?</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Unusually low prices can sometimes indicate a potential scam. Always meet in person
                and verify the property exists before making any payments.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDescription>
    </Alert>
  );
};

export default PriceAlert;

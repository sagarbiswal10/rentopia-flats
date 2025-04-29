
import React from 'react';
import { Shield, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const VerificationBadge = ({ status }) => {
  let icon, text, tooltipText, variant;
  
  switch(status) {
    case 'verified':
      icon = <Shield className="h-4 w-4 text-green-600" />;
      text = "Verified";
      tooltipText = "This property has been verified by our team";
      variant = "success";
      break;
    case 'pending':
      icon = <ShieldQuestion className="h-4 w-4 text-yellow-500" />;
      text = "Pending";
      tooltipText = "This property is pending verification";
      variant = "warning";
      break;
    case 'rejected':
      icon = <ShieldAlert className="h-4 w-4 text-red-500" />;
      text = "Flagged";
      tooltipText = "This property has been flagged for suspicious activity";
      variant = "destructive";
      break;
    default:
      icon = <ShieldQuestion className="h-4 w-4 text-gray-400" />;
      text = "Unverified";
      tooltipText = "This property has not been verified yet";
      variant = "secondary";
  }
  
  const getBadgeClass = () => {
    switch(variant) {
      case 'success':
        return "bg-green-100 text-green-800 border-green-200";
      case 'warning':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'destructive':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`flex items-center gap-1 ${getBadgeClass()}`}>
            {icon}
            <span>{text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;

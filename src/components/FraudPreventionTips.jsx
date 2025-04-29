
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Eye, DollarSign, UserCheck, MapPin } from 'lucide-react';

const FraudPreventionTips = () => {
  return (
    <Card>
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-blue-800 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Stay Safe: Fraud Prevention Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">Before Viewing a Property</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 list-disc pl-5 text-gray-700">
                <li>Check property verification status and landlord trust score</li>
                <li>Research typical rental prices in the area to identify suspiciously low prices</li>
                <li>Verify the property address exists using online maps</li>
                <li>Ask for additional photos or video tour if available</li>
                <li>Never pay any fees before viewing the property in person</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">During Property Viewings</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 list-disc pl-5 text-gray-700">
                <li>Try to view properties during daylight hours</li>
                <li>Take someone with you or inform someone about your viewing schedule</li>
                <li>Verify the person showing the property is the actual owner/agent</li>
                <li>Ask to see property ownership documents</li>
                <li>Check that the property matches the listing description and images</li>
                <li>Beware of high-pressure tactics to make quick decisions</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base">Making Payments</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 list-disc pl-5 text-gray-700">
                <li>Only make payments through our secure platform</li>
                <li>Never pay in cash without proper documentation</li>
                <li>Be suspicious if asked to wire money or use gift cards</li>
                <li>Always get a receipt for any payment made</li>
                <li>Ensure you receive a copy of the signed rental agreement</li>
                <li>Be wary of landlords who claim they're out of the country or can't meet in person</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base">Warning Signs of Rental Scams</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p><span className="font-medium">Unusually low rent</span>: If the rent is significantly below market rate, it might be a scam.</p>
                </div>
                
                <div className="flex items-start">
                  <Eye className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p><span className="font-medium">Can't view the property</span>: Landlord makes excuses about why you can't see the property before paying.</p>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p><span className="font-medium">Requesting wire transfers</span>: Being asked to wire money or pay via gift cards is a major red flag.</p>
                </div>
                
                <div className="flex items-start">
                  <UserCheck className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p><span className="font-medium">No screening process</span>: Legitimate landlords typically verify income and check references.</p>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p><span className="font-medium">Vague location details</span>: Listing doesn't show the exact address or only shows distant exterior shots.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            If you encounter suspicious listings or activity, please use the "Report Listing" button or contact our
            support team immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudPreventionTips;

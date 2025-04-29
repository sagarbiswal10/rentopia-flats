
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Flag } from "lucide-react";

const PropertyReportButton = ({ propertyId }) => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    if (!user) {
      toast.error("You must be logged in to report a property");
      navigate('/login');
      return;
    }

    if (!reason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason,
          details
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully. Our team will review it.");
      setOpen(false);
      setReason("");
      setDetails("");
    } catch (error) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
          <Flag className="h-4 w-4 mr-1" />
          Report Listing
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Suspicious Property</DialogTitle>
          <DialogDescription>
            Please tell us why you think this property listing is suspicious or fraudulent.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Reporting</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="flex items-center space-x-2 py-2">
                <Radio id="fake" value="fake" />
                <Label htmlFor="fake">Fake or non-existent property</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Radio id="scam" value="scam" />
                <Label htmlFor="scam">Scam or suspicious pricing</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Radio id="misrepresent" value="misrepresent" />
                <Label htmlFor="misrepresent">Misrepresentation of property</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Radio id="personal_info" value="personal_info" />
                <Label htmlFor="personal_info">Asking for personal/financial information</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Radio id="other" value="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Additional Details</Label>
            <Textarea
              id="details"
              placeholder="Please provide any additional information about why you're reporting this property..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleReport} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyReportButton;

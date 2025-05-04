
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Home, MapPin, IndianRupee, Upload, Calendar, Shield, Lock, Flag } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const propertySchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters" }),
  type: z.string().min(1, { message: "Please select a property type" }),
  rent: z.coerce.number().positive({ message: "Rent must be a positive number" }),
  deposit: z.coerce.number().positive({ message: "Deposit must be a positive number" }),
  bedrooms: z.coerce.number().int().positive({ message: "Bedrooms must be a positive number" }),
  bathrooms: z.coerce.number().int().positive({ message: "Bathrooms must be a positive number" }),
  area: z.coerce.number().positive({ message: "Area must be a positive number" }),
  furnishing: z.string().min(1, { message: "Please select a furnishing status" }),
  locality: z.string().min(3, { message: "Locality must be at least 3 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  description: z.string().min(50, { message: "Description must be at least 50 characters" }),
  amenities: z.array(z.string()).min(1, { message: "Please select at least one amenity" }),
  available: z.boolean(),
  availableFrom: z.string().min(1, { message: "Please select an availability date" }),
  addressProof: z.any().optional(),
  ownershipProof: z.any().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

const ListPropertyPage = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [userVerification, setUserVerification] = useState({
    emailVerified: false,
    phoneVerified: false,
    identityVerified: false,
    trustScore: 0,
    listingLimit: 3,
    listingsCount: 0,
  });
  const [openVerificationDialog, setOpenVerificationDialog] = useState(false);
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to list a property");
      navigate('/login');
    } else {
      // Get user verification details
      fetchUserVerification();
    }
  }, [user, navigate]);

  const fetchUserVerification = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserVerification({
          emailVerified: userData.emailVerified || false,
          phoneVerified: userData.phoneVerified || false,
          identityVerified: userData.verificationDetails?.identityVerified || false,
          trustScore: userData.verificationDetails?.trustScore || 0,
          listingLimit: userData.verificationDetails?.listingLimit || 3,
          listingsCount: 0, // Will be updated later
        });
        
        // Fetch user's current listings count
        const propertiesResponse = await fetch('http://localhost:5000/api/properties/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (propertiesResponse.ok) {
          const properties = await propertiesResponse.json();
          setUserVerification(prev => ({
            ...prev,
            listingsCount: properties.length
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user verification:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      type: "apartment",
      rent: "",
      deposit: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      furnishing: "semi-furnished",
      locality: "",
      city: "",
      state: "",
      description: "",
      amenities: [],
      available: true,
      availableFrom: new Date().toISOString().split('T')[0],
      addressProof: null,
      ownershipProof: null,
      termsAccepted: false,
    },
  });

  const handleAmenityToggle = (amenity) => {
    setAmenities(current => {
      if (current.includes(amenity)) {
        const updated = current.filter(a => a !== amenity);
        form.setValue('amenities', updated);
        return updated;
      } else {
        const updated = [...current, amenity];
        form.setValue('amenities', updated);
        return updated;
      }
    });
  };

  const requestPhoneVerification = async () => {
    try {
      const phone = prompt("Enter your phone number for verification (Indian format):");
      
      if (!phone) return;
      
      const response = await fetch('http://localhost:5000/api/users/verify-phone-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Verification code sent to your phone");
        
        // In development, show the code from the response if available
        if (data.code) {
          toast.info(`Development mode: Your verification code is ${data.code}`);
        }
        
        const verificationCode = prompt("Enter the verification code sent to your phone:");
        
        if (verificationCode) {
          const verifyResponse = await fetch('http://localhost:5000/api/users/verify-phone', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ code: verificationCode })
          });
          
          if (verifyResponse.ok) {
            toast.success("Phone number verified successfully!");
            fetchUserVerification();
          } else {
            const error = await verifyResponse.json();
            toast.error(error.message || "Phone verification failed");
          }
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Error in phone verification:", error);
      toast.error("An error occurred during phone verification");
    }
  };

  const submitIdentityVerification = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/verify-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        toast.success("Identity verification submitted successfully!");
        setOpenVerificationDialog(false);
        fetchUserVerification();
      } else {
        const error = await response.json();
        toast.error(error.message || "Identity verification submission failed");
      }
    } catch (error) {
      console.error("Error in identity verification:", error);
      toast.error("An error occurred during identity verification");
    }
  };

  const onSubmit = async (values) => {
    if (!user) {
      toast.error("You must be logged in to list a property");
      navigate('/login');
      return;
    }
    
    // Check if user has reached their listing limit
    if (userVerification.listingsCount >= userVerification.listingLimit) {
      toast.error(`You have reached your listing limit of ${userVerification.listingLimit}. Please verify your account to increase your limit.`);
      setOpenVerificationDialog(true);
      return;
    }
    
    // Check if important verifications are done
    if (!userVerification.emailVerified) {
      toast.error("Please verify your email before listing a property");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create property data object
      const propertyData = {
        ...values,
        images: ["/placeholder.svg"], // Placeholder images array (would be replaced with actual images in production)
        thumbnailUrl: "/placeholder.svg", // Placeholder image
      };
      
      // Send data to backend API
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property");
      }
      
      const newProperty = await response.json();
      
      toast.success("Property listed successfully!");
      navigate(`/property/${newProperty._id}`);
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error(error.message || "Failed to list property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // List of amenities to choose from
  const amenityOptions = [
    "Parking", "Security", "Gym", "Swimming Pool", "Power Backup", 
    "Lift", "Gas Pipeline", "Club House", "Children's Play Area", "Garden",
    "WiFi", "Air Conditioning", "Water Purifier", "Washing Machine", "Refrigerator"
  ];

  const renderVerificationStatus = () => {
    const totalVerifications = 3;
    const completedVerifications = [
      userVerification.emailVerified,
      userVerification.phoneVerified,
      userVerification.identityVerified
    ].filter(Boolean).length;
    
    const percentage = (completedVerifications / totalVerifications) * 100;
    
    return (
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Account Verification Status
          </h3>
          <Badge variant={percentage === 100 ? "success" : "secondary"}>
            {percentage === 100 ? "Fully Verified" : "Verification Needed"}
          </Badge>
        </div>
        
        <Progress value={percentage} className="h-2 mb-4" />
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Badge variant={userVerification.emailVerified ? "success" : "outline"} className="mr-2">
                {userVerification.emailVerified ? "Verified" : "Unverified"}
              </Badge>
              Email Verification
            </span>
            {!userVerification.emailVerified && (
              <Button variant="outline" size="sm" onClick={() => alert("Check your email for verification link")}>
                Verify Email
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Badge variant={userVerification.phoneVerified ? "success" : "outline"} className="mr-2">
                {userVerification.phoneVerified ? "Verified" : "Unverified"}
              </Badge>
              Phone Verification
            </span>
            {!userVerification.phoneVerified && (
              <Button variant="outline" size="sm" onClick={requestPhoneVerification}>
                Verify Phone
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Badge variant={userVerification.identityVerified ? "success" : "outline"} className="mr-2">
                {userVerification.identityVerified ? "Verified" : "Unverified"}
              </Badge>
              Identity Verification
            </span>
            {!userVerification.identityVerified && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setOpenVerificationDialog(true)}
              >
                Verify Identity
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Verification increases your trust score and listing limits.</p>
          <p className="mt-1">
            Current listing limit: <span className="font-medium">{userVerification.listingsCount} / {userVerification.listingLimit}</span>
          </p>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Home className="h-6 w-6 mr-2 text-primary" />
                <h1 className="text-2xl font-bold">List Your Property</h1>
              </div>
              
              {renderVerificationStatus()}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Property Details */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Basic Details</h2>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Spacious 2BHK with mountain view" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="apartment">Apartment</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="villa">Villa</SelectItem>
                                <SelectItem value="condo">Condo</SelectItem>
                                <SelectItem value="office">Office Space</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="furnishing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Furnishing Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select furnishing status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                                <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                                <SelectItem value="unfurnished">Unfurnished</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area (sq.ft)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Rent & Deposit */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Rent & Deposit</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Rent (₹)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input type="number" min="0" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deposit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Security Deposit (₹)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input type="number" min="0" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Location</h2>
                    
                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locality/Area</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input placeholder="e.g. Koramangala" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Bengaluru" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Karnataka" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Property Ownership Verification */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-md border border-gray-200 mt-2">
                      <h3 className="text-md font-medium flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-primary" />
                        Property Verification
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="addressProof"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Proof</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png" 
                                onChange={(e) => {
                                  // In a real app, this would upload the file
                                  field.onChange(e.target.files ? e.target.files[0] : null);
                                }} 
                              />
                            </FormControl>
                            <FormDescription>
                              Upload utility bill or other proof of address
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownershipProof"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ownership Proof</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png" 
                                onChange={(e) => {
                                  // In a real app, this would upload the file
                                  field.onChange(e.target.files ? e.target.files[0] : null);
                                }} 
                              />
                            </FormControl>
                            <FormDescription>
                              Upload property deed, tax receipt, or rental agreement
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <p className="text-sm text-muted-foreground mt-2">
                        Properties with verified ownership documents get preferential listing and higher trust scores.
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Description</h2>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your property in detail, including unique features, nearby facilities, etc." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed and accurate description of at least 50 characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Amenities */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Amenities</h2>
                    
                    <FormField
                      control={form.control}
                      name="amenities"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {amenityOptions.map((amenity) => (
                              <div
                                key={amenity}
                                className={`flex items-center p-3 border rounded-md cursor-pointer ${
                                  amenities.includes(amenity) ? 'border-primary bg-primary/10' : 'border-gray-200'
                                }`}
                                onClick={() => handleAmenityToggle(amenity)}
                              >
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={amenities.includes(amenity)}
                                  onChange={() => {}}
                                />
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Availability */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Availability</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Available for Rent</FormLabel>
                              <FormDescription>
                                Is this property ready to be rented?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="availableFrom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available From</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input type="date" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload (placeholder) */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Property Images</h2>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag & drop images here, or click to select files
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        (Upload feature is not implemented in this demo)
                      </p>
                    </div>
                    <FormDescription>
                      Using real property photos increases trust. Avoid stock images or misrepresentations.
                    </FormDescription>
                  </div>

                  {/* Terms and Conditions */}
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 pt-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Terms and Conditions</FormLabel>
                          <FormDescription>
                            I confirm that I am authorized to list this property and that all information provided is accurate and truthful. I understand that providing false information may result in account suspension.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting || userVerification.listingsCount >= userVerification.listingLimit}>
                    {isSubmitting ? "Listing Property..." : "List Property"}
                  </Button>
                </form>
              </Form>
            </div>
          </Card>
        </div>
      </main>

      {/* Identity Verification Dialog */}
      <Dialog open={openVerificationDialog} onOpenChange={setOpenVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Identity</DialogTitle>
            <DialogDescription>
              Identity verification increases your trust score and listing limits.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">ID Type</label>
              <Select defaultValue="passport">
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="national_id">National ID Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ID Number</label>
              <Input placeholder="Enter ID number" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Upload ID Document</label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              <p className="text-xs text-gray-500 mt-1">Upload a clear image of your ID document</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setOpenVerificationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => submitIdentityVerification({
              idType: "passport", // In a real app, get from form
              idNumber: "ABC123456", // In a real app, get from form
              idImage: "placeholder" // In a real app, upload the file
            })}>
              Submit Verification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ListPropertyPage;

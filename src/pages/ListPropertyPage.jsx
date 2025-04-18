import React, { useState } from 'react';
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
import { Home, MapPin, IndianRupee, Upload, Calendar, FileCheck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  description: z.string().min(30, { message: "Description must be at least 30 characters" }),
  amenities: z.array(z.string()).min(1, { message: "Please select at least one amenity" }),
  available: z.boolean(),
  availableFrom: z.string().min(1, { message: "Please select an availability date" }),
  verificationAgreement: z.boolean().refine(val => val === true, { 
    message: "You must agree to verify your property" 
  }),
});

const ListPropertyPage = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenities, setAmenities] = useState([]);
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to list a property");
      navigate('/login');
    }
  }, [user, navigate]);

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
      verificationAgreement: false,
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

  const onSubmit = async (values) => {
    if (!user) {
      toast.error("You must be logged in to list a property");
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create property data object
      const propertyData = {
        ...values,
        images: ["/placeholder.svg"], // Placeholder images array (would be replaced with actual images in production)
        thumbnailUrl: "/placeholder.svg", // Placeholder image
        verificationDocuments: ["/placeholder.svg"], // Placeholder for verification documents
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
      
      toast.success("Property submitted for verification! Your listing will be reviewed by our team.");
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
              
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  All property listings must be verified before they appear publicly. Please be prepared to upload 
                  ownership documents or rental agreement to verify your property.
                </AlertDescription>
              </Alert>
              
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
                  
                  {/* Verification Documents */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Property Verification</h2>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <FileCheck className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Upload property ownership documents here (property deed, rental agreement, etc.)
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        (Upload feature is not implemented in this demo)
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => toast.info("Document upload is not implemented in this demo")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload verification documents
                      </Button>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="verificationAgreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                id="verification-agreement"
                              />
                              <label htmlFor="verification-agreement" className="text-sm text-gray-700">
                                I confirm that I have the legal right to list this property and agree to provide verification 
                                documents if requested. I understand my listing will not be publicly visible until verified.
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting for Verification..." : "Submit Property for Verification"}
                  </Button>
                </form>
              </Form>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListPropertyPage;

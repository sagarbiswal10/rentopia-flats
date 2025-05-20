import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Calendar, MapPin, Phone, IndianRupee, User, MessageCircle, Images } from 'lucide-react';
import SquareFootage from '@/components/icons/SquareFootage';
import { toast } from 'sonner';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user, token, addRental, userRentals } = useUser();
  const navigate = useNavigate();
  const [isRenting, setIsRenting] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingRental, setExistingRental] = useState(null);
  
  // Define real high-quality apartment and villa images
  const realApartmentImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop'
  ];
  
  const realVillaImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'
  ];
  
  // Function to get type-specific images - similar to PropertyCard component
  const getTypeSpecificImages = (type) => {
    switch(type) {
      case 'apartment':
        return realApartmentImages;
      case 'villa':
        return realVillaImages;
      case 'house':
        return [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop'
        ];
      case 'condo':
        return [
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=800&auto=format&fit=crop'
        ];
      case 'office':
        return [
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&auto=format&fit=crop'
        ];
      default:
        return [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop'
        ];
    }
  };
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        
        const data = await response.json();
        console.log('Property fetched successfully:', data);
        
        // Enhance with real images based on property type if none exist or if server-relative paths
        let enhancedData = { ...data };
        if (!enhancedData.images || enhancedData.images.length === 0 || 
            (enhancedData.images[0] && enhancedData.images[0].startsWith('/uploads/'))) {
          enhancedData.images = getTypeSpecificImages(enhancedData.type);
        }
        
        setProperty(enhancedData);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message);
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  // Check if user already has a rental for this property
  useEffect(() => {
    if (user && userRentals && userRentals.length > 0 && id) {
      const rental = userRentals.find(r => 
        r.property && r.property._id === id && r.status === 'active'
      );
      
      if (rental) {
        console.log('User already has a rental for this property:', rental);
        setExistingRental(rental);
      }
    }
  }, [user, userRentals, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="mb-4">The property you are looking for does not exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    title,
    type,
    rent,
    deposit,
    bedrooms,
    bathrooms,
    area,
    furnishing,
    locality,
    city,
    state,
    images,
    description,
    amenities,
    available,
    user: propertyOwner,
  } = property;
  
  // Check if the current user is the owner of this property
  const isOwner = user && propertyOwner && user._id === propertyOwner._id;
  
  const handleRentProperty = async () => {
    if (!user) {
      toast.error("Please login to rent this property");
      navigate('/login');
      return;
    }
    
    if (isOwner) {
      toast.error("You cannot rent your own property");
      return;
    }
    
    setIsRenting(true);
    
    try {
      // If user already has a pending rental, navigate to payment page
      if (existingRental && existingRental.paymentStatus === 'pending') {
        navigate(`/payment/${property._id}`);
        return;
      }
      
      // Create rental data
      const rentalData = {
        propertyId: property._id,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 11)).toISOString(),
        totalAmount: property.rent + property.deposit,
      };
      
      // Option 1: Use addRental from context if it exists
      if (typeof addRental === 'function') {
        const newRental = await addRental(rentalData);
        
        if (newRental) {
          console.log('Rental created successfully, redirecting to payment page');
          navigate(`/payment/${property._id}`);
          return;
        }
      }
      
      // Option 2: Direct API call if addRental fails or doesn't exist
      const response = await fetch('http://localhost:5000/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(rentalData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create rental");
      }
      
      const newRental = await response.json();
      console.log('Rental created via direct API call:', newRental);
      
      // Redirect to payment page
      navigate(`/payment/${property._id}`);
      
    } catch (error) {
      console.error('Error creating rental:', error);
      toast.error(error.message || "Failed to process your request. Please try again.");
    } finally {
      setIsRenting(false);
    }
  };

  // Format dates and prepare data for display
  const ownerName = propertyOwner?.name || "Property Owner";
  const ownerPhone = propertyOwner?.phone || "+91 9876543210"; // Default phone if not available
  const availableFrom = property.availableFrom ? new Date(property.availableFrom) : new Date();
  
  // Determine if property is truly available (considering the user's own pending rental)
  const canRent = available || (existingRental && existingRental.paymentStatus === 'pending');
  
  // Ensure we have valid images to display - use type-specific images for server-relative paths
  const propertyImages = (!images || images.length === 0 || 
    (images[0] && images[0].startsWith('/uploads/'))) ? 
    getTypeSpecificImages(type) : images;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Images & Details */}
            <div className="lg:col-span-2">
              {/* Property Images Carousel */}
              <Card className="mb-6 overflow-hidden">
                <div className="p-4">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {propertyImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-video overflow-hidden rounded-lg">
                            <img 
                              src={image} 
                              alt={`${title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                // Fall back to type-specific image if this one fails
                                const fallbackImages = getTypeSpecificImages(type);
                                e.target.src = fallbackImages[0];
                              }}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                  
                  {/* Image indicator */}
                  <div className="mt-4 flex justify-center">
                    <Badge variant="outline" className="flex items-center">
                      <Images className="h-4 w-4 mr-1" />
                      <span>{propertyImages.length} Photos</span>
                    </Badge>
                  </div>
                </div>
              </Card>
              
              {/* Property Details */}
              <Card className="mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className="mb-2">{type}</Badge>
                      <h1 className="text-2xl font-bold mb-2">{title}</h1>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{locality}, {city}, {state}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-2xl font-bold text-primary">
                        <IndianRupee className="h-6 w-6" />
                        <span>{rent.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-500 text-sm">/month</p>
                      <p className="text-gray-600 mt-1">
                        Deposit: ₹{deposit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Key Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-t border-b py-4">
                    <div className="flex flex-col items-center justify-center p-3">
                      <Bed className="h-6 w-6 text-gray-600 mb-1" />
                      <span className="font-semibold">{bedrooms}</span>
                      <span className="text-xs text-gray-500">{bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3">
                      <Bath className="h-6 w-6 text-gray-600 mb-1" />
                      <span className="font-semibold">{bathrooms}</span>
                      <span className="text-xs text-gray-500">{bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3">
                      <SquareFootage className="h-6 w-6 text-gray-600 mb-1" />
                      <span className="font-semibold">{area}</span>
                      <span className="text-xs text-gray-500">sq.ft</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3">
                      <Calendar className="h-6 w-6 text-gray-600 mb-1" />
                      <span className="font-semibold">{availableFrom.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span className="text-xs text-gray-500">Available From</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">About the property</h2>
                    <p className="text-gray-600">
                      {description}
                    </p>
                  </div>
                  
                  {/* Amenities */}
                  {amenities && amenities.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">Amenities</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                            <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Right Column - Contact & Book Visit */}
            <div className="lg:col-span-1">
              {/* Owner Card */}
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Owner</h2>
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{ownerName}</p>
                      <p className="text-sm text-gray-500">Owner</p>
                    </div>
                  </div>
                  
                  <Button className="w-full mb-3">
                    <Phone className="h-4 w-4 mr-2" />
                    {ownerPhone}
                  </Button>
                  
                  <Button variant="secondary" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Owner
                  </Button>
                </div>
              </Card>
              
              {/* Rent Property Card */}
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Rent This Property</h2>
                  
                  {isOwner ? (
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <p className="text-blue-600">
                        This is your property. You cannot rent your own property.
                      </p>
                    </div>
                  ) : existingRental && existingRental.paymentStatus === 'paid' ? (
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <p className="text-green-600">
                        You have already rented this property.
                      </p>
                    </div>
                  ) : canRent ? (
                    <>
                      <p className="text-gray-600 mb-4">
                        {existingRental && existingRental.paymentStatus === 'pending' ? 
                          'Complete your payment to secure this property.' : 
                          'Interested in renting this property? Proceed to payment to secure it now.'}
                      </p>
                      <Button 
                        className="w-full" 
                        disabled={isRenting}
                        onClick={handleRentProperty}
                      >
                        {isRenting ? "Processing..." : (existingRental && existingRental.paymentStatus === 'pending' ? "Complete Payment" : "Rent Now")}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        You'll pay ₹{(rent + deposit).toLocaleString()} (rent + deposit)
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-50 p-4 rounded-md mb-4">
                        <p className="text-red-600">
                          This property is currently unavailable for rent.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/properties')}
                      >
                        Browse Other Properties
                      </Button>
                    </>
                  )}
                  
                  <div className="mt-4">
                    <Button variant="secondary" className="w-full">
                      Book a Visit
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;

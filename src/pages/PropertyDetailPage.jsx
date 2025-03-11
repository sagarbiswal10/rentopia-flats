
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Calendar, MapPin, Phone, IndianRupee, User, MessageCircle } from 'lucide-react';
import SquareFootage from '@/components/icons/SquareFootage';
import { properties } from '@/data/properties';
import { toast } from 'sonner';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user, addRental } = useUser();
  const navigate = useNavigate();
  const [isRenting, setIsRenting] = useState(false);
  
  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
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
    availableFrom,
    ownerName,
    ownerPhone,
  } = property;
  
  const handleRentProperty = async () => {
    if (!user) {
      toast.error("Please login to rent this property");
      navigate('/login');
      return;
    }
    
    setIsRenting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new rental
      const newRental = {
        id: Date.now(),
        property: property,
        user: {
          id: user.id,
          name: user.name,
        },
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      // Add to user's rentals
      addRental(newRental);
      
      // Redirect to payment page
      navigate(`/payment/${newRental.id}`);
    } catch (error) {
      toast.error("Failed to process your request. Please try again.");
      setIsRenting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Images & Details */}
            <div className="lg:col-span-2">
              {/* Property Images */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative aspect-video">
                  <img 
                    src={images?.[0] || '/placeholder.svg'} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-4 left-4 ${
                      available ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                
                {/* Thumbnail Gallery */}
                {images && images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-2">
                    {images.slice(1, 5).map((img, index) => (
                      <div key={index} className="aspect-video cursor-pointer">
                        <img 
                          src={img} 
                          alt={`Property ${index + 2}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
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
                      <span className="font-semibold">{new Date(availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
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
                  
                  {available ? (
                    <>
                      <p className="text-gray-600 mb-4">
                        Interested in renting this property? Proceed to payment to secure it now.
                      </p>
                      <Button 
                        className="w-full" 
                        disabled={isRenting}
                        onClick={handleRentProperty}
                      >
                        {isRenting ? "Processing..." : "Rent Now"}
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

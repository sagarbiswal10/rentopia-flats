
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { properties } from '@/data/properties';
import { formatIndianRupees, formatArea } from '@/utils/formatters';
import { 
  MapPin, BedDouble, Bath, Home, SquareFootage, Calendar, 
  IndianRupee, Building, Users, Heart, Share2, Phone, Mail, 
  Check, ChevronRight
} from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isContactVisible, setIsContactVisible] = useState(false);
  
  useEffect(() => {
    const propertyData = properties.find(p => p.id === parseInt(id));
    
    if (propertyData) {
      setProperty(propertyData);
      setLoading(false);
    } else {
      // Handle not found
      setLoading(false);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/properties">
            <Button className="bg-primary hover:bg-primary/90">
              Browse All Properties
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const {
    title, description, type, bedrooms, bathrooms, furnishing, area, rent, deposit,
    address, locality, city, state, availableFrom, preferred, amenities, images, owner
  } = property;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-6">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="inline h-3 w-3 mx-1" />
            <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
            <ChevronRight className="inline h-3 w-3 mx-1" />
            <span>{locality}, {city}</span>
          </div>
          
          {/* Property Title */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{address}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Favorite
              </Button>
              <Button variant="outline" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Property Images */}
          <div className="mb-8">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={images[activeImage]} 
                alt={title}
                className="w-full h-[400px] object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                    activeImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left - Property Details */}
            <div className="lg:w-2/3">
              {/* Price & Overview */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <div>
                      <p className="text-3xl font-bold text-primary mb-1">
                        ₹{formatIndianRupees(rent, false)}<span className="text-base font-normal text-gray-500">/month</span>
                      </p>
                      <p className="text-gray-600">
                        Deposit: ₹{formatIndianRupees(deposit, false)}
                      </p>
                    </div>
                    <Badge className="mt-2 md:mt-0 w-fit">
                      {furnishing}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <BedDouble className="h-6 w-6 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-600">Bedrooms</span>
                      <span className="font-semibold">{bedrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <Bath className="h-6 w-6 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-600">Bathrooms</span>
                      <span className="font-semibold">{bathrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <Home className="h-6 w-6 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-600">Property Type</span>
                      <span className="font-semibold">{type}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <SquareFootage className="h-6 w-6 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-600">Area</span>
                      <span className="font-semibold">{formatArea(area)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold mb-3">Property Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <span className="text-sm text-gray-600 block">Available From</span>
                          <span>{new Date(availableFrom).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <span className="text-sm text-gray-600 block">Maintenance</span>
                          <span>Included in Rent</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <span className="text-sm text-gray-600 block">Furnishing</span>
                          <span>{furnishing}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <span className="text-sm text-gray-600 block">Preferred Tenants</span>
                          <span>{preferred}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Description */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">About This Property</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Amenities */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Location */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Location</h3>
                  <p className="text-gray-700 mb-4">{address}</p>
                  <div className="aspect-video bg-gray-200 rounded-md w-full">
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-gray-400 mr-2" />
                      <span className="text-gray-500">Map view placeholder</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right - Owner Info & Contact */}
            <div className="lg:w-1/3">
              <div className="sticky top-20">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
                    <div className="flex items-center mb-6">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-xl text-gray-500 font-medium">{owner.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{owner.name}</p>
                        <p className="text-sm text-gray-500">Property Owner</p>
                      </div>
                    </div>
                    
                    {isContactVisible ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-primary mr-2" />
                          <a href={`tel:${owner.phone}`} className="text-gray-800 hover:text-primary transition-colors">
                            {owner.phone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-primary mr-2" />
                          <a href={`mailto:${owner.email}`} className="text-gray-800 hover:text-primary transition-colors">
                            {owner.email}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-600 text-sm">
                          Contact the owner directly to schedule a visit or get more information about this property.
                        </p>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => setIsContactVisible(true)}
                        >
                          Show Contact Details
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">Safety Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <span>Visit the property before making any payment</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <span>Verify all documents and ownership proof</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <span>Make payments via secure methods (bank transfer, etc.)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <span>Sign a proper rental agreement before moving in</span>
                      </li>
                    </ul>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>
                        Report any suspicious activity to our team at{' '}
                        <a href="mailto:support@renteasy.in" className="text-primary hover:underline">
                          support@renteasy.in
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;

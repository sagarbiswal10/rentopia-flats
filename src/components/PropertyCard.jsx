
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, MapPin, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import SquareFootage from '@/components/icons/SquareFootage';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const PropertyCard = ({ property }) => {
  const {
    _id,
    id, // Support both _id (from MongoDB) and id (from local data)
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
    images,
    thumbnailUrl,
    available,
  } = property;

  // Use _id if available, otherwise fall back to id (for compatibility with both sources)
  const propertyId = _id || id;
  
  // High-quality real estate images based on property type
  const getTypeSpecificImages = (type) => {
    switch(type) {
      case 'apartment':
        return [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop'
        ];
      case 'villa':
        return [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop'
        ];
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
  
  // If images array is empty or contains placeholders, use type-specific images
  const propertyImages = (images && images.length > 0 && !images[0].includes('placeholder')) 
    ? images 
    : getTypeSpecificImages(type);
  
  // Use thumbnailUrl as first image if available, otherwise use the first from the array
  const imageArray = thumbnailUrl && !thumbnailUrl.includes('placeholder') 
    ? [thumbnailUrl, ...propertyImages] 
    : propertyImages;
  
  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = (e) => {
    e.preventDefault(); // Prevent link navigation
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
  };
  
  const prevImage = (e) => {
    e.preventDefault(); // Prevent link navigation
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageArray.length) % imageArray.length);
  };

  return (
    <Link to={`/property/${propertyId}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        {/* Property Image Carousel */}
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img
              src={imageArray[currentImageIndex]}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.svg';
              }}
            />
          </AspectRatio>
          
          {/* Image navigation buttons */}
          {imageArray.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{imageArray.length}
              </div>
            </>
          )}
          
          {/* Property Badges */}
          <Badge
            className={`absolute top-2 right-2 ${available ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {available ? 'Available' : 'Unavailable'}
          </Badge>
          <Badge className="absolute top-2 left-2 bg-secondary">{type}</Badge>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{locality}, {city}</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-primary font-bold">
              <IndianRupee className="h-4 w-4" />
              <span>{rent.toLocaleString()}</span>
              <span className="text-gray-500 font-normal text-sm ml-1">/month</span>
            </div>
            <div className="text-sm text-gray-500">
              Deposit: ₹{deposit.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center">
              <SquareFootage className="h-4 w-4 mr-1" />
              <span>{area} sq.ft</span>
            </div>
          </div>

          <div className="mt-3">
            <Badge variant="outline">{furnishing}</Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PropertyCard;

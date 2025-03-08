
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatIndianRupees, formatArea } from '@/utils/formatters';
import { Heart, MapPin, Home, BedDouble, Bath } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const { id, title, type, bedrooms, bathrooms, area, rent, locality, city, images, furnishing, featured } = property;

  return (
    <Card className="property-card overflow-hidden border border-gray-200 rounded-lg">
      <div className="relative">
        <img 
          src={images[0]} 
          alt={title} 
          className="h-48 w-full object-cover"
        />
        {featured && (
          <Badge className="absolute top-2 left-2 bg-secondary text-white">
            Featured
          </Badge>
        )}
        <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors">
          <Heart className="h-5 w-5" />
        </button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
        </div>
        
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{locality}, {city}</span>
        </div>
        
        <div className="flex justify-between mb-4">
          <p className="text-xl font-bold text-primary">
            ₹{formatIndianRupees(rent, false)}<span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <Badge variant="outline" className="text-xs">
            {furnishing}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="flex flex-col items-center">
            <Home className="h-4 w-4 mb-1 text-gray-500" />
            <span className="text-xs text-gray-600">{type}</span>
          </div>
          <div className="flex flex-col items-center">
            <BedDouble className="h-4 w-4 mb-1 text-gray-500" />
            <span className="text-xs text-gray-600">{bedrooms} {bedrooms > 1 ? 'Beds' : 'Bed'}</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="h-4 w-4 mb-1 text-gray-500" />
            <span className="text-xs text-gray-600">{bathrooms} {bathrooms > 1 ? 'Baths' : 'Bath'}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            <span>{formatArea(area)}</span>
          </div>
          <Link 
            to={`/property/${id}`}
            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatIndianRupees } from '@/utils/formatters';
import { MapPin, BedDouble, Bath, SquareFootage } from 'lucide-react';
import CustomSquareFootage from './icons/SquareFootage';

const PropertyCard = ({ property }) => {
  const { 
    id, title, rent, locality, city, bedrooms, bathrooms, 
    area, furnishing, images, preferred 
  } = property;

  return (
    <Link to={`/property/${id}`}>
      <Card className="property-card overflow-hidden h-full">
        <div className="relative">
          <img 
            src={images[0]} 
            alt={title}
            className="h-48 w-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-secondary">
            {furnishing}
          </Badge>
          {preferred && (
            <Badge 
              className="absolute top-2 left-2 bg-primary"
              variant="outline"
            >
              {preferred}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{locality}, {city}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-primary font-semibold">
              ₹{formatIndianRupees(rent, false)}
              <span className="text-xs text-gray-500 font-normal">/month</span>
            </p>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1" />
              <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center">
              <CustomSquareFootage className="h-4 w-4 mr-1" />
              <span>{area} sq.ft</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;

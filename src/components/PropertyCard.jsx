
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, MapPin, IndianRupee } from 'lucide-react';
import SquareFootage from '@/components/icons/SquareFootage';

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
  
  // Use thumbnailUrl if available, otherwise use the first image
  const imageUrl = thumbnailUrl || (images && images.length > 0 ? images[0] : '/placeholder.svg');

  return (
    <Link to={`/property/${propertyId}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        {/* Property Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.svg';
            }}
          />
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

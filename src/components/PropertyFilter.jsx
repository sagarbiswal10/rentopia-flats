
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const PropertyFilter = ({ onFilterChange }) => {
  const [propertyType, setPropertyType] = useState([]);
  const [bedrooms, setBedrooms] = useState([]);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [furnishing, setFurnishing] = useState([]);
  const [amenities, setAmenities] = useState([]);
  
  const handlePropertyTypeChange = (type) => {
    setPropertyType(prev => {
      if (prev.includes(type)) {
        return prev.filter(item => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const handleBedroomsChange = (bhk) => {
    setBedrooms(prev => {
      if (prev.includes(bhk)) {
        return prev.filter(item => item !== bhk);
      } else {
        return [...prev, bhk];
      }
    });
  };
  
  const handleFurnishingChange = (type) => {
    setFurnishing(prev => {
      if (prev.includes(type)) {
        return prev.filter(item => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const handleAmenitiesChange = (amenity) => {
    setAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(item => item !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };
  
  const handleApplyFilters = () => {
    const filters = {
      propertyType: propertyType.length > 0 ? propertyType : null,
      bedrooms: bedrooms.length > 0 ? bedrooms : null,
      minRent: minRent ? parseInt(minRent, 10) : null,
      maxRent: maxRent ? parseInt(maxRent, 10) : null,
      furnishing: furnishing.length > 0 ? furnishing : null,
      amenities: amenities.length > 0 ? amenities : null,
    };
    
    onFilterChange(filters);
  };
  
  const handleClearFilters = () => {
    setPropertyType([]);
    setBedrooms([]);
    setMinRent('');
    setMaxRent('');
    setFurnishing([]);
    setAmenities([]);
    
    onFilterChange({});
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <Accordion type="multiple" defaultValue={["property-type", "bedrooms", "budget", "furnishing", "amenities"]}>
        {/* Property Type */}
        <AccordionItem value="property-type">
          <AccordionTrigger className="text-base font-medium">Property Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Apartment", "Villa", "Independent House", "PG/Hostel"].map((type) => (
                <div className="flex items-center space-x-2" key={type}>
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={propertyType.includes(type)}
                    onCheckedChange={() => handlePropertyTypeChange(type)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Bedrooms */}
        <AccordionItem value="bedrooms">
          <AccordionTrigger className="text-base font-medium">Bedrooms</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].map((bhk) => (
                <div className="flex items-center space-x-2" key={bhk}>
                  <Checkbox 
                    id={`bhk-${bhk}`} 
                    checked={bedrooms.includes(bhk)}
                    onCheckedChange={() => handleBedroomsChange(bhk)}
                  />
                  <Label htmlFor={`bhk-${bhk}`} className="text-sm">{bhk}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Budget */}
        <AccordionItem value="budget">
          <AccordionTrigger className="text-base font-medium">Budget</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div>
                <Label htmlFor="min-rent" className="text-sm">Min Rent (₹)</Label>
                <Input
                  id="min-rent"
                  type="number"
                  placeholder="Min"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max-rent" className="text-sm">Max Rent (₹)</Label>
                <Input
                  id="max-rent"
                  type="number"
                  placeholder="Max"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Furnishing */}
        <AccordionItem value="furnishing">
          <AccordionTrigger className="text-base font-medium">Furnishing</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Fully Furnished", "Semi-Furnished", "Unfurnished"].map((type) => (
                <div className="flex items-center space-x-2" key={type}>
                  <Checkbox 
                    id={`furnishing-${type}`} 
                    checked={furnishing.includes(type)}
                    onCheckedChange={() => handleFurnishingChange(type)}
                  />
                  <Label htmlFor={`furnishing-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Amenities */}
        <AccordionItem value="amenities">
          <AccordionTrigger className="text-base font-medium">Amenities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                "Lift", "Power Backup", "Security", "Parking", 
                "Gym", "Swimming Pool", "Garden", "Club House"
              ].map((amenity) => (
                <div className="flex items-center space-x-2" key={amenity}>
                  <Checkbox 
                    id={`amenity-${amenity}`} 
                    checked={amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenitiesChange(amenity)}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6 space-y-2">
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleClearFilters}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilter;

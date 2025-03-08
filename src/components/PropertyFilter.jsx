
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatIndianRupees } from '@/utils/formatters';
import { Check, Sliders } from 'lucide-react';

const PropertyFilter = ({ onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: [],
    bedrooms: [],
    furnishing: [],
    minRent: 5000,
    maxRent: 100000,
    minArea: 300,
    maxArea: 3000,
    amenities: []
  });

  const propertyTypes = ["Apartment", "Independent House", "Villa", "PG/Hostel"];
  const bedroomOptions = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
  const furnishingOptions = ["Fully-Furnished", "Semi-Furnished", "Unfurnished"];
  const amenityOptions = [
    "Lift", "Parking", "Security", "Gym", "Swimming Pool", 
    "Power Backup", "Gas Pipeline", "Club House", "WiFi"
  ];

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter(item => item !== value);
      } else {
        updated[category] = [...updated[category], value];
      }
      return updated;
    });
  };

  const handleRentChange = (value) => {
    setFilters(prev => ({
      ...prev,
      minRent: value[0],
      maxRent: value[1]
    }));
  };

  const handleAreaChange = (value) => {
    setFilters(prev => ({
      ...prev,
      minArea: value[0],
      maxArea: value[1]
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      propertyType: [],
      bedrooms: [],
      furnishing: [],
      minRent: 5000,
      maxRent: 100000,
      minArea: 300,
      maxArea: 3000,
      amenities: []
    });
    onFilterChange({});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Sliders className="h-5 w-5 mr-1" />
          {isFilterOpen ? 'Hide' : 'Show'}
        </Button>
      </div>

      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        {/* Property Type */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium mb-3">Property Type</h4>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <div key={type} className="flex items-center">
                <button
                  type="button"
                  className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${
                    filters.propertyType.includes(type) ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}
                  onClick={() => toggleFilter('propertyType', type)}
                >
                  {filters.propertyType.includes(type) && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
                <Label htmlFor={`property-${type}`} className="cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium mb-3">Bedrooms</h4>
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map((option) => (
              <Button
                key={option}
                variant={filters.bedrooms.includes(option) ? 'default' : 'outline'}
                className={`${
                  filters.bedrooms.includes(option) ? 'bg-primary text-white' : 'text-gray-700'
                } text-sm py-1 h-auto`}
                onClick={() => toggleFilter('bedrooms', option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Rent Range */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium mb-3">Rent Range</h4>
          <div className="px-2">
            <Slider
              defaultValue={[filters.minRent, filters.maxRent]}
              min={5000}
              max={100000}
              step={1000}
              onValueChange={handleRentChange}
              className="mb-6"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatIndianRupees(filters.minRent)}</span>
              <span>{formatIndianRupees(filters.maxRent)}</span>
            </div>
          </div>
        </div>

        {/* Furnishing */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium mb-3">Furnishing</h4>
          <div className="space-y-2">
            {furnishingOptions.map((option) => (
              <div key={option} className="flex items-center">
                <button
                  type="button"
                  className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${
                    filters.furnishing.includes(option) ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}
                  onClick={() => toggleFilter('furnishing', option)}
                >
                  {filters.furnishing.includes(option) && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
                <Label htmlFor={`furnishing-${option}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium mb-3">Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {amenityOptions.map((option) => (
              <div key={option} className="flex items-center">
                <button
                  type="button"
                  className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${
                    filters.amenities.includes(option) ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}
                  onClick={() => toggleFilter('amenities', option)}
                >
                  {filters.amenities.includes(option) && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
                <Label htmlFor={`amenity-${option}`} className="cursor-pointer text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex space-x-3">
          <Button 
            onClick={applyFilters}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;

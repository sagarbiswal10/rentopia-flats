
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilter from '@/components/PropertyFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { properties } from '@/data/properties';
import { Search, MapPin, List, Grid3X3 } from 'lucide-react';

const Properties = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialLocationQuery = queryParams.get('location') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialLocationQuery);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    handleSearch();
  }, [activeFilters]);

  const handleSearch = () => {
    let filtered = properties;
    
    // Apply search term (location/keyword)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(property => {
        return (
          property.locality.toLowerCase().includes(searchLower) ||
          property.city.toLowerCase().includes(searchLower) ||
          property.title.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply property type filter
    if (activeFilters.propertyType && activeFilters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        activeFilters.propertyType.includes(property.type)
      );
    }
    
    // Apply bedrooms filter
    if (activeFilters.bedrooms && activeFilters.bedrooms.length > 0) {
      filtered = filtered.filter(property => {
        // Map BHK strings to numbers
        let matches = false;
        activeFilters.bedrooms.forEach(bhk => {
          if (bhk === "1 RK" && property.bedrooms === 1) matches = true;
          else if (bhk === "1 BHK" && property.bedrooms === 1) matches = true;
          else if (bhk === "2 BHK" && property.bedrooms === 2) matches = true;
          else if (bhk === "3 BHK" && property.bedrooms === 3) matches = true;
          else if (bhk === "4 BHK" && property.bedrooms === 4) matches = true;
          else if (bhk === "4+ BHK" && property.bedrooms > 4) matches = true;
        });
        return matches;
      });
    }
    
    // Apply rent range filter
    if (activeFilters.minRent || activeFilters.maxRent) {
      filtered = filtered.filter(property => 
        property.rent >= (activeFilters.minRent || 0) && 
        property.rent <= (activeFilters.maxRent || 1000000)
      );
    }
    
    // Apply furnishing filter
    if (activeFilters.furnishing && activeFilters.furnishing.length > 0) {
      filtered = filtered.filter(property => 
        activeFilters.furnishing.includes(property.furnishing)
      );
    }
    
    // Apply amenities filter
    if (activeFilters.amenities && activeFilters.amenities.length > 0) {
      filtered = filtered.filter(property => {
        return activeFilters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
      });
    }
    
    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case 'rent-asc':
          filtered.sort((a, b) => a.rent - b.rent);
          break;
        case 'rent-desc':
          filtered.sort((a, b) => b.rent - a.rent);
          break;
        case 'area-asc':
          filtered.sort((a, b) => a.area - b.area);
          break;
        case 'area-desc':
          filtered.sort((a, b) => b.area - a.area);
          break;
        default:
          break;
      }
    }
    
    setFilteredProperties(filtered);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-6 pb-12">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter city, locality or landmark"
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-1/4">
              <PropertyFilter onFilterChange={handleFilterChange} />
            </div>
            
            {/* Right - Properties List */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-lg font-semibold mb-2 sm:mb-0">
                  {filteredProperties.length} Properties Found
                </h2>
                
                <div className="flex items-center gap-4">
                  {/* View Type Toggle */}
                  <div className="flex border rounded overflow-hidden">
                    <button 
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button 
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <select 
                    className="border rounded p-2"
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      handleSearch();
                    }}
                  >
                    <option value="">Sort By</option>
                    <option value="rent-asc">Rent: Low to High</option>
                    <option value="rent-desc">Rent: High to Low</option>
                    <option value="area-asc">Area: Small to Large</option>
                    <option value="area-desc">Area: Large to Small</option>
                  </select>
                </div>
              </div>
              
              {/* Properties Grid/List */}
              {filteredProperties.length > 0 ? (
                <div className={viewMode === 'grid' ? 'property-grid' : 'space-y-4'}>
                  {filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters to find more properties.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilters({});
                      setFilteredProperties(properties);
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Properties;

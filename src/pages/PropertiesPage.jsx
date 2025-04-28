
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilter from '@/components/PropertyFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, List, Grid3X3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import API_URL from '@/utils/apiConfig';

const PropertiesPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialLocationQuery = queryParams.get('city') || '';
  const { toast: uiToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState(initialLocationQuery);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties from:', `${API_URL}/api/properties`);
        const response = await fetch(`${API_URL}/api/properties`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        console.log('Properties loaded:', data.length);
        
        // Filter to only show verified properties
        const verifiedProperties = data.filter(
          property => property.verificationStatus === 'verified'
        );
        console.log('Verified properties:', verifiedProperties.length);
        
        setProperties(verifiedProperties);
        setFilteredProperties(verifiedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties. Please try again.');
        // Set empty array to avoid undefined errors
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (initialLocationQuery && properties.length > 0) {
      handleSearch();
    }
  }, [initialLocationQuery, properties]);

  useEffect(() => {
    if (properties.length > 0) {
      handleSearch();
    }
  }, [activeFilters, sortOption]);

  const handleSearch = () => {
    let filtered = [...properties];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(property => {
        return (
          property.locality?.toLowerCase().includes(searchLower) ||
          property.city?.toLowerCase().includes(searchLower) ||
          property.title?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    if (activeFilters.propertyType && activeFilters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        activeFilters.propertyType.includes(property.type)
      );
    }
    
    if (activeFilters.bedrooms && activeFilters.bedrooms.length > 0) {
      filtered = filtered.filter(property => {
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
    
    if (activeFilters.minRent || activeFilters.maxRent) {
      filtered = filtered.filter(property => 
        (activeFilters.minRent ? property.rent >= activeFilters.minRent : true) && 
        (activeFilters.maxRent ? property.rent <= activeFilters.maxRent : true)
      );
    }
    
    if (activeFilters.furnishing && activeFilters.furnishing.length > 0) {
      filtered = filtered.filter(property => 
        activeFilters.furnishing.includes(property.furnishing)
      );
    }
    
    if (activeFilters.amenities && activeFilters.amenities.length > 0) {
      filtered = filtered.filter(property => {
        return activeFilters.amenities.every(amenity => 
          property.amenities && property.amenities.includes(amenity)
        );
      });
    }
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-6 pb-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-pulse">
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/4">
                <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="lg:w-3/4">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-6 pb-12">
        <div className="container mx-auto px-4">
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
            <div className="lg:w-1/4">
              <PropertyFilter onFilterChange={handleFilterChange} />
            </div>
            
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-lg font-semibold mb-2 sm:mb-0">
                  {filteredProperties.length} Properties Found
                </h2>
                
                <div className="flex items-center gap-4">
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
                  
                  <select 
                    className="border rounded p-2"
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
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
              
              {filteredProperties.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredProperties.map(property => (
                    <PropertyCard 
                      key={property._id} 
                      property={{
                        ...property,
                        id: property._id
                      }} 
                    />
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

export default PropertiesPage;

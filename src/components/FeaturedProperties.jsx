
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PropertyCard from './PropertyCard';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Add a timestamp to prevent caching issues
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/properties?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API response is not JSON format');
        }
        
        const data = await response.json();
        
        // Get only first 6 properties for featured section
        const featuredProperties = data.slice(0, 6);
        setProperties(featuredProperties);
        
        console.log('Fetched properties:', featuredProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured properties.',
          variant: 'destructive',
        });
        
        // Empty array since we don't want to show dummy data anymore
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  if (loading) {
    return (
      <section className="py-12 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Featured Properties</h2>
              <p className="text-gray-600">Handpicked properties for you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-12 bg-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Featured Properties</h2>
          <p className="text-gray-600 mb-6">No properties available at the moment.</p>
          <Link to="/post-property">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Post Your Property
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Featured Properties</h2>
            <p className="text-gray-600">Handpicked properties for you</p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="hidden md:flex items-center">
              View All 
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard 
              key={property._id || property.id} 
              property={property} 
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/properties">
            <Button variant="outline" className="items-center">
              View All Properties
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

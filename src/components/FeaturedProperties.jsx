
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
        const response = await fetch('/api/properties');
        const data = await response.json();
        
        // Get only first 4 properties for featured section
        const featuredProperties = data.slice(0, 4);
        setProperties(featuredProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured properties.',
          variant: 'destructive',
        });
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
          <div className="property-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
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

        <div className="property-grid">
          {properties.map(property => (
            <PropertyCard key={property._id} property={{
              ...property,
              id: property._id, // Map _id to id for compatibility
              available: property.available
            }} />
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

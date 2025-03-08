
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PropertyCard from './PropertyCard';
import { properties } from '@/data/properties';
import { ChevronRight } from 'lucide-react';

const FeaturedProperties = () => {
  // Get only featured properties
  const featuredProperties = properties.filter(property => property.featured);

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
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
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

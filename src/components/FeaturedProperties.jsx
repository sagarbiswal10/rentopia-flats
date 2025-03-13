
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PropertyCard from './PropertyCard';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading for a better UX
    setTimeout(() => {
      // Hardcoded properties data - no API call required
      const hardcodedProperties = [
        {
          id: "prop-1",
          title: "2 BHK Furnished Apartment",
          type: "apartment",
          rent: 25000,
          deposit: 50000,
          bedrooms: 2,
          bathrooms: 2,
          area: 850,
          furnishing: "fully-furnished",
          locality: "Indiranagar",
          city: "Bangalore",
          thumbnailUrl: "/placeholder.svg",
          images: ["/placeholder.svg"],
          available: true,
        },
        {
          id: "prop-2",
          title: "3 BHK Luxury Villa",
          type: "villa",
          rent: 45000,
          deposit: 90000,
          bedrooms: 3,
          bathrooms: 3,
          area: 1500,
          furnishing: "fully-furnished",
          locality: "Koramangala",
          city: "Bangalore",
          thumbnailUrl: "/placeholder.svg",
          images: ["/placeholder.svg"],
          available: true,
        },
        {
          id: "prop-3",
          title: "1 BHK Studio Apartment",
          type: "apartment",
          rent: 15000,
          deposit: 30000,
          bedrooms: 1,
          bathrooms: 1,
          area: 500,
          furnishing: "semi-furnished",
          locality: "HSR Layout",
          city: "Bangalore",
          thumbnailUrl: "/placeholder.svg",
          images: ["/placeholder.svg"],
          available: true,
        },
        {
          id: "prop-4",
          title: "4 BHK Penthouse",
          type: "penthouse",
          rent: 75000,
          deposit: 150000,
          bedrooms: 4,
          bathrooms: 4,
          area: 2200,
          furnishing: "fully-furnished",
          locality: "Whitefield",
          city: "Bangalore",
          thumbnailUrl: "/placeholder.svg",
          images: ["/placeholder.svg"],
          available: true,
        },
        {
          id: "prop-5",
          title: "2 BHK Apartment with Sea View",
          type: "apartment",
          rent: 35000,
          deposit: 70000,
          bedrooms: 2,
          bathrooms: 2,
          area: 950,
          furnishing: "semi-furnished",
          locality: "Bandra West",
          city: "Mumbai",
          thumbnailUrl: "/placeholder.svg",
          images: ["/placeholder.svg"],
          available: true,
        },
        {
          id: "prop-6",
          title: "3 BHK Independent House",
          type: "house",
          rent: 40000,
          deposit: 80000,
          bedrooms: 3,
          bathrooms: 2,
          area: 1200,
          furnishing: "unfurnished",
          locality: "Jubilee Hills",
          city: "Hyderabad",
          thumbnailUrl: "/placeholder.svg",
          images: ["/placeholder.svg"],
          available: true,
        }
      ];

      setProperties(hardcodedProperties);
      setLoading(false);
    }, 1000); // Simulate 1 second loading time
  }, []);

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
              <Skeleton key={item} className="h-72 rounded-lg" />
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
              key={property.id || property._id} 
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

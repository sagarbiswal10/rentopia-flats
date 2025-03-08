
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="relative bg-primary text-white">
      <div className="hero-gradient">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find Your Dream Rental Property in India
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              No broker fees. Direct contact with owners. Thousands of verified properties.
            </p>
            
            <Card className="search-box bg-white p-4 md:p-6 rounded-lg shadow-lg">
              <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter city, locality or landmark"
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="md:w-1/6">
                  <select 
                    className="px-4 py-2 w-full rounded-md border border-gray-300"
                    defaultValue="rent"
                  >
                    <option value="rent">Rent</option>
                    <option value="pg">PG/Hostel</option>
                  </select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-white"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </form>
              
              <div className="mt-4 flex flex-wrap items-center justify-center space-x-4 text-sm text-gray-600">
                <span>Popular: </span>
                <a href="/properties?location=Whitefield" className="hover:text-primary transition-colors">Whitefield</a>
                <a href="/properties?location=Indiranagar" className="hover:text-primary transition-colors">Indiranagar</a>
                <a href="/properties?location=HSR+Layout" className="hover:text-primary transition-colors">HSR Layout</a>
                <a href="/properties?location=Koramangala" className="hover:text-primary transition-colors">Koramangala</a>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-lg font-medium">Trusted by thousands of tenants and owners across India</p>
            <div className="flex justify-center items-center space-x-8 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-sm text-gray-200">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-gray-200">Happy Tenants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm text-gray-200">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

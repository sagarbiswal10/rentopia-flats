
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Home, IndianRupee, Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/properties';

const HomePage = () => {
  const featuredProperties = properties.slice(0, 3);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="hero-gradient text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Find Your Perfect Home Without Brokerage
              </h1>
              <p className="text-lg md:text-xl mb-8">
                RentEasy connects you directly with verified property owners. No middlemen, no brokerage fees.
              </p>
              
              {/* Search Box */}
              <div className="bg-white p-4 rounded-lg shadow-lg search-box">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter city, locality or landmark"
                      className="pl-10 w-full"
                    />
                  </div>
                  <Link to="/properties">
                    <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Properties */}
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Featured Properties</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover handpicked properties that match your requirements
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/properties">
                <Button className="bg-primary hover:bg-primary/90">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find and rent properties in just a few simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-cream rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search</h3>
                <p className="text-gray-600">
                  Search for properties based on your preferences, budget, and location.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-cream rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit</h3>
                <p className="text-gray-600">
                  Schedule a visit to the property and connect directly with the owner.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-cream rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Finalize</h3>
                <p className="text-gray-600">
                  Finalize the deal with the owner and move into your new home.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Cities Section */}
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Cities We Serve</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find properties across major cities in India
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi'].map((city) => (
                <Link to={`/properties?city=${city}`} key={city}>
                  <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-200">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <h3 className="font-medium text-gray-800">{city}</h3>
                    <p className="text-xs text-gray-500 mt-1">100+ Properties</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Why Choose RentEasy</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We are revolutionizing the rental experience in India
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-cream rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-full shadow-md">
                    <Home className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Verified Listings</h3>
                <p className="text-gray-600">All properties listed on our platform are verified by our team to ensure authenticity.</p>
              </div>
              
              <div className="bg-cream rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-full shadow-md">
                    <IndianRupee className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Zero Brokerage</h3>
                <p className="text-gray-600">Connect directly with property owners without paying any commission to brokers.</p>
              </div>
              
              <div className="bg-cream rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-full shadow-md">
                    <Check className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Legal Support</h3>
                <p className="text-gray-600">Free rental agreement and legal assistance for a hassle-free renting experience.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/about">
                <Button className="bg-primary hover:bg-primary/90">Learn More About Us</Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">List Your Property For Free</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of property owners who have listed their properties and found tenants without paying any broker fees.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/post-property">
                <Button className="bg-secondary hover:bg-secondary/90 text-white text-lg px-8 py-6 h-auto">
                  List Your Property
                </Button>
              </Link>
              <Link to="/owner-plans">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto">
                  Learn About Owner Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;

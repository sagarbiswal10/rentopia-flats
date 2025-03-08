
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import HowItWorks from '@/components/HowItWorks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Home as HomeIcon, IndianRupee, Check } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <main>
        <Hero />
        <FeaturedProperties />
        <HowItWorks />
        
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
                    <HomeIcon className="h-10 w-10 text-secondary" />
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

export default Index;

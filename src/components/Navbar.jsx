
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, Search, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Rent</span>
              <span className="text-secondary">Easy</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-primary transition-colors">
              Properties
            </Link>
            <Link to="/post-property" className="text-gray-700 hover:text-primary transition-colors">
              Post Property
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <User className="h-5 w-5 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link to="/" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Home
            </Link>
            <Link to="/properties" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Properties
            </Link>
            <Link to="/post-property" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Post Property
            </Link>
            <Link to="/about" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              About
            </Link>
            <div className="flex items-center space-x-3 px-2 py-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <User className="h-5 w-5 mr-2" />
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

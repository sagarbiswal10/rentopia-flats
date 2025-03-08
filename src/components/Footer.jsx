
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">RentEasy</span>
            </div>
            <p className="mb-4 text-gray-300">
              Helping you find the perfect home without any brokerage fees.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-secondary transition-colors">
                  Rent
                </Link>
              </li>
              <li>
                <Link to="/post-property" className="text-gray-300 hover:text-secondary transition-colors">
                  List Property
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Major Cities</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?city=Mumbai" className="text-gray-300 hover:text-secondary transition-colors">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Delhi" className="text-gray-300 hover:text-secondary transition-colors">
                  Delhi
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bangalore" className="text-gray-300 hover:text-secondary transition-colors">
                  Bangalore
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad" className="text-gray-300 hover:text-secondary transition-colors">
                  Hyderabad
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Chennai" className="text-gray-300 hover:text-secondary transition-colors">
                  Chennai
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5" />
                <span>support@renteasy.in</span>
              </div>
              <div className="flex items-start">
                <Home className="h-5 w-5 mr-2 mt-0.5" />
                <span>123, ABC Tower, MG Road, Bangalore - 560001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-gray-300">
          <p>© {new Date().getFullYear()} RentEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

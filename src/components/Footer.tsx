
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-purple-800/20 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/LOGO.png" 
                alt="Titan Evolve Logo" 
                className="h-10 w-10 object-contain"
              />
              <div className="text-2xl font-black tracking-wider">
                <span className="text-purple-400">TITAN</span>EVOLVE
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Premium nutrition supplements for serious athletes. Transform your body, elevate your performance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-purple-400">QUICK LINKS</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-purple-400">CUSTOMER SERVICE</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping-info" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
             
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-purple-400">CONTACT INFO</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <a 
                  href="mailto:titanevolvenutrition.care@gmail.com" 
                  className="hover:text-purple-400 transition-colors"
                >
                  titanevolvenutrition.care@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <a 
                  href="https://wa.me/919211991181" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors"
                >
                  +91 9211991181
                </a>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>Bilekahalli,<br />Banglore-560076</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-800/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 Titan Evolve. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm justify-center md:justify-end">
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <a 
                href="https://nvsufriurpjcrrnaxlfl.supabase.co/storage/v1/object/public/legal-documents/privacy-policy-1755788937437.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="https://nvsufriurpjcrrnaxlfl.supabase.co/storage/v1/object/public/legal-documents/terms-and-conditions-1755788930746.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

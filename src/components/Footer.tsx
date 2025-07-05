
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-black text-white tracking-wider mb-4 block">
              <span className="text-purple-400">MUSCLE</span>FUEL
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Premium supplements for serious athletes. Fuel your ambition with our high-quality products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=pre-workout" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Pre-Workout
                </Link>
              </li>
              <li>
                <Link to="/shop?category=protein" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Protein
                </Link>
              </li>
              <li>
                <Link to="/shop?category=mass gainer" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Mass Gainers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=creatine" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Creatine
                </Link>
              </li>
              <li>
                <Link to="/shop?category=recovery" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Recovery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=vitamins" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Vitamins
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help-center" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link to="/affiliate-program" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-3" />
                <span>info@musclefuel.com</span>
              </div>
              <div className="flex items-start text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-3 mt-1" />
                <span>123 Fitness Street, Mumbai, Maharashtra 400001, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                Cookie Policy
              </Link>
            </div>
            <p className="text-gray-400 text-xs">
              © 2024 MuscleFuel. All rights reserved. Made in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import Layout from '@/components/Layout';
import { Truck, Clock } from 'lucide-react';

const ShippingInfo = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-purple-900 to-black flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-7xl font-black tracking-tight mb-4">SHIPPING INFO</h1>
            <p className="text-2xl text-gray-300 max-w-2xl">
              Fast, reliable delivery to fuel your fitness journey
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              
              {/* Order Processing */}
              <div className="bg-gradient-to-r from-purple-900/30 to-black p-8 rounded-2xl border border-purple-800/30 mb-12">
                <div className="flex items-center mb-6">
                  <Clock className="h-8 w-8 text-purple-400 mr-4" />
                  <h2 className="text-3xl font-black text-purple-400">ORDER PROCESSING</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Orders are processed within <span className="text-purple-400 font-bold">24–48 hours</span> after payment
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      You'll receive tracking info via email/SMS once dispatched
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="bg-gray-900/50 p-8 rounded-2xl border border-purple-800/20 mb-12">
                <div className="flex items-center mb-6">
                  <Truck className="h-8 w-8 text-purple-400 mr-4" />
                  <h2 className="text-3xl font-black text-purple-400">DELIVERY TIMELINE</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-700/30">
                    <h3 className="text-xl font-bold text-white mb-3">Metro Cities</h3>
                    <p className="text-2xl font-black text-purple-400">2–4 working days</p>
                  </div>
                  <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-700/30">
                    <h3 className="text-xl font-bold text-white mb-3">Tier 2 & Rural Areas</h3>
                    <p className="text-2xl font-black text-purple-400">4–7 working days</p>
                  </div>
                </div>
              </div>

              {/* Shipping Charges */}
              <div className="bg-gradient-to-r from-green-900/30 to-black p-8 rounded-2xl border border-green-800/30 mb-12">
                <h2 className="text-3xl font-black text-green-400 mb-6">SHIPPING CHARGES</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-700/30">
                    <span className="text-lg text-gray-300">FREE shipping on all prepaid orders above</span>
                    <span className="text-2xl font-bold text-green-400">₹1499</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-700/30">
                    <span className="text-lg text-gray-300">Flat shipping for orders below ₹1499</span>
                    <span className="text-xl font-bold text-white">₹99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-900/20 rounded-lg border border-orange-700/30">
                    <span className="text-lg text-gray-300">Cash on Delivery (COD) additional charge</span>
                    <span className="text-xl font-bold text-orange-400">₹199</span>
                  </div>
                </div>
              </div>


              {/* Contact Information */}
              <div className="text-center bg-purple-900/20 p-8 rounded-2xl border border-purple-800/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Need Help?</h3>
                <p className="text-lg text-gray-300 mb-4">
                  For any shipping-related queries, contact us immediately
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/918506912255" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    WhatsApp: +91 8506912255
                  </a>
                  <a 
                    href="mailto:support@titanevolve.com" 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    Email Support
                  </a>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ShippingInfo;

import React from 'react';
import Layout from '@/components/Layout';
import { Truck, Clock, Shield, Package } from 'lucide-react';

const ShippingInfo = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">SHIPPING INFO</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about our shipping policy
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <Truck className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
                <p className="text-gray-400">On orders above ₹2,000</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-400">3-7 business days</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure Packaging</h3>
                <p className="text-gray-400">Safe & secure delivery</p>
              </div>
              <div className="text-center">
                <Package className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Order Tracking</h3>
                <p className="text-gray-400">Real-time updates</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-purple-400 mb-6">Shipping Details</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Shipping Charges</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Free shipping on orders above ₹2,000</li>
                    <li>• ₹150 shipping charges for orders below ₹2,000</li>
                    <li>• Express delivery available for ₹300 extra</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Delivery Timeline</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Metro cities: 3-5 business days</li>
                    <li>• Tier 2 cities: 5-7 business days</li>
                    <li>• Remote areas: 7-10 business days</li>
                    <li>• Express delivery: 1-2 business days (metro cities only)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Order Processing</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Orders placed before 2 PM are processed the same day</li>
                    <li>• Orders placed after 2 PM are processed the next business day</li>
                    <li>• No processing on Sundays and public holidays</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Tracking Your Order</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• You'll receive a tracking number via SMS and email</li>
                    <li>• Track your order in real-time on our website</li>
                    <li>• Get updates at every step of delivery</li>
                  </ul>
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

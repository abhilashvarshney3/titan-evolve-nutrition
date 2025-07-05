
import React from 'react';
import Layout from '@/components/Layout';
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react';

const HelpCenter = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">HELP CENTER</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're here to help you with any questions or concerns
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="text-center bg-gray-900 rounded-xl p-6">
                <Phone className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-400 mb-2">+91 98765 43210</p>
                <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 7 PM</p>
              </div>
              <div className="text-center bg-gray-900 rounded-xl p-6">
                <Mail className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-400 mb-2">support@yourstore.com</p>
                <p className="text-sm text-gray-500">24/7 Support</p>
              </div>
              <div className="text-center bg-gray-900 rounded-xl p-6">
                <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                <p className="text-gray-400 mb-2">Chat with us now</p>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
              <div className="text-center bg-gray-900 rounded-xl p-6">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Response Time</h3>
                <p className="text-gray-400 mb-2">Within 2 hours</p>
                <p className="text-sm text-gray-500">Average response</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-purple-400 mb-6">Common Issues</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Order Related</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Order status and tracking</li>
                    <li>• Delivery delays</li>
                    <li>• Order modifications</li>
                    <li>• Payment issues</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Product Related</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Product information</li>
                    <li>• Usage instructions</li>
                    <li>• Side effects</li>
                    <li>• Authenticity verification</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Returns & Refunds</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Return process</li>
                    <li>• Refund status</li>
                    <li>• Exchange requests</li>
                    <li>• Damaged products</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Account Issues</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Login problems</li>
                    <li>• Password reset</li>
                    <li>• Profile updates</li>
                    <li>• Subscription management</li>
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

export default HelpCenter;

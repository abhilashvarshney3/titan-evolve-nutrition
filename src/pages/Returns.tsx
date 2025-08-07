
import React from 'react';
import Layout from '@/components/Layout';
import { RotateCcw, Clock, Shield, CheckCircle, Camera, AlertTriangle } from 'lucide-react';

const Returns = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">RETURNS</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Easy returns and refunds policy
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <RotateCcw className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">7-Day Returns</h3>
                <p className="text-gray-400">Hassle-free returns</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Quick Processing</h3>
                <p className="text-gray-400">Fast refund processing</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
                <p className="text-gray-400">100% satisfaction</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Easy Process</h3>
                <p className="text-gray-400">Simple return steps</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-black p-8 rounded-2xl border border-red-800/30 mb-12">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-black text-red-400">RETURNS & REFUND POLICY</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                We stand by our product quality. However, if there's damage or tampering during shipping, 
                we offer replacements or refunds under our strict policy:
              </p>

              {/* Mandatory Unboxing Video */}
              <div className="bg-red-900/20 p-6 rounded-xl border border-red-700/30 mb-8">
                <div className="flex items-center mb-4">
                  <Camera className="h-6 w-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-bold text-red-400">MANDATORY UNBOXING VIDEO</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    You must record a 360° unboxing video with your phone
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    Video must show seal condition, box label, and product clearly
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    Ensure good lighting and product in focus — all in one take
                  </li>
                </ul>
              </div>

              {/* Refund/Replacement Validity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/30">
                  <h3 className="text-xl font-bold text-white mb-4">REFUND/REPLACEMENT VALIDITY</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></span>
                      Must report the issue within 7 days of delivery
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></span>
                      Share the video immediately via email or WhatsApp
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                      <span className="font-bold text-red-400">No video = no claim will be accepted</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/30">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
                    <h3 className="text-xl font-bold text-yellow-400">WHAT WE DON'T ACCEPT</h3>
                  </div>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 mt-2"></span>
                      Opened, used, or tampered products without a valid reason
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 mt-2"></span>
                      Return requests after 7 days
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 mt-2"></span>
                      Flavor dislikes or taste preferences
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-center bg-purple-900/20 p-8 rounded-2xl border border-purple-800/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Need Help?</h3>
                <p className="text-lg text-gray-300 mb-4">
                  For any return-related queries, contact us immediately
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/919211991181" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    WhatsApp: +91 9211991181
                  </a>
                  <a 
                    href="mailto:titanevolvenutrition.care@gmail.com" 
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

export default Returns;

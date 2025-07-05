
import React from 'react';
import Layout from '@/components/Layout';
import { RotateCcw, Clock, Shield, CheckCircle } from 'lucide-react';

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
                <h3 className="text-xl font-bold mb-2">30-Day Returns</h3>
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

            <div className="bg-gray-900 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-purple-400 mb-6">Return Policy</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Return Conditions</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Products must be unopened and in original packaging</li>
                    <li>• Return request must be initiated within 30 days of delivery</li>
                    <li>• Products should be in unused condition</li>
                    <li>• Original invoice must be provided</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">How to Return</h3>
                  <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                    <li>Contact our customer support team</li>
                    <li>Provide order number and reason for return</li>
                    <li>Receive return authorization and shipping label</li>
                    <li>Pack the product securely and ship it back</li>
                    <li>Refund will be processed within 7-10 business days</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Refund Process</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Refunds are processed to the original payment method</li>
                    <li>• Bank transfers take 3-5 business days</li>
                    <li>• Credit card refunds take 5-7 business days</li>
                    <li>• Shipping charges are non-refundable</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Non-Returnable Items</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Opened or used supplements</li>
                    <li>• Products damaged by customer negligence</li>
                    <li>• Items returned after 30 days</li>
                    <li>• Products without proper packaging</li>
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

export default Returns;

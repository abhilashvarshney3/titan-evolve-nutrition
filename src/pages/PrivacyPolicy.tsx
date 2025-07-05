
import React from 'react';
import Layout from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">PRIVACY POLICY</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How we collect, use, and protect your information
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gray-900 rounded-xl p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Information We Collect</h2>
                <p className="text-gray-300 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support.
                </p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">How We Use Your Information</h2>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional emails (with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Information Sharing</h2>
                <p className="text-gray-300 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except as described in this policy.
                </p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Service providers who assist in our operations</li>
                  <li>Payment processors for transaction processing</li>
                  <li>Shipping companies for order delivery</li>
                  <li>Legal requirements or to protect our rights</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Data Security</h2>
                <p className="text-gray-300">
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Your Rights</h2>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about this Privacy Policy, please contact us at 
                  privacy@yourstore.com or call +91 98765 43210.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;

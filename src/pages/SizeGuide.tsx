
import React from 'react';
import Layout from '@/components/Layout';

const SizeGuide = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">SIZE GUIDE</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the right size for your supplements
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="bg-gray-900 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-purple-400 mb-6">Supplement Serving Sizes</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Protein Supplements</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300 border border-purple-800/30">
                      <thead>
                        <tr className="bg-purple-900/30">
                          <th className="border border-purple-800/30 p-3 text-left">Product Size</th>
                          <th className="border border-purple-800/30 p-3 text-left">Servings</th>
                          <th className="border border-purple-800/30 p-3 text-left">Recommended For</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-purple-800/30 p-3">1 kg</td>
                          <td className="border border-purple-800/30 p-3">30-33 servings</td>
                          <td className="border border-purple-800/30 p-3">1 month supply</td>
                        </tr>
                        <tr>
                          <td className="border border-purple-800/30 p-3">2 kg</td>
                          <td className="border border-purple-800/30 p-3">60-66 servings</td>
                          <td className="border border-purple-800/30 p-3">2 months supply</td>
                        </tr>
                        <tr>
                          <td className="border border-purple-800/30 p-3">5 kg</td>
                          <td className="border border-purple-800/30 p-3">150-165 servings</td>
                          <td className="border border-purple-800/30 p-3">5 months supply</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Pre-Workout Supplements</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300 border border-purple-800/30">
                      <thead>
                        <tr className="bg-purple-900/30">
                          <th className="border border-purple-800/30 p-3 text-left">Product Size</th>
                          <th className="border border-purple-800/30 p-3 text-left">Servings</th>
                          <th className="border border-purple-800/30 p-3 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-purple-800/30 p-3">300g</td>
                          <td className="border border-purple-800/30 p-3">20 servings</td>
                          <td className="border border-purple-800/30 p-3">3-4 weeks</td>
                        </tr>
                        <tr>
                          <td className="border border-purple-800/30 p-3">450g</td>
                          <td className="border border-purple-800/30 p-3">30 servings</td>
                          <td className="border border-purple-800/30 p-3">1 month</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Usage Guidelines</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Beginners: Start with smaller sizes to test tolerance</li>
                    <li>• Regular users: 1-2 kg sizes offer good value</li>
                    <li>• Bulk buyers: 5 kg sizes provide maximum savings</li>
                    <li>• Pre-workout: Use only on training days</li>
                    <li>• Protein: Can be used daily for best results</li>
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

export default SizeGuide;

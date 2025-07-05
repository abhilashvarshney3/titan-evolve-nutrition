
import React from 'react';
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-purple-900 to-black flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-7xl font-black tracking-tight mb-4">ABOUT US</h1>
            <p className="text-2xl text-gray-300 max-w-2xl">
              Pioneering the future of performance nutrition
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div>
                  <h2 className="text-4xl font-black mb-6 text-purple-400">OUR MISSION</h2>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    At TITAN EVOLVE, we believe in pushing the boundaries of human potential. 
                    Our mission is to provide athletes and fitness enthusiasts with scientifically 
                    engineered supplements that deliver uncompromising results.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Every product in our lineup is meticulously formulated using cutting-edge 
                    research and premium ingredients sourced from around the globe.
                  </p>
                </div>
                <div className="bg-purple-900/20 p-8 rounded-xl border border-purple-800/30">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">WHY CHOOSE US?</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Premium, lab-tested ingredients
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Science-backed formulations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Transparent labeling
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Third-party testing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Authentic product verification
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-4xl font-black mb-8 text-purple-400">THE TITAN DIFFERENCE</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-800/20">
                    <div className="text-3xl font-black text-purple-500 mb-4">QUALITY</div>
                    <p className="text-gray-300">
                      We use only the highest quality ingredients, rigorously tested for purity and potency.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-800/20">
                    <div className="text-3xl font-black text-purple-500 mb-4">INNOVATION</div>
                    <p className="text-gray-300">
                      Our R&D team constantly pushes the boundaries of supplement science.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-800/20">
                    <div className="text-3xl font-black text-purple-500 mb-4">RESULTS</div>
                    <p className="text-gray-300">
                      Every product is designed to deliver measurable, consistent results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;

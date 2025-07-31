
import React from 'react';
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-purple-900 to-black flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-7xl font-black tracking-tight mb-4">ABOUT TITAN EVOLVE</h1>
            <p className="text-2xl text-gray-300 max-w-3xl">
              Born for athletes. Built by the relentless. Driven by discipline.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Introduction */}
              <div className="text-center mb-16">
                <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  Titan Evolve is a premium Indian nutraceutical brand crafted to fulfil the needs of athletes, 
                  strength training enthusiasts, and fitness-driven individuals. Engineered by elite coaches, 
                  sports scientists, and performance-focused professionals, our mission is to deliver high-quality 
                  supplements backed by science, driven by performance, and elevated by taste.
                </p>
                <div className="mt-8 text-2xl font-bold text-purple-400">
                  We don't chase trends. We chase results.
                </div>
                <p className="mt-4 text-lg text-gray-300">
                  From the training ground to the podium — we fuel evolution, a TITAN in process.
                </p>
                <p className="mt-4 text-lg text-gray-300">
                  Whether you're a beginner, everyday gym-goer, elite lifter, or competitive athlete — 
                  Titan Evolve is your trusted partner in building strength, endurance, aesthetics, and mindset.
                </p>
              </div>

              {/* Vision Section */}
              <div className="bg-gradient-to-r from-purple-900/30 to-black p-12 rounded-2xl border border-purple-800/30 mb-16">
                <h2 className="text-4xl font-black mb-6 text-purple-400 text-center">OUR VISION</h2>
                <p className="text-xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                  To become India's most trusted and performance-first supplement brand — combining elite-level quality, 
                  scientific formulation, and a community culture that empowers athletes across all disciplines.
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-12 text-purple-400">WHY CHOOSE TITAN EVOLVE?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-gray-900/50 p-8 rounded-xl border border-purple-800/20 hover:border-purple-600/40 transition-all duration-300">
                    <div className="text-purple-500 text-lg font-bold mb-4">✔️ Real Athletes, Real Testing</div>
                    <p className="text-gray-300">
                      Formulated by real athletes and coaches & tested in real training environments
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-8 rounded-xl border border-purple-800/20 hover:border-purple-600/40 transition-all duration-300">
                    <div className="text-purple-500 text-lg font-bold mb-4">✔️ Maximum Impact</div>
                    <p className="text-gray-300">
                      Micronized, bioavailable ingredients for maximum impact
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-8 rounded-xl border border-purple-800/20 hover:border-purple-600/40 transition-all duration-300">
                    <div className="text-purple-500 text-lg font-bold mb-4">✔️ Pure & Clean</div>
                    <p className="text-gray-300">
                      Transparent labels, zero banned substances, no filler junk
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-8 rounded-xl border border-purple-800/20 hover:border-purple-600/40 transition-all duration-300">
                    <div className="text-purple-500 text-lg font-bold mb-4">✔️ Superior Taste</div>
                    <p className="text-gray-300">
                      Superior taste profiles with smooth, mixable blends
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-8 rounded-xl border border-purple-800/20 hover:border-purple-600/40 transition-all duration-300">
                    <div className="text-purple-500 text-lg font-bold mb-4">✔️ Trusted by Athletes</div>
                    <p className="text-gray-300">
                      Trusted by strength athletes, fitness enthusiasts, and performance-driven individuals
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-8 rounded-xl border border-purple-800/20 hover:border-purple-600/40 transition-all duration-300">
                    <div className="text-purple-500 text-lg font-bold mb-4">✔️ Community Focused</div>
                    <p className="text-gray-300">
                      Community-focused brand built on grit, knowledge, and trust
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

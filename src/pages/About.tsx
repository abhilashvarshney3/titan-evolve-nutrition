
import React from 'react';
import { Shield, Award, Users, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'QUALITY FIRST',
      description: 'Every product undergoes rigorous third-party testing for purity and potency'
    },
    {
      icon: Award,
      title: 'SCIENTIFICALLY PROVEN',
      description: 'Formulations backed by peer-reviewed research and clinical studies'
    },
    {
      icon: Users,
      title: 'ATHLETE APPROVED',
      description: 'Trusted by professional athletes and elite performers worldwide'
    },
    {
      icon: Target,
      title: 'RESULTS DRIVEN',
      description: 'Engineered for maximum performance and measurable results'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-b from-gray-900 to-black flex items-center">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Gym equipment"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-7xl md:text-8xl font-black tracking-tight mb-8">
              ABOUT
              <span className="block text-red-500">TITAN EVOLVE</span>
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed">
              We don't just make supplements. We engineer performance solutions 
              for athletes who refuse to accept limitations.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-8">OUR STORY</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Founded by elite athletes who were frustrated by mediocre supplements, 
                  Titan Evolve was born from a simple mission: create products that 
                  actually work.
                </p>
                <p>
                  Every formula is meticulously crafted using clinically dosed ingredients, 
                  rigorously tested for purity, and proven in the crucible of competition.
                </p>
                <p>
                  We don't compromise. We don't cut corners. We engineer excellence.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
                alt="Laboratory"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16">OUR VALUES</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                    <IconComponent className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

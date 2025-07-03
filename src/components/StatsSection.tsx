
import React from 'react';
import { Users, Award, Zap, Shield } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '50K+',
      label: 'Athletes Trust Us',
      description: 'Professional and amateur athletes worldwide'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Years Experience',
      description: 'Pioneering sports nutrition excellence'
    },
    {
      icon: Zap,
      value: '100%',
      label: 'Lab Tested',
      description: 'Every batch rigorously tested for purity'
    },
    {
      icon: Shield,
      value: '24/7',
      label: 'Expert Support',
      description: 'Nutrition specialists at your service'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Champions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our commitment to excellence has made us the preferred choice of elite athletes and fitness enthusiasts worldwide
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                    <IconComponent className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="absolute inset-0 bg-purple-600/10 rounded-2xl blur-xl group-hover:bg-purple-600/20 transition-colors"></div>
                </div>
                
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {stat.value}
                </div>
                
                <div className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </div>
                
                <div className="text-sm text-gray-400 leading-relaxed">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

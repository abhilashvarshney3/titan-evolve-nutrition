
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Dumbbell, Shield, Target } from 'lucide-react';

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: 'Pre-Workout',
      description: 'Explosive energy and focus for intense training sessions',
      icon: Zap,
      color: 'bg-red-500',
      products: 12,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Protein & Mass',
      description: 'Build lean muscle with premium protein formulas',
      icon: Dumbbell,
      color: 'bg-blue-500',
      products: 18,
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Recovery',
      description: 'Optimize recovery and reduce muscle fatigue',
      icon: Shield,
      color: 'bg-green-500',
      products: 8,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Performance',
      description: 'Enhance strength, endurance and overall performance',
      icon: Target,
      color: 'bg-purple-500',
      products: 15,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect supplements for your fitness goals and training style
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4">
                    <div className={`p-3 ${category.color} rounded-xl text-white shadow-lg`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Product Count */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                    {category.products} products
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-200"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

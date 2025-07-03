
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'pre-workout', name: 'Pre-Workout' },
    { id: 'protein', name: 'Protein' },
    { id: 'mass-gainer', name: 'Mass Gainer' },
    { id: 'creatine', name: 'Creatine' },
    { id: 'fat-loss', name: 'Fat Loss' },
    { id: 'recovery', name: 'Recovery' }
  ];

  const products = [
    {
      id: '1',
      name: 'MURDERER Pre-Workout',
      category: 'Pre-Workout',
      price: 49.99,
      originalPrice: 59.99,
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
      rating: 4.9,
      reviewCount: 342,
      badge: 'BESTSELLER',
      description: 'Hard-hitting pre-workout formula with 200mg caffeine, 3200mg beta-alanine for explosive energy and focus.'
    },
    // Add more products...
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-red-900 to-black flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl font-black tracking-tight mb-4">SHOP</h1>
          <p className="text-xl text-gray-300">Premium supplements for elite performance</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-900 p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">CATEGORIES</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`block w-full text-left px-4 py-2 rounded-none transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 p-6">
              <h3 className="text-xl font-bold mb-4">FILTERS</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">PRICE RANGE</label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" className="bg-black border-gray-700 text-white" />
                    <Input placeholder="Max" className="bg-black border-gray-700 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-gray-900 border-gray-700 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;

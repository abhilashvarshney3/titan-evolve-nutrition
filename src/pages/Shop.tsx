
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Products', count: 48 },
    { id: 'pre-workout', name: 'Pre-Workout', count: 12 },
    { id: 'protein', name: 'Protein', count: 15 },
    { id: 'mass-gainer', name: 'Mass Gainer', count: 8 },
    { id: 'creatine', name: 'Creatine', count: 6 },
    { id: 'fat-loss', name: 'Fat Loss', count: 7 }
  ];

  const products = [
    {
      id: '1',
      name: 'MURDERER Pre-Workout Extreme',
      category: 'Pre-Workout',
      price: 49.99,
      originalPrice: 59.99,
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
      rating: 4.9,
      reviewCount: 342,
      badge: 'BESTSELLER',
      description: 'Hard-hitting pre-workout formula with 200mg caffeine and 3200mg beta-alanine for explosive energy.'
    },
    {
      id: '2',
      name: 'MUSCLE GAINER Premium Blend',
      category: 'Mass Gainer',
      price: 64.99,
      image: '/lovable-uploads/534d4161-7ade-4f7c-bfe9-debf0e569cc5.png',
      rating: 4.7,
      reviewCount: 198,
      badge: 'NEW',
      description: 'High-quality mass gainer with 50g protein and 250g carbs for serious muscle building.'
    },
    {
      id: '3',
      name: 'LEAN WHEY Protein Isolate',
      category: 'Protein',
      price: 39.99,
      originalPrice: 44.99,
      image: '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png',
      rating: 4.8,
      reviewCount: 456,
      description: 'Ultra-pure whey protein isolate with 25g protein per serving and minimal carbs.'
    },
    {
      id: '4',
      name: 'CREATINE Monohydrate Pure',
      category: 'Creatine',
      price: 29.99,
      image: '/lovable-uploads/379dfbc4-577f-4c70-8379-887938232ec0.png',
      rating: 4.6,
      reviewCount: 289,
      description: 'Pharmaceutical grade creatine monohydrate for strength and power enhancement.'
    },
    {
      id: '5',
      name: 'FAT BURNER Thermogenic',
      category: 'Fat Loss',
      price: 54.99,
      originalPrice: 64.99,
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
      rating: 4.5,
      reviewCount: 156,
      badge: 'HOT',
      description: 'Advanced thermogenic formula to accelerate fat loss and boost metabolism.'
    },
    {
      id: '6',
      name: 'PUMP Enhancer Nitric Oxide',
      category: 'Pre-Workout',
      price: 44.99,
      image: '/lovable-uploads/534d4161-7ade-4f7c-bfe9-debf0e569cc5.png',
      rating: 4.8,
      reviewCount: 89,
      description: 'Nitric oxide booster for incredible pumps and vascularity during workouts.'
    },
    {
      id: '7',
      name: 'CASEIN Protein Night Formula',
      category: 'Protein',
      price: 42.99,
      image: '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png',
      rating: 4.7,
      reviewCount: 234,
      description: 'Slow-release casein protein perfect for overnight muscle recovery and growth.'
    },
    {
      id: '8',
      name: 'BCAA Recovery Matrix',
      category: 'Recovery',
      price: 34.99,
      image: '/lovable-uploads/379dfbc4-577f-4c70-8379-887938232ec0.png',
      rating: 4.6,
      reviewCount: 178,
      description: 'Essential amino acids to reduce muscle fatigue and accelerate recovery.'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase().includes(selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-red-900 via-black to-gray-900 flex items-center mt-20">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl font-black tracking-tight mb-4">SHOP</h1>
          <p className="text-xl text-gray-300">Premium supplements for elite performance</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-gray-900 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-6 text-red-400">CATEGORIES</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm opacity-70">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 text-red-400">PRICE FILTER</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input 
                    placeholder="Min" 
                    className="bg-black border-gray-700 text-white rounded-lg" 
                  />
                  <Input 
                    placeholder="Max" 
                    className="bg-black border-gray-700 text-white rounded-lg" 
                  />
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">
                  APPLY FILTER
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-gray-900 border-gray-700 text-white rounded-lg h-12"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">
                  {filteredProducts.length} products found
                </span>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="bg-red-600 hover:bg-red-700 border-red-600"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="bg-red-600 hover:bg-red-700 border-red-600"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
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

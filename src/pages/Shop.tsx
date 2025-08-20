import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';
import { useProducts, ProductWithVariantsAndImages } from '@/hooks/useProducts';
import ModernProductCard from '@/components/ModernProductCard';

const Shop = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Define categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'protein', name: 'Protein' },
    { id: 'mass-gainer', name: 'Mass Gainer' },
    { id: 'pre-workout', name: 'Pre-Workout' },
    { id: 'creatine', name: 'Creatine' }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-2000', name: '₹0 - ₹2,000' },
    { id: '2000-3500', name: '₹2,000 - ₹3,500' },
    { id: '3500-5000', name: '₹3,500 - ₹5,000' },
    { id: '5000+', name: '₹5,000+' }
  ];

  const sortOptions = [
    { id: 'name', name: 'Name' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'featured', name: 'Featured' }
  ];

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter - includes product name, description, and variant flavors
    if (searchQuery) {
      filtered = filtered.filter(product => {
        const matchesProduct = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesVariantFlavor = product.variants.some(variant => 
          variant.flavor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          variant.size?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          variant.variant_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        return matchesProduct || matchesVariantFlavor;
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        // Handle both category_id and name-based filtering
        return product.category_id === selectedCategory || 
               product.name.toLowerCase().includes(selectedCategory.replace('-', ' '));
      });
    }

    // Price filter - using default variant price
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p.replace('+', '')));
      filtered = filtered.filter(product => {
        const defaultPrice = product.variants[0]?.price || product.price || 0;
        if (max === undefined || max === Infinity) return defaultPrice >= min;
        return defaultPrice >= min && defaultPrice <= max;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.variants[0]?.price || a.price || 0) - (b.variants[0]?.price || b.price || 0);
        case 'price-high':
          return (b.variants[0]?.price || b.price || 0) - (a.variants[0]?.price || a.price || 0);
        case 'featured':
          return b.is_featured ? 1 : -1;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filterProducts function, no need to update URL params
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('name');
    setSearchParams(new URLSearchParams());
  };

  const filteredProducts = filterProducts();

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-900 to-black py-20 animate-fade-in">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">SHOP</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover our complete range of premium supplements
            </p>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 border-b border-purple-800/30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="w-full lg:w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900 border-purple-700 text-white w-full"
                  />
                </div>
              </form>

              {/* Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-2 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Price Filter */}
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-2 py-2 text-sm"
                >
                  {priceRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-2 py-2 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      Sort by {option.name}
                    </option>
                  ))}
                </select>

                {/* Reset Filters Button */}
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white text-sm"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
                <p className="text-gray-400 mb-8">Try adjusting your filters or search terms.</p>
                <Button
                  onClick={resetFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ModernProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Shop;
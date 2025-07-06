
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  stock_quantity: number;
  sku: string;
  is_featured: boolean;
  is_new: boolean;
  categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { user } = useAuth();
  const { toast } = useToast();

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-3000', name: '₹0 - ₹3,000' },
    { id: '3000-4500', name: '₹3,000 - ₹4,500' },
    { id: '4500-6000', name: '₹4,500 - ₹6,000' },
    { id: '6000+', name: '₹6,000+' }
  ];

  const sortOptions = [
    { id: 'name', name: 'Name' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'featured', name: 'Featured' }
  ];

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.categories?.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p.replace('+', '')));
      filtered = filtered.filter(product => {
        if (max === undefined || max === Infinity) return product.price >= min;
        return product.price >= min && product.price <= max;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
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
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const handleQuickAdd = async (product: Product) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
              quantity: 1
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`
      });

      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive"
      });
    }
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
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900 border-purple-700 text-white"
                  />
                </div>
              </form>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-3 py-2"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name.toLowerCase()}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Price Filter */}
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-3 py-2"
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
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-3 py-2"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      Sort by {option.name}
                    </option>
                  ))}
                </select>
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-800/20 animate-fade-in relative"
                  >
                    {/* Image Container */}
                    <Link to={`/product/${product.id}`}>
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.is_new && (
                            <Badge className="bg-purple-600 text-white px-2 py-1 text-xs font-bold">
                              NEW
                            </Badge>
                          )}
                          {product.is_featured && (
                            <Badge className="bg-yellow-600 text-black px-2 py-1 text-xs font-bold">
                              FEATURED
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button className="absolute top-3 right-3 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-600">
                          <Heart className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </Link>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        onClick={() => handleQuickAdd(product)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 transform hover:scale-105 transition-all duration-300"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        QUICK ADD
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Category */}
                      <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">
                        {product.categories?.name || 'Supplement'}
                      </span>
                      
                      {/* Title */}
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-white text-lg font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 4
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs">(247)</span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price and Add to Cart */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-white text-xl font-bold">
                          ₹{product.price.toFixed(0)}
                        </span>
                        
                        <Button
                          size="sm"
                          onClick={() => handleQuickAdd(product)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 text-sm font-bold"
                        >
                          ADD
                        </Button>
                      </div>

                      {/* Stock Status */}
                      <div className="text-xs">
                        {product.stock_quantity > 0 ? (
                          <span className="text-green-400">✓ In Stock ({product.stock_quantity})</span>
                        ) : (
                          <span className="text-red-400">✗ Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-400 mb-4">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Shop;

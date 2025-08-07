
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, ShoppingCart, Heart, MessageCircle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartQuantity } from '@/hooks/useCartQuantity';
import { products as centralizedProducts, getAllCategories, ProductData } from '@/data/products';

// Using centralized ProductData interface and categories

// Use centralized products data directly instead of mapping
// Shop will now use the centralized product data with correct images

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, description: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedFlavor, setSelectedFlavor] = useState('all');
  const [selectedWeight, setSelectedWeight] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

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

  // Extract unique flavors and weights from products
  const availableFlavors = ['all', ...new Set(products.map(p => p.details.flavor).filter(Boolean))];
  const availableWeights = ['all', ...new Set(products.map(p => p.details.weight).filter(Boolean))];

  useEffect(() => {
    loadCategoriesAndProducts();
  }, []);

  const loadCategoriesAndProducts = () => {
    try {
      const allCategories = getAllCategories();
      setCategories(Object.values(allCategories));
      setProducts(centralizedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
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
        product.category.toLowerCase() === selectedCategory.toLowerCase()
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

    // Flavor filter
    if (selectedFlavor !== 'all') {
      filtered = filtered.filter(product => 
        product.details.flavor === selectedFlavor
      );
    }

    // Weight filter
    if (selectedWeight !== 'all') {
      filtered = filtered.filter(product => 
        product.details.weight === selectedWeight
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'featured':
          return b.isFeatured ? 1 : -1;
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
    setSelectedFlavor('all');
    setSelectedWeight('all');
    setSortBy('name');
    setSearchParams(new URLSearchParams());
  };

  const handleQuickAdd = async (product: ProductData) => {
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

  const handleQuickBuy = (product: ProductData) => {
    const message = `Hi! I'm interested in purchasing ${product.name} (₹${product.price}). Can you help me with the order?`;
    const whatsappUrl = `https://wa.me/919211991181?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  
  // CartButtons component for shop page
  const CartButtons = ({ productId, productName }: { productId: string; productName: string }) => {
    const { quantity, loading, incrementQuantity, decrementQuantity, addToCart } = useCartQuantity(productId);
    const { user } = useAuth();
    const { toast } = useToast();

    const handleAddToCart = () => {
      if (!user) {
        toast({
          title: "Please Sign In",
          description: "You need to be logged in to add items to cart.",
          variant: "destructive"
        });
        return;
      }
      addToCart(productName);
    };

    const handleQuickBuy = () => {
      const message = `Hi! I'm interested in purchasing ${productName}. Can you help me with the order?`;
      const whatsappUrl = `https://wa.me/919211991181?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    return (
      <div className="flex gap-2">
        {quantity > 0 ? (
          // Quantity Controls - Compact and responsive
          <div className="flex items-center bg-purple-600 rounded-lg overflow-hidden">
            <Button
              size="sm"
              onClick={() => decrementQuantity(productName)}
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded-none h-8 min-w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="bg-purple-600 text-white px-2 py-1 text-sm font-bold min-w-8 text-center flex items-center justify-center h-8">
              {quantity}
            </span>
            <Button
              size="sm"
              onClick={() => incrementQuantity(productName)}
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded-none h-8 min-w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          // Add to Cart Button - Purple theme
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm font-bold"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            ADD TO CART
          </Button>
        )}
        
        {/* Quick Buy Button */}
        <Button
          size="sm"
          onClick={handleQuickBuy}
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1 text-sm font-bold"
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          BUY
        </Button>
      </div>
    );
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-2 py-2 text-sm"
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
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-2 py-2 text-sm"
                >
                  {priceRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>

                {/* Flavor Filter */}
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-2 py-2 text-sm"
                >
                  <option value="all">All Flavors</option>
                  {availableFlavors.filter(f => f !== 'all').map((flavor) => (
                    <option key={flavor} value={flavor}>
                      {flavor.split(' - ')[0].replace(/[🍉🍬🍫]/g, '').trim()}
                    </option>
                  ))}
                </select>

                {/* Weight Filter */}
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="bg-gray-900 border border-purple-700 text-white rounded-lg px-2 py-2 text-sm"
                >
                  <option value="all">All Weights</option>
                  {availableWeights.filter(w => w !== 'all').map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-800/20 animate-fade-in relative"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="relative h-48 overflow-hidden bg-gray-800 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isNew && (
                            <Badge className="bg-purple-600 text-white px-2 py-1 text-xs font-bold">
                              NEW
                            </Badge>
                          )}
                          {product.isFeatured && (
                            <Badge className="bg-yellow-600 text-black px-2 py-1 text-xs font-bold">
                              FEATURED
                            </Badge>
                          )}
                          {product.badge && (
                            <Badge className="bg-red-600 text-white px-2 py-1 text-xs font-bold">
                              {product.badge}
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.id, product.name);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            isInWishlist(product.id)
                              ? 'bg-red-600 text-white'
                              : 'bg-black/50 text-white hover:bg-purple-600'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Category */}
                      <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">
                        {product.category}
                      </span>
                      
                      {/* Title */}
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-white text-lg font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>


                      {/* Description */}
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price and Buttons */}
                      <div className="flex flex-col gap-3 pt-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-xl font-bold">
                              ₹{product.price.toFixed(0)}
                            </span>
                            {product.mrp && (
                              <span className="text-gray-500 text-sm line-through">
                                ₹{product.mrp.toFixed(0)}
                              </span>
                            )}
                          </div>
                          {product.discount && (
                            <span className="text-green-400 text-xs font-bold">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>
                        
                        {/* Cart quantity controls */}
                        <CartButtons productId={product.id} productName={product.name} />
                      </div>

                      {/* Stock Status */}
                      <div className="text-xs">
                        {product.stockQuantity > 0 ? (
                          <span className="text-green-400">✓ In Stock ({product.stockQuantity})</span>
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

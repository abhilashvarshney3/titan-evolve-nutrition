
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Minus, Plus, Shield, Truck, RotateCcw } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  features: string[];
  ingredients: string[];
  instructions: string;
  nutritionFacts: { [key: string]: string };
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock product data with real images
  const mockProducts: { [key: string]: Product } = {
    '1': {
      id: '1',
      name: 'MURDERER Pre-Workout',
      description: 'Hard hitting pre-workout with hardcore pump and laser focus. Engineered for elite athletes who demand maximum performance.',
      price: 49.99,
      originalPrice: 59.99,
      image: '/lovable-uploads/07c966c6-c74a-41cd-bdf1-b37a79c15e05.png',
      category: 'Pre-Workout',
      rating: 4.9,
      reviewCount: 342,
      badge: 'BESTSELLER',
      features: [
        'Hardcore Pump Formula',
        'Laser Focus Technology',
        'Zero Sugar',
        '30 Servings',
        'Watermelon Flavor'
      ],
      ingredients: ['Citrulline Malate', 'Beta Alanine', 'Creatine Monohydrate', 'Caffeine Anhydrous', 'L-Theanine'],
      instructions: 'Mix 1 scoop with 8-10 oz of water 15-30 minutes before workout.',
      nutritionFacts: {
        'Serving Size': '1 Scoop (15g)',
        'Servings Per Container': '30',
        'Caffeine': '300mg',
        'Citrulline Malate': '6g',
        'Beta Alanine': '3.2g'
      }
    },
    '2': {
      id: '2',
      name: 'LEAN WHEY Protein',
      description: 'Ultra micro filtered whey with 24g protein and fast absorption. Perfect for lean muscle development and recovery.',
      price: 39.99,
      originalPrice: 44.99,
      image: '/lovable-uploads/ab7a6da8-9536-4097-8873-2667208ceef8.png',
      category: 'Protein',
      rating: 4.8,
      reviewCount: 456,
      features: [
        '24g Premium Protein',
        'Fast Absorption',
        'Muscle Recovery',
        '57 Servings',
        'American Ice Cream Flavor'
      ],
      ingredients: ['Whey Protein Isolate', 'Whey Protein Concentrate', 'Natural Flavors', 'Stevia', 'Digestive Enzymes'],
      instructions: 'Mix 1 scoop with 6-8 oz of water or milk. Best consumed post-workout.',
      nutritionFacts: {
        'Serving Size': '1 Scoop (35g)',
        'Servings Per Container': '57',
        'Protein': '24g',
        'Carbohydrates': '2g',
        'Fat': '1g'
      }
    },
    '3': {
      id: '3',
      name: 'LEAN WHEY Premium',
      description: 'Premium whey protein for lean muscle development with enhanced absorption technology.',
      price: 44.99,
      image: '/lovable-uploads/746318e4-45e9-471f-a51f-473b614f8266.png',
      category: 'Protein',
      rating: 4.7,
      reviewCount: 289,
      badge: 'NEW',
      features: [
        '25g Premium Protein',
        'Enhanced Absorption',
        'Lean Muscle Support',
        '60 Servings',
        'American Ice Cream Flavor'
      ],
      ingredients: ['Whey Protein Isolate', 'Whey Protein Concentrate', 'Natural Flavors', 'Stevia', 'Digestive Enzymes'],
      instructions: 'Mix 1 scoop with 6-8 oz of water or milk. Best consumed post-workout.',
      nutritionFacts: {
        'Serving Size': '1 Scoop (33g)',
        'Servings Per Container': '60',
        'Protein': '25g',
        'Carbohydrates': '1g',
        'Fat': '0.5g'
      }
    },
    '4': {
      id: '4',
      name: 'LEAN WHEY Elite',
      description: 'Elite formula for maximum muscle recovery with ultra-filtered whey protein.',
      price: 49.99,
      image: '/lovable-uploads/729e363e-5733-4ed4-a128-36142849c19e.png',
      category: 'Protein',
      rating: 4.6,
      reviewCount: 198,
      features: [
        '26g Elite Protein',
        'Maximum Recovery',
        'Ultra-Filtered',
        '55 Servings',
        'American Ice Cream Flavor'
      ],
      ingredients: ['Whey Protein Isolate', 'Whey Protein Hydrolysate', 'Natural Flavors', 'Stevia', 'BCAAs'],
      instructions: 'Mix 1 scoop with 6-8 oz of water or milk. Take 1-3 times daily.',
      nutritionFacts: {
        'Serving Size': '1 Scoop (36g)',
        'Servings Per Container': '55',
        'Protein': '26g',
        'Carbohydrates': '1g',
        'Fat': '0.5g'
      }
    }
  };

  useEffect(() => {
    if (id && mockProducts[id]) {
      setProduct(mockProducts[id]);
      
      // Set related products (exclude current product)
      const related = Object.values(mockProducts)
        .filter(p => p.id !== id && p.category === mockProducts[id].category)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    setLoading(false);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    if (!product) return;

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
          .update({ quantity: existingItem.quantity + quantity })
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
              quantity: quantity
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to your cart.`
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
            <Link to="/shop">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Breadcrumb */}
        <div className="border-b border-purple-800/30 py-4">
          <div className="container mx-auto px-6">
            <nav className="text-sm text-gray-400">
              <Link to="/" className="hover:text-purple-400">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/shop" className="hover:text-purple-400">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="relative">
                <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <Badge className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 text-sm font-bold">
                      {product.badge}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">{product.name}</h1>
                  <p className="text-purple-400 text-lg uppercase tracking-wider">{product.category}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">({product.reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold">Quantity:</span>
                  <div className="flex items-center border border-purple-600 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-white hover:bg-purple-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-white font-bold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-white hover:bg-purple-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-bold"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    ADD TO CART
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white p-3"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-800/30">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">100% Authentic</p>
                  </div>
                  <div className="text-center">
                    <Truck className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">30-Day Return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="py-12 border-t border-purple-800/30">
          <div className="container mx-auto px-6">
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ingredients</h3>
                  <ul className="space-y-2">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-300">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition Facts */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Nutrition Facts</h3>
                  <div className="space-y-2">
                    {Object.entries(product.nutritionFacts).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-300">{key}:</span>
                        <span className="text-white font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 pt-8 border-t border-purple-800/30">
                <h3 className="text-2xl font-bold text-white mb-4">How to Use</h3>
                <p className="text-gray-300">{product.instructions}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 border-t border-purple-800/30">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-black text-white mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                    <div className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold mb-2 hover:text-purple-400 transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-purple-400 text-sm mb-2">{relatedProduct.category}</p>
                        <p className="text-white text-xl font-bold">${relatedProduct.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;

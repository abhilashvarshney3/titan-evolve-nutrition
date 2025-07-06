
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Minus, Plus, Shield, Truck, RotateCcw } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (product) {
        setProduct(product);
        
        // Fetch related products from same category
        if (product.category_id) {
          const { data: related } = await supabase
            .from('products')
            .select(`
              *,
              categories (
                name
              )
            `)
            .eq('category_id', product.category_id)
            .neq('id', product.id)
            .limit(4);

          if (related) {
            setRelatedProducts(related);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleQuickAdd = async (productId: string, productName: string) => {
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
        .eq('product_id', productId)
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
              product_id: productId,
              quantity: 1
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${productName} has been added to your cart.`
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
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {(product.is_new || product.is_featured) && (
                    <Badge className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 text-sm font-bold">
                      {product.is_new ? 'NEW' : 'FEATURED'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">{product.name}</h1>
                  <p className="text-purple-400 text-lg uppercase tracking-wider">{product.categories?.name || 'Supplement'}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">(247 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white">₹{product.price.toFixed(0)}</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

                {/* Stock Status */}
                <div className="text-sm">
                  {product.stock_quantity > 0 ? (
                    <span className="text-green-400">✓ In Stock ({product.stock_quantity} available)</span>
                  ) : (
                    <span className="text-red-400">✗ Out of Stock</span>
                  )}
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
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="text-white hover:bg-purple-600"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Product Details */}
        <section className="py-12 border-t border-purple-800/30">
          <div className="container mx-auto px-6">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-4">Key Features</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Premium quality ingredients</li>
                    <li>• Lab tested for purity</li>
                    <li>• No artificial additives</li>
                    <li>• Easy to mix and consume</li>
                    <li>• Made in India</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-4">Usage Instructions</h4>
                  <p className="text-gray-300">
                    Mix 1 scoop with 200-250ml of water or milk. Consume 30 minutes before workout for pre-workout supplements or immediately after workout for protein supplements.
                  </p>
                </div>
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
                  <div key={relatedProduct.id} className="group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 relative">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        onClick={() => handleQuickAdd(relatedProduct.id, relatedProduct.name)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 transform hover:scale-105 transition-all duration-300"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        ADD
                      </Button>
                    </div>

                    <div className="p-4">
                      <Link to={`/product/${relatedProduct.id}`}>
                        <h3 className="text-white font-bold mb-2 hover:text-purple-400 transition-colors">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <p className="text-purple-400 text-sm mb-2">{relatedProduct.categories?.name}</p>
                      <p className="text-white text-xl font-bold">₹{relatedProduct.price.toFixed(0)}</p>
                    </div>
                  </div>
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

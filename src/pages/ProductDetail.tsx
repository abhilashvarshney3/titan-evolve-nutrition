import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Minus, Plus, Shield, Truck, RotateCcw } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useProduct, useProducts, ProductWithVariantsAndImages, DatabaseProductVariant } from '@/hooks/useProducts';
import { useProductReviews } from '@/hooks/useProductReviews';
import ReviewSection from '@/components/ReviewSection';
import ReviewStars from '@/components/ReviewStars';
import VariantSelector from '@/components/VariantSelector';
import VariantImageSlider from '@/components/VariantImageSlider';

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading: productLoading } = useProduct(id || '');
  const { products } = useProducts();
  const [selectedVariant, setSelectedVariant] = useState<DatabaseProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithVariantsAndImages[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { stats: reviewStats, loading: reviewsLoading } = useProductReviews(id || '');

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      // Get related products by category
      const related = products.filter(p => 
        p.id !== product.id && 
        p.category_id === product.category_id
      ).slice(0, 4);
      setRelatedProducts(related);
    }
  }, [product, products]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    if (!product || !selectedVariant) return;

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('variant_id', selectedVariant.id)
        .maybeSingle();

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
              variant_id: selectedVariant.id,
              quantity: quantity
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${quantity} x ${selectedVariant.variant_name} added to your cart.`
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

  const handleQuickAdd = async (productId: string, productName: string, variantId: string) => {
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
        .eq('variant_id', variantId)
        .maybeSingle();

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
              variant_id: variantId,
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

  if (productLoading) {
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
              {/* Product Images */}
              <div className="relative">
                <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden relative">
                  {(() => {
                    if (selectedVariant) {
                      const variant = product.variants.find(v => v.id === selectedVariant.id);
                      const variantImages = variant?.images;
                      if (variantImages && variantImages.length > 0) {
                        // Use VariantImageSlider for multiple images
                        return (
                          <VariantImageSlider 
                            images={variantImages.map(img => ({ 
                              id: img.id, 
                              imageUrl: img.image_url,
                              isPrimary: img.is_primary,
                              displayOrder: img.display_order
                            }))}
                            className="w-full h-full"
                          />
                        );
                      }
                    }
                    // Fallback to single product image
                    return (
                      <div className="w-full h-full flex items-center justify-center p-8">
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    );
                  })()}
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.is_new && (
                      <Badge className="bg-purple-600 text-white px-3 py-1 text-sm font-bold">
                        NEW
                      </Badge>
                    )}
                    {product.is_featured && (
                      <Badge className="bg-yellow-600 text-black px-3 py-1 text-sm font-bold">
                        FEATURED
                      </Badge>
                    )}
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(product.id, product.name)}
                    className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 ${
                      isInWishlist(product.id)
                        ? 'bg-red-600 text-white'
                        : 'bg-black/50 text-white hover:bg-purple-600'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">{product.name}</h1>
                  <p className="text-purple-400 text-lg uppercase tracking-wider">Product</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  {reviewStats && reviewStats.total_reviews > 0 ? (
                    <ReviewStars 
                      rating={reviewStats.average_rating} 
                      totalReviews={reviewStats.total_reviews} 
                      showText={true}
                      size="md"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No reviews yet</span>
                  )}
                </div>

                {/* Variant Selector */}
                {product.variants.length > 1 && selectedVariant && (
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantChange={setSelectedVariant}
                  />
                )}

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white">
                    ₹{selectedVariant ? selectedVariant.price.toFixed(0) : product.price?.toFixed(0) || '0'}
                  </span>
                  {selectedVariant?.original_price && selectedVariant.original_price > selectedVariant.price && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        ₹{selectedVariant.original_price.toFixed(0)}
                      </span>
                      <span className="text-green-400 font-bold text-lg">
                        {Math.round(((selectedVariant.original_price - selectedVariant.price) / selectedVariant.original_price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>


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
                      onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || product.stock_quantity || 0, quantity + 1))}
                      className="text-white hover:bg-purple-600"
                      disabled={quantity >= (selectedVariant?.stock_quantity || product.stock_quantity || 0)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedVariant && (selectedVariant.stock_quantity <= 10 && selectedVariant.stock_quantity > 0) && (
                  <p className="text-orange-400 text-sm">
                    Only {selectedVariant.stock_quantity} left in stock!
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    ADD TO CART
                  </Button>
                  <Button
                    onClick={() => toggleWishlist(product.id, product.name)}
                    variant="outline"
                    className={`p-3 transition-all duration-300 ${
                      isInWishlist(product.id)
                        ? 'border-red-600 text-red-600 bg-red-600/10'
                        : 'border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
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
                    <p className="text-sm text-gray-400">7-Day Return</p>
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
                   <h4 className="text-lg font-bold text-purple-400 mb-4">Product Information</h4>
                   <div className="space-y-2 text-gray-300">
                     {selectedVariant?.flavor && <p><strong>Flavor:</strong> {selectedVariant.flavor}</p>}
                     {selectedVariant && <p><strong>Size:</strong> {selectedVariant.size}</p>}
                      {selectedVariant?.product_details && (() => {
                        try {
                          const details = JSON.parse(selectedVariant.product_details);
                          if (Array.isArray(details) && details.length > 0) {
                            return details.map((detail, index) => (
                              <p key={index} className="mb-2">
                                <strong className="text-purple-400">{detail.title}:</strong>{' '}
                                <span className="text-gray-300">{detail.value}</span>
                              </p>
                            ));
                          } else if (typeof details === 'string' && details.trim()) {
                            return <p className="mb-2"><strong className="text-purple-400">Details:</strong> <span className="text-gray-300">{details}</span></p>;
                          }
                        } catch (error) {
                          // If it's not valid JSON, treat as plain text
                          if (selectedVariant.product_details.trim()) {
                            return <p className="mb-2"><strong className="text-purple-400">Details:</strong> <span className="text-gray-300">{selectedVariant.product_details}</span></p>;
                          }
                        }
                        return null;
                      })()}
                     <p><strong>Stock Status:</strong> {
                       (selectedVariant?.stock_quantity || product.stock_quantity || 0) > 0 
                         ? <span className="text-green-400">In Stock</span>
                         : <span className="text-red-400">Out of Stock</span>
                     }</p>
                   </div>
                 </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-4">Quality Assurance</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 100% Authentic Products</li>
                    <li>• Quality Tested</li>
                    <li>• Fast & Safe Delivery</li>
                    <li>• Customer Support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 border-t border-purple-800/30">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-black text-white mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 relative">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <div className="aspect-square overflow-hidden flex items-center justify-center p-4 bg-gray-800">
                        <img
                          src={relatedProduct.image_url || '/placeholder.svg'}
                          alt={relatedProduct.name}
                          className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        onClick={() => handleQuickAdd(relatedProduct.id, relatedProduct.name, relatedProduct.variants[0]?.id || '')}
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
                      <p className="text-purple-400 text-sm mb-2">Product</p>
                      <p className="text-white text-xl font-bold">₹{relatedProduct.variants[0]?.price.toFixed(0) || relatedProduct.price?.toFixed(0) || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
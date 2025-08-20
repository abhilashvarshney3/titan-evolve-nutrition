
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
import { getProductById, getProductsByCategory, CentralizedProduct, ProductVariant, getDefaultVariant } from '@/data/centralizedProducts';
import { useProductReviews } from '@/hooks/useProductReviews';
import VariantImageSlider from '@/components/VariantImageSlider';
import ReviewSection from '@/components/ReviewSection';
import ReviewStars from '@/components/ReviewStars';
import VariantSelector from '@/components/VariantSelector';

// Using centralized ProductData interface

// Updated product images mapping with your new uploaded images
const productImageMap: { [key: string]: string } = {
  'whey-protein': '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png',
  'lean-whey-1': '/lovable-uploads/6f21609e-a5cd-4cc0-a41a-82da539f5d0f.png',
  'lean-whey-2': '/lovable-uploads/cc7b982a-2963-4aa1-a018-5a61326ddf2c.png',
  'lean-whey-3': '/lovable-uploads/4fee9b66-0c62-4d8c-b54d-72d7f96438ee.png',
  'lean-whey-4': '/lovable-uploads/eb51c9b0-6315-4286-917c-7cb77f40819b.png',
  'lean-whey-5': '/lovable-uploads/01639641-f34b-4a7f-b28d-02d91875dc2c.png',
  'lean-whey-6': '/lovable-uploads/81d96adc-b283-4208-990d-1f54b9bda60f.png',
  'lean-whey-7': '/lovable-uploads/1e473ded-53cc-4557-ac29-e3a9e518d662.png',
  'murderer-pre-1': '/lovable-uploads/ff150af1-45f4-466a-a0f0-8c24b6de0207.png',
  'murderer-pre-2': '/lovable-uploads/3e9a2628-505c-4ff1-87e4-bf4481e661c9.png'
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<CentralizedProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<CentralizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { stats: reviewStats, loading: reviewsLoading } = useProductReviews(id || '');

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(getDefaultVariant(product.id) || product.variants[0]);
    }
  }, [product]);

  const loadProduct = () => {
    if (!id) return;

    try {
      const foundProduct = getProductById(id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Get related products from same category
        const related = getProductsByCategory(foundProduct.categoryId)
          .filter(p => p.id !== foundProduct.id)
          .slice(0, 4);
        
        setRelatedProducts(related);
      } else {
        toast({
          title: "Error",
          description: "Product not found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
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
        description: `${quantity} x ${selectedVariant.variantName} added to your cart.`
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
                <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden relative flex items-center justify-center p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <Badge className="bg-purple-600 text-white px-3 py-1 text-sm font-bold">
                        NEW
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="bg-yellow-600 text-black px-3 py-1 text-sm font-bold">
                        FEATURED
                      </Badge>
                    )}
                    {product.badge && (
                      <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(product.id, product.name)}
                    className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
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
                  <p className="text-purple-400 text-lg uppercase tracking-wider">{product.category}</p>
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
                    ₹{selectedVariant ? selectedVariant.price.toFixed(0) : '0'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

                {/* Stock Status */}
                <div className="text-sm">
                  {selectedVariant && selectedVariant.stockQuantity > 0 ? (
                    <span className="text-green-400">✓ In Stock ({selectedVariant.stockQuantity} available)</span>
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
                      onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 0, quantity + 1))}
                      className="text-white hover:bg-purple-600"
                      disabled={quantity >= (selectedVariant?.stockQuantity || 0)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
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
                  <h4 className="text-lg font-bold text-purple-400 mb-4">Key Benefits</h4>
                  <ul className="space-y-2 text-gray-300">
                    {product.details.keyBenefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-4">Product Information</h4>
                  <div className="space-y-2 text-gray-300">
                    {product.details.netWeight && <p><strong>Net Weight:</strong> {product.details.netWeight}</p>}
                    {product.details.servings && <p><strong>Servings:</strong> {product.details.servings}</p>}
                    {product.details.form && <p><strong>Form:</strong> {product.details.form}</p>}
                    {selectedVariant?.flavor && <p><strong>Flavor:</strong> {selectedVariant.flavor}</p>}
                    {selectedVariant && <p><strong>Size:</strong> {selectedVariant.size}</p>}
                    {selectedVariant && <p><strong>SKU:</strong> {selectedVariant.sku}</p>}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-4">How to Use</h4>
                  <ul className="space-y-2 text-gray-300">
                    {product.details.howToUse.map((instruction, index) => (
                      <li key={index}>• {instruction}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-4">Certifications</h4>
                  <ul className="space-y-2 text-gray-300">
                    {product.details.certifications.map((cert, index) => (
                      <li key={index}>• {cert}</li>
                    ))}
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
                        src={relatedProduct.image}
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
                      <p className="text-purple-400 text-sm mb-2">{relatedProduct.category}</p>
                      <p className="text-white text-xl font-bold">₹{relatedProduct.variants[0]?.price.toFixed(0) || 0}</p>
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

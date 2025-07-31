
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getProductById } from '@/data/products';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock_quantity: number;
  };
}

// Updated product images mapping
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

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Map cart items with centralized product data
      const cartItemsWithProducts = (data || []).map(item => {
        const product = getProductById(item.product_id);
        return {
          ...item,
          products: product ? {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image,
            stock_quantity: product.stockQuantity
          } : null
        };
      }).filter(item => item.products !== null);

      setCartItems(cartItemsWithProducts as CartItem[]);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(itemId);
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items => items.filter(item => item.id !== itemId));
      
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart."
      });

      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    const phoneNumber = "918506912255";
    let message = "Hi! I want to place an order for the following items:\n\n";
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.products.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.products.price.toFixed(0)} each\n`;
      message += `   Subtotal: ₹${(item.products.price * item.quantity).toFixed(0)}\n\n`;
    });

    const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
    const shipping = subtotal >= 1499 ? 0 : 99;
    const total = subtotal + shipping;
    
    message += `Subtotal: ₹${subtotal.toFixed(0)}\n`;
    message += `Shipping: ${shipping === 0 ? 'FREE' : `₹${shipping}`}\n`;
    message += `Total Amount: ₹${total.toFixed(0)}\n\n`;
    message += "Payment Method: [ ] Prepaid [ ] Cash on Delivery (+₹199)\n\n";
    message += "Please confirm the order and provide delivery details.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const total = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <ShoppingBag className="h-20 w-20 text-purple-400 mx-auto" />
            <h2 className="text-3xl font-bold">Please Sign In</h2>
            <p className="text-gray-400 text-lg">You need to be logged in to view your cart.</p>
            <Link to="/login">
              <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-purple-900 to-black p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-purple-600 mr-3"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Shopping Cart ({itemCount})</h1>
        </div>

        {/* Desktop Hero Section */}
        <section className="hidden md:block bg-gradient-to-r from-purple-900 to-black py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl font-black mb-4">SHOPPING CART</h1>
            <p className="text-xl text-gray-300">
              Review your items and proceed to checkout
            </p>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <ShoppingBag className="h-24 w-24 text-purple-400 mx-auto" />
                <h2 className="text-3xl font-bold">Your cart is empty</h2>
                <p className="text-gray-400 text-lg">Add some products to get started!</p>
                <Link to="/shop">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items - Mobile & Desktop */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="hidden md:block text-2xl font-bold mb-6">Cart Items ({itemCount})</h2>
                  
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-900 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-800 transition-colors"
                    >
                      {/* Product Image */}
                      <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                        <img
                          src={item.products.image_url || '/placeholder.svg'}
                          alt={item.products.name}
                          className="w-full sm:w-24 md:w-32 h-32 sm:h-24 md:h-32 object-cover rounded-lg hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 space-y-3 sm:space-y-2">
                        <Link to={`/product/${item.product_id}`} className="block">
                          <h3 className="text-lg md:text-xl font-bold text-white hover:text-purple-400 transition-colors line-clamp-2">
                            {item.products.name}
                          </h3>
                        </Link>
                        
                        <p className="text-purple-400 text-xl md:text-2xl font-bold">
                          ₹{item.products.price.toFixed(0)}
                        </p>

                        {/* Mobile Quantity & Remove */}
                        <div className="flex items-center justify-between sm:hidden">
                          <div className="flex items-center space-x-2 bg-black rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updating === item.id || item.quantity <= 1}
                              className="h-8 w-8 text-white hover:bg-purple-600"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-bold text-white">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating === item.id || item.quantity >= item.products.stock_quantity}
                              className="h-8 w-8 text-white hover:bg-purple-600"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Subtotal - Mobile */}
                        <div className="sm:hidden">
                          <p className="text-gray-400 text-sm">
                            Subtotal: <span className="text-white font-bold">₹{(item.products.price * item.quantity).toFixed(0)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Desktop Quantity & Actions */}
                      <div className="hidden sm:flex flex-col items-end justify-between space-y-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        
                        <div className="flex items-center space-x-2 bg-black rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="h-8 w-8 text-white hover:bg-purple-600"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-bold text-white">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || item.quantity >= item.products.stock_quantity}
                            className="h-8 w-8 text-white hover:bg-purple-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-xl font-bold text-white">
                          ₹{(item.products.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-900 rounded-xl p-6 sticky top-24 space-y-6">
                    <h3 className="text-2xl font-bold text-purple-400">Order Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal ({itemCount} items)</span>
                        <span>₹{total.toFixed(0)}</span>
                      </div>
                      
                      {/* Shipping Calculation */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-400">
                          <span>Shipping</span>
                          <span className={total >= 1499 ? "text-green-400" : "text-yellow-400"}>
                            {total >= 1499 ? "FREE" : "₹99"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {total >= 1499 
                            ? "FREE shipping on prepaid orders above ₹1499" 
                            : `Add ₹${(1499 - total).toFixed(0)} more for FREE shipping`
                          }
                        </div>
                        <div className="text-xs text-orange-400">
                          Cash on Delivery (COD) available with ₹199 additional charge
                        </div>
                      </div>
                      
                      <div className="border-t border-purple-800/30 pt-4">
                        <div className="flex justify-between text-xl font-bold text-white">
                          <span>Total</span>
                          <span>₹{(total + (total >= 1499 ? 0 : 99)).toFixed(0)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          (Shipping included for prepaid orders)
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleWhatsAppCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      CHECKOUT VIA WHATSAPP
                    </Button>

                    <p>
                      
                    </p>

                    <Link to="/shop">
                      <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Cart;

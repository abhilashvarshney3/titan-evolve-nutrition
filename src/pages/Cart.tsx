
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'MURDERER Pre-Workout',
      category: 'Pre-Workout',
      price: 49.99,
      image: '/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png',
      quantity: 2
    },
    {
      id: '2',
      name: 'LEAN WHEY Protein',
      category: 'Protein',
      price: 39.99,
      image: '/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png',
      quantity: 1
    }
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative h-80 bg-gradient-to-r from-red-900 via-black to-gray-900 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl font-black tracking-tight mb-4">CART</h1>
            <p className="text-xl text-gray-300">Review your selected items</p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some products to get started</p>
              <Link to="/shop">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3">
                  CONTINUE SHOPPING
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-red-400 mb-6">CART ITEMS</h2>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-900 rounded-xl p-6 flex items-center gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.category}</p>
                      <p className="text-red-400 font-bold text-lg">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-white font-bold w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-900 rounded-xl p-6 h-fit">
                <h2 className="text-2xl font-bold text-red-400 mb-6">ORDER SUMMARY</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-gray-700" />
                  <div className="flex justify-between text-white font-bold text-xl">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Promo Code"
                    className="bg-black border-gray-700 text-white rounded-lg"
                  />
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2">
                    APPLY CODE
                  </Button>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">
                    PROCEED TO CHECKOUT
                  </Button>
                </div>

                {shipping > 0 && (
                  <p className="text-gray-400 text-sm mt-4 text-center">
                    Add ${(75 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

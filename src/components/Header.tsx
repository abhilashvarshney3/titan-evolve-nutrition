
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      if (user) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [user]);

  const fetchCartCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart')
        .select('quantity')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(total);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-purple-800/20 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Image */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/LOGO.png" 
              alt="Titan Evolve Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-black text-white tracking-wider">
              <span className="text-purple-400">TITAN</span>EVOLVE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-purple-400 transition-colors font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-white hover:text-purple-400 transition-colors font-medium">
              Shop
            </Link>
            <Link to="/about" className="text-white hover:text-purple-400 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-purple-400 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Desktop Search & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center animate-fade-in">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-gray-900 border-purple-700 text-white"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 text-white hover:bg-purple-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:bg-purple-600 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-purple-600 hover:text-white transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-white hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions Bar */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Cart - Always Visible */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-purple-600 relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-purple-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-900 border-purple-700 text-white"
                autoFocus
              />
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-800/20 py-4 space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-white hover:text-purple-400 transition-colors text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-white hover:text-purple-400 transition-colors text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-purple-400 transition-colors text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-purple-400 transition-colors text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="flex items-center justify-between pt-4 border-t border-purple-800/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setIsMenuOpen(false);
                  }}
                  className="text-white hover:bg-purple-600"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>

                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-purple-600">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-white hover:bg-purple-600"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BannerDisplay from './BannerDisplay';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <BannerDisplay position="top" />
      <Header />
      <main className="pt-20">
        <BannerDisplay position="hero" />
        {children}
        <BannerDisplay position="middle" />
      </main>
      <BannerDisplay position="bottom" />
      <Footer />
    </div>
  );
};

export default Layout;

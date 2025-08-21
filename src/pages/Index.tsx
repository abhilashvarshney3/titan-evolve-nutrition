
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import NewProductsSection from '../components/NewProductsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import BannerDisplay from '../components/BannerDisplay';

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <BannerDisplay position="top" />
      <Hero />
      <BannerDisplay position="hero" />
      <ProductShowcase />
      <BannerDisplay position="middle" />
      <NewProductsSection />
      <BannerDisplay position="middle" />
      <TestimonialsSection />
      <StatsSection />
      <BannerDisplay position="bottom" />
      <Footer />
    </div>
  );
};

export default Index;

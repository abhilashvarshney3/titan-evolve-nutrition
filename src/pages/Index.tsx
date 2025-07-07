
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import NewProductsSection from '../components/NewProductsSection';
import PromotionBanner from '../components/PromotionBanner';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <ProductShowcase />
      <NewProductsSection />
      <PromotionBanner />
      <TestimonialsSection />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Index;

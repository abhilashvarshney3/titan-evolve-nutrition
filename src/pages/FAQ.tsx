
import React from 'react';
import Layout from '@/components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "What are your shipping charges?",
      answer: "We offer free shipping on all orders above ₹2,000. For orders below ₹2,000, shipping charges are ₹150."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 3-7 business days depending on your location. Metro cities receive orders faster."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes, all our products are 100% authentic and sourced directly from manufacturers. We provide authenticity certificates."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unopened products. Products must be in original condition with all packaging."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer attractive discounts on bulk orders. Contact our sales team for bulk pricing."
    },
    {
      question: "How can I track my order?",
      answer: "You will receive a tracking number via SMS and email once your order is shipped. You can track it on our website."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">FAQ</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Frequently Asked Questions
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-purple-800/30">
                  <AccordionTrigger className="text-white hover:text-purple-400 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FAQ;

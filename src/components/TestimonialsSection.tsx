
import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Rohit Sharma",
    role: "Professional Bodybuilder",
    image: "/lovable-uploads/ChatGPT Image Jul 4, 2025, 02_35_56 PM.png",
    rating: 5,
    text: "Titan Evolve's supplements have transformed my training. The quality is unmatched and results speak for themselves. I've gained 15kg of lean muscle in 6 months!"
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Fitness Influencer",
    image: "/lovable-uploads/ChatGPT Image Jul 4, 2025, 04_57_45 PM.png",
    rating: 5,
    text: "As a fitness influencer, I've tried many brands. Titan Evolve stands out with their pure ingredients and amazing taste. My followers love my recommendations!"
  },
  {
    id: 3,
    name: "Arjun Singh",
    role: "Marathon Runner",
    image: "/lovable-uploads/ChatGPT Image Jul 4, 2025, 04_58_27 PM.png",
    rating: 5,
    text: "The endurance boost I get from Titan Evolve's pre-workout is incredible. I've improved my marathon time by 12 minutes since I started using their products."
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Yoga Instructor",
    image: "/lovable-uploads/ChatGPT Image Jul 5, 2025, 05_43_54 AM.png",
    rating: 5,
    text: "Natural, clean, and effective. Titan Evolve's protein blends perfectly in my post-yoga smoothies. My energy levels have never been better!"
  },
  {
    id: 5,
    name: "Vikram Kumar",
    role: "Powerlifter",
    image: "/lovable-uploads/ChatGPT Image Jul 5, 2025, 05_44_23 AM.png",
    rating: 5,
    text: "I've been powerlifting for 10 years. Titan Evolve's creatine and protein have helped me break personal records I thought were impossible."
  },
  {
    id: 6,
    name: "Anjali Gupta",
    role: "Nutritionist",
    image: "/lovable-uploads/ChatGPT Image Jul 5, 2025, 05_46_58 AM.png",
    rating: 5,
    text: "As a nutritionist, I recommend Titan Evolve to all my clients. Their transparency in ingredients and third-party testing gives me complete confidence."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-black text-white mb-4">
            WHAT OUR <span className="text-purple-400">CHAMPIONS</span> SAY
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied athletes who trust Titan Evolve for their fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 hover:from-purple-900/20 hover:to-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-800/20 animate-fade-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-purple-400 mb-6 opacity-50" />
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
                />
                <div>
                  <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-purple-400 text-sm font-medium">{testimonial.role}</p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-30"></div>
              <div className="absolute top-6 right-6 w-1 h-1 bg-purple-400 rounded-full opacity-50"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-black text-purple-400 mb-2">50K+</div>
            <p className="text-gray-400 font-medium">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-purple-400 mb-2">98%</div>
            <p className="text-gray-400 font-medium">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-purple-400 mb-2">25+</div>
            <p className="text-gray-400 font-medium">Premium Products</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-purple-400 mb-2">5★</div>
            <p className="text-gray-400 font-medium">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

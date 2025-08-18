export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  mrp: number;
  discount: number;
  image: string;
  images?: string[];
  category: string;
  categoryId: string;
  stockQuantity: number;
  isFeatured: boolean;
  isNew: boolean;
  sku: string;
  badge?: string;
  details: {
    netWeight?: string;
    servings?: string;
    form?: string;
    flavor?: string;
    weight?: string;
    keyBenefits: string[];
    usps: string[];
    howToUse: string[];
    whoShouldUse: string[];
    certifications: string[];
    storageWarnings: string[];
  };
}

export const productCategories = {
  creatine: {
    id: "550e8400-e29b-41d4-a716-446655440101",
    name: "Creatine",
    description: "Pure creatine monohydrate for strength and power"
  },
  preworkout: {
    id: "550e8400-e29b-41d4-a716-446655440102", 
    name: "Pre-Workout",
    description: "Energy and pump formulas for peak performance"
  },
  massgainer: {
    id: "550e8400-e29b-41d4-a716-446655440103",
    name: "Mass Gainer", 
    description: "Quality calories for clean bulking"
  },
  protein: {
    id: "550e8400-e29b-41d4-a716-446655440104",
    name: "Whey Protein",
    description: "Premium whey protein for muscle growth"
  }
};

export const products: ProductData[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Titan Evolve – Creatine Monohydrate (Unflavored)",
    description: "200 Mesh Ultra Micronized Powder for strength and explosive power",
    price: 1199,
    mrp: 2999,
    discount: 60.02,
    image: "/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png",
    images: [
      "/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png",
      "/lovable-uploads/534d4161-7ade-4f7c-bfe9-debf0e569cc5.png"
    ],
    category: "Creatine",
    categoryId: "550e8400-e29b-41d4-a716-446655440101",
    stockQuantity: 50,
    isFeatured: true,
    isNew: false,
    sku: "TE-CREAT-180",
    badge: "Best Seller",
    details: {
      netWeight: "180g",
      servings: "60 Servings",
      form: "200 Mesh Ultra Micronized Powder",
      flavor: "Unflavored",
      weight: "180g",
      keyBenefits: [
        "Increases strength and explosive power",
        "Enhances muscle recovery and workout endurance", 
        "Boosts ATP production for intense training sessions",
        "Supports lean muscle growth over time",
        "Delays fatigue and improves training volume"
      ],
      usps: [
        "Ultra-fine 200 mesh grade creatine",
        "Pure, pharmaceutical-grade monohydrate",
        "No fillers, no additives, zero flavor",
        "Rapid solubility and bioavailability",
        "Banned-substance free & lab-tested for purity"
      ],
      howToUse: [
        "Loading Phase (Optional): 5g twice daily for the first 5–7 days",
        "Maintenance Phase: Take 3g daily post-workout with water or your protein shake",
        "Pro Tip: Stay well-hydrated while using creatine"
      ],
      whoShouldUse: [
        "Powerlifters, bodybuilders, athletes, and fitness enthusiasts seeking to naturally enhance performance and strength"
      ],
      certifications: [
        "Lab-tested",
        "Banned-substance free", 
        "GMP-compliant manufacturing",
        "Vegetarian friendly"
      ],
      storageWarnings: [
        "Store in a cool, dry place away from sunlight",
        "Not intended for children, pregnant or lactating women",
        "Do not exceed the recommended dosage"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Titan Evolve – Pre-Workout (Watermelon)",
    description: "Refreshing, juicy and slightly tangy pre-workout for explosive energy",
    price: 1750,
    mrp: 3799,
    discount: 53.94,
    image: "/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png",
    images: [
      "/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png",
      "/lovable-uploads/746318e4-45e9-471f-a51f-473b614f8266.png"
    ],
    category: "Pre-Workout",
    categoryId: "550e8400-e29b-41d4-a716-446655440102",
    stockQuantity: 30,
    isFeatured: true,
    isNew: true,
    sku: "TE-PRE-WM-250",
    badge: "New",
    details: {
      netWeight: "250g",
      servings: "25 Servings",
      form: "Flavored Nutraceutical Powder",
      flavor: "🍉 Watermelon - Refreshing, juicy and slightly tangy",
      weight: "250g",
      keyBenefits: [
        "Explosive energy & peak performance",
        "Insane muscle pumps & vascularity",
        "Improved mental focus & motivation",
        "Delays fatigue during intense training",
        "Helps maximize strength and endurance"
      ],
      usps: [
        "Balanced performance matrix with stimulants + pump + focus blend",
        "No crash, no jitters, no bloating",
        "Delicious taste with fast solubility",
        "Perfect for pre-training rituals",
        "Tested by strength athletes at RAW@ Academy"
      ],
      howToUse: [
        "Mix 1 scoop (approx. 10g) with 200–250ml cold water",
        "Consume 20–30 minutes before a workout",
        "First-timers should assess tolerance with ½ scoop"
      ],
      whoShouldUse: [
        "Lifters, power athletes, runners, and combat sport athletes",
        "Anyone needing a high-performance edge during training",
        "Great for evening workouts, high-volume lifting, or competitions"
      ],
      certifications: [
        "Made in a GMP-certified facility",
        "No banned substance",
        "Manufactured under licensed FSSAI guidelines",
        "Lab-tested for purity and potency",
        "100% vegetarian-friendly"
      ],
      storageWarnings: [
        "Not suitable for individuals under 18, pregnant or lactating women",
        "Do not exceed 1 scoop/day",
        "Avoid using near bedtime to prevent sleep disturbance",
        "Keep tightly sealed in cool, dry conditions"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Titan Evolve – Pre-Workout (Bubblegum Burst)",
    description: "Sweet & nostalgic candy burst with zero aftertaste",
    price: 1750,
    mrp: 3799,
    discount: 53.94,
    image: "/lovable-uploads/fd697111-f859-4663-8f11-149724090d82.png",
    images: [
      "/lovable-uploads/fd697111-f859-4663-8f11-149724090d82.png",
      "/lovable-uploads/729e363e-5733-4ed4-a128-36142849c19e.png"
    ],
    category: "Pre-Workout",
    categoryId: "550e8400-e29b-41d4-a716-446655440102",
    stockQuantity: 25,
    isFeatured: false,
    isNew: true,
    sku: "TE-PRE-BB-250",
    badge: "New",
    details: {
      netWeight: "250g",
      servings: "25 Servings",
      form: "Flavored Nutraceutical Powder",
      flavor: "🍬 Bubblegum Burst - Sweet & nostalgic candy burst with zero aftertaste",
      weight: "250g",
      keyBenefits: [
        "Explosive energy & peak performance",
        "Insane muscle pumps & vascularity", 
        "Improved mental focus & motivation",
        "Delays fatigue during intense training",
        "Helps maximize strength and endurance"
      ],
      usps: [
        "Balanced performance matrix with stimulants + pump + focus blend",
        "No crash, no jitters, no bloating",
        "Delicious taste with fast solubility",
        "Perfect for pre-training rituals",
        "Tested by strength athletes at RAW@ Academy"
      ],
      howToUse: [
        "Mix 1 scoop (approx. 10g) with 200–250ml cold water",
        "Consume 20–30 minutes before a workout", 
        "First-timers should assess tolerance with ½ scoop"
      ],
      whoShouldUse: [
        "Lifters, power athletes, runners, and combat sport athletes",
        "Anyone needing a high-performance edge during training",
        "Great for evening workouts, high-volume lifting, or competitions"
      ],
      certifications: [
        "Made in a GMP-certified facility",
        "No banned substance",
        "Manufactured under licensed FSSAI guidelines", 
        "Lab-tested for purity and potency",
        "100% vegetarian-friendly"
      ],
      storageWarnings: [
        "Not suitable for individuals under 18, pregnant or lactating women",
        "Do not exceed 1 scoop/day",
        "Avoid using near bedtime to prevent sleep disturbance",
        "Keep tightly sealed in cool, dry conditions"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Titan Evolve – Mass Gainer (Double Rich Chocolate) 6lbs",
    description: "Creamy, dense cocoa flavor — easy on the stomach",
    price: 3499,
    mrp: 4499,
    discount: 22.22,
    image: "/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png",
    images: [
      "/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png",
      "/lovable-uploads/ab7a6da8-9536-4097-8873-2667208ceef8.png"
    ],
    category: "Mass Gainer",
    categoryId: "550e8400-e29b-41d4-a716-446655440103",
    stockQuantity: 20,
    isFeatured: true,
    isNew: false,
    sku: "TE-MG-DRC-6LBS",
    badge: "Popular",
    details: {
      netWeight: "6lbs",
      servings: "27",
      form: "Flavored Mass Gainer Powder",
      flavor: "🍫 Double Rich Chocolate - Creamy, dense cocoa flavor — easy on the stomach",
      weight: "6lbs",
      keyBenefits: [
        "Supports clean bulking with quality calories",
        "Provides steady energy release via complex carbs",
        "Promotes muscle mass gain and faster recovery",
        "Enhanced with digestive enzymes easy absorption",
        "Rich in taste, zero stomach discomfort"
      ],
      usps: [
        "Balanced macro ratio: high carbs, moderate protein, low sugar",
        "Whey protein-based formula (not soy-dominant)",
        "Added digestive enzymes for gut comfort",
        "Ideal for hard gainers or anyone in a caloric surplus phase",
        "Mixes easily – no lumps, no bloating"
      ],
      howToUse: [
        "Mix 2 level scoops (~100g) in 250–300ml cold water or milk",
        "Consume once or twice daily between meals or post-workout",
        "Can be blended with banana, oats, or nut butter for added calories"
      ],
      whoShouldUse: [
        "Underweight individuals or hard gainers",
        "Athletes in strength or hypertrophy phases",
        "Anyone looking to add lean size with a clean macro profile"
      ],
      certifications: [
        "Manufactured in a GMP-certified facility",
        "Lab-tested for purity and protein integrity",
        "No added sugars, banned substances, or cheap fillers",
        "Complies with FSSAI & Indian nutraceutical standards"
      ],
      storageWarnings: [
        "Store in a cool, dry place",
        "Not recommended for individuals with lactose intolerance without enzyme tolerance",
        "Keep the container tightly sealed after use",
        "Not for medicinal use"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Titan Evolve – Mass Gainer (Double Rich Chocolate) 10lbs",
    description: "Creamy, dense cocoa flavor — easy on the stomach",
    price: 4999,
    mrp: 7499,
    discount: 33.33,
    image: "/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png",
    images: [
      "/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png",
      "/lovable-uploads/ab7a6da8-9536-4097-8873-2667208ceef8.png"
    ],
    category: "Mass Gainer",
    categoryId: "550e8400-e29b-41d4-a716-446655440103",
    stockQuantity: 15,
    isFeatured: false,
    isNew: false,
    sku: "TE-MG-DRC-10LBS",
    details: {
      netWeight: "10lbs",
      servings: "45",
      form: "Flavored Mass Gainer Powder",
      flavor: "🍫 Double Rich Chocolate - Creamy, dense cocoa flavor — easy on the stomach",
      weight: "10lbs",
      keyBenefits: [
        "Supports clean bulking with quality calories",
        "Provides steady energy release via complex carbs",
        "Promotes muscle mass gain and faster recovery",
        "Enhanced with digestive enzymes easy absorption",
        "Rich in taste, zero stomach discomfort"
      ],
      usps: [
        "Balanced macro ratio: high carbs, moderate protein, low sugar",
        "Whey protein-based formula (not soy-dominant)",
        "Added digestive enzymes for gut comfort",
        "Ideal for hard gainers or anyone in a caloric surplus phase",
        "Mixes easily – no lumps, no bloating"
      ],
      howToUse: [
        "Mix 2 level scoops (~100g) in 250–300ml cold water or milk",
        "Consume once or twice daily between meals or post-workout",
        "Can be blended with banana, oats, or nut butter for added calories"
      ],
      whoShouldUse: [
        "Underweight individuals or hard gainers",
        "Athletes in strength or hypertrophy phases",
        "Anyone looking to add lean size with a clean macro profile"
      ],
      certifications: [
        "Manufactured in a GMP-certified facility",
        "Lab-tested for purity and protein integrity",
        "No added sugars, banned substances, or cheap fillers",
        "Complies with FSSAI & Indian nutraceutical standards"
      ],
      storageWarnings: [
        "Store in a cool, dry place",
        "Not recommended for individuals with lactose intolerance without enzyme tolerance",
        "Keep the container tightly sealed after use",
        "Not for medicinal use"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Titan Evolve – Mass Gainer (Kesar Pista Delight) 6lbs",
    description: "A royal fusion of saffron and pistachio with warm, aromatic undertones",
    price: 3499,
    image: "/lovable-uploads/c3d18c0f-97cc-4c1d-9922-eb5d630de616.png",
    category: "Mass Gainer",
    categoryId: "550e8400-e29b-41d4-a716-446655440103",
    stockQuantity: 18,
    isFeatured: false,
    isNew: true,
    sku: "TE-MG-KPD-6LBS",
    badge: "New",
    mrp: 4499,
    discount: 22.22,
    details: {
      netWeight: "6lbs",
      servings: "27",
      form: "Flavored Mass Gainer Powder",
      flavor: "Kesar Pista Delight - A royal fusion of saffron and pistachio with warm, aromatic undertones — rich, smooth, and unforgettable",
      weight: "6lbs",
      keyBenefits: [
        "Supports clean bulking with quality calories",
        "Provides steady energy release via complex carbs",
        "Promotes muscle mass gain and faster recovery",
        "Enhanced with digestive enzymes easy absorption",
        "Rich in taste, zero stomach discomfort"
      ],
      usps: [
        "Balanced macro ratio: high carbs, moderate protein, low sugar",
        "Whey protein-based formula (not soy-dominant)",
        "Added digestive enzymes for gut comfort",
        "Ideal for hard gainers or anyone in a caloric surplus phase",
        "Mixes easily – no lumps, no bloating"
      ],
      howToUse: [
        "Mix 2 level scoops (~100g) in 250–300ml cold water or milk",
        "Consume once or twice daily between meals or post-workout",
        "Can be blended with banana, oats, or nut butter for added calories"
      ],
      whoShouldUse: [
        "Underweight individuals or hard gainers",
        "Athletes in strength or hypertrophy phases",
        "Anyone looking to add lean size with a clean macro profile"
      ],
      certifications: [
        "Manufactured in a GMP-certified facility",
        "Lab-tested for purity and protein integrity",
        "No added sugars, banned substances, or cheap fillers",
        "Complies with FSSAI & Indian nutraceutical standards"
      ],
      storageWarnings: [
        "Store in a cool, dry place",
        "Not recommended for individuals with lactose intolerance without enzyme tolerance",
        "Keep the container tightly sealed after use",
        "Not for medicinal use"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Titan Evolve – Mass Gainer (Kesar Pista Delight) 10lbs",
    description: "A royal fusion of saffron and pistachio with warm, aromatic undertones",
    price: 4999,
    image: "/lovable-uploads/c3d18c0f-97cc-4c1d-9922-eb5d630de616.png",
    category: "Mass Gainer",
    categoryId: "550e8400-e29b-41d4-a716-446655440103",
    stockQuantity: 12,
    isFeatured: false,
    isNew: true,
    sku: "TE-MG-KPD-10LBS",
    badge: "New",
    mrp: 7499,
    discount: 33.33,
    details: {
      netWeight: "10lbs",
      servings: "45",
      form: "Flavored Mass Gainer Powder",
      flavor: "Kesar Pista Delight - A royal fusion of saffron and pistachio with warm, aromatic undertones — rich, smooth, and unforgettable",
      weight: "10lbs",
      keyBenefits: [
        "Supports clean bulking with quality calories",
        "Provides steady energy release via complex carbs",
        "Promotes muscle mass gain and faster recovery",
        "Enhanced with digestive enzymes easy absorption",
        "Rich in taste, zero stomach discomfort"
      ],
      usps: [
        "Balanced macro ratio: high carbs, moderate protein, low sugar",
        "Whey protein-based formula (not soy-dominant)",
        "Added digestive enzymes for gut comfort",
        "Ideal for hard gainers or anyone in a caloric surplus phase",
        "Mixes easily – no lumps, no bloating"
      ],
      howToUse: [
        "Mix 2 level scoops (~100g) in 250–300ml cold water or milk",
        "Consume once or twice daily between meals or post-workout",
        "Can be blended with banana, oats, or nut butter for added calories"
      ],
      whoShouldUse: [
        "Underweight individuals or hard gainers",
        "Athletes in strength or hypertrophy phases",
        "Anyone looking to add lean size with a clean macro profile"
      ],
      certifications: [
        "Manufactured in a GMP-certified facility",
        "Lab-tested for purity and protein integrity",
        "No added sugars, banned substances, or cheap fillers",
        "Complies with FSSAI & Indian nutraceutical standards"
      ],
      storageWarnings: [
        "Store in a cool, dry place",
        "Not recommended for individuals with lactose intolerance without enzyme tolerance",
        "Keep the container tightly sealed after use",
        "Not for medicinal use"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Titan Evolve – Lean Whey Protein (Double Rich Chocolate)",
    description: "Deep, rich cocoa with a clean finish - 25g protein per serving",
    price: 4999,
    mrp: 7999,
    discount: 37.5,
    image: "/lovable-uploads/9840db8e-f064-47aa-aae6-a4febe854970.png",
    images: [
      "/lovable-uploads/9840db8e-f064-47aa-aae6-a4febe854970.png",
      "/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png",
      "/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png"
    ],
    category: "Whey Protein",
    categoryId: "550e8400-e29b-41d4-a716-446655440104",
    stockQuantity: 35,
    isFeatured: true,
    isNew: false,
    sku: "TE-WP-DRC-2KG",
    badge: "Premium",
    details: {
      netWeight: "2kg",
      servings: "66",
      form: "Flavoured Whey Protein Blend",
      flavor: "🍫 Double Rich Chocolate - Deep, rich cocoa with a clean finish",
      weight: "2kg",
      keyBenefits: [
        "Provides 25g of high-quality protein per serving",
        "Promotes lean muscle growth & faster recovery",
        "Enriched with EAAs + BCAAs for better protein synthesis",
        "Zero sugar, low fat – ideal for cutting or clean bulking",
        "Added digestive enzymes to ensure zero bloating"
      ],
      usps: [
        "Blend of Whey Protein Isolate + Concentrate",
        "Contains 11.4g EAAs and 5.2g BCAAs per scoop",
        "Fast-digesting + full amino acid spectrum",
        "DigeZyme® enzyme complex included",
        "Smooth mixability, rich taste — no clumps, no chalkiness",
        "Vegetarian-friendly & FSSAI licensed"
      ],
      howToUse: [
        "Mix 1 scoop (30g) in 200–250ml cold water or milk",
        "Consume post-workout or anytime to meet protein goals",
        "Can be used in smoothies, oats, or pancake mixes"
      ],
      whoShouldUse: [
        "Strength athletes, bodybuilders, or regular gym-goers",
        "People in cutting, recomposition, or lean gain phases",
        "Those who want a digestive-friendly, reliable daily protein"
      ],
      certifications: [
        "GMP-certified",
        "No banned substance",
        "Lab-tested for quality & accuracy",
        "100% Vegetarian formula",
        "Complies with FSSAI and Indian food safety norms"
      ],
      storageWarnings: [
        "Store in a cool, dry place",
        "Do not exceed the recommended dosage",
        "Not for medical use",
        "Not intended for children, pregnant or lactating women"
      ]
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Titan Evolve – Lean Whey Protein (American Ice Cream)",
    description: "Creamy, dessert-like experience with a vanilla-caramel blend - 25g protein per serving",
    price: 4999,
    image: "/lovable-uploads/10b6d7ef-bb73-4171-bcf4-135a875bffeb.png",
    images: [
      "/lovable-uploads/10b6d7ef-bb73-4171-bcf4-135a875bffeb.png",
      "/lovable-uploads/e04aff8e-bea5-4f62-916d-a8a50dbd8955.png",
      "/lovable-uploads/d012ea81-fb2d-44ba-806d-f1fd364e61d1.png"
    ],
    category: "Whey Protein",
    categoryId: "550e8400-e29b-41d4-a716-446655440104",
    stockQuantity: 28,
    isFeatured: false,
    isNew: true,
    sku: "TE-WP-AIC-2KG",
    badge: "New",
    mrp: 7999,
    discount: 37.5,
    details: {
      netWeight: "2kg",
      servings: "66",
      form: "Flavoured Whey Protein Blend",
      flavor: "American Ice Cream - Creamy, dessert-like experience with a vanilla-caramel blend",
      weight: "2kg",
      keyBenefits: [
        "Provides 25g of high-quality protein per serving",
        "Promotes lean muscle growth & faster recovery",
        "Enriched with EAAs + BCAAs for better protein synthesis",
        "Zero sugar, low fat – ideal for cutting or clean bulking",
        "Added digestive enzymes to ensure zero bloating"
      ],
      usps: [
        "Blend of Whey Protein Isolate + Concentrate",
        "Contains 11.4g EAAs and 5.2g BCAAs per scoop",
        "Fast-digesting + full amino acid spectrum",
        "DigeZyme® enzyme complex included",
        "Smooth mixability, rich taste — no clumps, no chalkiness",
        "Vegetarian-friendly & FSSAI licensed"
      ],
      howToUse: [
        "Mix 1 scoop (30g) in 200–250ml cold water or milk",
        "Consume post-workout or anytime to meet protein goals",
        "Can be used in smoothies, oats, or pancake mixes"
      ],
      whoShouldUse: [
        "Strength athletes, bodybuilders, or regular gym-goers",
        "People in cutting, recomposition, or lean gain phases",
        "Those who want a digestive-friendly, reliable daily protein"
      ],
      certifications: [
        "GMP-certified",
        "No banned substance",
        "Lab-tested for quality & accuracy",
        "100% Vegetarian formula",
        "Complies with FSSAI and Indian food safety norms"
      ],
      storageWarnings: [
        "Store in a cool, dry place",
        "Do not exceed the recommended dosage",
        "Not for medical use",
        "Not intended for children, pregnant or lactating women"
      ]
    }
  }
];

// Helper functions to get products by category, featured status, etc.
export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getNewProducts = () => products.filter(p => p.isNew);
export const getProductsByCategory = (categoryId: string) => products.filter(p => p.categoryId === categoryId);
export const getProductById = (id: string) => products.find(p => p.id === id);
export const getAllCategories = () => Object.values(productCategories);

// Brand information
export const brandInfo = {
  name: "Titan Evolve",
  tagline: "Born for athletes. Built by the relentless. Driven by discipline.",
  description: "Titan Evolve is a premium Indian nutraceutical brand crafted to fulfil the needs of athletes, strength training enthusiasts, and fitness-driven individuals. Engineered by elite coaches, sports scientists, and performance-focused professionals, our mission is to deliver high-quality supplements backed by science, driven by performance, and elevated by taste.",
  vision: "To become India's most trusted and performance-first supplement brand — combining elite-level quality, scientific formulation, and a community culture that empowers athletes across all disciplines.",
  whyChoose: [
    "Formulated by real athletes and coaches & tested in real training environments",
    "Micronized, bioavailable ingredients for maximum impact",
    "Transparent labels, zero banned substances, no filler junk",
    "Superior taste profiles with smooth, mixable blends",
    "Trusted by strength athletes, fitness enthusiasts, and performance-driven individuals",
    "Community-focused brand built on grit, knowledge, and trust"
  ]
};

// Shipping and policy information
export const shippingInfo = {
  processing: "Orders are processed within 24–48 hours after payment",
  tracking: "You'll receive tracking info via email/SMS once dispatched",
  delivery: {
    metro: "2–4 working days",
    rural: "4–7 working days"
  },
  charges: {
    free: "FREE shipping on all prepaid orders above ₹1499",
    standard: "₹99 flat shipping for orders below ₹1499",
    cod: "Cash on Delivery (COD) available with ₹199 additional charge"
  }
};

export const returnPolicy = {
  title: "Returns & Refund Policy",
  description: "We stand by our product quality. However, if there's damage or tampering during shipping, we offer replacements or refunds under our strict policy:",
  videoRequirement: "You must record a 360° unboxing video with your phone. Video must show seal condition, box label, and product clearly. Ensure good lighting and product in focus — all in one take.",
  validity: "Must report the issue within 24 hours of delivery. Share the video immediately via email or WhatsApp. No video = no claim will be accepted.",
  notAccepted: [
    "Opened, used, or tampered products without a valid reason",
    "Return requests after 24 hours", 
    "Flavor dislikes or taste preferences"
  ]
};
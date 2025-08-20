export interface ProductVariant {
  id: string;
  variantName: string;
  flavor?: string;
  size: string;
  price: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
}

export interface CentralizedProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  image: string;
  isNew: boolean;
  isFeatured: boolean;
  badge?: string;
  variants: ProductVariant[];
  details: {
    keyBenefits: string[];
    howToUse: string[];
    certifications: string[];
    netWeight?: string;
    servings?: string;
    form?: string;
    flavor?: string;
  };
}

// Centralized product data with variants - Updated with correct UUIDs
export const centralizedProducts: CentralizedProduct[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Titan Evolve – Lean Whey Protein',
    description: 'Premium quality whey protein for muscle building and recovery. Made from the finest ingredients to support your fitness goals.',
    category: 'Protein',
    categoryId: 'protein',
    image: '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png',
    isNew: true,
    isFeatured: true,
    badge: 'BEST SELLER',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440008-variant-1',
        variantName: 'Double Rich Chocolate 2lbs',
        flavor: 'Double Rich Chocolate',
        size: '2lbs',
        price: 4999,
        stockQuantity: 35,
        sku: 'TE-LWP-DRC-2LBS',
        isActive: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009-variant-1',
        variantName: 'American Ice Cream 2lbs',
        flavor: 'American Ice Cream',
        size: '2lbs',
        price: 4999,
        stockQuantity: 28,
        sku: 'TE-LWP-AIC-2LBS',
        isActive: true
      }
    ],
    details: {
      keyBenefits: [
        "High-quality whey protein for muscle growth",
        "Fast absorption and digestion",
        "Rich in essential amino acids",
        "Supports post-workout recovery",
        "Great taste and mixability"
      ],
      howToUse: [
        "Mix 1 scoop (30g) with 200-250ml water or milk",
        "Consume within 30 minutes post-workout",
        "Can be taken 1-2 times daily",
        "Store in a cool, dry place"
      ],
      certifications: [
        "ISO 22000 Certified",
        "FSSAI Approved",
        "Lab Tested for Purity",
        "No Banned Substances"
      ],
      form: "Powder",
      servings: "66 servings (2lbs)"
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Titan Evolve – Mass Gainer',
    description: 'Advanced mass gainer formula with high-quality proteins and carbohydrates to support muscle growth and weight gain.',
    category: 'Mass Gainer',
    categoryId: 'mass-gainer',
    image: '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png',
    isNew: false,
    isFeatured: true,
    badge: 'HIGH PROTEIN',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440004-variant-1',
        variantName: 'Double Rich Chocolate 6lbs',
        flavor: 'Double Rich Chocolate',
        size: '6lbs',
        price: 3499,
        stockQuantity: 20,
        sku: 'TE-MG-DRC-6LBS',
        isActive: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005-variant-1',
        variantName: 'Double Rich Chocolate 10lbs',
        flavor: 'Double Rich Chocolate',
        size: '10lbs',
        price: 4999,
        stockQuantity: 15,
        sku: 'TE-MG-DRC-10LBS',
        isActive: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006-variant-1',
        variantName: 'Kesar Pista Delight 6lbs',
        flavor: 'Kesar Pista Delight',
        size: '6lbs',
        price: 3499,
        stockQuantity: 18,
        sku: 'TE-MG-KPD-6LBS',
        isActive: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007-variant-1',
        variantName: 'Kesar Pista Delight 10lbs',
        flavor: 'Kesar Pista Delight',
        size: '10lbs',
        price: 4999,
        stockQuantity: 12,
        sku: 'TE-MG-KPD-10LBS',
        isActive: true
      }
    ],
    details: {
      keyBenefits: [
        "High calorie formula for weight gain",
        "Blend of fast and slow proteins",
        "Complex carbohydrates for sustained energy",
        "Enriched with vitamins and minerals",
        "Supports muscle mass development"
      ],
      howToUse: [
        "Mix 2-3 scoops (100g) with 300-400ml milk or water",
        "Consume 1-2 times daily between meals",
        "Best taken post-workout or as a meal replacement",
        "Shake well before consumption"
      ],
      certifications: [
        "ISO 22000 Certified",
        "FSSAI Approved",
        "Third-party Lab Tested",
        "Quality Assured"
      ],
      form: "Powder",
      servings: "27 servings (6lbs), 45 servings (10lbs)"
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Titan Evolve – Pre-Workout',
    description: 'Explosive pre-workout formula designed to boost energy, focus, and performance during intense training sessions.',
    category: 'Pre-Workout',
    categoryId: 'pre-workout',
    image: '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png',
    isNew: true,
    isFeatured: true,
    badge: 'ENERGY BOOST',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440002-variant-1',
        variantName: 'Watermelon 250g',
        flavor: 'Watermelon',
        size: '250g',
        price: 1750,
        stockQuantity: 30,
        sku: 'TE-PRE-WM-250',
        isActive: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003-variant-1',
        variantName: 'Bubblegum Burst 250g',
        flavor: 'Bubblegum Burst',
        size: '250g',
        price: 1750,
        stockQuantity: 25,
        sku: 'TE-PRE-BB-250',
        isActive: true
      }
    ],
    details: {
      keyBenefits: [
        "Explosive energy and focus",
        "Enhanced workout performance",
        "Increased muscle pump",
        "Faster recovery between sets",
        "Great tasting flavors"
      ],
      howToUse: [
        "Mix 1 scoop (10g) with 200ml cold water",
        "Consume 15-30 minutes before workout",
        "Start with half scoop to assess tolerance",
        "Do not exceed 1 scoop per day"
      ],
      certifications: [
        "FSSAI Approved",
        "Lab Tested for Banned Substances",
        "Quality Certified",
        "Safe for Athletes"
      ],
      form: "Powder"
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Titan Evolve – Creatine Monohydrate',
    description: 'Pure creatine monohydrate powder for enhanced strength, power, and muscle volume. Unflavored and easily mixable.',
    category: 'Creatine',
    categoryId: 'creatine',
    image: '/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png',
    isNew: false,
    isFeatured: true,
    badge: 'PURE FORMULA',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440001-variant-1',
        variantName: 'Unflavored 180g',
        flavor: 'Unflavored',
        size: '180g',
        price: 1199,
        stockQuantity: 50,
        sku: 'TE-CREAT-180',
        isActive: true
      }
    ],
    details: {
      keyBenefits: [
        "Increases muscle strength and power",
        "Enhances athletic performance",
        "Supports muscle volume",
        "Fast muscle recovery",
        "Pure micronized formula"
      ],
      howToUse: [
        "Mix 1 scoop (5g) with water or juice",
        "Take daily for best results",
        "Can be taken pre or post workout",
        "Loading phase: 20g per day for 5 days, then 5g daily"
      ],
      certifications: [
        "99.9% Pure Creatine Monohydrate",
        "FSSAI Approved",
        "Third-party Tested",
        "Pharmaceutical Grade"
      ],
      form: "Powder",
      servings: "36 servings (180g)"
    }
  }
];

// Helper functions
export const getAllProducts = (): CentralizedProduct[] => {
  return centralizedProducts;
};

export const getProductById = (id: string): CentralizedProduct | undefined => {
  return centralizedProducts.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): CentralizedProduct[] => {
  return centralizedProducts.filter(product => product.categoryId === categoryId);
};

export const getFeaturedProducts = (): CentralizedProduct[] => {
  return centralizedProducts.filter(product => product.isFeatured);
};

export const getNewProducts = (): CentralizedProduct[] => {
  return centralizedProducts.filter(product => product.isNew);
};

export const getProductVariant = (productId: string, variantId: string): ProductVariant | undefined => {
  const product = getProductById(productId);
  return product?.variants.find(variant => variant.id === variantId);
};

export const getDefaultVariant = (productId: string): ProductVariant | undefined => {
  const product = getProductById(productId);
  return product?.variants[0]; // Return first variant as default
};
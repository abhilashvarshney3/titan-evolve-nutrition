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

// Centralized product data with variants
export const centralizedProducts: CentralizedProduct[] = [
  {
    id: 'lean-whey-protein',
    name: 'Lean Whey Protein',
    description: 'Premium quality whey protein for muscle building and recovery. Made from the finest ingredients to support your fitness goals.',
    category: 'Protein',
    categoryId: 'protein',
    image: '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png',
    isNew: true,
    isFeatured: true,
    badge: 'BEST SELLER',
    variants: [
      {
        id: 'lean-whey-2kg-chocolate',
        variantName: '2KG - Double Rich Chocolate',
        flavor: 'Double Rich Chocolate',
        size: '2KG',
        price: 2499,
        stockQuantity: 50,
        sku: 'LWP-2KG-CHOC',
        isActive: true
      },
      {
        id: 'lean-whey-4kg-chocolate',
        variantName: '4KG - Double Rich Chocolate',
        flavor: 'Double Rich Chocolate',
        size: '4KG',
        price: 4599,
        stockQuantity: 30,
        sku: 'LWP-4KG-CHOC',
        isActive: true
      },
      {
        id: 'lean-whey-2kg-icecream',
        variantName: '2KG - American Ice Cream',
        flavor: 'American Ice Cream',
        size: '2KG',
        price: 2499,
        stockQuantity: 45,
        sku: 'LWP-2KG-ICE',
        isActive: true
      },
      {
        id: 'lean-whey-4kg-icecream',
        variantName: '4KG - American Ice Cream',
        flavor: 'American Ice Cream',
        size: '4KG',
        price: 4599,
        stockQuantity: 25,
        sku: 'LWP-4KG-ICE',
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
      servings: "66 servings (2KG), 133 servings (4KG)"
    }
  },
  {
    id: 'muscle-gainer',
    name: 'Muscle Gainer',
    description: 'Advanced mass gainer formula with high-quality proteins and carbohydrates to support muscle growth and weight gain.',
    category: 'Mass Gainer',
    categoryId: 'mass-gainer',
    image: '/lovable-uploads/6f21609e-a5cd-4cc0-a41a-82da539f5d0f.png',
    isNew: false,
    isFeatured: true,
    badge: 'HIGH PROTEIN',
    variants: [
      {
        id: 'muscle-gainer-6lbs-chocolate',
        variantName: '6lbs - Double Rich Chocolate',
        flavor: 'Double Rich Chocolate',
        size: '6lbs',
        price: 3299,
        stockQuantity: 40,
        sku: 'MG-6LBS-CHOC',
        isActive: true
      },
      {
        id: 'muscle-gainer-10lbs-chocolate',
        variantName: '10lbs - Double Rich Chocolate',
        flavor: 'Double Rich Chocolate',
        size: '10lbs',
        price: 5199,
        stockQuantity: 20,
        sku: 'MG-10LBS-CHOC',
        isActive: true
      },
      {
        id: 'muscle-gainer-6lbs-kesar',
        variantName: '6lbs - Kesar Pista',
        flavor: 'Kesar Pista',
        size: '6lbs',
        price: 3299,
        stockQuantity: 35,
        sku: 'MG-6LBS-KESAR',
        isActive: true
      },
      {
        id: 'muscle-gainer-10lbs-kesar',
        variantName: '10lbs - Kesar Pista',
        flavor: 'Kesar Pista',
        size: '10lbs',
        price: 5199,
        stockQuantity: 15,
        sku: 'MG-10LBS-KESAR',
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
    id: 'pre-workout',
    name: 'Pre-Workout',
    description: 'Explosive pre-workout formula designed to boost energy, focus, and performance during intense training sessions.',
    category: 'Pre-Workout',
    categoryId: 'pre-workout',
    image: '/lovable-uploads/ff150af1-45f4-466a-a0f0-8c24b6de0207.png',
    isNew: true,
    isFeatured: false,
    badge: 'ENERGY BOOST',
    variants: [
      {
        id: 'pre-workout-30-watermelon',
        variantName: '30 Servings - Watermelon',
        flavor: 'Watermelon',
        size: '30 servings',
        price: 1799,
        stockQuantity: 60,
        sku: 'PWO-30-WATER',
        isActive: true
      },
      {
        id: 'pre-workout-60-watermelon',
        variantName: '60 Servings - Watermelon',
        flavor: 'Watermelon',
        size: '60 servings',
        price: 3299,
        stockQuantity: 35,
        sku: 'PWO-60-WATER',
        isActive: true
      },
      {
        id: 'pre-workout-30-bubblegum',
        variantName: '30 Servings - Bubblegum',
        flavor: 'Bubblegum',
        size: '30 servings',
        price: 1799,
        stockQuantity: 55,
        sku: 'PWO-30-BUBBLE',
        isActive: true
      },
      {
        id: 'pre-workout-60-bubblegum',
        variantName: '60 Servings - Bubblegum',
        flavor: 'Bubblegum',
        size: '60 servings',
        price: 3299,
        stockQuantity: 30,
        sku: 'PWO-60-BUBBLE',
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
    id: 'creatine',
    name: 'Creatine Monohydrate',
    description: 'Pure creatine monohydrate powder for enhanced strength, power, and muscle volume. Unflavored and easily mixable.',
    category: 'Creatine',
    categoryId: 'creatine',
    image: '/lovable-uploads/cc7b982a-2963-4aa1-a018-5a61326ddf2c.png',
    isNew: false,
    isFeatured: true,
    badge: 'PURE FORMULA',
    variants: [
      {
        id: 'creatine-180g',
        variantName: '180g - Unflavored',
        size: '180g',
        price: 899,
        stockQuantity: 80,
        sku: 'CREAT-180G',
        isActive: true
      },
      {
        id: 'creatine-250g',
        variantName: '250g - Unflavored',
        size: '250g',
        price: 1199,
        stockQuantity: 70,
        sku: 'CREAT-250G',
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
      servings: "36 servings (180g), 50 servings (250g)"
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
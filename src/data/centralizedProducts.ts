export interface ProductVariant {
  id: string;
  variantName: string;
  flavor?: string;
  size: string;
  price: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
  images?: VariantImage[];
}

export interface VariantImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
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

// Centralized product data with variants - Updated with correct specifications
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
        id: '550e8400-e29b-41d4-a716-446655440101',
        variantName: 'Double Rich Chocolate 2KG',
        flavor: 'Double Rich Chocolate',
        size: '2KG',
        price: 4999,
        stockQuantity: 35,
        sku: 'TE-LWP-DRC-2KG',
        isActive: true,
        images: [{ id: '1', imageUrl: '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440102',
        variantName: 'Double Rich Chocolate 4KG',
        flavor: 'Double Rich Chocolate',
        size: '4KG',
        price: 8999,
        stockQuantity: 20,
        sku: 'TE-LWP-DRC-4KG',
        isActive: true,
        images: [{ id: '2', imageUrl: '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440103',
        variantName: 'American Ice Cream 2KG',
        flavor: 'American Ice Cream',
        size: '2KG',
        price: 4999,
        stockQuantity: 28,
        sku: 'TE-LWP-AIC-2KG',
        isActive: true,
        images: [{ id: '3', imageUrl: '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440104',
        variantName: 'American Ice Cream 4KG',
        flavor: 'American Ice Cream',
        size: '4KG',
        price: 8999,
        stockQuantity: 15,
        sku: 'TE-LWP-AIC-4KG',
        isActive: true,
        images: [{ id: '4', imageUrl: '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', isPrimary: true, displayOrder: 0 }]
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
    id: '550e8400-e29b-41d4-a716-446655440001',
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
        id: '550e8400-e29b-41d4-a716-446655440201',
        variantName: 'Double Rich Chocolate 6lbs',
        flavor: 'Double Rich Chocolate',
        size: '6lbs',
        price: 3499,
        stockQuantity: 20,
        sku: 'TE-MG-DRC-6LBS',
        isActive: true,
        images: [{ id: '5', imageUrl: '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440202',
        variantName: 'Double Rich Chocolate 10lbs',
        flavor: 'Double Rich Chocolate',
        size: '10lbs',
        price: 4999,
        stockQuantity: 15,
        sku: 'TE-MG-DRC-10LBS',
        isActive: true,
        images: [{ id: '6', imageUrl: '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440203',
        variantName: 'Kesar Pista 6lbs',
        flavor: 'Kesar Pista',
        size: '6lbs',
        price: 3499,
        stockQuantity: 18,
        sku: 'TE-MG-KP-6LBS',
        isActive: true,
        images: [{ id: '7', imageUrl: '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440204',
        variantName: 'Kesar Pista 10lbs',
        flavor: 'Kesar Pista',
        size: '10lbs',
        price: 4999,
        stockQuantity: 12,
        sku: 'TE-MG-KP-10LBS',
        isActive: true,
        images: [{ id: '8', imageUrl: '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', isPrimary: true, displayOrder: 0 }]
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
        id: '550e8400-e29b-41d4-a716-446655440301',
        variantName: 'Watermelon 30 servings',
        flavor: 'Watermelon',
        size: '30 servings',
        price: 1750,
        stockQuantity: 30,
        sku: 'TE-PRE-WM-30',
        isActive: true,
        images: [{ id: '9', imageUrl: '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440302',
        variantName: 'Watermelon 60 servings',
        flavor: 'Watermelon',
        size: '60 servings',
        price: 2999,
        stockQuantity: 20,
        sku: 'TE-PRE-WM-60',
        isActive: true,
        images: [{ id: '10', imageUrl: '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440303',
        variantName: 'Bubblegum 30 servings',
        flavor: 'Bubblegum',
        size: '30 servings',
        price: 1750,
        stockQuantity: 25,
        sku: 'TE-PRE-BB-30',
        isActive: true,
        images: [{ id: '11', imageUrl: '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440304',
        variantName: 'Bubblegum 60 servings',
        flavor: 'Bubblegum',
        size: '60 servings',
        price: 2999,
        stockQuantity: 18,
        sku: 'TE-PRE-BB-60',
        isActive: true,
        images: [{ id: '12', imageUrl: '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', isPrimary: true, displayOrder: 0 }]
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
    id: '550e8400-e29b-41d4-a716-446655440003',
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
        id: '550e8400-e29b-41d4-a716-446655440401',
        variantName: 'Unflavored 180g',
        flavor: 'Unflavored',
        size: '180g',
        price: 1199,
        stockQuantity: 50,
        sku: 'TE-CREAT-180',
        isActive: true,
        images: [{ id: '13', imageUrl: '/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png', isPrimary: true, displayOrder: 0 }]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440402',
        variantName: 'Unflavored 250g',
        flavor: 'Unflavored',
        size: '250g',
        price: 1599,
        stockQuantity: 35,
        sku: 'TE-CREAT-250',
        isActive: true,
        images: [{ id: '14', imageUrl: '/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png', isPrimary: true, displayOrder: 0 }]
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
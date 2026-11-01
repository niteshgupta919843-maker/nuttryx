import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'dark-chocolate',
    name: 'NUTTRYX Dark Chocolate Peanut Butter',
    subtitle: 'Creamy • Roasted • Protein Rich with Pure Dutch Cacao',
    description: 'Indulge guilt-free with the ultimate fusion of slow-roasted bold peanuts and premium unsweetened dark cocoa. Rich chocolate aroma with a velvety mouthfeel that satisfies your sweet tooth while powering your fitness goals.',
    image: '/images/dark-chocolate-peanut-butter.jpg',
    badge: 'Bestseller 🔥',
    rating: 4.9,
    reviewsCount: 1420,
    category: 'chocolate',
    sizes: [
      { weight: '500g', price: 329, originalPrice: 429, inStock: true },
      { weight: '1kg', price: 599, originalPrice: 799, inStock: true }
    ],
    nutrition: {
      proteinPer100g: '28g',
      proteinPerServing: '9.2g',
      caloriesPerServing: '188 kcal',
      dietaryFibre: '6.5g',
      sugarAdded: '0g'
    },
    ingredients: 'Slow Roasted Saurashtra Peanuts (80%), Premium Dutch Dark Cocoa Powder, Raw Honey Extract, Natural Vanilla, Himalayan Pink Salt (<0.5%).',
    features: [
      '28g Natural Plant Protein per 100g',
      'No Added Refined White Sugar',
      'Zero Palm Oil or Hydrogenated Fats',
      'Real Belgian & Dutch Cacao for decadent flavour',
      '100% Vegetarian & Green Certified'
    ]
  },
  {
    id: 'crunchy-peanut-butter',
    name: 'NUTTRYX Crunchy Peanut Butter',
    subtitle: 'Roasted Peanut Chunks • Slow Roasted • Maximum Crunch',
    description: 'For those who love real crunch! Loaded with crispy toasted peanut bits blended into a nutty paste. Made exclusively from 100% Saurashtra bold peanuts with zero additives or fillers.',
    image: '/images/crunchy-peanut-butter.jpg',
    badge: 'Most Popular ⭐',
    rating: 4.9,
    reviewsCount: 980,
    category: 'protein',
    sizes: [
      { weight: '500g', price: 299, originalPrice: 399, inStock: true },
      { weight: '1kg', price: 549, originalPrice: 749, inStock: true }
    ],
    nutrition: {
      proteinPer100g: '30g',
      proteinPerServing: '10g',
      caloriesPerServing: '194 kcal',
      dietaryFibre: '8g',
      sugarAdded: '0g'
    },
    ingredients: '100% Roasted Gujarat Bold Peanuts. That’s literally it! Nothing else added.',
    features: [
      '30g High Protein per 100g',
      'Pure Single-Ingredient Formula',
      'Loaded with Satisfying Crunchy Peanut Bits',
      'Zero Salt, Zero Sugar, Zero Preservatives',
      'Supports Heavy Gym Sessions & Muscle Repair'
    ]
  },
  {
    id: 'creamy-peanut-butter',
    name: 'NUTTRYX Natural Creamy Peanut Butter',
    subtitle: 'Silky Smooth Texture • Slow Stone Milled • Pure Nutrition',
    description: 'Silky, buttery, and effortlessly spreadable. Ground on traditional granite stone mills to achieve an ultra-smooth consistency without any chemical emulsifiers. Perfect on warm sourdough, oatmeal, or protein smoothies.',
    image: '/images/creamy-peanut-butter.jpg',
    badge: 'Classic Choice 🥜',
    rating: 4.8,
    reviewsCount: 1120,
    category: 'protein',
    sizes: [
      { weight: '500g', price: 299, originalPrice: 399, inStock: true },
      { weight: '1kg', price: 549, originalPrice: 749, inStock: true }
    ],
    nutrition: {
      proteinPer100g: '30g',
      proteinPerServing: '10g',
      caloriesPerServing: '194 kcal',
      dietaryFibre: '7.8g',
      sugarAdded: '0g'
    },
    ingredients: '100% Roasted Gujarat Peanuts (Slow Stone Ground).',
    features: [
      '30g Protein per 100g for sustained all-day energy',
      'Ultra smooth texture, blends in 5 seconds in smoothies',
      'Zero Palm Oil, Zero Stabilizers',
      'Heart-healthy monounsaturated fats (MUFA)',
      'Loved by fitness pros, working techies & growing kids'
    ]
  },
  {
    id: 'bundle-trio',
    name: 'NUTTRYX Discovery Bundle (All 3 Flavours)',
    subtitle: 'Dark Chocolate + Crunchy + Creamy (3x 350g Jars)',
    description: 'Cannot decide on one flavour? Get the best of all worlds! Our limited edition gift pack features 1x Dark Chocolate, 1x Crunchy, and 1x Creamy jar along with an artisan wooden butter knife and recipe booklet.',
    image: '/images/nuttryx-hero-banner.jpg',
    badge: 'Save ₹300 🎁',
    rating: 5.0,
    reviewsCount: 650,
    category: 'combos',
    sizes: [
      { weight: '3x 350g (1.05kg)', price: 699, originalPrice: 999, inStock: true },
      { weight: '3x 500g (1.5kg)', price: 899, originalPrice: 1299, inStock: true }
    ],
    nutrition: {
      proteinPer100g: '29.3g Avg',
      proteinPerServing: '9.8g',
      caloriesPerServing: '192 kcal',
      dietaryFibre: '7.4g',
      sugarAdded: '0g'
    },
    ingredients: 'Assortment: 1 jar Pure Dark Chocolate, 1 jar Pure Crunchy, 1 jar Pure Creamy.',
    features: [
      'Experience all three signature textures & flavours',
      'Comes in a premium matte gold embossed gift box',
      'Includes free handcrafted wooden spreader knife',
      'Free Express Delivery anywhere across India'
    ]
  }
];


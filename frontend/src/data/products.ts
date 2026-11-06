export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  rating: number;
  reviewsCount: number;
  category: 'all' | 'protein' | 'chocolate' | 'combos';
  sizes: {
    weight: string;
    price: number;
    originalPrice: number;
    inStock: boolean;
  }[];
  nutrition: {
    proteinPer100g: string;
    proteinPerServing: string;
    caloriesPerServing: string;
    dietaryFibre: string;
    sugarAdded: string;
  };
  ingredients: string;
  features: string[];
}

export const PRODUCTS: Product[] = [
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
      { weight: '500g', price: 279, originalPrice: 429, inStock: true },
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

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Aman Sharma',
    role: 'Fitness Coach & Marathoner, Mumbai',
    rating: 5,
    date: 'Verified Buyer • 2 days ago',
    comment: 'The 30g protein punch without palm oil is a game changer. Most supermarket brands add hydrogenated palm oil which ruins digestion. NUTTRYX tastes like real roasted peanuts and the Dark Chocolate one is dangerously good on pre-workout rice cakes!',
    flavour: 'Dark Chocolate & Crunchy'
  },
  {
    id: 't2',
    name: 'Pooja Iyer',
    role: 'Software Engineer & Mom, Bengaluru',
    rating: 5,
    date: 'Verified Buyer • 5 days ago',
    comment: 'My kids love Nuttryx Creamy on warm toast every morning before school. Knowing there is ZERO refined sugar and zero chemicals gives me complete peace of mind. Truly wholesome quality.',
    flavour: 'Natural Creamy'
  },
  {
    id: 't3',
    name: 'Rohan Deshmukh',
    role: 'CrossFit Athlete, Pune',
    rating: 5,
    date: 'Verified Buyer • 1 week ago',
    comment: 'Crunchy peanut butter with actual huge crunch bits! It gives sustained energy through intense 2-hour workout blocks without any energy crashes. Reordered 1kg pack already.',
    flavour: 'Crunchy Roasted'
  },
  {
    id: 't4',
    name: 'Dr. Neha Verma',
    role: 'Clinical Nutritionist, New Delhi',
    rating: 5,
    date: 'Verified Buyer • 2 weeks ago',
    comment: 'I actively recommend NUTTRYX to my diabetic and fitness clients. Clean ingredients, rich MUFA profile, and high protein density make it one of the cleanest peanut butters manufactured in India.',
    flavour: 'Trio Discovery Bundle'
  }
];

export const FAQS = [
  {
    q: 'Why does oil float on top of the peanut butter?',
    a: 'Natural peanut oil separation is the ultimate proof of purity! Commercial brands add hydrogenated palm oil and chemical emulsifiers to keep the oil mixed artificially. At NUTTRYX, we use zero palm oil. Simply stir the natural oils back in with a spoon or store the jar upside down.'
  },
  {
    q: 'What makes NUTTRYX different from supermarket peanut butter brands?',
    a: 'Most commercial brands use 20-30% added refined sugar, cheap vegetable oil, and low-grade peanuts. NUTTRYX uses 100% slow-roasted Saurashtra bold peanuts, zero refined sugar, zero palm oil, and delivers 30g of authentic plant protein per 100g.'
  },
  {
    q: 'Is NUTTRYX suitable for diabetics and keto diets?',
    a: 'Yes, absolutely! Our Classic Creamy and Crunchy peanut butters have 0g added sugar and only naturally occurring complex carbohydrates with high fibre (low glycemic index). It does not trigger sudden insulin spikes.'
  },
  {
    q: 'How long does a jar stay fresh and how should I store it?',
    a: 'NUTTRYX has a shelf life of 9 months from the date of manufacture. Store it in a cool, dry place away from direct sunlight. Refrigeration is optional—it will make it firmer, while room temperature keeps it creamy and easily spreadable.'
  },
  {
    q: 'How does the Free 50g Sample offer work?',
    a: 'Every single order placed on our website automatically receives a complimentary 50g travel sample jar of one of our other flavours so you can try all textures risk-free! You can also request a free sample pack directly through our sample claim form.'
  },
  {
    q: 'What are the shipping charges and delivery timelines?',
    a: 'We offer FREE shipping across India on all orders above ₹499! Orders are freshly roasted and dispatched within 24 hours. Metro cities receive delivery in 2-3 days, while rest of India takes 3-5 days. Tracking links are sent via WhatsApp and SMS.'
  }
];

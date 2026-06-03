import { Product, Coupon } from '../types';

export const mockProducts: Product[] = [
  // --- GROCERIES ---
  {
    id: 'g1',
    name: 'Nature Select Organic Fresh Blueberries (18oz)',
    price: 4.98,
    originalPrice: 5.98,
    category: 'Groceries',
    subCategory: 'Produce',
    brand: 'Nature Select',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviewCount: 1420,
    stock: 45,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Fresh, juicy, organic blueberries packed with antioxidants. Hand-picked on family-owned sustainable farms in Washington.',
    features: ['100% USDA Certified Organic', 'Excellent source of Vitamin C & Fiber', 'No synthetic pesticides used', 'Pre-washed and packed in eco-friendly BPA-free tubs'],
    specs: {
      'Weight': '18 oz',
      'Origin': 'USA',
      'Nutrition': '80 Calories per serving',
      'Shelf Life': 'Typically fresh for 7+ days',
      'Certifications': 'USDA Organic, Non-GMO Project Verified'
    },
    reviews: [
      { author: 'Sarah M.', rating: 5, comment: 'Incredibly sweet and firm. My kids devour these in one sitting!', date: 'May 28, 2026' },
      { author: 'James L.', rating: 4, comment: 'Consistent quality. Better than what you typical find in standard supermarkets.', date: 'May 15, 2026' }
    ],
    bestseller: true,
    frequentlyBoughtTogether: ['g2', 'g3'],
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 10
  },
  {
    id: 'g2',
    name: 'Valley Farms Grass-Fed Organic Whole Milk (1 Gal)',
    price: 5.42,
    category: 'Groceries',
    subCategory: 'Dairy',
    brand: 'Valley Farms',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    reviewCount: 3822,
    stock: 120,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Rich, creamy whole milk from pasture-raised, grass-fed cows. Homogenized and ultra-pasteurized for pristine quality and taste.',
    features: ['Grass-fed cows with pasture access', 'Vitamin D3 enriched', 'No artificial growth hormones (rBST-free)', 'Excellent source of Calcium and Protein'],
    specs: {
      'Volume': '1 Gallon',
      'Fat Content': '3.25%',
      'Container': 'Recyclable Plastic Jug'
    },
    reviews: [
      { author: 'Robert D.', rating: 5, comment: 'Tastes like real milk from my childhood. Essential for our weekly delivery.', date: 'Jun 01, 2026' }
    ],
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 15
  },
  {
    id: 'g3',
    name: 'Heartland Seeded Multigrain Sliced Bread (24 oz)',
    price: 3.28,
    originalPrice: 3.98,
    category: 'Groceries',
    subCategory: 'Bakery',
    brand: 'Heartland',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    reviewCount: 890,
    stock: 35,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Thick, seeded multigrain sandwich bread slow-baked with rolled oats, flaxseed, chia, and real wild honey.',
    features: ['12g whole grains per slice', 'No high fructose corn syrup', 'Baked daily in local region bakeries', 'Coated with oats and sunflower seeds'],
    specs: {
      'Weight': '24 oz',
      'Slices': 'Approx. 16 per loaf',
      'Allergens': 'Contains Wheat, Sesame'
    },
    reviews: [
      { author: 'Linda K.', rating: 5, comment: 'Toasts beautifully and preserves amazing texture. Highly recommended.', date: 'May 20, 2026' }
    ],
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 10
  },
  {
    id: 'g4',
    name: 'Homestead Premium Extra Large Grade A Eggs (18ct)',
    price: 4.88,
    category: 'Groceries',
    subCategory: 'Dairy & Eggs',
    brand: 'Homestead Pack',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    reviewCount: 2210,
    stock: 8,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Farm-fresh grade A extra large eggs from cage-free, grain-fed laying hens.',
    features: ['100% Cage-free', 'Extra Large size with robust golden yolks', 'Rigorous triple-washed sorting', 'BPA-free pulp carton packaging'],
    specs: {
      'Quantity': '18 Eggs',
      'Grade': 'USDA Grade A',
      'Size': 'Extra Large'
    },
    reviews: [],
    bestseller: true,
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 10
  },
  {
    id: 'g5',
    name: 'Crisp Harvest Fresh Hass Avocados (4-Pack Bag)',
    price: 3.48,
    originalPrice: 4.28,
    category: 'Groceries',
    subCategory: 'Produce',
    brand: 'Crisp Harvest',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80',
    rating: 4.4,
    reviewCount: 3044,
    stock: 60,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Perfectly creamy, high-quality Hass avocados. Handloaded into a dynamic mesh bag for optimal freshness control.',
    features: ['Rich in healthy monounsaturated fats', 'Great for homemade guacamole or toast topping', 'Picked daily on certified sustainable groves'],
    specs: {
      'Bag Count': '4 Avocados',
      'Variety': 'Hass Avocados',
      'Ripeness': 'Firm (arrives near-ripe)'
    },
    reviews: [],
    isSubscriptionEligible: false
  },

  // --- ELECTRONICS ---
  {
    id: 'e1',
    name: 'AeroVue 55" Class 4K UHD Smart Ambient Fire TV',
    price: 278.00,
    originalPrice: 349.00,
    category: 'Electronics',
    subCategory: 'TVs & Video',
    brand: 'AeroVue',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=300&q=80',
    rating: 4.5,
    reviewCount: 8840,
    stock: 14,
    deliveryEstimate: 'Tomorrow morning',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Immersive entertainment experience with absolute 4K Ultra High Definition clarity, built-in smart TV dashboard, and futuristic responsive ambient LED backlighting.',
    features: ['Crisp 4K HDR10 resolution at 60Hz', 'Hands-free voice assistant capability', '3 HDMI 2.1 low-latency inputs', 'Super minimal bezel design'],
    specs: {
      'Screen Size': '54.6 Inches',
      'Refresh Rate': '60 Hz',
      'Display Tech': 'LED with Auto-backlight dimming',
      'Connectivity': 'Dual-band Wi-Fi, Ethernet, Bluetooth 5.0'
    },
    reviews: [
      { author: 'Kevin Cooke', rating: 5, comment: 'Unbeatable value. Standard streaming is fast, colors look vibrant, UI is lag-free.', date: 'May 12, 2026' }
    ],
    bestseller: true,
    isSubscriptionEligible: false
  },
  {
    id: 'e2',
    name: 'SonicWave Noise-Cancelling Wireless Earbuds Pro',
    price: 69.99,
    originalPrice: 89.99,
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'SonicWave',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    reviewCount: 1622,
    stock: 28,
    deliveryEstimate: 'Today, within 4h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Active Noise Cancellation combined with dynamic dual-driver high-fidelity audio output. Ergonomic water-resistant earbuds engineered for active lifestyles.',
    features: ['Active Hybrid ANC (blocks up to 35dB)', 'Up to 36 Hours total playback playtime with charging pods', 'IPX5 Sweat and Water Proof structure', 'Intelligent smart-touch controls'],
    specs: {
      'Driver Size': '10mm dual-diaphragm',
      'Bluetooth Version': 'v5.3 Low Delay',
      'Battery Capacity': '420mAh pod, 50mAh per bud'
    },
    reviews: [],
    isSubscriptionEligible: false
  },
  {
    id: 'e3',
    name: 'HyperCharge Pro 3-in-1 Magnetic Wireless Station',
    price: 34.50,
    category: 'Electronics',
    subCategory: 'Accessories',
    brand: 'HyperCharge',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    reviewCount: 5310,
    stock: 15,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Eliminate charger mess. Simultaneously fast charge your mobile smartphone, magnetic smartwatch, and wireless earbud tray in a single weighted stand.',
    features: ['15W Mag-Safe certified swift charging', 'Weighted anti-slide stand', 'Built-in intelligent safety control chip overcharge protection'],
    specs: {
      'Output Ports': 'Wireless charging pads (x3)',
      'Total Output Power': '25W Max',
      'Package Includes': '3-in-1 Stand, USB-C 4ft mesh cord, 30W QC3.0 Power brick'
    },
    reviews: [],
    isSubscriptionEligible: false
  },

  // --- HOME & KITCHEN ---
  {
    id: 'h1',
    name: 'Thermosyphon Dual-Basket Intelligent Air Fryer (8.5 Qt)',
    price: 89.00,
    originalPrice: 119.00,
    category: 'Home',
    subCategory: 'Appliances',
    brand: 'Thermosyphon',
    image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviewCount: 4210,
    stock: 22,
    deliveryEstimate: 'Tomorrow afternoon',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Futuristic cooking tech. Two independent rapid-heat baskets let you cook 2 foods, 2 ways, and sync the finish time instantly.',
    features: ['8.5-quart massive family capacity split', 'DualZone technology cooks independently', '6-in-1 presets: Air Fry, Roast, Dehydrate, Bake, Reheat, Crisp', 'Nonstick, dishwasher safe baskets'],
    specs: {
      'Wattage': '1800-Watts',
      'Product Weight': '14.2 lbs',
      'Safety': 'Auto-shutoff on basket separation'
    },
    reviews: [],
    bestseller: true,
    isSubscriptionEligible: false
  },
  {
    id: 'h2',
    name: 'SleepWell Premium Cooling Memory Foam Pillow',
    price: 24.88,
    category: 'Home',
    subCategory: 'Bedding',
    brand: 'SleepWell',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=300&q=80',
    rating: 4.5,
    reviewCount: 310,
    stock: 120,
    deliveryEstimate: 'Today, within 4h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Wake up fully refreshed. Ergonomically shaped pressure-relieving memory foam pillow layered with proprietary soothing cooling gel panels.',
    features: ['Cooling gel infused dynamic memory foam', 'Removable, premium cooling-weave cover', 'Supports side, back, and stomach sleepers'],
    specs: {
      'Dimension': 'Standard (26" x 16" x 5")',
      'Cover Material': 'Hypoallergenic Bamboo-Sateen Blend'
    },
    reviews: [],
    isSubscriptionEligible: false
  },
  {
    id: 'h3',
    name: 'ClearCare Stackable Heavy Duty Clear Storage Bins (6-Pack)',
    price: 29.96,
    originalPrice: 34.96,
    category: 'Home',
    subCategory: 'Organization',
    brand: 'ClearCare',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    reviewCount: 1540,
    stock: 54,
    deliveryEstimate: 'Tomorrow morning',
    pickupAvailable: false,
    deliveryAvailable: true,
    description: 'Rugged modular organization containers. Airtight secure latches keep humidity and dust out of your seasonal goods.',
    features: ['Ultra-clear visual walls make identifying easy', 'Extra strong nesting snap lids', 'Reinforced impact-resistant polymer body'],
    specs: {
      'Capacity': '32 Quarts each',
      'Outer Dimensions': '18.1" L x 12.2" W x 9.8" H',
      'Package Qty': '6 Containers with Lids'
    },
    reviews: [],
    isSubscriptionEligible: false
  },

  // --- CLOTHING ---
  {
    id: 'c1',
    name: 'Apex Comfort Stretch Performance Active Shorts',
    price: 14.96,
    category: 'Clothing',
    subCategory: 'Mens',
    brand: 'Apex Athletics',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=300&q=80',
    rating: 4.3,
    reviewCount: 890,
    stock: 200,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Engineered for extreme motion comfort. Moisture-wicking ultra-light fabrication with secure zipper device pockets.',
    features: ['Lightweight four-way stretch weave', 'Mesh airflow lining zone', 'Deep pockets', 'Anti-odor protection tech'],
    specs: {
      'Material': '88% Recycled Polyester, 12% Spandex',
      'Inseam': '7 Inches',
      'Sizes Offered': 'S, M, L, XL, XXL'
    },
    reviews: [],
    isSubscriptionEligible: false
  },
  {
    id: 'c2',
    name: 'OmniWeave Classic Ring-Spun Cotton Crew Tees (5-Pack)',
    price: 18.50,
    originalPrice: 22.00,
    category: 'Clothing',
    subCategory: 'Mens Basics',
    brand: 'OmniWeave',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    reviewCount: 3120,
    stock: 450,
    deliveryEstimate: 'Today, within 4h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Ultra-soft, heavyweight pre-shrunk cotton tees. Flat-seamed collar keeps its fit collar ribbing after hundreds of washes.',
    features: ['100% premium combed ring-spun cotton', 'Tagless design for comfort', 'Reinforced neck tape lines'],
    specs: {
      'Colors': 'Solid Black, Grey, White, Navy, Olive',
      'Fit': 'Modern Relaxed Fit'
    },
    reviews: [],
    bestseller: true,
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 5
  },

  // --- PHARMACY ---
  {
    id: 'p1',
    name: 'MediGuard Acetaminophen Pain Reliever 500mg (100 Caplets)',
    price: 3.96,
    category: 'Pharmacy',
    subCategory: 'Over-The-Counter',
    brand: 'MediGuard',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviewCount: 4120,
    stock: 300,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Rapid-release extra strength pain reducer and fever reducer caplets.',
    features: ['Comparable to active ingredients in leading brands', 'Easy-swallow smooth coat caplets', 'Child-resistant container safety top'],
    specs: {
      'Count': '100 Caplets',
      'Dosage': '500 mg per caplet',
      'Expiry Guarantee': 'Minimum 18+ month shelf life'
    },
    reviews: [],
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 12
  },
  {
    id: 'p2',
    name: 'BioDaily Smart Complete Adult Multivitamin Gummy (150ct)',
    price: 12.98,
    category: 'Pharmacy',
    subCategory: 'Vitamins',
    brand: 'BioDaily',
    image: 'https://images.unsplash.com/photo-1611010343333-b96472d2d5a1?auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    reviewCount: 1980,
    stock: 140,
    deliveryEstimate: 'Today, within 2h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Delicious, comprehensive multi-nutrient chew gummies naturally flavored with cherry, berry, and orange extracts.',
    features: ['Contains critical Vitamins A, C, D, E, B6, B12, Zinc & Folic Acid', 'No high fructose corn syrup or synthetic dyes', 'Gelatin-free vegan formulation'],
    specs: {
      'Count': '150 Gummies',
      'Servings': '75 Days supply',
      'Flavors': 'Natural Mixed Berry'
    },
    reviews: [],
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 15
  },

  // --- AUTO & HARDWARE ---
  {
    id: 'a1',
    name: 'IronForge 142-Piece Home Repair Tool Set & Case',
    price: 38.99,
    originalPrice: 49.99,
    category: 'Auto & Hardware',
    subCategory: 'Hand Tools',
    brand: 'IronForge',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    reviewCount: 830,
    stock: 25,
    deliveryEstimate: 'Tomorrow morning',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Comprehensive mechanical tools designed for homeowner tasks. High-grade induction hardened chrome-vanadium steel bits.',
    features: ['Includes hammer, pliers, screwdrivers, socket set, tape, and precision hexes', 'Durable rugged molded storage carrying case', 'Ergonomic non-slip grips'],
    specs: {
      'Material': 'Chrome Vanadium Alloy Steel',
      'Case Size': '15" x 11.5" x 3.2"',
      'Warranty': 'Lifetime Limited Manufacturer Warranty'
    },
    reviews: [],
    isSubscriptionEligible: false
  },
  {
    id: 'a2',
    name: 'CarbonFlow Synthetic Motor Oil 5W-30 (5 Quart)',
    price: 22.48,
    category: 'Auto & Hardware',
    subCategory: 'Auto Care',
    brand: 'CarbonFlow',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviewCount: 3122,
    stock: 80,
    deliveryEstimate: 'Today, within 4h',
    pickupAvailable: true,
    deliveryAvailable: true,
    description: 'Full synthetic formulation maximizes engine life and protects against sludge build-up in high-velocity conditions.',
    features: ['Ensures low-friction operations and limits thermal wear', 'Excellent cold-weather flow rates on startup', 'Meets API SP & ILSAC GF-6A industry standards'],
    specs: {
      'Volume': '5 Quarts',
      'Viscosity': '5W-30',
      'Oil Type': 'Full Synthetic'
    },
    reviews: [],
    isSubscriptionEligible: true,
    subscriptionDiscountPercent: 8
  }
];

export const mockCoupons: Coupon[] = [
  {
    code: 'USARETAIL20',
    discountType: 'percent',
    value: 20,
    description: '20% off all Electronics (minimum $100 spent)',
    minimumSpend: 100,
    eligibleCategory: 'Electronics'
  },
  {
    code: 'GROCERY5',
    discountType: 'fixed',
    value: 5,
    description: '$5.00 off any Groceries order $30+',
    minimumSpend: 30,
    eligibleCategory: 'Groceries'
  },
  {
    code: 'OMNISAVE',
    discountType: 'percent',
    value: 10,
    description: '10% off storewide (minimum $50 spent)',
    minimumSpend: 50
  }
];

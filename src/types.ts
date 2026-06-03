export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For deals
  category: string;
  subCategory?: string;
  brand: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number; // For low stock displays
  deliveryEstimate: string; // e.g., "Today, 2-hour window", "Tomorrow", "Next-day"
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  description: string;
  features: string[];
  specs: Record<string, string>;
  reviews: Record<string, any>[];
  bestseller?: boolean;
  frequentlyBoughtTogether?: string[]; // list of product IDs
  isSubscriptionEligible: boolean;
  subscriptionDiscountPercent?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription: boolean;
  subscriptionIntervalWeeks?: number; // e.g., 1, 2, 4, 8 weeks
}

export interface HouseholdProfile {
  id: string;
  name: string;
  role: 'Primary' | 'Partner' | 'Kid' | 'Guest';
  avatarColor: string; // e.g., "bg-blue-500"
  selectedCategories: string[];
  dietaryPreferences: string[];
  frequentItems: string[]; // Product IDs
}

export interface HouseholdSubscription {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  intervalWeeks: number;
  nextDeliveryDate: string;
  quantity: number;
  status: 'Active' | 'Paused';
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  description: string;
  minimumSpend: number;
  eligibleCategory?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';
  deliveryMethod: 'delivery' | 'pickup';
  address: string;
  scheduledTime: string;
  driverName?: string;
  driverPhone?: string;
  driverCoordinates?: { x: number; y: number }; // Percentage coords 0-100 on our custom SVG map
  driverStateMessage?: string;
}

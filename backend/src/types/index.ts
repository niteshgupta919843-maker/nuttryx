export interface ProductNutrition {
  proteinPer100g: string;
  proteinPerServing: string;
  caloriesPerServing: string;
  dietaryFibre: string;
  sugarAdded: string;
}

export interface ProductSize {
  weight: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

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
  sizes: ProductSize[];
  nutrition: ProductNutrition;
  ingredients: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
}

export interface OrderCustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'razorpay' | 'upi' | 'card' | 'cod';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'cod';
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
}

export interface SampleRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  selectedFlavour: string;
  status?: 'pending' | 'dispatched' | 'delivered';
  createdAt: string;
}


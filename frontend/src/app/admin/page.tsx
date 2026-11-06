'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Package, 
  ShoppingCart, 
  Gift, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Truck, 
  ArrowUpRight,
  Filter,
  Eye,
  LogOut,
  LayoutDashboard,
  Settings,
  Bell,
  Check,
  RefreshCw,
  Database,
  SlidersHorizontal,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Lock,
  ShieldCheck,
  EyeOff,
  Printer,
  X,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Loader2,
  HelpCircle,
  Award,
  Heart,
  Leaf,
  Dumbbell,
  CheckCircle2,
  Star,
  MessageSquareHeart
} from 'lucide-react';
import { PRODUCTS, Product } from '@/data/products';

interface MockOrder {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  items: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  paymentMethod?: string;
  paymentStatus?: string;
  paymentId?: string;
  date: string;
}

interface MockSample {
  id: string;
  name: string;
  phone: string;
  city: string;
  flavour: string;
  date: string;
  status: 'Received' | 'Dispatched' | 'Delivered';
}

interface MockSlide {
  id: string;
  name: string;
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  bannerImage: string;
  badge1: string;
  badge2: string;
  badge3: string;
  buttonText: string;
  buttonLink: string;
  sampleButtonText: string;
  order: number;
  isActive: boolean;
}

const INITIAL_SLIDES_LIST: MockSlide[] = [
  {
    id: 'slide-dark-chocolate',
    name: 'Dark Chocolate Peanut Butter',
    subtitle: 'PURE PEANUT BUTTER',
    titleLine1: 'Creamy. Roasted.',
    titleLine2: 'Protein Rich.',
    description: 'Fuel your fitness, work, and daily life with the natural power of real peanuts.',
    bannerImage: '/images/hero-bg-dark-chocolate.jpg',
    badge1: 'HIGH\nPROTEIN',
    badge2: 'NO ADDED\nSUGAR',
    badge3: '100%\nNATURAL',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    order: 1,
    isActive: true
  },
  {
    id: 'slide-creamy',
    name: 'Natural Creamy Peanut Butter',
    subtitle: '100% PURE & NATURAL',
    titleLine1: 'Silky Smooth.',
    titleLine2: 'Zero Added Sugar.',
    description: 'Handcrafted from slow-roasted Saurashtra peanuts for an ultra-smooth, creamy texture.',
    bannerImage: '/images/hero-bg-creamy.jpg',
    badge1: 'HIGH\nPROTEIN',
    badge2: 'NO ADDED\nSUGAR',
    badge3: '100%\nNATURAL',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    order: 2,
    isActive: true
  },
  {
    id: 'slide-crunchy',
    name: 'Roasted Crunchy Peanut Butter',
    subtitle: 'EXTRA CRUNCH & FIBER',
    titleLine1: 'Bold Crunch.',
    titleLine2: 'Power Packed.',
    description: 'Loaded with real crispy roasted peanut bits in every spoonful for high-protein workouts.',
    bannerImage: '/images/hero-bg-crunchy.jpg',
    badge1: 'HIGH\nPROTEIN',
    badge2: 'NO ADDED\nSUGAR',
    badge3: '100%\nNATURAL',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    order: 3,
    isActive: true
  }
];

const INITIAL_ORDERS: MockOrder[] = [
  { id: 'NUTX-892102', customerName: 'Rajesh Malhotra', phone: '+91 98201 44512', city: 'Mumbai', items: 'Dark Chocolate (1kg) x 1', total: 599, status: 'Shipped', date: 'Today, 2:40 PM' },
  { id: 'NUTX-892101', customerName: 'Sneha Patel', phone: '+91 99042 11203', city: 'Ahmedabad', items: 'Natural Creamy (500g) x 2', total: 598, status: 'Delivered', date: 'Yesterday' },
  { id: 'NUTX-892100', customerName: 'Vikram Sundaram', phone: '+91 98450 77312', city: 'Bengaluru', items: 'Crunchy Roasted (1kg) x 1', total: 549, status: 'Pending', date: 'Today, 11:15 AM' },
  { id: 'NUTX-892099', customerName: 'Ananya Sharma', phone: '+91 98110 33491', city: 'Delhi NCR', items: 'Dark Chocolate (500g) x 1', total: 329, status: 'Delivered', date: '28 Oct' },
];

const INITIAL_SAMPLES: MockSample[] = [
  { id: 'SMP-1042', name: 'Kabir Verma', phone: '+91 98765 43210', city: 'Pune', flavour: 'Dark Chocolate 50g', date: 'Today, 3:10 PM', status: 'Received' },
  { id: 'SMP-1041', name: 'Divya Rao', phone: '+91 97123 45678', city: 'Hyderabad', flavour: 'Natural Creamy 50g', date: 'Today, 1:20 PM', status: 'Dispatched' },
  { id: 'SMP-1040', name: 'Amit Joshi', phone: '+91 99887 76655', city: 'Jaipur', flavour: 'Crunchy Roasted 50g', date: 'Yesterday', status: 'Dispatched' },
];

export interface MockFaq {
  id: string;
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface MockCraftStep {
  id: string;
  num: string;
  subtitle: string;
  title: string;
  desc: string;
  icon: string;
  order: number;
  isActive?: boolean;
}

export interface MockLifestylePillar {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  perk: string;
  order?: number;
  isActive?: boolean;
}

export interface MockBenefitRow {
  id: string;
  feature: string;
  nuttryx: string;
  regular: string;
  nuttryxWins?: boolean;
  order?: number;
  isActive?: boolean;
}

export interface MockReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  flavour: string;
  isVerified?: boolean;
  isActive?: boolean;
  order?: number;
}

const ADMIN_SECRET = 'Admin@2026N';
const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://nuttryx.onrender.com').replace(/\/$/, '');

export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'samples' | 'sliders' | 'ticker' | 'faqs' | 'craft' | 'lifestyle' | 'benefit' | 'reviews' | 'settings'>('dashboard');
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [ordersList, setOrdersList] = useState<MockOrder[]>(INITIAL_ORDERS);
  const [samplesList, setSamplesList] = useState<MockSample[]>(INITIAL_SAMPLES);
  const [slidesList, setSlidesList] = useState<MockSlide[]>(INITIAL_SLIDES_LIST);

  // FAQs State
  const [faqsList, setFaqsList] = useState<MockFaq[]>([]);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('All');
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<MockFaq | null>(null);
  const [faqFormQuestion, setFaqFormQuestion] = useState('');
  const [faqFormAnswer, setFaqFormAnswer] = useState('');
  const [faqFormCategory, setFaqFormCategory] = useState('Purity & Quality');
  const [faqFormOrder, setFaqFormOrder] = useState<number>(1);
  const [faqFormIsActive, setFaqFormIsActive] = useState<boolean>(true);
  const [isSavingFaq, setIsSavingFaq] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<MockFaq | null>(null);

  // Craft Steps State (Our Story)
  const [craftBadge, setCraftBadge] = useState('Our Story • The Pure Craft');
  const [craftHeading, setCraftHeading] = useState('From Gujarat Soil to Your Spoon');
  const [craftDesc, setCraftDesc] = useState('No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition.');
  const [craftSteps, setCraftSteps] = useState<MockCraftStep[]>([]);
  const [isSavingCraftHeader, setIsSavingCraftHeader] = useState(false);
  const [isCraftStepModalOpen, setIsCraftStepModalOpen] = useState(false);
  const [editingCraftStep, setEditingCraftStep] = useState<MockCraftStep | null>(null);
  const [stepFormNum, setStepFormNum] = useState('01');
  const [stepFormSubtitle, setStepFormSubtitle] = useState('');
  const [stepFormTitle, setStepFormTitle] = useState('');
  const [stepFormDesc, setStepFormDesc] = useState('');
  const [stepFormIcon, setStepFormIcon] = useState('Sparkles');
  const [stepFormOrder, setStepFormOrder] = useState(1);
  const [stepFormIsActive, setStepFormIsActive] = useState(true);
  const [isSavingCraftStep, setIsSavingCraftStep] = useState(false);

  // Lifestyle Audience & Pillars State
  const [lifestyleBadge, setLifestyleBadge] = useState('Built For Every Lifestyle');
  const [lifestyleHeading, setLifestyleHeading] = useState('Who Is NUTTRYX Crafted For?');
  const [lifestyleDesc, setLifestyleDesc] = useState('From high-performance gym workouts to busy laptop desks and school lunchboxes, our pure peanut butter fuels your daily journey.');
  const [lifestylePillars, setLifestylePillars] = useState<MockLifestylePillar[]>([]);
  const [isSavingLifestyleHeader, setIsSavingLifestyleHeader] = useState(false);
  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<MockLifestylePillar | null>(null);
  const [pillarFormIcon, setPillarFormIcon] = useState('Dumbbell');
  const [pillarFormTitle, setPillarFormTitle] = useState('');
  const [pillarFormSubtitle, setPillarFormSubtitle] = useState('');
  const [pillarFormDesc, setPillarFormDesc] = useState('');
  const [pillarFormPerk, setPillarFormPerk] = useState('');
  const [pillarFormOrder, setPillarFormOrder] = useState(1);
  const [pillarFormIsActive, setPillarFormIsActive] = useState(true);
  const [isSavingPillar, setIsSavingPillar] = useState(false);

  // Benefit & Comparison Section State
  const [benefitBadge, setBenefitBadge] = useState('The Clean Label Revolution');
  const [benefitHeading, setBenefitHeading] = useState('Why NUTTRYX Wins Hands Down');
  const [benefitDesc, setBenefitDesc] = useState(
    'We started NUTTRYX because Indian fitness enthusiasts and families deserve genuine, unadulterated peanut butter without toxic palm oil and excessive sugars.'
  );
  const [benefitFooterBanner, setBenefitFooterBanner] = useState(
    'Certified under FSSAI regulations and tested in NABL accredited food testing laboratories.'
  );
  const [benefitFooterLinkText, setBenefitFooterLinkText] = useState('Try Pure Taste →');
  const [benefitFooterLinkUrl, setBenefitFooterLinkUrl] = useState('#products');
  const [benefitRows, setBenefitRows] = useState<MockBenefitRow[]>([]);
  const [isSavingBenefitHeader, setIsSavingBenefitHeader] = useState(false);
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [editingBenefitRow, setEditingBenefitRow] = useState<MockBenefitRow | null>(null);
  const [benefitFormFeature, setBenefitFormFeature] = useState('');
  const [benefitFormNuttryx, setBenefitFormNuttryx] = useState('');
  const [benefitFormRegular, setBenefitFormRegular] = useState('');
  const [benefitFormOrder, setBenefitFormOrder] = useState(1);
  const [benefitFormIsActive, setBenefitFormIsActive] = useState(true);
  const [isSavingBenefitRow, setIsSavingBenefitRow] = useState(false);

  // Customer Reviews State
  const [reviewsList, setReviewsList] = useState<MockReview[]>([]);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<MockReview | null>(null);
  const [reviewFormName, setReviewFormName] = useState('');
  const [reviewFormRole, setReviewFormRole] = useState('');
  const [reviewFormRating, setReviewFormRating] = useState(5);
  const [reviewFormFlavour, setReviewFormFlavour] = useState('Dark Chocolate Peanut Butter');
  const [reviewFormComment, setReviewFormComment] = useState('');
  const [reviewFormIsVerified, setReviewFormIsVerified] = useState(true);
  const [reviewFormIsActive, setReviewFormIsActive] = useState(true);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<MockReview | null>(null);

  const [tickerItems, setTickerItems] = useState<string[]>([
    '🔥 100% Slow Roasted Saurashtra Peanuts',
    '💪 30g Pure Plant Protein',
    '🚫 Zero Added Refined Sugar',
    '🌿 Zero Palm Oil or Trans Fats',
    '🌱 100% Pure Vegetarian Certified',
    '🚚 Free Express Shipping Over ₹499',
    '🎁 Free 50g Sample with Every Order',
    '🇮🇳 Made with Pride in India'
  ]);
  const [newTickerText, setNewTickerText] = useState('');
  const [isSavingTicker, setIsSavingTicker] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    companyName: 'NUTTRYX Foods Pvt Ltd',
    factoryAddress: 'NUTTRYX Foods Pvt Ltd, GIDC Agro Park, Rajkot - Saurashtra, Gujarat 360003',
    googleMapsUrl: 'https://maps.google.com/?q=GIDC+Agro+Park+Rajkot+Gujarat+360003',
    supportPhone: '+91 98765 43210',
    supportHours: '(Mon - Sat, 10am - 7pm)',
    supportEmail: 'care@nuttryx.com',
    fssaiNumber: '11524999000123',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    twitterUrl: 'https://twitter.com',
    youtubeUrl: 'https://youtube.com',
    whatsappNumber: '+91 98765 43210'
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Pending' | 'Shipped' | 'Delivered'>('All');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'paid' | 'cod'>('All');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderId = (id: string) => {
    try {
      navigator.clipboard?.writeText(id);
      setCopiedOrderId(id);
      showToast(`Order ID #${id} copied to clipboard!`);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } catch {
      // fallback
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const renderItemChips = (itemsStr: string) => {
    if (!itemsStr) return <span style={{ color: '#9E8C80', fontStyle: 'italic', fontSize: '0.8rem' }}>No items listed</span>;
    const items = itemsStr.split(',').map(s => s.trim()).filter(Boolean);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {items.map((item, idx) => (
          <span 
            key={idx} 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#2A180E',
              background: '#F8F5F0',
              border: '1px solid #ECE2D5',
              padding: '3px 9px',
              borderRadius: '6px',
              width: 'fit-content',
              lineHeight: 1.3
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>🥜</span> {item}
          </span>
        ))}
      </div>
    );
  };

  // New product form modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'protein' | 'chocolate' | 'combos'>('protein');
  const [newProductPrice, setNewProductPrice] = useState(299);
  const [newProductWeight, setNewProductWeight] = useState('500g');
  const [newProductImage, setNewProductImage] = useState<string>('/images/creamy-peanut-butter.jpg');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [uploadFileName, setUploadFileName] = useState<string>('');

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductSubtitle, setEditProductSubtitle] = useState('');
  const [editProductPrice, setEditProductPrice] = useState(299);
  const [editProductCategory, setEditProductCategory] = useState<'all' | 'protein' | 'chocolate' | 'combos'>('protein');
  const [editProductWeight, setEditProductWeight] = useState('500g');
  const [editProductImage, setEditProductImage] = useState<string>('/images/creamy-peanut-butter.jpg');
  const [editImageInputMode, setEditImageInputMode] = useState<'upload' | 'url'>('upload');
  const [editUploadFileName, setEditUploadFileName] = useState<string>('');

  // Delete confirmation modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Invoice modal state
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<MockOrder | null>(null);

  // Hero Slider modal state
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<MockSlide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<MockSlide | null>(null);

  // Form fields for Hero Slide
  const [slideName, setSlideName] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('PURE PEANUT BUTTER');
  const [slideTitle1, setSlideTitle1] = useState('Creamy. Roasted.');
  const [slideTitle2, setSlideTitle2] = useState('Protein Rich.');
  const [slideDesc, setSlideDesc] = useState('Fuel your fitness, work, and daily life with the natural power of real peanuts.');
  const [slideImage, setSlideImage] = useState('/images/hero-bg-dark-chocolate.jpg');
  const [slideBadge1, setSlideBadge1] = useState('HIGH\nPROTEIN');
  const [slideBadge2, setSlideBadge2] = useState('NO ADDED\nSUGAR');
  const [slideBadge3, setSlideBadge3] = useState('100%\nNATURAL');
  const [slideBtnText, setSlideBtnText] = useState('Shop Now');
  const [slideBtnLink, setSlideBtnLink] = useState('/shop');
  const [slideSampleBtnText, setSlideSampleBtnText] = useState('Book 50g Sample');
  const [slideImageMode, setSlideImageMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [slideImageFileName, setSlideImageFileName] = useState<string>('');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Computed analytics & filtered views
  const totalOrdersCount = ordersList.length;
  const pendingOrdersCount = ordersList.filter(o => o.status === 'Pending').length;
  const shippedOrdersCount = ordersList.filter(o => o.status === 'Shipped').length;
  const deliveredOrdersCount = ordersList.filter(o => o.status === 'Delivered').length;
  const totalRevenue = ordersList.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const paidOrdersCount = ordersList.filter(o => o.paymentStatus === 'paid').length;
  const codOrdersCount = ordersList.filter(o => o.paymentStatus !== 'paid').length;

  const filteredOrders = ordersList.filter(order => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.phone.toLowerCase().includes(q) ||
      order.city.toLowerCase().includes(q) ||
      order.items.toLowerCase().includes(q);

    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    const matchesPayment = paymentFilter === 'All' || 
      (paymentFilter === 'paid' ? order.paymentStatus === 'paid' : order.paymentStatus !== 'paid');

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const filteredSamples = samplesList.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.flavour.toLowerCase().includes(q);
  });

  // Restore admin session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('nuttryx_admin_token') || localStorage.getItem('nuttryx_admin_token');
      if (saved === ADMIN_SECRET || saved === 'Admin@2026N' || saved === 'Nuttryx@Admin2026') {
        setIsAdminAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError('');

    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: adminPasscode })
      });
      const data = await res.json();
      if (data.success) {
        const tokenToStore = data.adminToken || adminPasscode || ADMIN_SECRET;
        sessionStorage.setItem('nuttryx_admin_token', tokenToStore);
        setIsAdminAuthenticated(true);
        showToast('Admin access verified!');
      } else {
        setAdminError(data.message || 'Incorrect passcode.');
      }
    } catch {
      if (adminPasscode === ADMIN_SECRET || adminPasscode === 'Admin@2026N' || adminPasscode === 'Nuttryx@Admin2026') {
        sessionStorage.setItem('nuttryx_admin_token', adminPasscode);
        setIsAdminAuthenticated(true);
        showToast('Admin access verified!');
      } else {
        setAdminError('Incorrect passcode.');
      }
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('nuttryx_admin_token');
    localStorage.removeItem('nuttryx_admin_token');
    setIsAdminAuthenticated(false);
    showToast('Admin session closed.');
  };

  // Sync with MongoDB backend for Orders, Samples & Products
  const syncWithBackend = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      // 1. Fetch live orders (Admin protected)
      const ordersRes = await fetch('/api/orders', {
        headers: { 'x-admin-secret': ADMIN_SECRET }
      });
      if (ordersRes.ok) {
        const ordersJson = await ordersRes.json();
        if (ordersJson.success && Array.isArray(ordersJson.data) && ordersJson.data.length > 0) {
          const mapped: MockOrder[] = ordersJson.data.map((o: any) => ({
            id: o.id,
            customerName: o.customer?.name || 'Customer',
            phone: o.customer?.phone || '',
            city: `${o.customer?.city || 'India'} (${o.customer?.pincode || ''})`,
            items: Array.isArray(o.items) 
              ? o.items.map((it: any) => `${it.product?.name || 'Peanut Butter'} (${it.selectedSize?.weight || '500g'}) x ${it.quantity}`).join(', ')
              : 'Nuttryx Pure Peanut Butter',
            total: o.total,
            status: o.status === 'delivered' ? 'Delivered' : o.status === 'shipped' ? 'Shipped' : 'Pending',
            paymentMethod: o.paymentMethod || 'cod',
            paymentStatus: o.paymentStatus || 'cod',
            paymentId: o.paymentId || '',
            date: o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'
          }));
          setOrdersList(mapped);
          setDbConnected(true);
        }
      }

      // 2. Fetch live free sample requests (Admin protected)
      const samplesRes = await fetch('/api/samples', {
        headers: { 'x-admin-secret': ADMIN_SECRET }
      });
      if (samplesRes.ok) {
        const samplesJson = await samplesRes.json();
        if (samplesJson.success && Array.isArray(samplesJson.data) && samplesJson.data.length > 0) {
          const mappedSamples: MockSample[] = samplesJson.data.map((s: any) => ({
            id: s.id,
            name: s.name,
            phone: s.phone,
            city: `${s.city || 'India'} - ${s.pincode || ''}`,
            flavour: s.selectedFlavour || 'Dark Chocolate 50g',
            date: s.createdAt ? new Date(s.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today',
            status: s.status === 'dispatched' ? 'Dispatched' : s.status === 'delivered' ? 'Delivered' : 'Received'
          }));
          setSamplesList(mappedSamples);
        }
      }

      // 3. Fetch products catalog
      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const prodJson = await productsRes.json();
        if (prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
          setProductsList(prodJson.data);
        }
      }

      // 4. Fetch hero slides (always cache-busting to reflect instant updates)
      let slidesRes = await fetch(`/api/slides?_t=${Date.now()}`, { cache: 'no-store' });
      if (!slidesRes.ok) {
        slidesRes = await fetch(`${BACKEND_BASE}/api/slides?_t=${Date.now()}`, { cache: 'no-store' });
      }
      if (slidesRes.ok) {
        const slideJson = await slidesRes.json();
        if (slideJson.success && Array.isArray(slideJson.data) && slideJson.data.length > 0) {
          setSlidesList(slideJson.data);
        }
      }

      // 5. Fetch marquee ticker items (always fresh)
      try {
        let tickerRes = await fetch(`/api/ticker?_t=${Date.now()}`, { cache: 'no-store' });
        if (!tickerRes.ok) {
          tickerRes = await fetch(`${BACKEND_BASE}/api/ticker?_t=${Date.now()}`, { cache: 'no-store' });
        }
        if (tickerRes.ok) {
          const tickerJson = await tickerRes.json();
          if (tickerJson.success && Array.isArray(tickerJson.data) && tickerJson.data.length > 0) {
            setTickerItems(tickerJson.data);
          }
        }
      } catch {
        // offline resilience
      }

      // 6. Fetch store & factory settings
      try {
        let settingsRes = await fetch(`/api/settings?_t=${Date.now()}`, { cache: 'no-store' });
        if (!settingsRes.ok) {
          settingsRes = await fetch(`${BACKEND_BASE}/api/settings?_t=${Date.now()}`, { cache: 'no-store' });
        }
        if (settingsRes.ok) {
          const settingsJson = await settingsRes.json();
          if (settingsJson.success && settingsJson.data) {
            setStoreSettings(prev => ({
              ...prev,
              ...settingsJson.data
            }));
          }
        }
      } catch {
        // offline resilience
      }

      // 7. Fetch FAQs
      try {
        let faqsRes = await fetch(`/api/faqs/admin?_t=${Date.now()}`, { cache: 'no-store' });
        if (!faqsRes.ok) {
          faqsRes = await fetch(`${BACKEND_BASE}/api/faqs/admin?_t=${Date.now()}`, { cache: 'no-store' });
        }
        if (faqsRes.ok) {
          const faqsJson = await faqsRes.json();
          if (faqsJson.success && Array.isArray(faqsJson.data)) {
            setFaqsList(faqsJson.data);
          }
        }
      } catch {
        // offline resilience
      }

      // 8. Fetch Craft Process Story
      try {
        let craftRes = await fetch(`/api/craft?_t=${Date.now()}`, { cache: 'no-store' });
        if (!craftRes.ok) {
          craftRes = await fetch(`${BACKEND_BASE}/api/craft?_t=${Date.now()}`, { cache: 'no-store' });
        }
        if (craftRes.ok) {
          const craftJson = await craftRes.json();
          if (craftJson.success && craftJson.data) {
            setCraftBadge(craftJson.data.badge || 'The Pure Craft');
            setCraftHeading(craftJson.data.heading || 'From Gujarat Soil to Your Spoon');
            setCraftDesc(craftJson.data.description || 'No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition.');
            if (Array.isArray(craftJson.data.steps)) {
              setCraftSteps(craftJson.data.steps);
            }
          }
        }
      } catch {
        // offline resilience
      }

      // 9. Fetch Lifestyle Section
      try {
        let lifeRes = await fetch(`/api/lifestyle?_t=${Date.now()}`, { cache: 'no-store' });
        if (!lifeRes.ok) {
          lifeRes = await fetch(`${BACKEND_BASE}/api/lifestyle?_t=${Date.now()}`, { cache: 'no-store' });
        }
        if (lifeRes.ok) {
          const lifeJson = await lifeRes.json();
          if (lifeJson.success && lifeJson.data) {
            setLifestyleBadge(lifeJson.data.badge || 'Built For Every Lifestyle');
            setLifestyleHeading(lifeJson.data.heading || 'Who Is NUTTRYX Crafted For?');
            setLifestyleDesc(lifeJson.data.description || 'From high-performance gym workouts to busy laptop desks and school lunchboxes, our pure peanut butter fuels your daily journey.');
            if (Array.isArray(lifeJson.data.pillars)) {
              setLifestylePillars(lifeJson.data.pillars);
            }
          }
        }
      } catch {
        // offline resilience
      }

      // 10. Fetch Benefit Section (Comparison Table)
      try {
        let benRes = await fetch(`/api/benefit?_t=${Date.now()}`, { cache: 'no-store' });
        if (!benRes.ok) {
          benRes = await fetch(`${BACKEND_BASE}/api/benefit?_t=${Date.now()}`, { cache: 'no-store' });
        }
        if (benRes.ok) {
          const benJson = await benRes.json();
          if (benJson.success && benJson.data) {
            setBenefitBadge(benJson.data.badge || 'The Clean Label Revolution');
            setBenefitHeading(benJson.data.heading || 'Why NUTTRYX Wins Hands Down');
            setBenefitDesc(benJson.data.description || 'We started NUTTRYX because Indian fitness enthusiasts and families deserve genuine, unadulterated peanut butter without toxic palm oil and excessive sugars.');
            setBenefitFooterBanner(benJson.data.footerBanner || 'Certified under FSSAI regulations and tested in NABL accredited food testing laboratories.');
            setBenefitFooterLinkText(benJson.data.footerLinkText || 'Try Pure Taste →');
            setBenefitFooterLinkUrl(benJson.data.footerLinkUrl || '#products');
            if (Array.isArray(benJson.data.rows)) {
              setBenefitRows(benJson.data.rows);
            }
          }
        }
      } catch {
        // offline resilience
      }

      // 11. Fetch Customer Reviews
      try {
        let revRes = await fetch(`/api/reviews?admin=true&_t=${Date.now()}`, { cache: 'no-store' });
        if (!revRes.ok) {
          revRes = await fetch(`${BACKEND_BASE}/api/reviews?admin=true&_t=${Date.now()}`, { cache: 'no-store' });
        }
        if (revRes.ok) {
          const revJson = await revRes.json();
          if (revJson.success && Array.isArray(revJson.data)) {
            setReviewsList(revJson.data);
          }
        }
      } catch {
        // offline resilience
      }

      if (!silent) showToast('⚡ Live sync completed successfully!');
    } catch {
      setDbConnected(false);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    syncWithBackend(true);
    const interval = setInterval(() => {
      syncWithBackend(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [syncWithBackend, isAdminAuthenticated]);

  const handleStatusChange = async (orderId: string, newStatus: 'Pending' | 'Shipped' | 'Delivered') => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} updated to ${newStatus}`);

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
      });
    } catch {
      // offline resilience
    }
  };

  const handleSampleStatusToggle = async (sampleId: string) => {
    const current = samplesList.find(s => s.id === sampleId);
    const nextStatus = current?.status === 'Received' ? 'dispatched' : current?.status === 'Dispatched' ? 'delivered' : 'pending';
    const displayStatus = nextStatus === 'dispatched' ? 'Dispatched' : nextStatus === 'delivered' ? 'Delivered' : 'Received';

    setSamplesList(prev => prev.map(s => s.id === sampleId ? { ...s, status: displayStatus } : s));
    showToast(`Sample ${sampleId} marked as ${displayStatus}`);

    try {
      await fetch(`/api/samples/${sampleId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch {
      // offline resilience
    }
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditProductName(p.name);
    setEditProductSubtitle(p.subtitle);
    setEditProductCategory(p.category);
    setEditProductPrice(p.sizes?.[0]?.price || 299);
    setEditProductWeight(p.sizes?.[0]?.weight || '500g');
    setEditProductImage(p.image || '/images/creamy-peanut-butter.jpg');
    setEditImageInputMode(p.image?.startsWith('http') ? 'url' : 'upload');
    setEditUploadFileName('');
  };

  const handleEditProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      setEditUploadFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setEditProductImage(result);
          showToast(`✓ Image "${file.name}" loaded!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedSizes = editingProduct.sizes && editingProduct.sizes.length > 0
      ? editingProduct.sizes.map((s, idx) => idx === 0 ? { ...s, price: Number(editProductPrice), weight: editProductWeight } : s)
      : [{ weight: editProductWeight, price: Number(editProductPrice), originalPrice: Number(editProductPrice) + 100, inStock: true }];

    const payload = {
      name: editProductName,
      subtitle: editProductSubtitle,
      category: editProductCategory,
      sizes: updatedSizes,
      image: editProductImage
    };

    setProductsList(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
    setEditingProduct(null);
    showToast(`✓ Product "${editProductName}" updated!`);

    try {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify(payload)
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('nuttryx_catalog_updated', String(Date.now()));
        window.dispatchEvent(new Event('nuttryx_catalog_updated'));
      }
    } catch (err) {
      console.error('Update product error:', err);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const targetId = productToDelete.id;
    const targetName = productToDelete.name;

    // Optimistic UI update
    setProductsList(prev => prev.filter(p => p.id !== targetId));
    setProductToDelete(null);
    showToast(`Deleting "${targetName}"...`);

    try {
      const res = await fetch(`/api/products/${targetId}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': ADMIN_SECRET }
      });
      if (res.ok) {
        showToast(`✓ "${targetName}" deleted permanently from Database!`);
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_catalog_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_catalog_updated'));
        }
        syncWithBackend(true);
      }
    } catch (err) {
      console.error('Delete product failed:', err);
      showToast(`Removed locally. Check backend connectivity.`);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      setUploadFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setNewProductImage(result);
          showToast(`✓ Image "${file.name}" loaded!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Banner image size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      setSlideImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setSlideImage(result);
          showToast(`✓ Banner image "${file.name}" loaded!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const fallbackImage = newProductCategory === 'chocolate'
      ? '/images/dark-chocolate-peanut-butter.jpg'
      : newProductCategory === 'combos'
        ? '/images/crunchy-peanut-butter.jpg'
        : '/images/creamy-peanut-butter.jpg';

    const chosenImage = newProductImage && newProductImage.trim() 
      ? newProductImage.trim() 
      : fallbackImage;

    const newProd: Product = {
      id: `nuttryx-${Date.now()}`,
      name: newProductName.trim(),
      subtitle: 'Pure Peanut Butter • Freshly Stone Ground',
      description: 'Handcrafted slow-roasted Gujarat bold peanuts with pure wholesome goodness.',
      image: chosenImage,
      badge: 'New Launch 🚀',
      rating: 5.0,
      reviewsCount: 1,
      category: newProductCategory,
      sizes: [
        { 
          weight: newProductWeight, 
          price: Number(newProductPrice), 
          originalPrice: Number(newProductPrice) + 100, 
          inStock: true 
        }
      ],
      nutrition: {
        proteinPer100g: '30g',
        proteinPerServing: '10g',
        caloriesPerServing: '190 kcal',
        dietaryFibre: '7.5g',
        sugarAdded: '0g'
      },
      ingredients: '100% Roasted Gujarat Bold Peanuts.',
      features: ['High Plant Protein', 'Zero Added Sugar', 'Zero Palm Oil']
    };

    setProductsList([newProd, ...productsList]);
    setShowAddProductModal(false);
    setNewProductName('');
    setUploadFileName('');
    showToast(`Saving "${newProd.name}"...`);

    try {
      let res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify(newProd)
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-secret': ADMIN_SECRET
          },
          body: JSON.stringify(newProd)
        });
      }
      if (res.ok) {
        showToast(`✓ "${newProd.name}" saved successfully!`);
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_catalog_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_catalog_updated'));
        }
        syncWithBackend(true);
      }
    } catch (err) {
      console.error('Add product failed:', err);
      showToast('Saved locally. Check backend connectivity.');
    }
  };

  // Hero Slide Management Handlers
  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideName('');
    setSlideSubtitle('');
    setSlideTitle1('');
    setSlideTitle2('');
    setSlideDesc('');
    setSlideImage('');
    setSlideImageFileName('');
    setSlideImageMode('upload');
    setSlideBadge1('');
    setSlideBadge2('');
    setSlideBadge3('');
    setSlideBtnText('Shop Now');
    setSlideBtnLink('/shop');
    setSlideSampleBtnText('Book 50g Sample');
    setShowSlideModal(true);
  };

  const handleOpenEditSlide = (slide: MockSlide) => {
    setEditingSlide(slide);
    setSlideName(slide.name || '');
    setSlideSubtitle(slide.subtitle || '');
    setSlideTitle1(slide.titleLine1 || '');
    setSlideTitle2(slide.titleLine2 || '');
    setSlideDesc(slide.description || '');
    setSlideImage(slide.bannerImage || '');
    setSlideImageFileName('');
    if (slide.bannerImage && slide.bannerImage.startsWith('data:')) {
      setSlideImageMode('upload');
    } else if (slide.bannerImage && slide.bannerImage.startsWith('/images/hero-bg-')) {
      setSlideImageMode('preset');
    } else {
      setSlideImageMode('url');
    }
    setSlideBadge1(slide.badge1 || '');
    setSlideBadge2(slide.badge2 || '');
    setSlideBadge3(slide.badge3 || '');
    setSlideBtnText(slide.buttonText || 'Shop Now');
    setSlideBtnLink(slide.buttonLink || '/shop');
    setSlideSampleBtnText(slide.sampleButtonText || 'Book 50g Sample');
    setShowSlideModal(true);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideName.trim() || !slideTitle1.trim()) return;

    const payload = {
      name: slideName.trim(),
      subtitle: slideSubtitle.trim(),
      titleLine1: slideTitle1.trim(),
      titleLine2: slideTitle2.trim(),
      description: slideDesc.trim(),
      bannerImage: slideImage.trim() || '/images/hero-bg-dark-chocolate.jpg',
      badge1: slideBadge1.trim(),
      badge2: slideBadge2.trim(),
      badge3: slideBadge3.trim(),
      buttonText: slideBtnText.trim() || 'Shop Now',
      buttonLink: slideBtnLink.trim() || '/shop',
      sampleButtonText: slideSampleBtnText.trim() || 'Book 50g Sample',
      order: editingSlide ? editingSlide.order : slidesList.length + 1,
      isActive: true
    };

    setShowSlideModal(false);

    if (editingSlide) {
      showToast(`Saving updates for slide #${editingSlide.order} "${slideName}"...`);
      setSlidesList(prev => prev.map(s => s.id === editingSlide.id ? { ...s, ...payload } : s));
      try {
        const timestamp = Date.now();
        let res = await fetch(`/api/slides/${editingSlide.id}?_t=${timestamp}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-secret': ADMIN_SECRET
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/slides/${editingSlide.id}?_t=${timestamp}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-secret': ADMIN_SECRET
            },
            body: JSON.stringify(payload)
          });
        }
        if (res.ok) {
          showToast(`✓ Hero Slide #${editingSlide.order} updated successfully!`);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nuttryx_slides_updated', String(Date.now()));
            window.dispatchEvent(new Event('nuttryx_slides_updated'));
            window.dispatchEvent(new CustomEvent('nuttryx_slides_updated', { detail: payload }));
          }
          await syncWithBackend(true);
        } else {
          showToast(`⚠️ Could not save: ${res.statusText}`);
        }
      } catch (err) {
        console.error('Update slide error:', err);
      }
    } else {
      const newSlideItem: MockSlide = {
        ...payload,
        id: `slide-${Date.now()}`
      };
      setSlidesList(prev => [...prev, newSlideItem]);
      showToast(`Adding new slide "${slideName}" to database...`);
      try {
        let res = await fetch('/api/slides', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-secret': ADMIN_SECRET
          },
          body: JSON.stringify(newSlideItem)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/slides`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-secret': ADMIN_SECRET
            },
            body: JSON.stringify(newSlideItem)
          });
        }
        if (res.ok) {
          showToast(`✓ New Hero Slide saved to Database!`);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nuttryx_slides_updated', String(Date.now()));
            window.dispatchEvent(new Event('nuttryx_slides_updated'));
          }
          syncWithBackend(true);
        }
      } catch (err) {
        console.error('Create slide error:', err);
      }
    }
  };

  const confirmDeleteSlide = async () => {
    if (!slideToDelete) return;
    const targetId = slideToDelete.id;
    const targetName = slideToDelete.name;

    setSlidesList(prev => prev.filter(s => s.id !== targetId));
    setSlideToDelete(null);
    showToast(`Deleting slide "${targetName}"...`);

    try {
      let res = await fetch(`/api/slides/${targetId}`, { 
        method: 'DELETE',
        headers: { 'x-admin-secret': ADMIN_SECRET }
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/slides/${targetId}`, { 
          method: 'DELETE',
          headers: { 'x-admin-secret': ADMIN_SECRET }
        });
      }
      if (res.ok) {
        showToast(`✓ Slide "${targetName}" deleted permanently!`);
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_slides_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_slides_updated'));
        }
        syncWithBackend(true);
      }
    } catch (err) {
      console.error('Delete slide error:', err);
    }
  };

  const handleSaveTicker = async (itemsToSave: string[] = tickerItems) => {
    setIsSavingTicker(true);
    showToast('Saving Marquee Ticker...');
    try {
      let res = await fetch('/api/ticker', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({ items: itemsToSave })
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/ticker`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': ADMIN_SECRET
          },
          body: JSON.stringify({ items: itemsToSave })
        });
      }
      if (res.ok) {
        showToast('✓ Marquee Ticker updated successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_ticker_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_ticker_updated'));
        }
      } else {
        showToast('⚠️ Could not save ticker to database');
      }
    } catch (err) {
      console.error('Update ticker error:', err);
      showToast('⚠️ Network error saving ticker');
    } finally {
      setIsSavingTicker(false);
    }
  };

  const handleSaveSettings = async (settingsToSave = storeSettings) => {
    setIsSavingSettings(true);
    showToast('Saving Factory & Support settings...');
    try {
      let res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify(settingsToSave)
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': ADMIN_SECRET
          },
          body: JSON.stringify(settingsToSave)
        });
      }
      if (res.ok) {
        showToast('✓ Factory & Support settings saved successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_settings_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_settings_updated'));
        }
      } else {
        showToast('⚠️ Could not save settings to database');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      showToast('⚠️ Network error saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // ── FAQ Handlers ──
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqFormQuestion('');
    setFaqFormAnswer('');
    setFaqFormCategory('Purity & Quality');
    setFaqFormOrder(faqsList.length + 1);
    setFaqFormIsActive(true);
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq: MockFaq) => {
    setEditingFaq(faq);
    setFaqFormQuestion(faq.question);
    setFaqFormAnswer(faq.answer);
    setFaqFormCategory(faq.category || 'General');
    setFaqFormOrder(faq.order || 1);
    setFaqFormIsActive(faq.isActive !== false);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqFormQuestion.trim() || !faqFormAnswer.trim()) {
      showToast('❌ Question and Answer are both required.');
      return;
    }

    setIsSavingFaq(true);
    try {
      const payload = {
        question: faqFormQuestion.trim(),
        answer: faqFormAnswer.trim(),
        category: faqFormCategory.trim() || 'General',
        order: Number(faqFormOrder) || 1,
        isActive: faqFormIsActive
      };

      if (editingFaq) {
        let res = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/faqs/${editingFaq.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const data = await res.json();
        if (data.success && data.data) {
          setFaqsList(prev => prev.map(f => f.id === editingFaq.id ? data.data : f));
          showToast('✅ FAQ updated successfully!');
          setIsFaqModalOpen(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nuttryx_faqs_updated', String(Date.now()));
            window.dispatchEvent(new Event('nuttryx_faqs_updated'));
          }
        } else {
          showToast(`❌ ${data.message || 'Failed to update FAQ'}`);
        }
      } else {
        let res = await fetch('/api/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/faqs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const data = await res.json();
        if (data.success && data.data) {
          setFaqsList(prev => [...prev, data.data]);
          showToast('✅ FAQ added successfully!');
          setIsFaqModalOpen(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nuttryx_faqs_updated', String(Date.now()));
            window.dispatchEvent(new Event('nuttryx_faqs_updated'));
          }
        } else {
          showToast(`❌ ${data.message || 'Failed to create FAQ'}`);
        }
      }
    } catch {
      showToast('❌ Network error while saving FAQ.');
    } finally {
      setIsSavingFaq(false);
    }
  };

  const handleDeleteFaq = async (id: string, questionTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete this FAQ?\n\n"${questionTitle}"`)) return;

    try {
      let res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/faqs/${id}`, { method: 'DELETE' });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setFaqsList(prev => prev.filter(f => f.id !== id));
        showToast('🗑️ FAQ deleted successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_faqs_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_faqs_updated'));
        }
      } else {
        showToast(`❌ ${data.message || 'Failed to delete FAQ'}`);
      }
    } catch {
      showToast('❌ Network error while deleting FAQ.');
    }
  };

  const handleToggleFaqStatus = async (faq: MockFaq) => {
    try {
      const nextStatus = !faq.isActive;
      let res = await fetch(`/api/faqs/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/faqs/${faq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: nextStatus })
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setFaqsList(prev => prev.map(f => f.id === faq.id ? { ...f, isActive: nextStatus } : f));
        showToast(`FAQ is now ${nextStatus ? 'Active' : 'Hidden'}`);
      }
    } catch {
      showToast('❌ Could not toggle FAQ status');
    }
  };

  const handleSaveCraftHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCraftHeader(true);
    try {
      const payload = {
        badge: craftBadge.trim(),
        heading: craftHeading.trim(),
        description: craftDesc.trim()
      };
      let res = await fetch('/api/craft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/craft`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (data.success) {
        showToast('✅ Craft story header updated successfully!');
      } else {
        showToast(`❌ ${data.message || 'Failed to update header'}`);
      }
    } catch {
      showToast('❌ Network error while saving craft header.');
    } finally {
      setIsSavingCraftHeader(false);
    }
  };

  const handleOpenAddCraftStep = () => {
    setEditingCraftStep(null);
    const nextNum = craftSteps.length + 1;
    setStepFormNum(nextNum < 10 ? `0${nextNum}` : `${nextNum}`);
    setStepFormTitle('');
    setStepFormSubtitle('');
    setStepFormIcon('Sparkles');
    setStepFormDesc('');
    setStepFormOrder(nextNum);
    setStepFormIsActive(true);
    setIsCraftStepModalOpen(true);
  };

  const handleOpenEditCraftStep = (step: MockCraftStep) => {
    setEditingCraftStep(step);
    setStepFormNum(step.num);
    setStepFormTitle(step.title);
    setStepFormSubtitle(step.subtitle);
    setStepFormIcon(step.icon || 'Sparkles');
    setStepFormDesc(step.desc);
    setStepFormOrder(step.order || 1);
    setStepFormIsActive(step.isActive !== false);
    setIsCraftStepModalOpen(true);
  };

  const handleSaveCraftStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepFormTitle.trim() || !stepFormDesc.trim()) {
      showToast('❌ Step Title and Description are required.');
      return;
    }

    setIsSavingCraftStep(true);
    try {
      const payload = {
        num: stepFormNum.trim(),
        title: stepFormTitle.trim(),
        subtitle: stepFormSubtitle.trim() || 'Pure Nut Nutrition',
        icon: stepFormIcon,
        desc: stepFormDesc.trim(),
        order: Number(stepFormOrder) || 1,
        isActive: stepFormIsActive
      };

      if (editingCraftStep) {
        let res = await fetch(`/api/craft/steps/${editingCraftStep.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/craft/steps/${editingCraftStep.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const data = await res.json();
        if (data.success && data.allSteps) {
          setCraftSteps(data.allSteps);
          showToast('✅ Craft step updated successfully!');
          setIsCraftStepModalOpen(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nuttryx_craft_updated', String(Date.now()));
            window.dispatchEvent(new Event('nuttryx_craft_updated'));
          }
        } else {
          showToast(`❌ ${data.message || 'Failed to update step'}`);
        }
      } else {
        let res = await fetch('/api/craft/steps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/craft/steps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const data = await res.json();
        if (data.success && data.allSteps) {
          setCraftSteps(data.allSteps);
          showToast('✅ Craft step added successfully!');
          setIsCraftStepModalOpen(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nuttryx_craft_updated', String(Date.now()));
            window.dispatchEvent(new Event('nuttryx_craft_updated'));
          }
        } else {
          showToast(`❌ ${data.message || 'Failed to create step'}`);
        }
      }
    } catch {
      showToast('❌ Network error while saving craft step.');
    } finally {
      setIsSavingCraftStep(false);
    }
  };

  const handleDeleteCraftStep = async (stepId: string, stepTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete this process step?\n\n"${stepTitle}"`)) return;

    try {
      let res = await fetch(`/api/craft/steps/${stepId}`, { method: 'DELETE' });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/craft/steps/${stepId}`, { method: 'DELETE' });
      }
      const data = await res.json();
      if (res.ok && data.success && data.allSteps) {
        setCraftSteps(data.allSteps);
        showToast('🗑️ Craft step deleted successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_craft_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_craft_updated'));
        }
      } else {
        showToast(`❌ ${data.message || 'Failed to delete step'}`);
      }
    } catch {
      showToast('❌ Network error while deleting step.');
    }
  };

  const handleToggleCraftStepStatus = async (step: MockCraftStep) => {
    try {
      const nextStatus = !step.isActive;
      let res = await fetch(`/api/craft/steps/${step.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/craft/steps/${step.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: nextStatus })
        });
      }
      const data = await res.json();
      if (res.ok && data.success && data.allSteps) {
        setCraftSteps(data.allSteps);
        showToast(`Step is now ${nextStatus ? 'Live on Store' : 'Hidden'}`);
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_craft_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_craft_updated'));
        }
      }
    } catch {
      showToast('❌ Could not toggle step status');
    }
  };

  const handleSaveLifestyleHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLifestyleHeader(true);
    try {
      const payload = {
        badge: lifestyleBadge.trim(),
        heading: lifestyleHeading.trim(),
        description: lifestyleDesc.trim()
      };
      let res = await fetch('/api/lifestyle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/lifestyle`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (data.success) {
        showToast('✅ Lifestyle section header updated successfully!');
      } else {
        showToast(`❌ ${data.message || 'Failed to update header'}`);
      }
    } catch {
      showToast('❌ Network error while saving lifestyle header.');
    } finally {
      setIsSavingLifestyleHeader(false);
    }
  };

  const handleOpenAddPillar = () => {
    setEditingPillar(null);
    setPillarFormIcon('Dumbbell');
    setPillarFormTitle('');
    setPillarFormSubtitle('');
    setPillarFormDesc('');
    setPillarFormPerk('');
    setPillarFormOrder(lifestylePillars.length + 1);
    setPillarFormIsActive(true);
    setIsPillarModalOpen(true);
  };

  const handleOpenEditPillar = (pillar: MockLifestylePillar) => {
    setEditingPillar(pillar);
    setPillarFormIcon(pillar.icon || 'Dumbbell');
    setPillarFormTitle(pillar.title);
    setPillarFormSubtitle(pillar.subtitle);
    setPillarFormDesc(pillar.desc);
    setPillarFormPerk(pillar.perk);
    setPillarFormOrder(pillar.order || 1);
    setPillarFormIsActive(pillar.isActive !== false);
    setIsPillarModalOpen(true);
  };

  const handleSavePillar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pillarFormTitle.trim() || !pillarFormDesc.trim()) {
      showToast('❌ Title and Description are required.');
      return;
    }

    setIsSavingPillar(true);
    try {
      const payload = {
        icon: pillarFormIcon,
        title: pillarFormTitle.trim(),
        subtitle: pillarFormSubtitle.trim() || 'Daily Nutrition',
        desc: pillarFormDesc.trim(),
        perk: pillarFormPerk.trim() || '100% pure nutrition',
        order: Number(pillarFormOrder) || 1,
        isActive: pillarFormIsActive
      };

      if (editingPillar) {
        let res = await fetch(`/api/lifestyle/pillars/${editingPillar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/lifestyle/pillars/${editingPillar.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const data = await res.json();
        if (data.success && data.allPillars) {
          setLifestylePillars(data.allPillars);
          showToast('✅ Lifestyle card updated successfully!');
          setIsPillarModalOpen(false);
        } else {
          showToast(`❌ ${data.message || 'Failed to update pillar'}`);
        }
      } else {
        let res = await fetch('/api/lifestyle/pillars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/lifestyle/pillars`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const data = await res.json();
        if (data.success && data.allPillars) {
          setLifestylePillars(data.allPillars);
          showToast('✅ Lifestyle card added successfully!');
          setIsPillarModalOpen(false);
        } else {
          showToast(`❌ ${data.message || 'Failed to create pillar'}`);
        }
      }
    } catch {
      showToast('❌ Network error while saving lifestyle card.');
    } finally {
      setIsSavingPillar(false);
    }
  };

  const handleDeletePillar = async (pillarId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete this lifestyle card?\n\n"${title}"`)) return;

    try {
      let res = await fetch(`/api/lifestyle/pillars/${pillarId}`, { method: 'DELETE' });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/lifestyle/pillars/${pillarId}`, { method: 'DELETE' });
      }
      const data = await res.json();
      if (res.ok && data.success && data.allPillars) {
        setLifestylePillars(data.allPillars);
        showToast('🗑️ Lifestyle card deleted successfully!');
      } else {
        showToast(`❌ ${data.message || 'Failed to delete pillar'}`);
      }
    } catch {
      showToast('❌ Network error while deleting pillar.');
    }
  };

  const handleTogglePillarStatus = async (pillar: MockLifestylePillar) => {
    try {
      const nextStatus = !pillar.isActive;
      let res = await fetch(`/api/lifestyle/pillars/${pillar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/lifestyle/pillars/${pillar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: nextStatus })
        });
      }
      const data = await res.json();
      if (res.ok && data.success && data.allPillars) {
        setLifestylePillars(data.allPillars);
        showToast(`Card is now ${nextStatus ? 'Live on Store' : 'Hidden'}`);
      }
    } catch {
      showToast('❌ Could not toggle card status');
    }
  };

  // ══════════════════════════════════════════════════════════
  // BENEFIT COMPARISON SECTION HANDLERS
  // ══════════════════════════════════════════════════════════
  const handleSaveBenefitHeader = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingBenefitHeader(true);
    try {
      const payload = {
        badge: benefitBadge,
        heading: benefitHeading,
        description: benefitDesc,
        footerBanner: benefitFooterBanner,
        footerLinkText: benefitFooterLinkText,
        footerLinkUrl: benefitFooterLinkUrl
      };
      let res = await fetch('/api/benefit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/benefit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('✓ Benefit section headers saved & live on store!');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('nuttryx_benefit_updated'));
        }
      } else {
        showToast(`❌ ${data.message || 'Failed to save benefit header'}`);
      }
    } catch {
      showToast('❌ Network error while saving benefit section.');
    } finally {
      setIsSavingBenefitHeader(false);
    }
  };

  const handleOpenAddBenefitRow = () => {
    setEditingBenefitRow(null);
    setBenefitFormFeature('');
    setBenefitFormNuttryx('');
    setBenefitFormRegular('');
    setBenefitFormOrder(benefitRows.length + 1);
    setBenefitFormIsActive(true);
    setIsBenefitModalOpen(true);
  };

  const handleOpenEditBenefitRow = (row: MockBenefitRow) => {
    setEditingBenefitRow(row);
    setBenefitFormFeature(row.feature || '');
    setBenefitFormNuttryx(row.nuttryx || '');
    setBenefitFormRegular(row.regular || '');
    setBenefitFormOrder(row.order || 1);
    setBenefitFormIsActive(row.isActive !== false);
    setIsBenefitModalOpen(true);
  };

  const handleSaveBenefitRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!benefitFormFeature.trim() || !benefitFormNuttryx.trim() || !benefitFormRegular.trim()) {
      showToast('⚠️ Please fill in all comparison fields');
      return;
    }

    setIsSavingBenefitRow(true);
    try {
      const payload = {
        feature: benefitFormFeature.trim(),
        nuttryx: benefitFormNuttryx.trim(),
        regular: benefitFormRegular.trim(),
        order: Number(benefitFormOrder) || 1,
        isActive: benefitFormIsActive,
        nuttryxWins: true
      };

      let res: Response;
      if (editingBenefitRow) {
        res = await fetch(`/api/benefit/rows/${editingBenefitRow.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/benefit/rows/${editingBenefitRow.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      } else {
        res = await fetch('/api/benefit/rows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/benefit/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.section && Array.isArray(data.section.rows)) {
          setBenefitRows(data.section.rows);
        } else if (data.data) {
          if (editingBenefitRow) {
            setBenefitRows(prev => prev.map(r => r.id === editingBenefitRow.id ? data.data : r));
          } else {
            setBenefitRows(prev => [...prev, data.data]);
          }
        }
        showToast(editingBenefitRow ? '✓ Comparison row updated!' : '✓ New row added!');
        setIsBenefitModalOpen(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('nuttryx_benefit_updated'));
        }
      } else {
        showToast(`❌ ${data.message || 'Failed to save row'}`);
      }
    } catch {
      showToast('❌ Network error while saving comparison row.');
    } finally {
      setIsSavingBenefitRow(false);
    }
  };

  const handleDeleteBenefitRow = async (rowId: string, feature: string) => {
    if (!window.confirm(`Are you sure you want to delete this row?\n\n"${feature}"`)) return;

    try {
      let res = await fetch(`/api/benefit/rows/${rowId}`, { method: 'DELETE' });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/benefit/rows/${rowId}`, { method: 'DELETE' });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.section && Array.isArray(data.section.rows)) {
          setBenefitRows(data.section.rows);
        } else {
          setBenefitRows(prev => prev.filter(r => r.id !== rowId));
        }
        showToast('🗑️ Comparison row deleted successfully!');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('nuttryx_benefit_updated'));
        }
      } else {
        showToast(`❌ ${data.message || 'Failed to delete row'}`);
      }
    } catch {
      showToast('❌ Network error while deleting comparison row.');
    }
  };

  const handleToggleBenefitRowStatus = async (row: MockBenefitRow) => {
    try {
      const nextStatus = row.isActive === false;
      let res = await fetch(`/api/benefit/rows/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/benefit/rows/${row.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: nextStatus })
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setBenefitRows(prev => prev.map(r => r.id === row.id ? { ...r, isActive: nextStatus } : r));
        showToast(`Row is now ${nextStatus ? 'Live on Store' : 'Hidden'}`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('nuttryx_benefit_updated'));
        }
      }
    } catch {
      showToast('❌ Could not toggle row status');
    }
  };

  // ══════════════════════════════════════════════════════════
  // CUSTOMER REVIEWS HANDLERS
  // ══════════════════════════════════════════════════════════
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setReviewFormName('');
    setReviewFormRole('');
    setReviewFormRating(5);
    setReviewFormFlavour('Dark Chocolate Peanut Butter');
    setReviewFormComment('');
    setReviewFormIsVerified(true);
    setReviewFormIsActive(true);
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev: MockReview) => {
    setEditingReview(rev);
    setReviewFormName(rev.name || '');
    setReviewFormRole(rev.role || '');
    setReviewFormRating(rev.rating || 5);
    setReviewFormFlavour(rev.flavour || 'Dark Chocolate Peanut Butter');
    setReviewFormComment(rev.comment || '');
    setReviewFormIsVerified(rev.isVerified !== false);
    setReviewFormIsActive(rev.isActive !== false);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormName.trim() || !reviewFormComment.trim()) {
      showToast('⚠️ Name and review comment are required');
      return;
    }

    setIsSavingReview(true);
    try {
      const payload = {
        name: reviewFormName.trim(),
        role: reviewFormRole.trim() || 'Verified Buyer',
        rating: Number(reviewFormRating) || 5,
        flavour: reviewFormFlavour.trim(),
        comment: reviewFormComment.trim(),
        isVerified: reviewFormIsVerified,
        isActive: reviewFormIsActive
      };

      let res: Response;
      if (editingReview) {
        res = await fetch(`/api/reviews/${editingReview.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/reviews/${editingReview.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      } else {
        res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          res = await fetch(`${BACKEND_BASE}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        if (editingReview) {
          setReviewsList(prev => prev.map(r => r.id === editingReview.id ? data.data : r));
        } else {
          setReviewsList(prev => [data.data, ...prev]);
        }
        showToast(editingReview ? '✓ Review updated successfully!' : '✓ Review added successfully!');
        setIsReviewModalOpen(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_reviews_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_reviews_updated'));
        }
      } else {
        showToast(`❌ ${data.message || 'Failed to save review'}`);
      }
    } catch {
      showToast('❌ Network error while saving review.');
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string, reviewerName: string) => {
    if (!window.confirm(`Are you sure you want to delete this review by "${reviewerName}"?`)) return;

    try {
      let res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/reviews/${reviewId}`, { method: 'DELETE' });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList(prev => prev.filter(r => r.id !== reviewId));
        showToast('🗑️ Review deleted successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_reviews_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_reviews_updated'));
        }
      } else {
        showToast(`❌ ${data.message || 'Failed to delete review'}`);
      }
    } catch {
      showToast('❌ Network error while deleting review.');
    }
  };

  const handleToggleReviewStatus = async (rev: MockReview) => {
    try {
      const nextStatus = rev.isActive === false;
      let res = await fetch(`/api/reviews/${rev.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
      if (!res.ok) {
        res = await fetch(`${BACKEND_BASE}/api/reviews/${rev.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: nextStatus })
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList(prev => prev.map(r => r.id === rev.id ? { ...r, isActive: nextStatus } : r));
        showToast(`Review is now ${nextStatus ? 'Live on Store' : 'Hidden'}`);
        if (typeof window !== 'undefined') {
          localStorage.setItem('nuttryx_reviews_updated', String(Date.now()));
          window.dispatchEvent(new Event('nuttryx_reviews_updated'));
        }
      }
    } catch {
      showToast('❌ Could not toggle review status');
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#1A0D07', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: '#24140D', border: '1.5px solid rgba(217, 130, 43, 0.3)', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(217, 130, 43, 0.15)', color: '#D9822B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(217, 130, 43, 0.3)' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: '#FAF7F2', margin: '0 0 6px 0' }}>
            NUTTRYX Admin Portal
          </h2>
          <p style={{ color: '#C7B9B0', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '28px' }}>
            Enter Master Administrator Passcode to access fulfillment center, live orders, inventory and hero sliders.
          </p>

          {adminError && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#3D1515', border: '1px solid #7F1D1D', color: '#FCA5A5', fontSize: '0.84rem', fontWeight: 600, marginBottom: '20px' }}>
              {adminError}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                placeholder="Admin Passcode"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(217, 130, 43, 0.4)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#C7B9B0',
                  cursor: 'pointer'
                }}
              >
                {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={adminLoading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #D9822B 0%, #BF6F1F 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: adminLoading ? 'wait' : 'pointer',
                boxShadow: '0 4px 16px rgba(217, 130, 43, 0.35)',
                marginBottom: '16px'
              }}
            >
              {adminLoading ? 'Verifying...' : 'Unlock Admin Portal'}
            </button>
          </form>

          <a href="/" style={{ color: '#C7B9B0', fontSize: '0.84rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={14} /> Back to Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8F6F2', fontFamily: 'var(--font-heading)' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#20100A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem'
          }}
        >
          <Check size={16} color="#D9822B" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside 
        className="admin-sidebar"
        style={{
          width: '260px',
          background: '#20100A',
          color: '#FAF7F2',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}
      >
        {/* Brand */}
        <div className="admin-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
            <Image src="/images/nuttryx-logo-badge.jpg" alt="NUTTRYX" width={40} height={40} style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1 }}>NUTTRYX</div>
            <div style={{ fontSize: '0.65rem', color: '#D9822B', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>Admin Portal</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'dashboard' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'dashboard' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left'
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'orders' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'orders' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <ShoppingCart size={18} /> Orders
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {ordersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'products' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'products' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left'
            }}
          >
            <Package size={18} /> Products
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'samples' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'samples' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <Gift size={18} /> Free Samples
            <span style={{ marginLeft: 'auto', background: '#2D6A4F', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {samplesList.filter(s => s.status === 'Received').length} New
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sliders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'sliders' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'sliders' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <SlidersHorizontal size={18} /> Hero Sliders
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {slidesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ticker')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'ticker' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'ticker' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <Sparkles size={18} /> Marquee Ticker
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {tickerItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'faqs' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'faqs' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <HelpCircle size={18} /> FAQs & Questions
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {faqsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('craft')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'craft' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'craft' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <ShieldCheck size={18} /> Our Story (Pure Craft)
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {craftSteps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('lifestyle')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'lifestyle' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'lifestyle' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <Users size={18} /> Built For Lifestyle
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {lifestylePillars.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('benefit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'benefit' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'benefit' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <Award size={18} /> Why Nuttryx (Table)
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {benefitRows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'reviews' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'reviews' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <MessageSquareHeart size={18} /> Customer Reviews
            <span style={{ marginLeft: 'auto', background: '#D9822B', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px' }}>
              {reviewsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: activeTab === 'settings' ? 'rgba(217, 130, 43, 0.2)' : 'transparent',
              color: activeTab === 'settings' ? '#FFD199' : '#C7B9B0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <Settings size={18} /> Factory & Support
            <span style={{ marginLeft: 'auto', background: '#059669', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '99px', fontWeight: 800 }}>
              Live
            </span>
          </button>
        </nav>

        {/* Footer Link back to store */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={handleAdminLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              color: '#F87171',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: '8px',
              textAlign: 'left'
            }}
          >
            <Lock size={16} /> Lock Portal (Sign Out)
          </button>
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              color: '#C7B9B0',
              textDecoration: 'none',
              fontSize: '0.85rem',
              borderRadius: '8px'
            }}
          >
            <LogOut size={16} /> Back to Store
          </a>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header 
          className="admin-header"
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #ECE4D8',
            padding: '16px clamp(16px, 3vw, 32px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#20100A', letterSpacing: '-0.02em', margin: 0 }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'products' && 'Product Inventory'}
              {activeTab === 'samples' && 'Sample Claims & Dispatch'}
              {activeTab === 'sliders' && 'Hero Sliders & Banners'}
              {activeTab === 'ticker' && 'Running Marquee Ticker'}
              {activeTab === 'faqs' && 'Frequently Asked Questions (FAQ)'}
              {activeTab === 'craft' && 'Our Story — The Pure Craft'}
              {activeTab === 'lifestyle' && 'Built For Every Lifestyle (Pillars)'}
              {activeTab === 'benefit' && 'Clean Label Revolution — Why NUTTRYX Wins'}
              {activeTab === 'reviews' && 'Customer Reviews & Real Testimonials'}
              {activeTab === 'settings' && 'Factory, Location & Support Settings'}
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#736257', marginTop: '3px', marginBottom: 0 }}>
              Real-time monitoring and fulfillment center
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Live Database Sync Indicator */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 14px',
                borderRadius: '99px',
                background: dbConnected ? '#ECFDF5' : '#FFFBEB',
                border: `1px solid ${dbConnected ? '#A7F3D0' : '#FDE68A'}`,
                fontSize: '0.76rem',
                fontWeight: 800,
                color: dbConnected ? '#065F46' : '#92400E'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dbConnected ? '#10B981' : '#F59E0B', display: 'inline-block', boxShadow: dbConnected ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none' }}></span>
              <span>{dbConnected ? 'Live Cloud Sync' : 'Connecting...'}</span>
            </div>

            {/* Manual Refresh / Sync Button */}
            <button
              onClick={() => syncWithBackend(false)}
              disabled={isRefreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#20100A',
                color: '#FAF7F2',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Refresh live data"
            >
              <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9E8C80' }} />
              <input 
                type="text" 
                placeholder={activeTab === 'orders' ? 'Search orders...' : activeTab === 'products' ? 'Search products...' : activeTab === 'samples' ? 'Search claims...' : 'Search portal...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 30px 8px 34px',
                  borderRadius: '99px',
                  border: '1px solid #ECE4D8',
                  fontSize: '0.82rem',
                  outline: 'none',
                  background: '#F8F6F2',
                  transition: 'border-color 0.15s ease'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9E8C80',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ padding: '32px' }}>

          {/* ════ TAB 1: DASHBOARD OVERVIEW ════ */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '16px', border: '1px solid #ECE4D8', boxShadow: '0 2px 10px rgba(32, 16, 10, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#736257', fontWeight: 800, letterSpacing: '0.04em' }}>TOTAL REVENUE</span>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DollarSign size={18} color="#D9822B" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#20100A', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: '#065F46', marginTop: '8px', fontWeight: 800 }}>
                    <TrendingUp size={14} /> Verified Live Activity
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '16px', border: '1px solid #ECE4D8', boxShadow: '0 2px 10px rgba(32, 16, 10, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#736257', fontWeight: 800, letterSpacing: '0.04em' }}>ACTIVE ORDERS</span>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#F8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingCart size={18} color="#20100A" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#20100A', letterSpacing: '-0.02em' }}>
                    {ordersList.length}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: pendingOrdersCount > 0 ? '#B45309' : '#065F46', marginTop: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {pendingOrdersCount > 0 ? `⏳ ${pendingOrdersCount} pending dispatch` : '✅ All dispatched'}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '16px', border: '1px solid #ECE4D8', boxShadow: '0 2px 10px rgba(32, 16, 10, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#736257', fontWeight: 800, letterSpacing: '0.04em' }}>SAMPLE CLAIMS</span>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Gift size={18} color="#059669" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#20100A', letterSpacing: '-0.02em' }}>
                    {samplesList.length}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#D9822B', marginTop: '8px', fontWeight: 800 }}>
                    {samplesList.filter(s => s.status === 'Received').length} need shipping
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '16px', border: '1px solid #ECE4D8', boxShadow: '0 2px 10px rgba(32, 16, 10, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#736257', fontWeight: 800, letterSpacing: '0.04em' }}>TOTAL PRODUCTS</span>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#F8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={18} color="#20100A" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#20100A', letterSpacing: '-0.02em' }}>
                    {productsList.length}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#065F46', marginTop: '8px', fontWeight: 800 }}>
                    All in stock & live
                  </div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '24px', marginBottom: '32px', boxShadow: '0 2px 12px rgba(32, 16, 10, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#20100A', margin: 0, letterSpacing: '-0.01em' }}>
                      Recent Store Orders
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#736257', margin: '3px 0 0' }}>
                      Latest incoming customer purchases from online store
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')} 
                    style={{ 
                      fontSize: '0.82rem', 
                      color: '#D9822B', 
                      fontWeight: 800, 
                      background: '#FFF7ED', 
                      border: '1px solid #FED7AA', 
                      borderRadius: '8px',
                      padding: '7px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    View All Orders ({ordersList.length}) →
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ECE4D8', background: '#FAF7F2', color: '#736257', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Order ID</th>
                        <th style={{ padding: '12px 16px' }}>Customer</th>
                        <th style={{ padding: '12px 16px' }}>Items</th>
                        <th style={{ padding: '12px 16px' }}>Total</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersList.slice(0, 5).map((order) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #F3ECE2', transition: 'background 0.15s ease' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#20100A', background: '#F8F5F0', border: '1px solid #ECE2D5', padding: '3px 8px', borderRadius: '6px', fontSize: '0.82rem' }}>
                              #{order.id}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #20100A, #4A2718)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                                {getInitials(order.customerName)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#20100A' }}>{order.customerName}</div>
                                <div style={{ fontSize: '0.74rem', color: '#736257' }}>{order.city}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {renderItemChips(order.items)}
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 900, color: '#20100A', fontSize: '0.92rem', fontVariantNumeric: 'tabular-nums' }}>
                            ₹{order.total}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span 
                              style={{
                                padding: '4px 10px',
                                borderRadius: '99px',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: order.status === 'Delivered' ? '#ECFDF5' : order.status === 'Shipped' ? '#EFF6FF' : '#FEF3C7',
                                color: order.status === 'Delivered' ? '#065F46' : order.status === 'Shipped' ? '#1E40AF' : '#92400E',
                                border: `1px solid ${order.status === 'Delivered' ? '#A7F3D0' : order.status === 'Shipped' ? '#BFDBFE' : '#FDE68A'}`
                              }}
                            >
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: order.status === 'Delivered' ? '#10B981' : order.status === 'Shipped' ? '#3B82F6' : '#F59E0B' }}></span>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                                style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #ECE4D8', fontSize: '0.78rem', background: '#FFFFFF', fontWeight: 700 }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <button
                                onClick={() => setSelectedOrderForInvoice(order)}
                                title="Print Invoice"
                                style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #ECE4D8', background: '#FAF7F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Printer size={13} color="#20100A" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 2: PRODUCT MANAGEMENT ════ */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20100A', marginBottom: '4px' }}>
                    Product Inventory
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#736257' }}>
                    Manage active peanut butter flavors, sizes, pricing, and live catalog.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#20100A',
                    color: '#FFFFFF',
                    padding: '11px 24px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(32, 16, 10, 0.22)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#381C12';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#20100A';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              {/* Product Cards Grid with Soft Curves */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '22px' }}>
                {productsList.map((product) => {
                  const firstSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : { weight: '500g', price: 299 };
                  return (
                    <div 
                      key={product.id} 
                      style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '22px', 
                        border: '1px solid #ECE2D5', 
                        padding: '18px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        boxShadow: '0 4px 18px rgba(51, 26, 17, 0.05)',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 14px 32px rgba(51, 26, 17, 0.1)';
                        e.currentTarget.style.borderColor = '#DFD2C2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 18px rgba(51, 26, 17, 0.05)';
                        e.currentTarget.style.borderColor = '#ECE2D5';
                      }}
                    >
                      {/* Image Showcase Window with Rounded Corners */}
                      <div 
                        style={{ 
                          position: 'relative', 
                          width: '100%', 
                          height: '190px', 
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: 'linear-gradient(180deg, #FDFBF8 0%, #F5ECE0 100%)',
                          border: '1px solid rgba(80, 45, 25, 0.08)',
                          marginBottom: '14px' 
                        }}
                      >
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill 
                          style={{ objectFit: 'cover' }} 
                        />
                        
                        {/* Floating Category Pill */}
                        <div 
                          style={{ 
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(32, 16, 10, 0.88)',
                            backdropFilter: 'blur(6px)',
                            color: '#FFFFFF',
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
                          }}
                        >
                          {product.category}
                        </div>
                      </div>

                      {/* Product Info */}
                      <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#20100A', margin: '2px 0 6px', lineHeight: 1.3 }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#736257', marginBottom: '16px', lineHeight: 1.45 }}>
                        {product.subtitle}
                      </p>

                      {/* Price & Delete Action */}
                      <div 
                        style={{ 
                          marginTop: 'auto', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          paddingTop: '14px', 
                          borderTop: '1px solid #F3ECE2' 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#20100A' }}>
                            ₹{firstSize.price}
                          </span>
                          <span 
                            style={{ 
                              fontSize: '0.74rem', 
                              color: '#736257', 
                              background: '#F8F4EE',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontWeight: 700,
                              border: '1px solid #ECE2D5'
                            }}
                          >
                            {firstSize.weight}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleStartEditProduct(product)}
                            style={{ 
                              color: '#20100A', 
                              background: '#F3ECE2', 
                              border: '1px solid #E0D5C7', 
                              padding: '7px 14px', 
                              borderRadius: '9999px', 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '5px', 
                              fontSize: '0.78rem', 
                              fontWeight: 700,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Edit3 size={13} color="#D9822B" /> Edit
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            style={{ 
                              color: '#E53E3E', 
                              background: '#FFF1F1', 
                              border: '1px solid #FED7D7', 
                              padding: '7px 14px', 
                              borderRadius: '9999px', 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '5px', 
                              fontSize: '0.78rem', 
                              fontWeight: 700,
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#E53E3E';
                              e.currentTarget.style.color = '#FFFFFF';
                              e.currentTarget.style.borderColor = '#E53E3E';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#FFF1F1';
                              e.currentTarget.style.color = '#E53E3E';
                              e.currentTarget.style.borderColor = '#FED7D7';
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ TAB 3: ALL ORDERS ════ */}
          {activeTab === 'orders' && (
            <div>
              {/* Order Performance & Fulfillment KPI Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ECE4D8', boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>TOTAL ORDERS</span>
                    <ShoppingCart size={16} color="#20100A" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#20100A' }}>{totalOrdersCount}</div>
                  <div style={{ fontSize: '0.74rem', color: '#736257', marginTop: '4px' }}>Across all channels</div>
                </div>

                <div style={{ background: pendingOrdersCount > 0 ? '#FFFBEB' : '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: `1px solid ${pendingOrdersCount > 0 ? '#FDE68A' : '#ECE4D8'}`, boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: pendingOrdersCount > 0 ? '#92400E' : '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>AWAITING DISPATCH</span>
                    <Clock size={16} color={pendingOrdersCount > 0 ? '#D97706' : '#736257'} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: pendingOrdersCount > 0 ? '#92400E' : '#20100A' }}>{pendingOrdersCount}</div>
                  <div style={{ fontSize: '0.74rem', color: pendingOrdersCount > 0 ? '#B45309' : '#065F46', marginTop: '4px', fontWeight: 700 }}>
                    {pendingOrdersCount > 0 ? '⚠️ Immediate Action Required' : '✅ Everything Dispatched'}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ECE4D8', boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>IN TRANSIT</span>
                    <Truck size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#20100A' }}>{shippedOrdersCount}</div>
                  <div style={{ fontSize: '0.74rem', color: '#2563EB', marginTop: '4px', fontWeight: 700 }}>On the way to customers</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ECE4D8', boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>ORDER REVENUE</span>
                    <DollarSign size={16} color="#D9822B" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#20100A', fontVariantNumeric: 'tabular-nums' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.74rem', color: '#065F46', marginTop: '4px', fontWeight: 700 }}>{paidOrdersCount} prepaid • {codOrdersCount} COD</div>
                </div>
              </div>

              {/* Filter & Search Toolbar */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px 16px 0 0', border: '1px solid #ECE4D8', borderBottom: 'none', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                
                {/* Status Tabs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#736257', marginRight: '4px' }}>Filter Status:</span>
                  
                  <button
                    onClick={() => setOrderStatusFilter('All')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '99px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: 'none',
                      background: orderStatusFilter === 'All' ? '#20100A' : '#F4EFEA',
                      color: orderStatusFilter === 'All' ? '#FAF7F2' : '#5C4A3E',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All Orders ({totalOrdersCount})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('Pending')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '99px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: `1px solid ${orderStatusFilter === 'Pending' ? '#F59E0B' : '#FDE68A'}`,
                      background: orderStatusFilter === 'Pending' ? '#FEF3C7' : '#FFFDF7',
                      color: '#92400E',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }}></span>
                    Pending ({pendingOrdersCount})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('Shipped')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '99px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: `1px solid ${orderStatusFilter === 'Shipped' ? '#3B82F6' : '#BFDBFE'}`,
                      background: orderStatusFilter === 'Shipped' ? '#EFF6FF' : '#F8FAFC',
                      color: '#1E40AF',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3B82F6' }}></span>
                    Shipped ({shippedOrdersCount})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('Delivered')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '99px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: `1px solid ${orderStatusFilter === 'Delivered' ? '#10B981' : '#A7F3D0'}`,
                      background: orderStatusFilter === 'Delivered' ? '#ECFDF5' : '#F8FAF9',
                      color: '#065F46',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }}></span>
                    Delivered ({deliveredOrdersCount})
                  </button>
                </div>

                {/* Payment Filters & Reset */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as any)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #ECE4D8',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#20100A',
                      background: '#F8F6F2',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="All">All Payment Types</option>
                    <option value="paid">Prepaid Only (UPI / Card)</option>
                    <option value="cod">Cash on Delivery Only</option>
                  </select>

                  {(orderStatusFilter !== 'All' || paymentFilter !== 'All' || searchQuery) && (
                    <button
                      onClick={() => {
                        setOrderStatusFilter('All');
                        setPaymentFilter('All');
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #FCA5A5',
                        background: '#FEF2F2',
                        color: '#991B1B',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Clear Filters
                    </button>
                  )}

                  <span style={{ fontSize: '0.78rem', color: '#736257', fontWeight: 700 }}>
                    Showing {filteredOrders.length} of {ordersList.length}
                  </span>
                </div>

              </div>

              {/* Main Orders Table Card */}
              <div style={{ background: '#FFFFFF', borderRadius: '0 0 16px 16px', border: '1px solid #ECE4D8', boxShadow: '0 4px 20px -2px rgba(32, 16, 10, 0.04)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ background: '#FAF7F2', borderBottom: '2px solid #EFE8DE', color: '#736257', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '14px 18px', width: '130px' }}>Order ID</th>
                        <th style={{ padding: '14px 18px', minWidth: '180px' }}>Customer & Contact</th>
                        <th style={{ padding: '14px 18px', minWidth: '130px' }}>Location</th>
                        <th style={{ padding: '14px 18px', minWidth: '240px' }}>Items Ordered</th>
                        <th style={{ padding: '14px 18px', width: '100px' }}>Amount</th>
                        <th style={{ padding: '14px 18px', width: '120px' }}>Payment</th>
                        <th style={{ padding: '14px 18px', width: '120px' }}>Date</th>
                        <th style={{ padding: '14px 18px', width: '120px' }}>Status</th>
                        <th style={{ padding: '14px 18px', width: '140px' }}>Update & Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr 
                            key={order.id} 
                            style={{ 
                              borderBottom: '1px solid #F3ECE2', 
                              transition: 'background 0.15s ease' 
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAF8F5'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                          >
                            {/* Order ID with Copy Badge */}
                            <td style={{ padding: '16px 18px' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#20100A', background: '#F8F5F0', border: '1px solid #E5DACF', padding: '4px 8px', borderRadius: '6px', fontSize: '0.82rem' }}>
                                  #{order.id}
                                </span>
                                <button
                                  onClick={() => handleCopyOrderId(order.id)}
                                  title="Copy Order ID"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedOrderId === order.id ? '#10B981' : '#9E8C80', display: 'flex', alignItems: 'center' }}
                                >
                                  {copiedOrderId === order.id ? <Check size={13} /> : <Copy size={13} />}
                                </button>
                              </div>
                            </td>

                            {/* Customer Avatar & Phone */}
                            <td style={{ padding: '16px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #20100A 0%, #4D2616 100%)', color: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 2px 6px rgba(32, 16, 10, 0.15)' }}>
                                  {getInitials(order.customerName)}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 800, color: '#20100A', fontSize: '0.88rem' }}>{order.customerName}</div>
                                  {order.phone && (
                                    <a 
                                      href={`tel:${order.phone}`} 
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#736257', textDecoration: 'none', marginTop: '2px', fontWeight: 600 }}
                                      title="Call customer"
                                    >
                                      <Phone size={11} color="#D9822B" />
                                      <span>{order.phone}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Location */}
                            <td style={{ padding: '16px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                                <MapPin size={14} color="#D9822B" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontWeight: 700, color: '#20100A', fontSize: '0.84rem' }}>
                                    {order.city.split('(')[0].trim()}
                                  </div>
                                  {order.city.includes('(') && (
                                    <span style={{ fontSize: '0.72rem', color: '#736257', background: '#F8F5F0', border: '1px solid #ECE2D5', padding: '1px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                                      {order.city.match(/\((.*?)\)/)?.[1] || ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Items Ordered */}
                            <td style={{ padding: '16px 18px' }}>
                              {renderItemChips(order.items)}
                            </td>

                            {/* Amount */}
                            <td style={{ padding: '16px 18px', fontWeight: 900, color: '#20100A', fontSize: '0.96rem', fontVariantNumeric: 'tabular-nums' }}>
                              ₹{order.total}
                            </td>

                            {/* Payment Badge */}
                            <td style={{ padding: '16px 18px' }}>
                              <span 
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '99px',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: order.paymentStatus === 'paid' ? '#ECFDF5' : '#FFFBEB',
                                  color: order.paymentStatus === 'paid' ? '#065F46' : '#92400E',
                                  border: `1px solid ${order.paymentStatus === 'paid' ? '#A7F3D0' : '#FDE68A'}`
                                }}
                              >
                                {order.paymentStatus === 'paid' ? (
                                  <>
                                    <CheckCircle size={12} color="#10B981" />
                                    <span>{order.paymentMethod === 'upi' ? 'UPI • Paid' : order.paymentMethod === 'card' ? 'Card • Paid' : 'Paid'}</span>
                                  </>
                                ) : (
                                  <>
                                    <span>💵</span>
                                    <span>COD</span>
                                  </>
                                )}
                              </span>
                            </td>

                            {/* Date */}
                            <td style={{ padding: '16px 18px', fontSize: '0.78rem', color: '#736257', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={12} color="#9E8C80" />
                                <span>{order.date}</span>
                              </div>
                            </td>

                            {/* Status Pill */}
                            <td style={{ padding: '16px 18px' }}>
                              <span 
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '99px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: order.status === 'Delivered' ? '#ECFDF5' : order.status === 'Shipped' ? '#EFF6FF' : '#FEF3C7',
                                  color: order.status === 'Delivered' ? '#065F46' : order.status === 'Shipped' ? '#1E40AF' : '#92400E',
                                  border: `1px solid ${order.status === 'Delivered' ? '#A7F3D0' : order.status === 'Shipped' ? '#BFDBFE' : '#FDE68A'}`
                                }}
                              >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: order.status === 'Delivered' ? '#10B981' : order.status === 'Shipped' ? '#3B82F6' : '#F59E0B' }}></span>
                                {order.status}
                              </span>
                            </td>

                            {/* Update Dropdown & Invoice Button */}
                            <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                                  style={{ 
                                    padding: '6px 10px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #ECE4D8', 
                                    fontSize: '0.78rem', 
                                    background: '#FFFFFF',
                                    fontWeight: 700,
                                    color: '#20100A',
                                    outline: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                </select>

                                <button
                                  onClick={() => setSelectedOrderForInvoice(order)}
                                  title="Print Packing Slip / Invoice"
                                  style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '5px', 
                                    padding: '6px 10px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #E5DACF', 
                                    background: '#FAF7F2', 
                                    color: '#20100A',
                                    cursor: 'pointer', 
                                    fontSize: '0.76rem', 
                                    fontWeight: 800,
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#20100A';
                                    e.currentTarget.style.color = '#FFFFFF';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FAF7F2';
                                    e.currentTarget.style.color = '#20100A';
                                  }}
                                >
                                  <Printer size={13} />
                                  <span>Slip</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} style={{ padding: '48px 24px', textAlign: 'center' }}>
                            <div style={{ maxWidth: '360px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Search size={22} color="#9E8C80" />
                              </div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                                No matching orders found
                              </h4>
                              <p style={{ fontSize: '0.82rem', color: '#736257', margin: 0 }}>
                                Try adjusting your search query or filter settings.
                              </p>
                              <button
                                onClick={() => {
                                  setOrderStatusFilter('All');
                                  setPaymentFilter('All');
                                  setSearchQuery('');
                                }}
                                style={{
                                  padding: '7px 16px',
                                  borderRadius: '8px',
                                  background: '#20100A',
                                  color: '#FAF7F2',
                                  border: 'none',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  marginTop: '6px'
                                }}
                              >
                                Reset All Filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 4: FREE SAMPLES CLAIMS ════ */}
          {activeTab === 'samples' && (
            <div>
              {/* Sample Metrics Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ECE4D8', boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>TOTAL SAMPLE CLAIMS</span>
                    <Gift size={16} color="#059669" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#20100A' }}>{samplesList.length}</div>
                  <div style={{ fontSize: '0.74rem', color: '#736257', marginTop: '4px' }}>Free 50g trial jars requested</div>
                </div>

                <div style={{ background: samplesList.filter(s => s.status === 'Received').length > 0 ? '#FFFBEB' : '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: `1px solid ${samplesList.filter(s => s.status === 'Received').length > 0 ? '#FDE68A' : '#ECE4D8'}`, boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: samplesList.filter(s => s.status === 'Received').length > 0 ? '#92400E' : '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>NEEDS SHIPPING</span>
                    <Clock size={16} color="#D97706" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: samplesList.filter(s => s.status === 'Received').length > 0 ? '#92400E' : '#20100A' }}>
                    {samplesList.filter(s => s.status === 'Received').length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#B45309', marginTop: '4px', fontWeight: 700 }}>
                    Awaiting dispatch packing
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ECE4D8', boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>DISPATCHED</span>
                    <Truck size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#20100A' }}>
                    {samplesList.filter(s => s.status === 'Dispatched').length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#2563EB', marginTop: '4px', fontWeight: 700 }}>Courier in transit</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ECE4D8', boxShadow: '0 2px 8px rgba(32, 16, 10, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#736257', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>DELIVERED</span>
                    <CheckCircle size={16} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#20100A' }}>
                    {samplesList.filter(s => s.status === 'Delivered').length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#065F46', marginTop: '4px', fontWeight: 700 }}>Received by customer</div>
                </div>
              </div>

              {/* Samples Table Card */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', boxShadow: '0 4px 20px -2px rgba(32, 16, 10, 0.04)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ background: '#FAF7F2', borderBottom: '2px solid #EFE8DE', color: '#736257', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '14px 18px', width: '130px' }}>Claim ID</th>
                        <th style={{ padding: '14px 18px', minWidth: '180px' }}>Customer Name</th>
                        <th style={{ padding: '14px 18px', minWidth: '130px' }}>Phone</th>
                        <th style={{ padding: '14px 18px', minWidth: '160px' }}>Destination City</th>
                        <th style={{ padding: '14px 18px', minWidth: '180px' }}>Flavour Chosen</th>
                        <th style={{ padding: '14px 18px', width: '130px' }}>Claim Date</th>
                        <th style={{ padding: '14px 18px', width: '220px' }}>Dispatch Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSamples.length > 0 ? (
                        filteredSamples.map((sample) => (
                          <tr 
                            key={sample.id} 
                            style={{ 
                              borderBottom: '1px solid #F3ECE2',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAF8F5'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                          >
                            <td style={{ padding: '16px 18px' }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#20100A', background: '#F8F5F0', border: '1px solid #E5DACF', padding: '4px 8px', borderRadius: '6px', fontSize: '0.82rem' }}>
                                #{sample.id}
                              </span>
                            </td>
                            <td style={{ padding: '16px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                                  {getInitials(sample.name)}
                                </div>
                                <div style={{ fontWeight: 800, color: '#20100A' }}>{sample.name}</div>
                              </div>
                            </td>
                            <td style={{ padding: '16px 18px' }}>
                              {sample.phone ? (
                                <a 
                                  href={`tel:${sample.phone}`}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#736257', textDecoration: 'none', fontWeight: 600 }}
                                >
                                  <Phone size={12} color="#D9822B" />
                                  <span>{sample.phone}</span>
                                </a>
                              ) : '—'}
                            </td>
                            <td style={{ padding: '16px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3D2619', fontWeight: 600 }}>
                                <MapPin size={13} color="#D9822B" />
                                <span>{sample.city}</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px 18px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#FFF7ED', border: '1px solid #FED7AA', padding: '3px 10px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 800, color: '#9A3412' }}>
                                🥜 {sample.flavour}
                              </span>
                            </td>
                            <td style={{ padding: '16px 18px', fontSize: '0.78rem', color: '#736257', whiteSpace: 'nowrap' }}>
                              {sample.date}
                            </td>
                            <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span 
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '99px',
                                    fontSize: '0.74rem',
                                    fontWeight: 800,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: sample.status === 'Delivered' ? '#ECFDF5' : sample.status === 'Dispatched' ? '#EFF6FF' : '#FEF3C7',
                                    color: sample.status === 'Delivered' ? '#065F46' : sample.status === 'Dispatched' ? '#1E40AF' : '#92400E',
                                    border: `1px solid ${sample.status === 'Delivered' ? '#A7F3D0' : sample.status === 'Dispatched' ? '#BFDBFE' : '#FDE68A'}`
                                  }}
                                >
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sample.status === 'Delivered' ? '#10B981' : sample.status === 'Dispatched' ? '#3B82F6' : '#F59E0B' }}></span>
                                  {sample.status}
                                </span>
                                <button
                                  onClick={() => handleSampleStatusToggle(sample.id)}
                                  style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: sample.status === 'Received' ? '#20100A' : sample.status === 'Dispatched' ? '#059669' : '#ECE4D8',
                                    color: sample.status === 'Delivered' ? '#20100A' : '#FFFFFF',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {sample.status === 'Received' ? 'Dispatch 🚚' : sample.status === 'Dispatched' ? 'Mark Delivered ✅' : 'Reset'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ padding: '40px 24px', textAlign: 'center', color: '#736257' }}>
                            No sample requests found matching search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 5: HERO SLIDERS MANAGEMENT ════ */}
          {activeTab === 'sliders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20100A', marginBottom: '4px' }}>
                    Hero Banner Sliders
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#736257' }}>
                    Customize background renders, headlines, slogans, badges, and button links on the homepage carousel.
                    <span style={{ display: 'inline-block', marginLeft: '8px', color: '#B55A00', background: '#FFF3E0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                      📐 Best Image Size: 1920 × 800 px
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleOpenAddSlide}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#20100A',
                    color: '#FFFFFF',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(32, 16, 10, 0.2)'
                  }}
                >
                  <Plus size={16} /> Add New Slide
                </button>
              </div>

              {/* Sliders Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
                {slidesList.map((slide, idx) => (
                  <div 
                    key={slide.id} 
                    style={{ 
                      background: '#FFFFFF', 
                      borderRadius: '16px', 
                      border: '1px solid #ECE4D8', 
                      overflow: 'hidden',
                      display: 'flex', 
                      flexDirection: 'column',
                      boxShadow: '0 4px 12px rgba(51, 26, 17, 0.04)'
                    }}
                  >
                    {/* Slide Thumbnail */}
                    <div style={{ position: 'relative', width: '100%', height: '170px', background: '#F5ECE1' }}>
                      <Image 
                        src={slide.bannerImage} 
                        alt={slide.name} 
                        fill 
                        unoptimized={slide.bannerImage.startsWith('data:') || slide.bannerImage.startsWith('http')}
                        style={{ objectFit: 'cover' }} 
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(32, 16, 10, 0.88)',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px'
                        }}
                      >
                        Slide #{idx + 1}
                      </div>

                      <div 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#E8F5E9',
                          color: '#2D6A4F',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px'
                        }}
                      >
                        ● Active
                      </div>
                    </div>

                    {/* Content Details */}
                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#20100A' }}>
                          🏷️ {slide.name || `Slide #${idx + 1}`}
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D9822B', background: '#FFF3E0', padding: '2px 7px', borderRadius: '4px', border: '1px solid #FFE0B2' }}>
                          Slide #{idx + 1}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D9822B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {slide.subtitle || 'PURE PEANUT BUTTER'}
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#20100A', lineHeight: 1.25, marginBottom: '6px' }}>
                        {slide.titleLine1} {slide.titleLine2}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#736257', lineHeight: 1.45, marginBottom: '14px' }}>
                        {slide.description}
                      </p>

                      {/* Badges preview */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {[slide.badge1, slide.badge2, slide.badge3].filter(Boolean).map((b, bi) => (
                          <span 
                            key={bi} 
                            style={{ 
                              background: '#F8F4EE', 
                              border: '1px solid #ECE4D8', 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.68rem', 
                              fontWeight: 700, 
                              color: '#4B382D' 
                            }}
                          >
                            {b.replace('\n', ' ')}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #F3ECE2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.76rem', color: '#8A7669' }}>
                          Button: <strong>{slide.buttonText || 'Shop Now'}</strong>
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditSlide(slide)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #DFD2C4',
                              background: '#FAF7F2',
                              color: '#20100A',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Edit3 size={13} /> Edit Slide #{idx + 1}
                          </button>

                          <button
                            onClick={() => setSlideToDelete(slide)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #FED7D7',
                              background: '#FFF5F5',
                              color: '#E53E3E',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 6: RUNNING MARQUEE TICKER ── */}
          {activeTab === 'ticker' && (
            <div>
              {/* Header and Save CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20100A', marginBottom: '4px' }}>
                    Running Marquee Ticker Strip
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#736257' }}>
                    Website ke top/banner ke neeche jo running ticker chalti hai usko yahan se live add, edit aur delete karein.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const defaults = [
                        '🥜 100% Roasted Gujarat Peanuts',
                        '💪 30g Pure Plant Protein',
                        '🚫 Zero Added Refined Sugar',
                        '🌿 Zero Palm Oil or Trans Fats',
                        '🌱 100% Pure Vegetarian Certified',
                        '🚚 Free Express Shipping Above ₹499'
                      ];
                      setTickerItems(defaults);
                      handleSaveTicker(defaults);
                    }}
                    style={{
                      padding: '10px 16px',
                      background: '#FFF',
                      border: '1.5px solid #E6DCCD',
                      borderRadius: '10px',
                      color: '#736257',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={() => handleSaveTicker(tickerItems)}
                    disabled={isSavingTicker}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#D9822B',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: isSavingTicker ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingTicker ? 0.7 : 1
                    }}
                  >
                    <Check size={16} />
                    {isSavingTicker ? 'Saving...' : '✓ Save Changes'}
                  </button>
                </div>
              </div>

              {/* Live Preview Bar */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A7669' }}>
                    🔴 Live Ticker Preview (Website par aisa dikhega)
                  </span>
                  <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
                    Instant Real-time Sync
                  </span>
                </div>
                <div style={{ background: '#1E0C04', borderRadius: '10px', padding: '14px 20px', overflowX: 'auto', whiteSpace: 'nowrap', border: '1px solid rgba(217, 130, 43, 0.4)' }}>
                  {tickerItems.length === 0 ? (
                    <span style={{ color: '#A09085', fontSize: '0.85rem' }}>Koi ticker items nahi hain. Neeche se naya item add karein.</span>
                  ) : (
                    tickerItems.map((item, idx) => (
                      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{ color: '#FBE8D3', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                          {item}
                        </span>
                        <span style={{ color: '#D9822B', margin: '0 18px', fontWeight: 900 }}>•</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Add New Item Card with Quick Emojis */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#20100A', marginBottom: '8px' }}>
                  + Add New Ticker Announcement / Feature
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#736257', marginBottom: '14px' }}>
                  Quick badges par click karein ya apna text type karein.
                </p>

                {/* Quick Emoji Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { icon: '🥜', text: '100% Saurashtra Peanuts' },
                    { icon: '💪', text: '30g Pure Plant Protein' },
                    { icon: '🚫', text: 'Zero Added Refined Sugar' },
                    { icon: '🌿', text: 'Zero Palm Oil or Trans Fats' },
                    { icon: '🌱', text: '100% Pure Vegetarian Certified' },
                    { icon: '🚚', text: 'Free Express Shipping Above ₹499' },
                    { icon: '🔥', text: 'Limited Time Launch Offer' },
                    { icon: '🎁', text: 'Free Taste Sample Available' },
                    { icon: '⭐', text: 'Rated 4.9/5 by 2,400+ Athletes' }
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewTickerText(`${preset.icon} ${preset.text}`)}
                      style={{
                        padding: '6px 12px',
                        background: '#FAF6F0',
                        border: '1px solid #E6DCCD',
                        borderRadius: '99px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#4B3621',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F0E5D5';
                        e.currentTarget.style.borderColor = '#D9822B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FAF6F0';
                        e.currentTarget.style.borderColor = '#E6DCCD';
                      }}
                    >
                      {preset.icon} {preset.text}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newTickerText}
                    onChange={(e) => setNewTickerText(e.target.value)}
                    placeholder="e.g. 🥜 100% Slow-Roasted Saurashtra Peanuts"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTickerText.trim()) {
                        e.preventDefault();
                        const updated = [...tickerItems, newTickerText.trim()];
                        setTickerItems(updated);
                        setNewTickerText('');
                        handleSaveTicker(updated);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.92rem',
                      color: '#20100A',
                      outline: 'none',
                      background: '#FFF'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTickerText.trim()) return;
                      const updated = [...tickerItems, newTickerText.trim()];
                      setTickerItems(updated);
                      setNewTickerText('');
                      handleSaveTicker(updated);
                    }}
                    style={{
                      padding: '12px 24px',
                      background: '#D9822B',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(217, 130, 43, 0.3)'
                    }}
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                      Current Ticker Items ({tickerItems.length})
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#736257', marginTop: '2px', marginBottom: 0 }}>
                      Text box me direct click karke edit karein, arrows se reorder karein, aur changes save karein.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tickerItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: '#FAF6F0',
                        borderRadius: '12px',
                        border: '1px solid #ECE4D8'
                      }}
                    >
                      {/* Item index */}
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: '#20100A',
                          color: '#FFD199',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        #{index + 1}
                      </span>

                      {/* Inline Editable Input */}
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...tickerItems];
                          updated[index] = e.target.value;
                          setTickerItems(updated);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #DCD0C2',
                          background: '#FFF',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#20100A',
                          outline: 'none'
                        }}
                      />

                      {/* Reorder Up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          if (index === 0) return;
                          const updated = [...tickerItems];
                          const temp = updated[index - 1];
                          updated[index - 1] = updated[index];
                          updated[index] = temp;
                          setTickerItems(updated);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px solid #E6DCCD',
                          background: '#FFF',
                          color: index === 0 ? '#C4B5A5' : '#4B3621',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: index === 0 ? 'not-allowed' : 'pointer'
                        }}
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </button>

                      {/* Reorder Down */}
                      <button
                        type="button"
                        disabled={index === tickerItems.length - 1}
                        onClick={() => {
                          if (index === tickerItems.length - 1) return;
                          const updated = [...tickerItems];
                          const temp = updated[index + 1];
                          updated[index + 1] = updated[index];
                          updated[index] = temp;
                          setTickerItems(updated);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px solid #E6DCCD',
                          background: '#FFF',
                          color: index === tickerItems.length - 1 ? '#C4B5A5' : '#4B3621',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: index === tickerItems.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = tickerItems.filter((_, i) => i !== index);
                          setTickerItems(updated);
                          handleSaveTicker(updated);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px solid #FED7D7',
                          background: '#FFF5F5',
                          color: '#E53E3E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Delete item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bottom Save CTA */}
                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #ECE4D8', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => handleSaveTicker(tickerItems)}
                    disabled={isSavingTicker}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 28px',
                      background: '#D9822B',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: isSavingTicker ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingTicker ? 0.7 : 1
                    }}
                  >
                    <Check size={18} />
                    {isSavingTicker ? 'Saving...' : '✓ Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: FAQS & QUESTIONS ── */}
          {activeTab === 'faqs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5EE 100%)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #ECE4D8',
                  boxShadow: '0 4px 20px rgba(74, 34, 18, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(217, 130, 43, 0.12)',
                        color: '#D9822B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <HelpCircle size={20} />
                    </div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      Store FAQs & Question Management
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#736257', marginTop: '6px', marginBottom: 0 }}>
                    Add, edit, reorder or toggle customer questions displayed in the storefront FAQ section.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddFaq}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <Plus size={18} />
                  Add New Question
                </button>
              </div>

              {/* Filters & Search */}
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: '1px solid #ECE4D8',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                {/* Search Bar */}
                <div
                  style={{
                    position: 'relative',
                    flex: '1 1 300px',
                    maxWidth: '450px'
                  }}
                >
                  <Search
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#8A7669'
                    }}
                  />
                  <input
                    type="text"
                    value={faqSearchQuery}
                    onChange={e => setFaqSearchQuery(e.target.value)}
                    placeholder="Search questions or answers..."
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.88rem',
                      color: '#20100A',
                      background: '#FAF8F5',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['All', 'Purity & Quality', 'Diet & Health', 'Storage & Freshness', 'Samples & Orders', 'General'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFaqCategoryFilter(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: faqCategoryFilter === cat ? '1.5px solid #D9822B' : '1.5px solid #ECE4D8',
                        background: faqCategoryFilter === cat ? 'rgba(217, 130, 43, 0.12)' : '#FAF8F5',
                        color: faqCategoryFilter === cat ? '#D9822B' : '#736257',
                        fontWeight: faqCategoryFilter === cat ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQs List */}
              {(() => {
                const filtered = faqsList
                  .filter(faq => {
                    const matchesCategory = faqCategoryFilter === 'All' || (faq.category || 'General').toLowerCase() === faqCategoryFilter.toLowerCase();
                    const q = faqSearchQuery.toLowerCase();
                    const matchesSearch = !q || (faq.question && faq.question.toLowerCase().includes(q)) || (faq.answer && faq.answer.toLowerCase().includes(q));
                    return matchesCategory && matchesSearch;
                  })
                  .sort((a, b) => (a.order || 0) - (b.order || 0));

                if (filtered.length === 0) {
                  return (
                    <div
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '60px 20px',
                        textAlign: 'center',
                        border: '1px dashed #D6C8BC'
                      }}
                    >
                      <HelpCircle size={44} style={{ color: '#C2B4A8', margin: '0 auto 14px' }} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                        No FAQ Questions Found
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: '#8A7669', marginBottom: '20px' }}>
                        {faqSearchQuery || faqCategoryFilter !== 'All'
                          ? 'Try adjusting your search query or category filter.'
                          : 'You haven’t added any FAQ items yet. Click below to add one!'}
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddFaq}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          background: '#D9822B',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={16} /> Add First Question
                      </button>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filtered.map((faq, idx) => (
                      <div
                        key={faq.id || idx}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '14px',
                          border: '1px solid #ECE4D8',
                          padding: '20px 24px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '20px',
                          opacity: faq.isActive !== false ? 1 : 0.65,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          {/* Badges row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background: '#F5ECE3',
                                color: '#4A2212',
                                padding: '3px 10px',
                                borderRadius: '6px'
                              }}
                            >
                              Order #{faq.order || idx + 1}
                            </span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: 'rgba(217, 130, 43, 0.12)',
                                color: '#D9822B',
                                padding: '3px 10px',
                                borderRadius: '6px'
                              }}
                            >
                              {faq.category || 'General'}
                            </span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '3px 10px',
                                borderRadius: '6px',
                                background: faq.isActive !== false ? 'rgba(34, 197, 94, 0.12)' : 'rgba(156, 163, 175, 0.15)',
                                color: faq.isActive !== false ? '#15803D' : '#6B7280'
                              }}
                            >
                              {faq.isActive !== false ? '● Live on Store' : '○ Hidden'}
                            </span>
                          </div>

                          {/* Question */}
                          <h3
                            style={{
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              color: '#20100A',
                              marginBottom: '8px',
                              lineHeight: 1.4
                            }}
                          >
                            {faq.question}
                          </h3>

                          {/* Answer */}
                          <p
                            style={{
                              fontSize: '0.9rem',
                              color: '#5A463B',
                              lineHeight: 1.55,
                              margin: 0,
                              whiteSpace: 'pre-line'
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          {/* Toggle Active status */}
                          <button
                            type="button"
                            title={faq.isActive !== false ? 'Hide from store' : 'Publish to store'}
                            onClick={() => handleToggleFaqStatus(faq)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #ECE4D8',
                              background: '#FAF8F5',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: faq.isActive !== false ? '#4A3B32' : '#8A7669'
                            }}
                          >
                            {faq.isActive !== false ? <Eye size={15} color="#15803D" /> : <EyeOff size={15} color="#9CA3AF" />}
                            <span>{faq.isActive !== false ? 'Active' : 'Hidden'}</span>
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            title="Edit FAQ"
                            onClick={() => handleOpenEditFaq(faq)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #D9822B',
                              background: 'rgba(217, 130, 43, 0.08)',
                              color: '#D9822B',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700
                            }}
                          >
                            <Edit3 size={15} />
                            <span>Edit</span>
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            title="Delete FAQ"
                            onClick={() => handleDeleteFaq(faq.id, faq.question)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #FCA5A5',
                              background: '#FEF2F2',
                              color: '#DC2626',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── TAB: PURE CRAFT & STORY ── */}
          {activeTab === 'craft' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header Configuration Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5EE 100%)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #ECE4D8',
                  boxShadow: '0 4px 20px rgba(74, 34, 18, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(217, 130, 43, 0.12)',
                      color: '#D9822B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      Our Story — The Pure Craft & Process Story
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#736257', marginTop: '2px', marginBottom: 0 }}>
                      Control the Our Story section badge, heading, and individual process cards displayed on the storefront.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCraftHeader} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                        Section Badge Tag
                      </label>
                      <input
                        type="text"
                        value={craftBadge}
                        onChange={e => setCraftBadge(e.target.value)}
                        placeholder="e.g. THE PURE CRAFT"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid #ECE4D8',
                          fontSize: '0.88rem',
                          color: '#20100A',
                          background: '#FAF8F5',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                        Main Section Heading
                      </label>
                      <input
                        type="text"
                        value={craftHeading}
                        onChange={e => setCraftHeading(e.target.value)}
                        placeholder="e.g. From Gujarat Soil to Your Spoon"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid #ECE4D8',
                          fontSize: '0.88rem',
                          color: '#20100A',
                          background: '#FAF8F5',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Subheading / Mission Description
                    </label>
                    <textarea
                      rows={2}
                      value={craftDesc}
                      onChange={e => setCraftDesc(e.target.value)}
                      placeholder="e.g. No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        lineHeight: 1.5
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={isSavingCraftHeader}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: isSavingCraftHeader ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                        opacity: isSavingCraftHeader ? 0.7 : 1
                      }}
                    >
                      {isSavingCraftHeader ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      {isSavingCraftHeader ? 'Saving Header...' : 'Save Section Header'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Steps Management List */}
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #ECE4D8',
                  boxShadow: '0 4px 20px rgba(74, 34, 18, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      Process & Crafting Steps ({craftSteps.length})
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#736257', margin: '3px 0 0' }}>
                      Individual process cards (01, 02, 03, 04...) shown on the website store.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddCraftStep}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: '#D9822B',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)'
                    }}
                  >
                    <Plus size={16} /> Add New Step
                  </button>
                </div>

                {/* Steps Cards Grid */}
                {craftSteps.length === 0 ? (
                  <div
                    style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      border: '1px dashed #D6C8BC',
                      borderRadius: '12px',
                      background: '#FAF8F5'
                    }}
                  >
                    <ShieldCheck size={40} style={{ color: '#C2B4A8', margin: '0 auto 10px' }} />
                    <p style={{ color: '#8A7669', fontSize: '0.9rem', margin: 0 }}>
                      No craft steps found. Click &quot;Add New Step&quot; above to create one.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '16px'
                    }}
                  >
                    {[...craftSteps].sort((a, b) => (a.order || 0) - (b.order || 0)).map((step, idx) => (
                      <div
                        key={step.id || idx}
                        style={{
                          background: '#FAF8F5',
                          borderRadius: '14px',
                          border: '1.5px solid #ECE4D8',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '14px',
                          opacity: step.isActive !== false ? 1 : 0.65,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          {/* Top row: Number + Icon + Status */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '1.4rem',
                                  fontWeight: 900,
                                  color: '#D9822B',
                                  fontFamily: 'monospace'
                                }}
                              >
                                {step.num || `0${idx + 1}`}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: '#F5ECE3',
                                  color: '#4A2212',
                                  padding: '2px 8px',
                                  borderRadius: '4px'
                                }}
                              >
                                #{step.order || idx + 1}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: step.isActive !== false ? 'rgba(34, 197, 94, 0.12)' : 'rgba(156, 163, 175, 0.15)',
                                  color: step.isActive !== false ? '#15803D' : '#6B7280'
                                }}
                              >
                                {step.isActive !== false ? 'Live' : 'Hidden'}
                              </span>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'rgba(217, 130, 43, 0.15)',
                                  color: '#D9822B',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Sparkles size={16} />
                              </div>
                            </div>
                          </div>

                          {/* Subtitle tag */}
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D9822B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                            {step.subtitle}
                          </div>

                          {/* Title */}
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#20100A', margin: '0 0 8px', lineHeight: 1.35 }}>
                            {step.title}
                          </h4>

                          {/* Description */}
                          <p style={{ fontSize: '0.84rem', color: '#5A463B', lineHeight: 1.55, margin: 0 }}>
                            {step.desc}
                          </p>
                        </div>

                        {/* Bottom action bar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #ECE4D8' }}>
                          <button
                            type="button"
                            title={step.isActive !== false ? 'Hide from storefront' : 'Publish to storefront'}
                            onClick={() => handleToggleCraftStepStatus(step)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #ECE4D8',
                              background: '#FFFFFF',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: step.isActive !== false ? '#15803D' : '#6B7280'
                            }}
                          >
                            {step.isActive !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                            <span>{step.isActive !== false ? 'Active' : 'Hidden'}</span>
                          </button>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditCraftStep(step)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #D9822B',
                                background: 'rgba(217, 130, 43, 0.08)',
                                color: '#D9822B',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCraftStep(step.id, step.title)}
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px solid #FCA5A5',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: LIFESTYLE & AUDIENCE ── */}
          {activeTab === 'lifestyle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header Configuration Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5EE 100%)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #ECE4D8',
                  boxShadow: '0 4px 20px rgba(74, 34, 18, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(217, 130, 43, 0.12)',
                      color: '#D9822B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Users size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      Who Is NUTTRYX Crafted For? — Lifestyle & Brand Focus
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#736257', marginTop: '2px', marginBottom: 0 }}>
                      Manage the target audience section, banner headings, and the 4 lifestyle benefit cards on the homepage.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveLifestyleHeader} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                        Section Badge Tag
                      </label>
                      <input
                        type="text"
                        value={lifestyleBadge}
                        onChange={e => setLifestyleBadge(e.target.value)}
                        placeholder="e.g. BUILT FOR EVERY LIFESTYLE"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid #ECE4D8',
                          fontSize: '0.88rem',
                          color: '#20100A',
                          background: '#FAF8F5',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                        Main Section Heading
                      </label>
                      <input
                        type="text"
                        value={lifestyleHeading}
                        onChange={e => setLifestyleHeading(e.target.value)}
                        placeholder="e.g. Who Is NUTTRYX Crafted For?"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid #ECE4D8',
                          fontSize: '0.88rem',
                          color: '#20100A',
                          background: '#FAF8F5',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Subheading Description
                    </label>
                    <textarea
                      rows={2}
                      value={lifestyleDesc}
                      onChange={e => setLifestyleDesc(e.target.value)}
                      placeholder="e.g. From high-performance gym workouts to busy laptop desks and school lunchboxes, our pure peanut butter fuels your daily journey."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        lineHeight: 1.5
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={isSavingLifestyleHeader}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: isSavingLifestyleHeader ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                        opacity: isSavingLifestyleHeader ? 0.7 : 1
                      }}
                    >
                      {isSavingLifestyleHeader ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      {isSavingLifestyleHeader ? 'Saving Header...' : 'Save Section Header'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Pillars Cards List */}
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #ECE4D8',
                  boxShadow: '0 4px 20px rgba(74, 34, 18, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      Audience & Lifestyle Cards ({lifestylePillars.length})
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#736257', margin: '3px 0 0' }}>
                      Cards highlighting Gym & Athletes, Students, Working Professionals, Kids & Families.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddPillar}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: '#D9822B',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)'
                    }}
                  >
                    <Plus size={16} /> Add New Card
                  </button>
                </div>

                {/* Cards Grid */}
                {lifestylePillars.length === 0 ? (
                  <div
                    style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      border: '1px dashed #D6C8BC',
                      borderRadius: '12px',
                      background: '#FAF8F5'
                    }}
                  >
                    <Users size={40} style={{ color: '#C2B4A8', margin: '0 auto 10px' }} />
                    <p style={{ color: '#8A7669', fontSize: '0.9rem', margin: 0 }}>
                      No lifestyle cards found. Click &quot;Add New Card&quot; to create one.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '16px'
                    }}
                  >
                    {[...lifestylePillars].sort((a, b) => (a.order || 0) - (b.order || 0)).map((pillar, idx) => (
                      <div
                        key={pillar.id || idx}
                        style={{
                          background: '#FAF8F5',
                          borderRadius: '14px',
                          border: '1.5px solid #ECE4D8',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '14px',
                          opacity: pillar.isActive !== false ? 1 : 0.65,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          {/* Top row: Icon + Order + Status */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: '#FFFFFF',
                                color: '#D9822B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                              }}
                            >
                              <Dumbbell size={20} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: '#F5ECE3',
                                  color: '#4A2212',
                                  padding: '2px 8px',
                                  borderRadius: '4px'
                                }}
                              >
                                #{pillar.order || idx + 1}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: pillar.isActive !== false ? 'rgba(34, 197, 94, 0.12)' : 'rgba(156, 163, 175, 0.15)',
                                  color: pillar.isActive !== false ? '#15803D' : '#6B7280'
                                }}
                              >
                                {pillar.isActive !== false ? 'Live' : 'Hidden'}
                              </span>
                            </div>
                          </div>

                          {/* Subtitle tag */}
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B87024', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                            {pillar.subtitle}
                          </div>

                          {/* Title */}
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#20100A', margin: '0 0 8px', lineHeight: 1.35 }}>
                            {pillar.title}
                          </h4>

                          {/* Description */}
                          <p style={{ fontSize: '0.84rem', color: '#5A463B', lineHeight: 1.55, margin: '0 0 12px' }}>
                            {pillar.desc}
                          </p>

                          {/* Perk Badge */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#2D6A4F',
                              background: '#E8F5E9',
                              padding: '4px 10px',
                              borderRadius: '99px'
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>{pillar.perk}</span>
                          </div>
                        </div>

                        {/* Bottom action bar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #ECE4D8' }}>
                          <button
                            type="button"
                            title={pillar.isActive !== false ? 'Hide from storefront' : 'Publish to storefront'}
                            onClick={() => handleTogglePillarStatus(pillar)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #ECE4D8',
                              background: '#FFFFFF',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: pillar.isActive !== false ? '#15803D' : '#6B7280'
                            }}
                          >
                            {pillar.isActive !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                            <span>{pillar.isActive !== false ? 'Active' : 'Hidden'}</span>
                          </button>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditPillar(pillar)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #D9822B',
                                background: 'rgba(217, 130, 43, 0.08)',
                                color: '#D9822B',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePillar(pillar.id, pillar.title)}
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px solid #FCA5A5',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: BENEFIT & WHY NUTTRYX COMPARISON ── */}
          {activeTab === 'benefit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header Configuration Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5EE 100%)',
                  borderRadius: '16px',
                  border: '1.5px solid #ECE4D8',
                  padding: '24px 28px',
                  boxShadow: '0 4px 20px rgba(32, 16, 10, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(217, 130, 43, 0.12)',
                        color: '#D9822B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Award size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                        Why NUTTRYX Wins — Comparison Table Header
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#736257', margin: '2px 0 0 0' }}>
                        The Clean Label Revolution comparison table headings and trust footer banner
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveBenefitHeader}
                    disabled={isSavingBenefitHeader}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                      color: '#FFFFFF',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: isSavingBenefitHeader ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingBenefitHeader ? 0.7 : 1
                    }}
                  >
                    {isSavingBenefitHeader ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {isSavingBenefitHeader ? 'Saving...' : 'Save Header Settings'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#4A3B32', marginBottom: '6px' }}>
                      Badge Text (Golden Pill)
                    </label>
                    <input
                      type="text"
                      value={benefitBadge}
                      onChange={(e) => setBenefitBadge(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #ECE4D8',
                        background: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#20100A',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#4A3B32', marginBottom: '6px' }}>
                      Main Section Heading
                    </label>
                    <input
                      type="text"
                      value={benefitHeading}
                      onChange={(e) => setBenefitHeading(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #ECE4D8',
                        background: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: '#20100A',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#4A3B32', marginBottom: '6px' }}>
                      Section Subtitle / Mission Statement
                    </label>
                    <textarea
                      rows={2}
                      value={benefitDesc}
                      onChange={(e) => setBenefitDesc(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #ECE4D8',
                        background: '#FFFFFF',
                        fontSize: '0.86rem',
                        fontWeight: 500,
                        color: '#20100A',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#4A3B32', marginBottom: '6px' }}>
                      Footer Certification Trust Banner
                    </label>
                    <input
                      type="text"
                      value={benefitFooterBanner}
                      onChange={(e) => setBenefitFooterBanner(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #ECE4D8',
                        background: '#FFFFFF',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#20100A',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Comparison Rows List & Controls */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #ECE4D8',
                  padding: '24px 28px',
                  boxShadow: '0 4px 20px rgba(32, 16, 10, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#20100A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Comparison Parameters & Quality Rows
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '99px', background: '#D9822B', color: '#FFF' }}>
                        {benefitRows.length} Rows
                      </span>
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#736257', margin: '3px 0 0 0' }}>
                      Side-by-side comparison between NUTTRYX pure peanut butter and ordinary commercial brands
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddBenefitRow}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#20100A',
                      color: '#FAF7F2',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(32, 16, 10, 0.2)'
                    }}
                  >
                    <Plus size={16} color="#D9822B" /> Add Comparison Row
                  </button>
                </div>

                {benefitRows.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', background: '#FAF7F2', borderRadius: '12px', border: '1.5px dashed #D4B99D' }}>
                    <p style={{ color: '#736257', fontSize: '0.92rem', margin: '0 0 14px 0' }}>No comparison rows created yet.</p>
                    <button
                      onClick={handleOpenAddBenefitRow}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#D9822B',
                        color: '#FFF',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={15} /> Add First Row
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                      <thead>
                        <tr style={{ background: '#20100A', color: '#FAF7F2', fontSize: '0.82rem', letterSpacing: '0.02em' }}>
                          <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 0', width: '22%' }}>NUTRITIONAL STANDARD</th>
                          <th style={{ padding: '12px 16px', background: 'rgba(217, 130, 43, 0.25)', color: '#FFD199', width: '38%' }}>
                            🥜 NUTTRYX PURE PEANUT BUTTER
                          </th>
                          <th style={{ padding: '12px 16px', width: '25%', color: '#E8D4C8' }}>ORDINARY COMMERCIAL BRANDS</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center', width: '8%' }}>STATUS</th>
                          <th style={{ padding: '12px 16px', borderRadius: '0 8px 0 0', textAlign: 'right', width: '7%' }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {benefitRows.map((row, idx) => (
                          <tr
                            key={row.id || `row-${idx}`}
                            style={{
                              borderBottom: '1px solid #ECE4D8',
                              background: idx % 2 === 0 ? '#FFFFFF' : '#FAF7F2',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            <td style={{ padding: '14px 16px', fontWeight: 800, color: '#20100A', fontSize: '0.88rem' }}>
                              {row.feature}
                            </td>
                            <td style={{ padding: '14px 16px', background: 'rgba(217, 130, 43, 0.05)', fontSize: '0.85rem', fontWeight: 600, color: '#1E3A1A' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#DEF7EC', color: '#03543F' }}>
                                  ✓
                                </span>
                                <span>{row.nuttryx}</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '0.84rem', color: '#736257' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#FDE8E8', color: '#9B1C1C' }}>
                                  ✕
                                </span>
                                <span>{row.regular}</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleBenefitRowStatus(row)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '99px',
                                  border: 'none',
                                  background: row.isActive !== false ? '#DEF7EC' : '#F3F4F6',
                                  color: row.isActive !== false ? '#03543F' : '#6B7280',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {row.isActive !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                                {row.isActive !== false ? 'Live' : 'Hidden'}
                              </button>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditBenefitRow(row)}
                                  title="Edit Row"
                                  style={{
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #ECE4D8',
                                    background: '#FFFFFF',
                                    color: '#4A3B32',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBenefitRow(row.id, row.feature)}
                                  title="Delete Row"
                                  style={{
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #FCA5A5',
                                    background: '#FEF2F2',
                                    color: '#DC2626',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: CUSTOMER REVIEWS & TESTIMONIALS ── */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Reviews Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #ECE4D8',
                    padding: '20px 24px',
                    boxShadow: '0 4px 16px rgba(32, 16, 10, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#736257' }}>Total Reviews</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(217, 130, 43, 0.12)', color: '#D9822B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquareHeart size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#20100A' }}>
                    {reviewsList.length}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>Real customer experiences</span>
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #ECE4D8',
                    padding: '20px 24px',
                    boxShadow: '0 4px 16px rgba(32, 16, 10, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#736257' }}>5-Star Ratings</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star size={18} fill="#D97706" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#20100A' }}>
                    {reviewsList.filter(r => r.rating === 5).length}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 700 }}>
                    {reviewsList.length > 0 ? `${Math.round((reviewsList.filter(r => r.rating === 5).length / reviewsList.length) * 100)}% satisfaction` : '100%'}
                  </span>
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #ECE4D8',
                    padding: '20px 24px',
                    boxShadow: '0 4px 16px rgba(32, 16, 10, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#736257' }}>Live on Website</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#20100A' }}>
                    {reviewsList.filter(r => r.isActive !== false).length}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#03543F', fontWeight: 700 }}>Visible to shoppers</span>
                </div>
              </div>

              {/* Reviews Controls & List */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #ECE4D8',
                  padding: '24px 28px',
                  boxShadow: '0 4px 20px rgba(32, 16, 10, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                      <Search size={16} color="#736257" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Search reviews by name, comment, flavour..."
                        value={reviewSearchQuery}
                        onChange={(e) => setReviewSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #ECE4D8',
                          fontSize: '0.84rem',
                          outline: 'none',
                          color: '#20100A'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleOpenAddReview}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#20100A',
                      color: '#FAF7F2',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(32, 16, 10, 0.2)'
                    }}
                  >
                    <Plus size={16} color="#D9822B" /> Add Review
                  </button>
                </div>

                {reviewsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', background: '#FAF7F2', borderRadius: '12px', border: '1.5px dashed #D4B99D' }}>
                    <p style={{ color: '#736257', fontSize: '0.92rem', margin: '0 0 14px 0' }}>No reviews found in database.</p>
                    <button
                      onClick={handleOpenAddReview}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#D9822B',
                        color: '#FFF',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={15} /> Add First Review
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {reviewsList
                      .filter(r => {
                        if (!reviewSearchQuery.trim()) return true;
                        const q = reviewSearchQuery.toLowerCase();
                        return (
                          (r.name && r.name.toLowerCase().includes(q)) ||
                          (r.comment && r.comment.toLowerCase().includes(q)) ||
                          (r.flavour && r.flavour.toLowerCase().includes(q)) ||
                          (r.role && r.role.toLowerCase().includes(q))
                        );
                      })
                      .map((rev) => (
                        <div
                          key={rev.id}
                          style={{
                            background: '#FAF7F2',
                            borderRadius: '14px',
                            border: '1.5px solid #ECE4D8',
                            padding: '18px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px',
                            position: 'relative'
                          }}
                        >
                          <div>
                            {/* Top row: Name, Flavour badge, and Status */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                              <div>
                                <h4 style={{ fontSize: '0.96rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                                  {rev.name}
                                </h4>
                                <span style={{ fontSize: '0.76rem', color: '#736257', fontWeight: 600 }}>
                                  {rev.role}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '3px 8px',
                                  borderRadius: '99px',
                                  background: rev.isActive !== false ? '#DEF7EC' : '#F3F4F6',
                                  color: rev.isActive !== false ? '#03543F' : '#6B7280'
                                }}
                              >
                                {rev.isActive !== false ? 'Live' : 'Hidden'}
                              </span>
                            </div>

                            {/* Rating and Flavour Pill */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    fill={i < rev.rating ? '#D9822B' : 'transparent'}
                                    color={i < rev.rating ? '#D9822B' : '#C7B9B0'}
                                  />
                                ))}
                              </div>
                              {rev.flavour && (
                                <span style={{ fontSize: '0.72rem', background: '#F3ECE2', color: '#4A3B32', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                  {rev.flavour}
                                </span>
                              )}
                              {rev.isVerified !== false && (
                                <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <CheckCircle2 size={12} /> Verified
                                </span>
                              )}
                            </div>

                            {/* Comment */}
                            <p style={{ fontSize: '0.84rem', color: '#3A2E27', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                          </div>

                          {/* Footer Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #ECE4D8' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleReviewStatus(rev)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: rev.isActive !== false ? '#059669' : '#6B7280',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {rev.isActive !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                              {rev.isActive !== false ? 'Active on store' : 'Hidden from store'}
                            </button>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditReview(rev)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #ECE4D8',
                                  background: '#FFFFFF',
                                  color: '#20100A',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Edit3 size={12} color="#D9822B" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(rev.id, rev.name)}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #FCA5A5',
                                  background: '#FEF2F2',
                                  color: '#DC2626',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 7: FACTORY & SUPPORT SETTINGS ── */}
          {activeTab === 'settings' && (
            <div>
              {/* Header and Save CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20100A', marginBottom: '4px' }}>
                    Factory, Location & Support Settings
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#736257' }}>
                    Website footer aur contact pages par display hone wali company location, phone number, email aur FSSAI licence yahan se change karein.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const defaults = {
                        companyName: 'NUTTRYX Foods Pvt Ltd',
                        factoryAddress: 'NUTTRYX Foods Pvt Ltd, GIDC Agro Park, Rajkot - Saurashtra, Gujarat 360003',
                        googleMapsUrl: 'https://maps.google.com/?q=GIDC+Agro+Park+Rajkot+Gujarat+360003',
                        supportPhone: '+91 98765 43210',
                        supportHours: '(Mon - Sat, 10am - 7pm)',
                        supportEmail: 'care@nuttryx.com',
                        fssaiNumber: '11524999000123',
                        instagramUrl: 'https://instagram.com',
                        facebookUrl: 'https://facebook.com',
                        twitterUrl: 'https://twitter.com',
                        youtubeUrl: 'https://youtube.com',
                        whatsappNumber: '+91 98765 43210'
                      };
                      setStoreSettings(defaults);
                      handleSaveSettings(defaults);
                    }}
                    style={{
                      padding: '10px 16px',
                      background: '#FFF',
                      border: '1.5px solid #E6DCCD',
                      borderRadius: '10px',
                      color: '#736257',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={() => handleSaveSettings(storeSettings)}
                    disabled={isSavingSettings}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#D9822B',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: isSavingSettings ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingSettings ? 0.7 : 1
                    }}
                  >
                    <Check size={16} />
                    {isSavingSettings ? 'Saving...' : '✓ Save Settings'}
                  </button>
                </div>
              </div>

              {/* Live Footer Preview Box */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A7669' }}>
                    🔴 Live Website Footer Preview (Customer ko aisa dikhega)
                  </span>
                  <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
                    Clickable Links Active
                  </span>
                </div>

                <div style={{ background: '#1A0D07', borderRadius: '12px', padding: '22px 24px', border: '1px solid rgba(217, 130, 43, 0.35)', color: '#D5C4B8' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                    FACTORY & SUPPORT
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '0.86rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <MapPin size={18} color="#D9822B" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFD199' }}>Factory & HQ Address:</div>
                        <div>{storeSettings.factoryAddress}</div>
                        <span style={{ fontSize: '0.72rem', color: '#B5A092' }}>🔗 Google Maps link attached</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Phone size={16} color="#D9822B" style={{ flexShrink: 0 }} />
                        <span>{storeSettings.supportPhone} <span style={{ color: '#9E8B7F', fontSize: '0.78rem' }}>{storeSettings.supportHours}</span></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Mail size={16} color="#D9822B" style={{ flexShrink: 0 }} />
                        <span>{storeSettings.supportEmail}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.82rem' }}>
                        <ShieldCheck size={16} color="#10B981" />
                        <span>FSSAI Lic. No: {storeSettings.fssaiNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px', marginBottom: '24px' }}>
                
                {/* Section 1: Factory Location & Address */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <MapPin size={20} color="#D9822B" />
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                      Factory Location & Address
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        Company / Entity Name *
                      </label>
                      <input
                        type="text"
                        value={storeSettings.companyName}
                        onChange={(e) => setStoreSettings({ ...storeSettings, companyName: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        Physical Factory Address (Footer me dikhega) *
                      </label>
                      <textarea
                        rows={3}
                        value={storeSettings.factoryAddress}
                        onChange={(e) => setStoreSettings({ ...storeSettings, factoryAddress: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        Google Maps Location Link (Customer address click karega to khulega)
                      </label>
                      <input
                        type="text"
                        placeholder="https://maps.google.com/?q=..."
                        value={storeSettings.googleMapsUrl}
                        onChange={(e) => setStoreSettings({ ...storeSettings, googleMapsUrl: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Customer Support & Contact */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Phone size={20} color="#D9822B" />
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                      Customer Support & Helplines
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        Support Helpline Phone Number *
                      </label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={storeSettings.supportPhone}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        Operating Hours / Working Timing
                      </label>
                      <input
                        type="text"
                        placeholder="(Mon - Sat, 10am - 7pm)"
                        value={storeSettings.supportHours}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportHours: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        Support Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="care@nuttryx.com"
                        value={storeSettings.supportEmail}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        WhatsApp Business Support Number
                      </label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={storeSettings.whatsappNumber}
                        onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Licensing & Regulatory */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ShieldCheck size={20} color="#10B981" />
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                      FSSAI & Regulatory Compliance
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '6px' }}>
                        FSSAI License Registration Number *
                      </label>
                      <input
                        type="text"
                        placeholder="11524999000123"
                        value={storeSettings.fssaiNumber}
                        onChange={(e) => setStoreSettings({ ...storeSettings, fssaiNumber: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', color: '#20100A', outline: 'none', fontWeight: 700 }}
                      />
                      <p style={{ fontSize: '0.76rem', color: '#8A7669', marginTop: '6px', marginBottom: 0 }}>
                        Yeh number footer me green badge ke sath display hota hai trust build karne ke liye.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Social Media Channels */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ExternalLink size={20} color="#D9822B" />
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                      Social Media Links
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                        Instagram Profile Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/nuttryx"
                        value={storeSettings.instagramUrl}
                        onChange={(e) => setStoreSettings({ ...storeSettings, instagramUrl: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.86rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                        Facebook Page Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://facebook.com/nuttryx"
                        value={storeSettings.facebookUrl}
                        onChange={(e) => setStoreSettings({ ...storeSettings, facebookUrl: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.86rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                        Twitter / X Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://twitter.com/nuttryx"
                        value={storeSettings.twitterUrl}
                        onChange={(e) => setStoreSettings({ ...storeSettings, twitterUrl: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.86rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                        YouTube Channel Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/@nuttryx"
                        value={storeSettings.youtubeUrl}
                        onChange={(e) => setStoreSettings({ ...storeSettings, youtubeUrl: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.86rem', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Save CTA */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECE4D8', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div>
                  <span style={{ fontWeight: 800, color: '#20100A', fontSize: '0.95rem' }}>
                    Save Factory & Support Changes
                  </span>
                  <p style={{ fontSize: '0.8rem', color: '#736257', margin: 0 }}>
                    Changes save hote hi website footer me instant bina refresh ke update ho jayenge.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSettings(storeSettings)}
                  disabled={isSavingSettings}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: '#D9822B',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: isSavingSettings ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                    opacity: isSavingSettings ? 0.7 : 1
                  }}
                >
                  <Check size={18} />
                  {isSavingSettings ? 'Saving...' : '✓ Save Settings'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Modal: Add Product ── */}
        {showAddProductModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <div 
              className="modal-scrollbar"
              style={{ 
                background: '#FFFFFF', 
                padding: '28px 30px', 
                borderRadius: '24px', 
                width: '560px', 
                maxWidth: '95%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F3ECE2', paddingBottom: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                    Add New Peanut Butter Product
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#736257', marginTop: '2px' }}>
                    Enter product details, pricing, and upload or link a jar image.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowAddProductModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#8A7669' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                    Product Title *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. NUTTRYX Organic Honey Peanut Butter"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select 
                    value={newProductCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setNewProductCategory(cat);
                      if (imageInputMode === 'preset') {
                        if (cat === 'chocolate') setNewProductImage('/images/dark-chocolate-peanut-butter.jpg');
                        else if (cat === 'combos') setNewProductImage('/images/crunchy-peanut-butter.jpg');
                        else setNewProductImage('/images/creamy-peanut-butter.jpg');
                      }
                    }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', background: '#FFFFFF' }}
                  >
                    <option value="protein">High Protein Classics</option>
                    <option value="chocolate">Dark Chocolate</option>
                    <option value="combos">Bundles & Combos</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Price (₹) *</label>
                    <input 
                      type="number" 
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(Number(e.target.value))}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Size / Weight *</label>
                    <input 
                      type="text" 
                      value={newProductWeight}
                      onChange={(e) => setNewProductWeight(e.target.value)}
                      required
                      placeholder="e.g. 500g or 1kg"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* ── Image Selector: Upload / Link / Preset ── */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#20100A' }}>
                      Product Jar Image
                    </label>
                    <span 
                      style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        color: '#B55A00', 
                        background: '#FFF3E0', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        border: '1px solid #FFE0B2'
                      }}
                    >
                      📐 Recommended: 800 × 800 px (Square)
                    </span>
                  </div>

                  {/* Mode Toggles: Upload, URL Link, Preset */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    {[
                      { id: 'upload', label: 'Upload from Device', icon: Upload },
                      { id: 'url', label: 'Image URL Link', icon: LinkIcon },
                      { id: 'preset', label: 'Nuttryx Presets', icon: ImageIcon },
                    ].map((mode) => {
                      const isActive = imageInputMode === mode.id;
                      const IconComponent = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setImageInputMode(mode.id as any)}
                          style={{
                            flex: 1,
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: isActive ? '1.5px solid #20100A' : '1px solid #ECE2D5',
                            background: isActive ? '#20100A' : '#FAF7F2',
                            color: isActive ? '#FFFFFF' : '#5C4A3E',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <IconComponent size={13} />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Option 1: File Upload */}
                  {imageInputMode === 'upload' && (
                    <div
                      style={{
                        border: '2px dashed #D9822B',
                        borderRadius: '12px',
                        padding: '18px 14px',
                        textAlign: 'center',
                        background: '#FDF9F5',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                          zIndex: 2
                        }}
                      />
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5EAE0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                        <Upload size={18} color="#D9822B" />
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#20100A' }}>
                        {uploadFileName ? `Selected: ${uploadFileName}` : 'Click or Drag to Upload Product Image'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#736257', marginTop: '2px' }}>
                        Supports JPG, PNG, WebP (Max 5MB)
                      </div>
                    </div>
                  )}

                  {/* Option 2: Image URL */}
                  {imageInputMode === 'url' && (
                    <div>
                      <div style={{ position: 'relative' }}>
                        <LinkIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7669' }} />
                        <input 
                          type="text" 
                          placeholder="Paste image URL (e.g. https://... or /images/...)"
                          value={newProductImage}
                          onChange={(e) => setNewProductImage(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '10px', border: '1px solid #ECE4D8', fontSize: '0.86rem', outline: 'none' }}
                        />
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#736257', marginTop: '4px' }}>
                        Enter a direct link to any hosted image or a file inside /public/images/.
                      </p>
                    </div>
                  )}

                  {/* Option 3: Nuttryx Presets */}
                  {imageInputMode === 'preset' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {[
                        { label: 'Dark Chocolate', path: '/images/dark-chocolate-peanut-butter.jpg' },
                        { label: 'Natural Creamy', path: '/images/creamy-peanut-butter.jpg' },
                        { label: 'Roasted Crunchy', path: '/images/crunchy-peanut-butter.jpg' }
                      ].map((preset) => {
                        const isSelected = newProductImage === preset.path;
                        return (
                          <div
                            key={preset.path}
                            onClick={() => setNewProductImage(preset.path)}
                            style={{
                              border: isSelected ? '2px solid #D9822B' : '1px solid #ECE4D8',
                              borderRadius: '10px',
                              padding: '8px',
                              cursor: 'pointer',
                              background: isSelected ? '#FFF8F0' : '#FFFFFF',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ position: 'relative', height: '64px', width: '100%', borderRadius: '6px', overflow: 'hidden', marginBottom: '4px' }}>
                              <Image src={preset.path} alt={preset.label} fill style={{ objectFit: 'contain' }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isSelected ? '#D9822B' : '#5C4A3E' }}>
                              {isSelected ? '✓ ' : ''}{preset.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Live Selected Image Preview */}
                  {newProductImage && (
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#FAF6F0',
                        border: '1px solid #ECE2D5',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        marginTop: '12px'
                      }}
                    >
                      <div 
                        style={{
                          position: 'relative',
                          width: '54px',
                          height: '54px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: '#FFFFFF',
                          border: '1px solid #E2D7CA',
                          flexShrink: 0
                        }}
                      >
                        <Image 
                          src={newProductImage} 
                          alt="Product Preview" 
                          fill 
                          style={{ objectFit: 'contain' }} 
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#20100A' }}>
                          ✓ Image Ready for Catalog
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#736257', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {uploadFileName || newProductImage}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddProductModal(false);
                      setUploadFileName('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '9999px',
                      border: '1.5px solid #ECE4D8',
                      background: '#FFFFFF',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#20100A',
                      fontSize: '0.9rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{
                      flex: 1.5,
                      padding: '12px',
                      borderRadius: '9999px',
                      border: 'none',
                      background: '#20100A',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 14px rgba(32, 16, 10, 0.22)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#381C12')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#20100A')}
                  >
                    Save Product to Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal: Delete Confirmation Popup ── */}
        {productToDelete && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div 
              style={{ 
                background: '#FFFFFF', 
                padding: '28px', 
                borderRadius: '16px', 
                width: '420px', 
                maxWidth: '90%',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#FFF5F5',
                  color: '#E53E3E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <Trash2 size={24} />
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20100A', marginBottom: '8px' }}>
                Delete this Product?
              </h2>

              <p style={{ fontSize: '0.88rem', color: '#736257', marginBottom: '20px', lineHeight: 1.5 }}>
                Are you sure you want to remove <strong>&quot;{productToDelete.name}&quot;</strong> from your catalog? This action cannot be undone.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setProductToDelete(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1.5px solid #ECE4D8',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#20100A',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={confirmDeleteProduct}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#E53E3E',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal: Add / Edit Hero Slide ── */}
        {showSlideModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <div 
              style={{ 
                background: '#FFFFFF', 
                padding: '30px', 
                borderRadius: '18px', 
                width: '640px', 
                maxWidth: '95%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #F3ECE2', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    background: editingSlide ? '#20100A' : '#D9822B', 
                    color: '#FAF7F2', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 900, 
                    fontSize: '1.15rem', 
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    {editingSlide ? `#${editingSlide.order}` : '+'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#20100A', margin: 0, lineHeight: 1.25 }}>
                        {editingSlide ? `Edit Slide #${editingSlide.order}: ${editingSlide.name}` : `+ Add New Hero Slide (Slide #${slidesList.length + 1})`}
                      </h2>
                      {editingSlide ? (
                        <span style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ● Editing Single Slide
                        </span>
                      ) : (
                        <span style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                          + Fresh Blank Slide
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#736257', marginTop: '4px', marginBottom: 0 }}>
                      {editingSlide 
                        ? `Aap sirf Slide #${editingSlide.order} (${editingSlide.name}) ko edit kar rahe hain. Baaki slides bilkul safe rahenge.` 
                        : `Naya hero slide banayein. Saare fields bilkul fresh aur khali hain.`}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowSlideModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#8A7669', padding: '4px', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSlide} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Slide Name & Subtitle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                      Slide Name / Label *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dark Chocolate Festive Banner"
                      value={slideName}
                      onChange={(e) => setSlideName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                      Top Slogan / Subtitle
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. PURE PEANUT BUTTER"
                      value={slideSubtitle}
                      onChange={(e) => setSlideSubtitle(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Title Line 1 & Line 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                      Headline Line 1 *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Creamy. Roasted."
                      value={slideTitle1}
                      onChange={(e) => setSlideTitle1(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                      Headline Line 2 *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Protein Rich."
                      value={slideTitle2}
                      onChange={(e) => setSlideTitle2(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>
                    Paragraph Description
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="Fuel your fitness, work, and daily life with the natural power of real peanuts."
                    value={slideDesc}
                    onChange={(e) => setSlideDesc(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {/* ═══ Banner Image: Single Preview + Upload & Link Options ═══ */}
                <div style={{ background: '#FAF7F2', border: '1px solid #ECE4D8', borderRadius: '14px', padding: '16px' }}>
                  
                  {/* Section Title & Dimensions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
                    <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#20100A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={16} color="#D9822B" /> Banner Image
                    </label>
                    <span 
                      style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 800, 
                        color: '#B55A00', 
                        background: '#FFF3E0', 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        border: '1px solid #FFE0B2'
                      }}
                    >
                      📐 Recommended: 1920 × 800 px
                    </span>
                  </div>

                  {/* 1. Ek Image Show Ho: Single Live Banner Preview */}
                  <div style={{ marginBottom: '14px' }}>
                    {slideImage ? (
                      <div 
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '175px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#20100A',
                          border: '2px solid #D9822B',
                          boxShadow: '0 4px 14px rgba(217, 130, 43, 0.18)'
                        }}
                      >
                        <Image 
                          src={slideImage} 
                          alt={slideName || "Hero Banner Preview"} 
                          fill 
                          unoptimized={slideImage.startsWith('data:') || slideImage.startsWith('http')}
                          style={{ objectFit: 'cover' }} 
                        />
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(32, 16, 10, 0.88)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Check size={12} color="#10B981" /> Active Hero Banner Preview
                        </div>
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                          <span style={{ background: 'rgba(255, 255, 255, 0.92)', color: '#20100A', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {slideImageFileName ? `File: ${slideImageFileName}` : slideImage.startsWith('data:') ? 'Custom Uploaded Image' : slideImage}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSlideImage('');
                              setSlideImageFileName('');
                            }}
                            style={{
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#FFF',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '3px 8px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        style={{
                          width: '100%',
                          height: '130px',
                          borderRadius: '12px',
                          border: '2px dashed #D2C5B8',
                          background: '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          color: '#8A7669'
                        }}
                      >
                        <ImageIcon size={28} color="#B5A496" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#20100A' }}>Koi banner image selected nahi hai</span>
                        <span style={{ fontSize: '0.74rem', color: '#736257' }}>Neeche se computer se upload karein ya image link paste karein</span>
                      </div>
                    )}
                  </div>

                  {/* 2. Mode Toggles: Upload, Image Link / URL, Presets */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    {[
                      { id: 'upload', label: 'Upload from Device', icon: Upload },
                      { id: 'url', label: 'Image URL Link', icon: LinkIcon },
                      { id: 'preset', label: 'Nuttryx Presets', icon: ImageIcon }
                    ].map((mode) => {
                      const isActive = slideImageMode === mode.id;
                      const IconComp = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setSlideImageMode(mode.id as 'upload' | 'url' | 'preset')}
                          style={{
                            flex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: isActive ? '1.5px solid #D9822B' : '1px solid #ECE4D8',
                            background: isActive ? '#FFF7ED' : '#FFFFFF',
                            color: isActive ? '#9A3412' : '#736257',
                            fontWeight: isActive ? 800 : 600,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <IconComp size={14} color={isActive ? '#D9822B' : '#8A7669'} />
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Option 1: File Upload */}
                  {slideImageMode === 'upload' && (
                    <div
                      style={{
                        border: '2px dashed #D9822B',
                        borderRadius: '10px',
                        padding: '16px 12px',
                        textAlign: 'center',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlideImageUpload}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F5EAE0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                        <Upload size={18} color="#D9822B" />
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#20100A' }}>
                        {slideImageFileName ? `✓ Selected: ${slideImageFileName}` : 'Click ya Drag karke Banner Image Upload karein'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#736257', marginTop: '2px' }}>
                        Supports JPG, PNG, WebP (Ideal 1920 × 800 px, Max 5MB)
                      </div>
                    </div>
                  )}

                  {/* Option 2: Image URL / Link */}
                  {slideImageMode === 'url' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/... ya /images/...)"
                        value={slideImage}
                        onChange={(e) => {
                          setSlideImage(e.target.value);
                          setSlideImageFileName('');
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ECE4D8', fontSize: '0.84rem', outline: 'none', background: '#FFFFFF' }}
                      />
                      <p style={{ fontSize: '0.72rem', color: '#736257', marginTop: '4px', marginBottom: 0 }}>
                        💡 Direct image CDN link ya website ke `/images/...` path ka link paste karein. Upar live preview turant update hoga.
                      </p>
                    </div>
                  )}

                  {/* Option 3: Presets */}
                  {slideImageMode === 'preset' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {[
                          { label: 'Dark Chocolate', path: '/images/hero-bg-dark-chocolate.jpg' },
                          { label: 'Natural Creamy', path: '/images/hero-bg-creamy.jpg' },
                          { label: 'Roasted Crunchy', path: '/images/hero-bg-crunchy.jpg' }
                        ].map((imgOpt) => {
                          const isSelected = slideImage === imgOpt.path;
                          return (
                            <div
                              key={imgOpt.path}
                              onClick={() => {
                                setSlideImage(imgOpt.path);
                                setSlideImageFileName('');
                              }}
                              style={{
                                border: isSelected ? '2px solid #D9822B' : '1px solid #ECE4D8',
                                borderRadius: '8px',
                                padding: '6px',
                                cursor: 'pointer',
                                background: isSelected ? '#FFF8F0' : '#FFFFFF',
                                textAlign: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ position: 'relative', height: '54px', width: '100%', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                                <Image src={imgOpt.path} alt={imgOpt.label} fill style={{ objectFit: 'cover' }} />
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isSelected ? '#D9822B' : '#5C4A3E' }}>
                                {isSelected ? '✓ ' : ''}{imgOpt.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* 3 Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Badge 1</label>
                    <input 
                      type="text" 
                      value={slideBadge1}
                      onChange={(e) => setSlideBadge1(e.target.value)}
                      placeholder="e.g. HIGH PROTEIN"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ECE4D8', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Badge 2</label>
                    <input 
                      type="text" 
                      value={slideBadge2}
                      onChange={(e) => setSlideBadge2(e.target.value)}
                      placeholder="e.g. NO ADDED SUGAR"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ECE4D8', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Badge 3</label>
                    <input 
                      type="text" 
                      value={slideBadge3}
                      onChange={(e) => setSlideBadge3(e.target.value)}
                      placeholder="e.g. 100% NATURAL"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ECE4D8', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Buttons (Primary + Sample) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Primary Button Text</label>
                    <input 
                      type="text" 
                      value={slideBtnText}
                      onChange={(e) => setSlideBtnText(e.target.value)}
                      placeholder="Shop Now"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ECE4D8', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Button Link</label>
                    <input 
                      type="text" 
                      value={slideBtnLink}
                      onChange={(e) => setSlideBtnLink(e.target.value)}
                      placeholder="/shop"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ECE4D8', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#736257', display: 'block', marginBottom: '4px' }}>Sample Button Text</label>
                    <input 
                      type="text" 
                      value={slideSampleBtnText}
                      onChange={(e) => setSlideSampleBtnText(e.target.value)}
                      placeholder="Book 50g Sample"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ECE4D8', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowSlideModal(false)}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #ECE4D8', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer', color: '#20100A' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: '#20100A', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(32, 16, 10, 0.25)' }}
                  >
                    {editingSlide ? `✓ Update Slide #${editingSlide.order}` : `+ Add Slide #${slidesList.length + 1} to Website`}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ── Modal: Delete Slide Confirmation ── */}
        {slideToDelete && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div 
              style={{ 
                background: '#FFFFFF', 
                padding: '28px', 
                borderRadius: '16px', 
                width: '420px', 
                maxWidth: '90%',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#FFF5F5',
                  color: '#E53E3E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <Trash2 size={24} />
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20100A', marginBottom: '8px' }}>
                Delete this Hero Slide?
              </h2>

              <p style={{ fontSize: '0.88rem', color: '#736257', marginBottom: '20px', lineHeight: 1.5 }}>
                Are you sure you want to remove <strong>&quot;{slideToDelete.name}&quot;</strong> from your homepage carousel? This action cannot be undone.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setSlideToDelete(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1.5px solid #ECE4D8',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#20100A',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={confirmDeleteSlide}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#E53E3E',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Product Modal ── */}
        {editingProduct && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(20, 10, 5, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setEditingProduct(null)}
          >
            <div 
              className="modal-scrollbar"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                padding: '24px 26px',
                border: '1.5px solid #E8DDCE',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setEditingProduct(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#F3ECE2',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: '#20100A', marginBottom: '4px' }}>
                Edit Product Details
              </h2>
              <p style={{ color: '#736257', fontSize: '0.84rem', marginBottom: '14px' }}>
                Update title, description, category, pricing, and product image.
              </p>

              <form onSubmit={handleSaveEditProduct}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#20100A', marginBottom: '4px' }}>
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #E4DACD',
                      outline: 'none',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#20100A', marginBottom: '4px' }}>
                    Subtitle / Taste Notes
                  </label>
                  <input
                    type="text"
                    required
                    value={editProductSubtitle}
                    onChange={(e) => setEditProductSubtitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #E4DACD',
                      outline: 'none',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#20100A', marginBottom: '4px' }}>
                      Category
                    </label>
                    <select
                      value={editProductCategory}
                      onChange={(e) => setEditProductCategory(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        borderRadius: '10px',
                        border: '1.5px solid #E4DACD',
                        outline: 'none',
                        fontSize: '0.85rem',
                        background: '#FFFFFF'
                      }}
                    >
                      <option value="protein">High Protein</option>
                      <option value="chocolate">Chocolate</option>
                      <option value="combos">Combos</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#20100A', marginBottom: '4px' }}>
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={99}
                      value={editProductPrice}
                      onChange={(e) => setEditProductPrice(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        borderRadius: '10px',
                        border: '1.5px solid #E4DACD',
                        outline: 'none',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#20100A', marginBottom: '4px' }}>
                      Weight / Size
                    </label>
                    <input
                      type="text"
                      required
                      value={editProductWeight}
                      onChange={(e) => setEditProductWeight(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        borderRadius: '10px',
                        border: '1.5px solid #E4DACD',
                        outline: 'none',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                {/* ── Product Image: Only Current Product's Image & Edit Controls ── */}
                <div style={{ marginBottom: '14px', borderTop: '1px solid #F0E8DD', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#20100A' }}>
                      Product Jar Image
                    </label>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        color: '#B55A00', 
                        background: '#FFF3E0', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        border: '1px solid #FFE0B2'
                      }}
                    >
                      📐 Recommended: 800 × 800 px (Square)
                    </span>
                  </div>

                  {/* Current Product Image Card (Only shows the image of the product being edited) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#F8F4EE', borderRadius: '12px', border: '1.5px solid #EADBCC', marginBottom: '10px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', background: '#FFFFFF', border: '1.5px solid #D8C7B5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={editProductImage || editingProduct.image} 
                        alt={editingProduct.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/creamy-peanut-butter.jpg';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#20100A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {editingProduct.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#736257', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {editProductImage.startsWith('data:') ? 'Custom uploaded image file' : editProductImage}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2E7D32', background: '#E8F5E9', padding: '3px 7px', borderRadius: '6px' }}>
                      Active Image
                    </span>
                  </div>

                  {/* Mode Toggles: Only 2 options (Upload Image / Image URL Link) */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setEditImageInputMode('upload')}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: editImageInputMode === 'upload' ? '1.5px solid #20100A' : '1px solid #ECE2D5',
                        background: editImageInputMode === 'upload' ? '#20100A' : '#FAF7F2',
                        color: editImageInputMode === 'upload' ? '#FFFFFF' : '#5C4A3E',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Upload size={13} />
                      <span>Upload New Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditImageInputMode('url')}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: editImageInputMode === 'url' ? '1.5px solid #20100A' : '1px solid #ECE2D5',
                        background: editImageInputMode === 'url' ? '#20100A' : '#FAF7F2',
                        color: editImageInputMode === 'url' ? '#FFFFFF' : '#5C4A3E',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <LinkIcon size={13} />
                      <span>Image URL Link</span>
                    </button>
                  </div>

                  {/* Option 1: File Upload */}
                  {editImageInputMode === 'upload' && (
                    <div
                      style={{
                        border: '2px dashed #D9822B',
                        borderRadius: '12px',
                        padding: '14px 12px',
                        textAlign: 'center',
                        background: '#FDF9F5',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleEditProductImageUpload}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                          zIndex: 2
                        }}
                      />
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F5EAE0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                        <Upload size={15} color="#D9822B" />
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#20100A' }}>
                        {editUploadFileName ? `Selected: ${editUploadFileName}` : 'Click or Drag to Upload New Product Image'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#736257', marginTop: '2px' }}>
                        Supports JPG, PNG, WebP (Max 5MB)
                      </div>
                    </div>
                  )}

                  {/* Option 2: Image URL */}
                  {editImageInputMode === 'url' && (
                    <div>
                      <div style={{ position: 'relative' }}>
                        <LinkIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7669' }} />
                        <input 
                          type="text" 
                          placeholder="Paste image URL (e.g. https://... or /images/...)"
                          value={editProductImage}
                          onChange={(e) => setEditProductImage(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '10px', border: '1.5px solid #ECE4D8', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <p style={{ fontSize: '0.7rem', color: '#736257', marginTop: '4px' }}>
                        Direct hosted link ya local path paste karein.
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    style={{
                      padding: '11px 20px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      background: '#FFFFFF',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '11px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#20100A',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Admin Order Invoice Modal ── */}
        {selectedOrderForInvoice && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1200,
              background: 'rgba(20, 10, 5, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedOrderForInvoice(null)}
          >
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '650px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                padding: '36px 32px',
                position: 'relative',
                border: '1.5px solid #E8DDCE'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#F3ECE2',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #20100A', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                    NUTTRYX™ FOODS
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#736257', margin: '2px 0 0' }}>
                    Warehouse Fulfillment Slip & Invoice
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#736257', textTransform: 'uppercase', fontWeight: 800 }}>Order ID</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#D9822B' }}>{selectedOrderForInvoice.id}</div>
                  <div style={{ fontSize: '0.78rem', color: '#736257' }}>{selectedOrderForInvoice.date}</div>
                </div>
              </div>

              <div style={{ background: '#FAF7F2', padding: '16px 20px', borderRadius: '12px', border: '1px solid #ECE4D8', marginBottom: '20px', fontSize: '0.86rem' }}>
                <div><strong>Customer:</strong> {selectedOrderForInvoice.customerName}</div>
                <div><strong>Contact:</strong> {selectedOrderForInvoice.phone}</div>
                <div><strong>Destination:</strong> {selectedOrderForInvoice.city}</div>
                <div><strong>Fulfillment Status:</strong> {selectedOrderForInvoice.status.toUpperCase()}</div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#736257', marginBottom: '8px' }}>
                  Allocated Items
                </div>
                <div style={{ padding: '14px 18px', background: '#FFFFFF', border: '1px solid #ECE4D8', borderRadius: '10px', fontSize: '0.9rem', color: '#20100A', fontWeight: 600 }}>
                  {selectedOrderForInvoice.items}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #20100A', paddingTop: '16px', marginBottom: '24px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#20100A' }}>Total Invoice Amount:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2D6A4F' }}>₹{selectedOrderForInvoice.total}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    borderRadius: '10px',
                    background: '#20100A',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={16} /> Print Packing Slip
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Modal: Add / Edit FAQ Question ── */}
        {isFaqModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(32, 16, 10, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}
            onClick={() => setIsFaqModalOpen(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                width: '100%',
                maxWidth: '620px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                padding: '28px',
                border: '1px solid #ECE4D8'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: '1.5px solid #F5ECE3'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(217, 130, 43, 0.12)',
                      color: '#D9822B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      {editingFaq ? 'Edit FAQ Question' : 'Add New FAQ Question'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#8A7669', margin: '2px 0 0' }}>
                      {editingFaq ? `Editing FAQ #${editingFaq.order || 1}` : 'Provide a clear question and informative answer'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  style={{
                    background: '#F5ECE3',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#736257'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveFaq} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Question input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                    Question Title <span style={{ color: '#D9822B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={faqFormQuestion}
                    onChange={e => setFaqFormQuestion(e.target.value)}
                    placeholder="e.g. Why does oil float on top of natural peanut butter?"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.92rem',
                      color: '#20100A',
                      background: '#FAF8F5',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Answer textarea */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                    Answer Description <span style={{ color: '#D9822B' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={faqFormAnswer}
                    onChange={e => setFaqFormAnswer(e.target.value)}
                    placeholder="Enter detailed and transparent customer answer here..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.92rem',
                      color: '#20100A',
                      background: '#FAF8F5',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      lineHeight: 1.55
                    }}
                  />
                </div>

                {/* Row: Category + Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      value={faqFormCategory}
                      onChange={e => setFaqFormCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Purity & Quality">Purity & Quality</option>
                      <option value="Diet & Health">Diet & Health</option>
                      <option value="Storage & Freshness">Storage & Freshness</option>
                      <option value="Samples & Orders">Samples & Orders</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={faqFormOrder}
                      onChange={e => setFaqFormOrder(Number(e.target.value) || 1)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Toggle: Active status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#FAF8F5',
                    border: '1px solid #ECE4D8',
                    cursor: 'pointer'
                  }}
                  onClick={() => setFaqFormIsActive(!faqFormIsActive)}
                >
                  <input
                    type="checkbox"
                    id="faqActiveToggle"
                    checked={faqFormIsActive}
                    onChange={e => setFaqFormIsActive(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#D9822B', cursor: 'pointer' }}
                  />
                  <label htmlFor="faqActiveToggle" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#20100A', cursor: 'pointer' }}>
                    Publish to store website (Visible to customers)
                  </label>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsFaqModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      background: '#FFFFFF',
                      fontWeight: 700,
                      color: '#4A3B32',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingFaq}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      cursor: isSavingFaq ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingFaq ? 0.7 : 1
                    }}
                  >
                    {isSavingFaq && <Loader2 size={18} className="animate-spin" />}
                    {isSavingFaq ? 'Saving...' : editingFaq ? 'Update Question' : '✓ Add Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal: Add / Edit Craft Step ── */}
        {isCraftStepModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(32, 16, 10, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}
            onClick={() => setIsCraftStepModalOpen(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                width: '100%',
                maxWidth: '620px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                padding: '28px',
                border: '1px solid #ECE4D8'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: '1.5px solid #F5ECE3'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(217, 130, 43, 0.12)',
                      color: '#D9822B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      {editingCraftStep ? `Edit Step ${editingCraftStep.num}` : 'Add New Craft Step'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#8A7669', margin: '2px 0 0' }}>
                      {editingCraftStep ? `Update "${editingCraftStep.title}"` : 'Create a new process highlight card for the storefront'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCraftStepModalOpen(false)}
                  style={{
                    background: '#F5ECE3',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#736257'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveCraftStep} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Step Number + Title */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Step # <span style={{ color: '#D9822B' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={stepFormNum}
                      onChange={e => setStepFormNum(e.target.value)}
                      placeholder="e.g. 01"
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: '#D9822B',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Step Title <span style={{ color: '#D9822B' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={stepFormTitle}
                      onChange={e => setStepFormTitle(e.target.value)}
                      placeholder="e.g. Ethical Sourcing"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.92rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Subtitle tag + Icon selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Subtitle / Location Tag
                    </label>
                    <input
                      type="text"
                      value={stepFormSubtitle}
                      onChange={e => setStepFormSubtitle(e.target.value)}
                      placeholder="e.g. SAURASHTRA, GUJARAT"
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Card Icon
                    </label>
                    <select
                      value={stepFormIcon}
                      onChange={e => setStepFormIcon(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Sparkles">✨ Sparkles (Purity / Ethical)</option>
                      <option value="Flame">🔥 Flame (Hot-Air Roasting)</option>
                      <option value="Cpu">⚙️ Stone Mill / Grinding</option>
                      <option value="PackageCheck">📦 Package / Jarring</option>
                      <option value="ShieldCheck">🛡️ Shield (Quality Guarantee)</option>
                      <option value="Award">🏆 Award (Premium Gold)</option>
                      <option value="Heart">❤️ Heart (Healthy Nutrition)</option>
                      <option value="Zap">⚡ Zap (High Energy)</option>
                      <option value="Leaf">🌿 Leaf (100% Vegan / Organic)</option>
                      <option value="Truck">🚚 Truck (Fast Dispatch)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                    Process Description <span style={{ color: '#D9822B' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={stepFormDesc}
                    onChange={e => setStepFormDesc(e.target.value)}
                    placeholder="Describe how this step takes place and why it makes NUTTRYX superior..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.9rem',
                      color: '#20100A',
                      background: '#FAF8F5',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      lineHeight: 1.55
                    }}
                  />
                </div>

                {/* Row: Order + Active toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '14px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Sort Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={stepFormOrder}
                      onChange={e => setStepFormOrder(Number(e.target.value) || 1)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: '#FAF8F5',
                      border: '1px solid #ECE4D8',
                      cursor: 'pointer',
                      marginTop: '22px'
                    }}
                    onClick={() => setStepFormIsActive(!stepFormIsActive)}
                  >
                    <input
                      type="checkbox"
                      id="stepActiveToggle"
                      checked={stepFormIsActive}
                      onChange={e => setStepFormIsActive(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#D9822B', cursor: 'pointer' }}
                    />
                    <label htmlFor="stepActiveToggle" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#20100A', cursor: 'pointer' }}>
                      Show on Storefront
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCraftStepModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      background: '#FFFFFF',
                      fontWeight: 700,
                      color: '#4A3B32',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCraftStep}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      cursor: isSavingCraftStep ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingCraftStep ? 0.7 : 1
                    }}
                  >
                    {isSavingCraftStep && <Loader2 size={18} className="animate-spin" />}
                    {isSavingCraftStep ? 'Saving...' : editingCraftStep ? 'Update Step' : '✓ Add Step'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal: Add / Edit Lifestyle Pillar ── */}
        {isPillarModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(32, 16, 10, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}
            onClick={() => setIsPillarModalOpen(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                width: '100%',
                maxWidth: '620px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                padding: '28px',
                border: '1px solid #ECE4D8'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: '1.5px solid #F5ECE3'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(217, 130, 43, 0.12)',
                      color: '#D9822B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      {editingPillar ? `Edit Card: ${editingPillar.title}` : 'Add New Lifestyle Card'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#8A7669', margin: '2px 0 0' }}>
                      {editingPillar ? 'Modify audience messaging and key benefit' : 'Create a new lifestyle audience card'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPillarModalOpen(false)}
                  style={{
                    background: '#F5ECE3',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#736257'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSavePillar} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Title + Subtitle / Audience tag */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Card Title <span style={{ color: '#D9822B' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pillarFormTitle}
                      onChange={e => setPillarFormTitle(e.target.value)}
                      placeholder="e.g. Supports Fitness"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.92rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Audience Tag / Subtitle
                    </label>
                    <input
                      type="text"
                      value={pillarFormSubtitle}
                      onChange={e => setPillarFormSubtitle(e.target.value)}
                      placeholder="e.g. GYM & ATHLETES"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.92rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Icon Selector + Perk Benefit */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Icon
                    </label>
                    <select
                      value={pillarFormIcon}
                      onChange={e => setPillarFormIcon(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Dumbbell">🏋️ Dumbbell (Gym & Athletes)</option>
                      <option value="GraduationCap">🎓 Graduation Cap (Students)</option>
                      <option value="Laptop">💻 Laptop (Working Professionals)</option>
                      <option value="Users">👨‍👩‍👧‍👦 Users (Kids & Parents)</option>
                      <option value="Heart">❤️ Heart (Health & Wellness)</option>
                      <option value="Zap">⚡ Zap (High Energy)</option>
                      <option value="ShieldCheck">🛡️ Shield (Purity / Safety)</option>
                      <option value="Award">🏆 Award (Excellence)</option>
                      <option value="Sparkles">✨ Sparkles (Active Lifestyle)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Benefit Tag Perk (Green Pill)
                    </label>
                    <input
                      type="text"
                      value={pillarFormPerk}
                      onChange={e => setPillarFormPerk(e.target.value)}
                      placeholder="e.g. Ideal pre/post workout fuel"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                    Card Description <span style={{ color: '#D9822B' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={pillarFormDesc}
                    onChange={e => setPillarFormDesc(e.target.value)}
                    placeholder="Describe how NUTTRYX pure peanut butter benefits this specific lifestyle audience..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.9rem',
                      color: '#20100A',
                      background: '#FAF8F5',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      lineHeight: 1.55
                    }}
                  />
                </div>

                {/* Row: Order + Active toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '14px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Sort Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={pillarFormOrder}
                      onChange={e => setPillarFormOrder(Number(e.target.value) || 1)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: '#FAF8F5',
                      border: '1px solid #ECE4D8',
                      cursor: 'pointer',
                      marginTop: '22px'
                    }}
                    onClick={() => setPillarFormIsActive(!pillarFormIsActive)}
                  >
                    <input
                      type="checkbox"
                      id="pillarActiveToggle"
                      checked={pillarFormIsActive}
                      onChange={e => setPillarFormIsActive(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#D9822B', cursor: 'pointer' }}
                    />
                    <label htmlFor="pillarActiveToggle" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#20100A', cursor: 'pointer' }}>
                      Show on Storefront
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPillarModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      background: '#FFFFFF',
                      fontWeight: 700,
                      color: '#4A3B32',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPillar}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      cursor: isSavingPillar ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingPillar ? 0.7 : 1
                    }}
                  >
                    {isSavingPillar && <Loader2 size={18} className="animate-spin" />}
                    {isSavingPillar ? 'Saving...' : editingPillar ? 'Update Card' : '✓ Add Card'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: ADD / EDIT BENEFIT COMPARISON ROW ── */}
        {isBenefitModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(26, 13, 7, 0.72)',
              backdropFilter: 'blur(6px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsBenefitModalOpen(false)}
          >
            <div
              className="modal-scrollbar"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                padding: '28px',
                border: '1.5px solid #E8DDCE',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(217, 130, 43, 0.12)',
                      color: '#D9822B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      {editingBenefitRow ? `Edit Parameter: ${editingBenefitRow.feature}` : 'Add Comparison Parameter'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#8A7669', margin: '2px 0 0' }}>
                      {editingBenefitRow ? 'Modify NUTTRYX pure standard vs ordinary brands' : 'Create a new comparison row for the table'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBenefitModalOpen(false)}
                  style={{
                    background: '#F5ECE3',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#736257'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveBenefitRow} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                    Parameter / Standard Name <span style={{ color: '#D9822B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={benefitFormFeature}
                    onChange={(e) => setBenefitFormFeature(e.target.value)}
                    placeholder="e.g. Peanut Quality & Sourcing"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.92rem',
                      color: '#20100A',
                      background: '#FAF8F5',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E3A1A', marginBottom: '6px' }}>
                    🥜 NUTTRYX Pure Peanut Butter Standard <span style={{ color: '#059669' }}>*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={benefitFormNuttryx}
                    onChange={(e) => setBenefitFormNuttryx(e.target.value)}
                    placeholder="e.g. 100% Saurashtra Jumbo Bold Peanuts (Grade A)"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #A7F3D0',
                      fontSize: '0.88rem',
                      color: '#064E3B',
                      background: '#F0FDF4',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#991B1B', marginBottom: '6px' }}>
                    ⚠️ Ordinary Commercial Brands Standard <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={benefitFormRegular}
                    onChange={(e) => setBenefitFormRegular(e.target.value)}
                    placeholder="e.g. Unspecified split & low-grade bulk peanuts"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #FECACA',
                      fontSize: '0.88rem',
                      color: '#7F1D1D',
                      background: '#FEF2F2',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Sort Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={benefitFormOrder}
                      onChange={(e) => setBenefitFormOrder(Number(e.target.value) || 1)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: '#FAF8F5',
                      border: '1px solid #ECE4D8',
                      cursor: 'pointer',
                      marginTop: '22px'
                    }}
                    onClick={() => setBenefitFormIsActive(!benefitFormIsActive)}
                  >
                    <input
                      type="checkbox"
                      id="benefitActiveToggle"
                      checked={benefitFormIsActive}
                      onChange={(e) => setBenefitFormIsActive(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#D9822B', cursor: 'pointer' }}
                    />
                    <label htmlFor="benefitActiveToggle" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#20100A', cursor: 'pointer' }}>
                      Show on Storefront
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsBenefitModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      background: '#FFFFFF',
                      fontWeight: 700,
                      color: '#4A3B32',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingBenefitRow}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      cursor: isSavingBenefitRow ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingBenefitRow ? 0.7 : 1
                    }}
                  >
                    {isSavingBenefitRow && <Loader2 size={18} className="animate-spin" />}
                    {isSavingBenefitRow ? 'Saving...' : editingBenefitRow ? 'Update Parameter' : '✓ Add Parameter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: ADD / EDIT CUSTOMER REVIEW ── */}
        {isReviewModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(26, 13, 7, 0.72)',
              backdropFilter: 'blur(6px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsReviewModalOpen(false)}
          >
            <div
              className="modal-scrollbar"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                padding: '28px',
                border: '1.5px solid #E8DDCE',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(217, 130, 43, 0.12)',
                      color: '#D9822B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MessageSquareHeart size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                      {editingReview ? `Edit Review: ${editingReview.name}` : 'Add New Customer Review'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#8A7669', margin: '2px 0 0' }}>
                      {editingReview ? 'Modify rating, testimonial quote, or reviewer title' : 'Manually add a verified customer review'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  style={{
                    background: '#F5ECE3',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#736257'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Customer Name <span style={{ color: '#D9822B' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewFormName}
                      onChange={(e) => setReviewFormName(e.target.value)}
                      placeholder="e.g. Aman Sharma"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.92rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Role / Location
                    </label>
                    <input
                      type="text"
                      value={reviewFormRole}
                      onChange={(e) => setReviewFormRole(e.target.value)}
                      placeholder="e.g. Fitness Coach, Mumbai"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.92rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Star Rating
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewFormRating(s)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Star
                            size={24}
                            fill={s <= reviewFormRating ? '#D9822B' : 'transparent'}
                            color={s <= reviewFormRating ? '#D9822B' : '#C7B9B0'}
                          />
                        </button>
                      ))}
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#D9822B', marginLeft: '6px' }}>
                        {reviewFormRating} Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                      Flavour Purchased
                    </label>
                    <select
                      value={reviewFormFlavour}
                      onChange={(e) => setReviewFormFlavour(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #ECE4D8',
                        fontSize: '0.88rem',
                        color: '#20100A',
                        background: '#FAF8F5',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Dark Chocolate Peanut Butter">Dark Chocolate Peanut Butter</option>
                      <option value="Natural Creamy Peanut Butter">Natural Creamy Peanut Butter</option>
                      <option value="Roasted Crunchy Peanut Butter">Roasted Crunchy Peanut Butter</option>
                      <option value="Trio Discovery Bundle">Trio Discovery Bundle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3A2016', marginBottom: '6px' }}>
                    Customer Review & Feedback <span style={{ color: '#D9822B' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewFormComment}
                    onChange={(e) => setReviewFormComment(e.target.value)}
                    placeholder="Customer's genuine feedback and experience with NUTTRYX peanut butter..."
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      fontSize: '0.88rem',
                      color: '#20100A',
                      background: '#FAF8F5',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      lineHeight: 1.5
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: '#FAF8F5',
                      border: '1px solid #ECE4D8',
                      cursor: 'pointer'
                    }}
                    onClick={() => setReviewFormIsVerified(!reviewFormIsVerified)}
                  >
                    <input
                      type="checkbox"
                      id="reviewVerifiedToggle"
                      checked={reviewFormIsVerified}
                      onChange={(e) => setReviewFormIsVerified(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                    />
                    <label htmlFor="reviewVerifiedToggle" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#20100A', cursor: 'pointer' }}>
                      Verified Buyer Badge
                    </label>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: '#FAF8F5',
                      border: '1px solid #ECE4D8',
                      cursor: 'pointer'
                    }}
                    onClick={() => setReviewFormIsActive(!reviewFormIsActive)}
                  >
                    <input
                      type="checkbox"
                      id="reviewActiveToggle"
                      checked={reviewFormIsActive}
                      onChange={(e) => setReviewFormIsActive(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#D9822B', cursor: 'pointer' }}
                    />
                    <label htmlFor="reviewActiveToggle" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#20100A', cursor: 'pointer' }}>
                      Show on Storefront
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px solid #ECE4D8',
                      background: '#FFFFFF',
                      fontWeight: 700,
                      color: '#4A3B32',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingReview}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #D9822B 0%, #B8671B 100%)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      cursor: isSavingReview ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                      opacity: isSavingReview ? 0.7 : 1
                    }}
                  >
                    {isSavingReview && <Loader2 size={18} className="animate-spin" />}
                    {isSavingReview ? 'Saving...' : editingReview ? 'Update Review' : '✓ Add Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <style jsx>{`
        @media (max-width: 860px) {
          .admin-layout {
            flex-direction: column !important;
          }
          .admin-sidebar {
            width: 100% !important;
            padding: 12px 16px !important;
          }
          .admin-brand {
            padding-bottom: 10px !important;
            margin-bottom: 10px !important;
          }
          .admin-nav {
            flex-direction: row !important;
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            padding-bottom: 6px !important;
            -webkit-overflow-scrolling: touch;
          }
          .admin-nav::-webkit-scrollbar {
            display: none;
          }
          .admin-nav button {
            white-space: nowrap !important;
            padding: 8px 12px !important;
            font-size: 0.8rem !important;
          }
          .admin-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            padding: 14px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}


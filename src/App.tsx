/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Cpu, 
  ShieldAlert, 
  Battery, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Home, 
  Info, 
  ArrowLeft,
  X,
  Users,
  ThumbsUp,
  ThumbsDown,
  PlusCircle,
  CheckCircle2,
  Settings,
  Moon,
  Bell,
  CloudOff,
  User,
  LogIn,
  Edit2,
  Lock,
  LogOut,
  HelpCircle,
  BarChart2,
  Sparkles,
  CreditCard,
  AlertTriangle,
  Image as ImageIcon,
  Camera,
  Upload,
  Loader2,
  Download,
  Globe,
  Shield,
  Save,
  Share2,
  Copy,
  Mail,
  FileText,
  Activity,
  TrendingUp,
  Compass,
  ExternalLink,
  Eye,
  Link,
  Clock
} from 'lucide-react';
import { brands, phoneModels, Brand, PhoneModel, CommunitySuggestion, getCategoryCode, formatDisplayCode } from './data';
import Markdown from 'react-markdown';
import ComparatorScreen from './components/ComparatorScreen';
import LegalPage from './components/LegalPages';
import DeepSeekDevStudio from './components/DeepSeekDevStudio';
import NotFoundPage from './components/NotFoundPage';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { signInWithGoogle, logout, subscribeUser, db, addImageToModel, signInWithEmail, signUpWithEmail, auth } from './lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  runTransaction, 
  setDoc, 
  serverTimestamp, 
  getDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

type Screen = 'HOME' | 'COMPATIBILITY_FLOW' | 'BRAND_SELECT' | 'MODEL_SELECT' | 'RESULTS' | 'COMMUNITY' | 'SETTINGS' | 'AI_ASSISTANT' | 'GLOBAL_SEARCH' | 'COMPARATOR' | 'PRIVACY_POLICY' | 'TERMS_OF_SERVICE' | 'ABOUT_US' | 'CONTACT_US' | 'NOT_FOUND';
type Category = 'LCD' | 'IC' | 'SCREEN_PROTECTOR' | 'BATTERY';

interface CategoryConfig {
  title: string;
  subtitle: string;
  codeLabel: string;
  badgeLabel: string;
}

export const categoryConfigs: Record<Category, CategoryConfig> = {
  LCD: {
    title: 'LCD Compatibility',
    subtitle: 'Find compatible LCD screens',
    codeLabel: 'LCD Screen Code',
    badgeLabel: 'Verified LCD'
  },
  IC: {
    title: 'IC Chip Compatibility',
    subtitle: 'Find compatible power/display ICs',
    codeLabel: 'IC Chip Code',
    badgeLabel: 'Verified IC'
  },
  SCREEN_PROTECTOR: {
    title: 'Screen Cover Compatibility',
    subtitle: 'Find matching glass screen protectors',
    codeLabel: 'Glass Cover Code',
    badgeLabel: 'Verified Glass'
  },
  BATTERY: {
    title: 'Battery Compatibility',
    subtitle: 'Find interchangeable phone batteries',
    codeLabel: 'Battery Model Code',
    badgeLabel: 'Verified Battery'
  }
};

export const translations: Record<'ar' | 'en', any> = {
  ar: {
    appName: "دليل الشاشات والمطابقات",
    home: "الرئيسية",
    community: "المجتمع",
    search: "البحث الشامل",
    aiAssistant: "المساعد الذكي",
    settings: "الإعدادات",
    upgrade: "ترقية الحساب",
    proTip: "نصيحة الخبراء: قم بالترقية إلى PRO لإزالة الإعلانات",
    logout: "تسجيل الخروج",
    profile: "الملف الشخصي",
    proPlan: "خطة المحترفين",
    monthlyPrice: "3.00 دولار / شهرياً",
    proFeatures: [
      "إزالة جميع الإعلانات الممولة",
      "الوصول لمساعد الذكاء الاصطناعي الذكي",
      "أولوية الدعم الفني المباشر"
    ],
    buyWithGooglePay: "الشراء عبر Google Pay",
    myStats: "إحصائيات مساهماتي",
    suggestedScreens: "الشاشات المقترحة",
    approvedScreens: "تم اعتمادها",
    appPreferences: "تفضيلات التطبيق",
    darkMode: "الوضع الداكن (Dark Mode)",
    newMatchNotifications: "إشعارات المطابقات الجديدة",
    offlineMode: "وضع العمل أوفلاين (بدون إنترنت)",
    languageSetting: "لغة التطبيق (Language)",
    helpCenter: "مركز المساعدة وقواعد الاستخدام",
    helpCenterDesc: "كيفية التصويت واحتساب التوافق التلقائي (قاعدة الـ 50 إعجاب)",
    aboutApp: "حول تطبيق LCD DALULE",
    appNameLabel: "اسم التطبيق",
    developer: "المطور",
    chatOnWhatsApp: "تواصل عبر الواتساب",
    helpTitle: "شروط احتساب التوافق التلقائي 🛠️",
    helpRules: [
      "1. ميزة التوافق معتمدة كلياً على تصويت مجتمع الفنيين المحترفين داخل التطبيق.",
      "2. عندما يقوم أي عضو باقتراح بديل شاشة لموديل معين، يتاح الاقتراح فوراً للتصويت العلني.",
      "3. يُدرج الموديل تلقائياً في قائمة الهواتف والمطابقات الرسمية بمجرد حصوله على أكثر من 50 إعجاباً (👍)، شريطة أن تكون الأصوات المتوافقة أكبر من الأصوات غير المتطابقة (👎)."
    ],
    understandClose: "فهمت ذلك",
    // Home Screen categories
    lcdTitle: "مطابقات الشاشات LCD",
    lcdDesc: "الهواتف التي تشارك نفس شاشة الـ LCD",
    icTitle: "مطابقات قطع الـ IC",
    icDesc: "البحث عن توافق قطع الأي سي وشبكة التغذية",
    spTitle: "مطابقات واقيات الشاشة",
    spDesc: "البحث عن الزجاج الواقي المتطابق بين الهواتف",
    batteryTitle: "مطابقات البطاريات",
    batteryDesc: "البطاريات المتوافقة والقابلة للاستبدال بين الأجهزة",
    techSupport: "الدعم الفني والبدائل السريعة لغيار الهواتف الذكية",
    // Global Search Screen
    globalSearchTitle: "البحث الشامل والسريع",
    globalSearchPlaceholder: "اكتب ماركة أو كود أو اسم الموديل (مثال: Galaxy A12)...",
    allBrands: "كل الماركات",
    allCategories: "كل الفئات",
    noMatchesFound: "لم يتم العثور على أجهزة مطابقة لـ",
    clearSearch: "مسح البحث",
    searchTips: "اكتب الأحرف الأولى من الموديل لعرض المطابقات الفورية لكود الشاشة، الأي سي، البطارية وواقي الزجاج المتوافق.",
    clickToReveal: "اضغط على الجهاز لعرض الرموز وتفاصيل التوافق الكاملة",
    crossReferenceCount: "مطابقات متوافقة",
    showMore: "عرض التفاصيل",
    partLcd: "الشاشة LCD",
    partIc: "الأي سي IC",
    partSp: "واقي الزجاج",
    partBattery: "البطارية",
    findCompatibles: "البحث عن المطابقات",
    loadingData: "جاري تحميل البيانات...",
    loginTitle: "دليل الشاشات والمطابقات",
    loginSubtitle: "أكبر تجمع لفنيي صيانة الهواتف الذكية",
    signInWithGoogle: "الدخول بحساب Google",
    addSuggestionBtn: "اقتراح بديل للمجتمع",
    chooseBrand: "اختر الماركة",
    chooseModel: "اختر الموديل",
    selectBrandPlaceholder: "اختر جهة التصنيع...",
    selectModelPlaceholder: "اختر موديل الهاتف...",
    brandRef: "ماركة الهاتف",
    modelRef: "موديل الهاتف",
    partConfig: "مواصفات وتأكيد الموديل",
    awaitingParams: "بانتظار تحديد الهاتف",
    awaitingDesc: "يرجى تحديد ماركة وموديل الهاتف لبدء تحليل المطابقة والبحث عن البدائل المتوافقة.",
    verificationResults: "نتائج التحليل والمطابقة",
    verifiedCompatibleCode: "رمز القطعة المتوافقة",
    otherIdenticalDevices: "الهواتف المتوافقة مع هذا الرمز",
    noInterchangeableFound: "لا توجد بدائل مسجلة حالياً لهذا الموديل. كن أول من يقترح!",
    addPhoto: "إضافة صورة للهاتف",
    uploadSuccess: "تم رفع وحفظ الصورة بنجاح!",
    processingImage: "جاري معالجة الصورة...",
    uploadFileHint: "اسحب الشاشة أو اضغط لرفع صورة الهاتف مباشرة",
    continueAsGuest: "الاستمرار كزائر (محدود بـ 5 عمليات بحث/عرض)",
    guestLimitTitle: "تنبيه الحد اليومي للبحث كزائر ⚠️",
    guestLimitDesc: "لقد استنفدت حد البحث المجاني اليومي كزائر (5 عمليات بحث). يرجى تسجيل الدخول بحساب Google مجاناً لزيادة الحد إلى 20 عملية بحث يومياً!",
    memberLimitTitle: "تنبيه حد البحث اليومي للأعضاء 📢",
    memberLimitDesc: "لقد استنفدت حد البحث المجاني اليومي للأعضاء (20 عملية بحث). قم بالترقية إلى PRO للحصول على ميزات بحث غير محدودة ومساعد ذكي وبدون إعلانات!",
    limitExceeded: "تم تجاوز الحد اليومي",
    searchRemaining: "البحث المتبقي اليوم",
    unlimitedSearch: "بحث غير محدود PRO",
    proNeeded: "الموالف PRO (غير محدود)",
    loginNow: "سجل الدخول الآن",
    guestBadge: "زائر (محدود)",
    selectBrandTitle: "اختر الشركة المصنعة",
    selectModelTitle: "اختر الموديل المطلوب",
    executeCompatibilityCheck: "بدء فحص وتحليل المطابقة البديلة 🔍",
    analysisReady: "جاهز للمطابقة",
    analysisReadyDesc: "التحليل والبيانات مؤكدة لـ",
    compatibleMatrixTitle: "جدول وبدائل المطابقة المتوافقة",
    compatibleEntriesSuffix: "تطابق بديل مسجل",
    technicianAdvisory: "توجيه للفنيين: يرجى التحقق البصري المباشر وتدقيق مراجعات كابل الفلكس (Flex Cable Revisions) والتطابق الداخلي لأسلاك التوصيل لسلامة غيار القطع قبل التثبيت النهائي.",
    communityTitle: "مقترحات مجتمع الفنيين المعتمدة",
    addNewSuggestion: "إضافة اقتراح توافق بديل ➕",
    partProposalLabel: "إقتراح مطابقة غيار للقطع",
    suggestedPartCode: "كود القطعة البديلة المقترحة",
    matchStatusApproved: "متطابقتان",
    matchStatusDisapproved: "غير متطابقتين",
    autoApprovedLabel: "تم اعتماد التوافق تلقائياً من الفنيين ⭐",
    addNewSuggestionTitle: "إرسال اقتراح توافق جديد",
    contributionSubtitle: "ساهم بمطابقة الأجزاء مع مجتمع فنيين الصيانة في التطبيق",
    cancel: "إلغاء",
    publishToCommunity: "نشر ومشاركة للمجتمع 🙌"
  },
  en: {
    appName: "LCD & Parts Compatibility Guide",
    home: "Home",
    community: "Community",
    search: "Global Search",
    aiAssistant: "AI Assistant",
    settings: "Settings",
    upgrade: "Upgrade Account",
    proTip: "Expert Tip: Upgrade to PRO to remove these ads",
    logout: "Logout",
    profile: "Profile",
    proPlan: "Pro Plan",
    monthlyPrice: "3.00 USD / Month",
    proFeatures: [
      "Remove all sponsored ads",
      "Full access to AI Chat Assistant",
      "Direct technical priority support"
    ],
    buyWithGooglePay: "Buy with Google Pay",
    myStats: "My Contribution Stats",
    suggestedScreens: "Suggested Parts",
    approvedScreens: "Approved Matches",
    appPreferences: "App Preferences",
    darkMode: "Dark Mode",
    newMatchNotifications: "New Match Notifications",
    offlineMode: "Offline Work Mode",
    languageSetting: "Language (اللغة)",
    helpCenter: "Help Center & Community Rules",
    helpCenterDesc: "How voting & automatic verification work (50+ likes rule)",
    aboutApp: "About LCD DALULE App",
    appNameLabel: "App Name",
    developer: "Developer",
    chatOnWhatsApp: "Chat on WhatsApp",
    helpTitle: "Automatic Match Rules 🛠️",
    helpRules: [
      "1. Compatibility is fully sourced from technician community votes in the app.",
      "2. When a member suggests a compatible alternative, it's open for public voting.",
      "3. Suggested codes are approved and moved to the official list upon receiving 50+ likes (👍), given likes exceed dislikes (👎)."
    ],
    understandClose: "Got it!",
    // Home Screen categories
    lcdTitle: "LCD Screen Compatibility",
    lcdDesc: "Phones sharing the identical LCD screen",
    icTitle: "IC Chips & Power Parts",
    icDesc: "Find matching IC chips and power/display boards",
    spTitle: "Glass Screen Protectors",
    spDesc: "Find glass covers sharing exact physical size",
    batteryTitle: "Battery Interchangeability",
    batteryDesc: "Find interchangeable phone batteries",
    techSupport: "Smartphone hardware alternatives and fast replacement logs for technicians",
    // Global Search Screen
    globalSearchTitle: "Comprehensive Global Search",
    globalSearchPlaceholder: "Type brand, model, or part code (e.g. A12, Honor)...",
    allBrands: "All Brands",
    allCategories: "All Categories",
    noMatchesFound: "No matched devices found for",
    clearSearch: "Clear",
    searchTips: "Type first letters of any brand or model to immediately display its LCD, IC chip, battery, and screen protector compatibility.",
    clickToReveal: "Tap any model to show spec details and parts compatibility",
    crossReferenceCount: "Identical matches",
    showMore: "Show Details",
    partLcd: "LCD Screen",
    partIc: "IC Chip",
    partSp: "Screen Protector",
    partBattery: "Battery",
    findCompatibles: "Compatible Devices",
    loadingData: "Loading Database...",
    loginTitle: "LCD DALULE GUIDE",
    loginSubtitle: "The Ultimate Smartphone Technician Network",
    signInWithGoogle: "Login with Google Account",
    addSuggestionBtn: "Suggest Part Match",
    chooseBrand: "Choose Brand",
    chooseModel: "Choose Model",
    selectBrandPlaceholder: "Select manufacturer...",
    selectModelPlaceholder: "Select hardware model...",
    brandRef: "Phone Brand",
    modelRef: "Phone Model",
    partConfig: "Verify Model Specifications",
    awaitingParams: "Awaiting Parameters",
    awaitingDesc: "Define phone brand and model to start compatibility search & find interchangeable alternatives.",
    verificationResults: "Analysis & Compatibility Results",
    verifiedCompatibleCode: "Verified Matching Part Code",
    otherIdenticalDevices: "Other Devices sharing this component",
    noInterchangeableFound: "No identical parts recorded yet. Be the first to suggest!",
    addPhoto: "Add Phone Photo",
    uploadSuccess: "Photo uploaded & saved successfully!",
    processingImage: "Processing image...",
    uploadFileHint: "Drag or select to upload phone image directly",
    continueAsGuest: "Continue as Guest (Limit 5 searches)",
    guestLimitTitle: "Guest Daily Limit reached ⚠️",
    guestLimitDesc: "You have reached the daily guest search limit (5 searches). Please sign in with Google for free to increase your limit to 20 searches per day!",
    memberLimitTitle: "Member Daily Limit reached 📢",
    memberLimitDesc: "You have reached the daily member search limit (20 searches). Upgrade to PRO for unlimited search, AI assistant, and ad-free experience!",
    limitExceeded: "Daily Limit Exceeded",
    searchRemaining: "Searches left today",
    unlimitedSearch: "Unlimited PRO searches",
    proNeeded: "Upgrade to PRO (Unlimited)",
    loginNow: "Login with Google",
    guestBadge: "Guest (Limited)",
    selectBrandTitle: "Select Brand",
    selectModelTitle: "Select Model",
    executeCompatibilityCheck: "Check Hardware Match 🔍",
    analysisReady: "Analysis Ready",
    analysisReadyDesc: "Data verified and ready for",
    compatibleMatrixTitle: "Compatible Hardware Alternatives",
    compatibleEntriesSuffix: "Compatible Entries",
    technicianAdvisory: "TECHNICIAN ADVISORY: Cross-reference flex cable revisions prior to installation. Factory IDs are matched, but architectural variations may exist.",
    communityTitle: "Technician Community Suggestions",
    addNewSuggestion: "Suggest Compatibility Match ➕",
    partProposalLabel: "Suggested Matching Part",
    suggestedPartCode: "Suggested Part Code",
    matchStatusApproved: "Compatible",
    matchStatusDisapproved: "Not Compatible",
    autoApprovedLabel: "Technician Match Auto-Approved ⭐",
    addNewSuggestionTitle: "Suggest New Part Compatibility",
    contributionSubtitle: "Contribute proven compatible parts to the technician community network",
    cancel: "Cancel",
    publishToCommunity: "Publish to Community 🙌"
  }
};

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

const updateFaviconAndTouchIcon = (faviconUrl?: string, appIconUrl?: string) => {
  if (typeof window === 'undefined') return;
  if (faviconUrl) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = faviconUrl;
  }
  if (appIconUrl) {
    let appleLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.getElementsByTagName('head')[0].appendChild(appleLink);
    }
    appleLink.href = appIconUrl;
  }
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We do not throw an Error here because throwing unhandled errors in background
  // listeners or callbacks will propagate as uncaught runtime exceptions, which cause
  // the browser iframe environment to catch them as generic, confusing "Script error." crashes.
}

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [guestIsSubscribed, setGuestIsSubscribed] = useState(() => {
    return localStorage.getItem('guest_is_subscribed') === 'true';
  });

  const isSubscribedComputed = profile?.isSubscribed || guestIsSubscribed;

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('app_language');
    return saved === 'en' ? 'en' : 'ar';
  });

  const handleSetLanguage = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = translations[language];

  // PWA App Installation States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install outcome: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setShowInstallInstructions(true);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = language === 'ar' 
        ? 'دليل الشاشات والمطابقات - LCD DALULE | أكبر تجمع لفنيي صيانة الهواتف الذكية' 
        : 'LCD & Parts Compatibility Guide - LCD DALULE | Smartphone Technician Network';
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      
      // Update meta description dynamically for search bots
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', language === 'ar' 
          ? 'أكبر دليل وتجمع تفاعلي لفنيي صيانة الهواتف الذكية. ابحث ووفر وقتك ومطابقة الشاشات، البطاريات، الدوائر (IC) وبدائل قطع الغيار المتوافقة لجميع الموديلات.'
          : 'Ultimate compatibility guide for smartphone repair technicians. Search and discover matching LCD screens, battery replacements, ICs, and compatible hardware.'
        );
      }
    }
  }, [language]);

  const isAdmin = user?.email === 'dracola.33@gmail.com' || profile?.role === 'admin' || profile?.isAdmin || profile?.email === 'dracola.33@gmail.com';

  const [appBranding, setAppBranding] = useState(() => {
    const saved = localStorage.getItem('app_branding_offline_fallback');
    try {
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      appIconUrl: '',
      faviconUrl: ''
    };
  });

  useEffect(() => {
    const docRef = doc(db, 'settings', 'app_branding');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAppBranding({
          appIconUrl: data.appIconUrl || '',
          faviconUrl: data.faviconUrl || ''
        });
        localStorage.setItem('app_branding_offline_fallback', JSON.stringify(data));
        updateFaviconAndTouchIcon(data.faviconUrl, data.appIconUrl);
      }
    }, (error) => {
      console.warn("Error subscribing to app_branding settings:", error);
    });
    return unsubscribe;
  }, []);

  const handleSaveAppBranding = async (newBranding: any) => {
    try {
      const docRef = doc(db, 'settings', 'app_branding');
      await setDoc(docRef, {
        ...newBranding,
        updatedAt: Date.now(),
        updatedBy: user?.email || 'admin'
      });
      return true;
    } catch (e: any) {
      console.error("Failed to save App Branding", e);
      throw e;
    }
  };

  const [googleAds, setGoogleAds] = useState(() => {
    const saved = localStorage.getItem('google_ads_offline_fallback');
    try {
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      isEnabled: true,
      bannerUrlOrHtml: 'إعلان ممول: احصل على شاشات متميزة وإكسسوارات صيانة بأعلى جودة بخصم للفنيين الأعضاء لدليل شاشات DALULE',
      linkUrl: 'https://wa.me/212677421903',
      adFormat: 'text',
      adTitle: 'إعلان ممول / Google Sponsored AD',
      bannerImageUrl: '',
      adSenseClient: '',
      adSenseSlot: ''
    };
  });

  useEffect(() => {
    const docRef = doc(db, 'settings', 'google_ads');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGoogleAds(data);
        localStorage.setItem('google_ads_offline_fallback', JSON.stringify(data));
      }
    }, (error) => {
      console.warn("Error subscribing to google_ads settings:", error);
    });
    return unsubscribe;
  }, []);

  // Set up dynamic routing & deep-linking for Search Engine Robots & Users
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const screenParam = (params.get('screen') || '').toLowerCase();
    const modelId = params.get('model');
    const brandParam = (params.get('brand') || '').toLowerCase();
    const catParam = (params.get('category') || '').toUpperCase();
    const searchParam = params.get('search') || params.get('q');

    // 1. Check for Category parameter
    if (catParam && ['LCD', 'IC', 'SCREEN_PROTECTOR', 'BATTERY'].includes(catParam)) {
      setSelectedCategory(catParam as Category);
    }

    // 2. Check for explicit 404 route
    if (pathname === '/404' || pathname === '/404.html' || pathname === '/not-found' || screenParam === '404') {
      setCurrentScreen('NOT_FOUND');
      return;
    }

    // 3. Check for Model deep-link
    if (modelId) {
      const model = phoneModels.find(m => m.id.toLowerCase() === modelId.toLowerCase());
      if (model) {
        const brand = brands.find(b => b.id === model.brandId) || null;
        setSelectedBrand(brand);
        setSelectedModel(model);
        setCurrentScreen('RESULTS');
        return;
      }
    }

    // 4. Check for Brand deep-link
    if (brandParam) {
      const brand = brands.find(b => b.id.toLowerCase() === brandParam || b.name.toLowerCase() === brandParam);
      if (brand) {
        setSelectedBrand(brand);
        setCurrentScreen('MODEL_SELECT');
        return;
      }
    }

    // 5. Check for Search parameter
    if (searchParam) {
      setInitialSearchQuery(searchParam);
      setCurrentScreen('GLOBAL_SEARCH');
      return;
    }

    // 6. Check for App Pages
    if (screenParam === 'comparator' || pathname === '/comparator') {
      setCurrentScreen('COMPARATOR');
      return;
    }
    if (screenParam === 'community' || pathname === '/community') {
      setCurrentScreen('COMMUNITY');
      return;
    }
    if (screenParam === 'search' || pathname === '/search') {
      setCurrentScreen('GLOBAL_SEARCH');
      return;
    }
    if (screenParam === 'ai' || pathname === '/ai') {
      setCurrentScreen('AI_ASSISTANT');
      return;
    }
    if (screenParam === 'brands' || pathname === '/brands') {
      setCurrentScreen('BRAND_SELECT');
      return;
    }
    if (screenParam === 'about' || pathname === '/about' || pathname === '/about-us') {
      setCurrentScreen('ABOUT_US');
      return;
    }
    if (screenParam === 'privacy' || pathname === '/privacy' || pathname === '/privacy-policy') {
      setCurrentScreen('PRIVACY_POLICY');
      return;
    }
    if (screenParam === 'terms' || pathname === '/terms' || pathname === '/terms-of-service') {
      setCurrentScreen('TERMS_OF_SERVICE');
      return;
    }
    if (screenParam === 'contact' || pathname === '/contact' || pathname === '/contact-us') {
      setCurrentScreen('CONTACT_US');
      return;
    }

    // 7. If model was requested but does not exist in our catalog -> Show 404
    if (modelId) {
      setCurrentScreen('NOT_FOUND');
      return;
    }

    // 8. If an unknown clean path was entered (not root or known asset/amp) -> Show 404
    if (pathname !== '/' && pathname !== '/index.html' && pathname !== '/amp.html' && !pathname.startsWith('/@') && !pathname.startsWith('/src')) {
      setCurrentScreen('NOT_FOUND');
      return;
    }
  }, []);

  // Listen to popstate for browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const screenParam = (params.get('screen') || '').toUpperCase();
      if (screenParam === '404') {
        setCurrentScreen('NOT_FOUND');
      } else if (screenParam && ['HOME', 'COMMUNITY', 'SETTINGS', 'AI_ASSISTANT', 'GLOBAL_SEARCH', 'COMPARATOR', 'PRIVACY_POLICY', 'TERMS_OF_SERVICE', 'ABOUT_US', 'CONTACT_US', 'BRAND_SELECT'].includes(screenParam)) {
        setCurrentScreen(screenParam as Screen);
      } else if (!window.location.search && window.location.pathname === '/') {
        setCurrentScreen('HOME');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSaveGoogleAds = async (newAds: any) => {
    try {
      const docRef = doc(db, 'settings', 'google_ads');
      await setDoc(docRef, {
        ...newAds,
        updatedAt: Date.now(),
        updatedBy: user?.email || 'admin'
      });
      return true;
    } catch (e: any) {
      console.error("Failed to save Ads", e);
      throw e;
    }
  };

  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<Category>('LCD');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [aiAssistantInitialPrompt, setAiAssistantInitialPrompt] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>([]);
  const [modelMetadata, setModelMetadata] = useState<Record<string, { imageUrl: string }>>({});
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({}); // suggestionId -> isLike
  const [showAddModal, setShowAddModal] = useState(false);
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    return localStorage.getItem('guest_mode') === 'true';
  });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitExceededType, setLimitExceededType] = useState<'GUEST' | 'MEMBER'>('GUEST');

  const [searchUsageList, setSearchUsageList] = useState<string[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('lcd_dalule_search_tracker');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.date === today && Array.isArray(parsed.viewedModelIds)) {
          return parsed.viewedModelIds;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Register traffic tracking for registered users
  useEffect(() => {
    if (!user) return; // Only track registered users as requested

    const getSessionMeta = () => {
      if (typeof window === 'undefined') return {
        referrer: 'Direct', utmSource: '', utmMedium: '', utmCampaign: '',
        userAgent: '', device: 'Desktop', os: 'Unknown', browser: 'Unknown',
        language: 'ar', countryCode: 'Unknown', screenResolution: '1920x1080'
      };

      const referrer = document.referrer || 'Direct (No Referrer)';
      const userAgent = navigator.userAgent;
      const language = navigator.language || 'ar';

      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source') || '';
      const utmMedium = params.get('utm_medium') || '';
      const utmCampaign = params.get('utm_campaign') || '';

      // Device categorization
      let device = 'Desktop';
      if (/Mobi|Android|iPhone|iPad|Phone/i.test(userAgent)) {
        device = 'Mobile';
      } else if (/Tablet|iPad|PlayBook|Silk/i.test(userAgent)) {
        device = 'Tablet';
      }

      // OS categorization
      let os = 'Unknown';
      if (/Windows/i.test(userAgent)) os = 'Windows';
      else if (/Android/i.test(userAgent)) os = 'Android';
      else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';
      else if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'macOS';
      else if (/Linux/i.test(userAgent)) os = 'Linux';

      // Browser categorization
      let browser = 'Unknown';
      if (/Chrome|CriOS/i.test(userAgent)) browser = 'Chrome';
      else if (/Safari/i.test(userAgent) && !/Chrome|CriOS/i.test(userAgent)) browser = 'Safari';
      else if (/Firefox|FxiOS/i.test(userAgent)) browser = 'Firefox';
      else if (/Edg/i.test(userAgent)) browser = 'Edge';

      let countryCode = language.split('-')[1] || language.toUpperCase();
      if (countryCode === 'AR') countryCode = 'Arabic (Global)';

      return {
        referrer, utmSource, utmMedium, utmCampaign, userAgent,
        device, os, browser, language, countryCode,
        screenResolution: `${window.innerWidth}x${window.innerHeight}`
      };
    };

    const getScreenInfoString = (screen: Screen, cat: Category, brand: Brand | null, model: PhoneModel | null) => {
      switch (screen) {
        case 'HOME':
          return `الصفحة الرئيسية - قسم ${cat}`;
        case 'RESULTS':
          return `مقارنة ومطابقة: ${brand?.name || ''} ${model?.modelName || ''} (قسم ${cat})`;
        case 'BRAND_SELECT':
          return `اختيار البراند لقسم: ${cat}`;
        case 'MODEL_SELECT':
          return `اختيار الموديل لبراند: ${brand?.name || ''} (قسم ${cat})`;
        case 'COMMUNITY':
          return 'المجتمع والطلبات';
        case 'SETTINGS':
          return 'الإعدادات والملف الشخصي';
        case 'AI_ASSISTANT':
          return 'الذكاء الاصطناعي والمساعد';
        case 'GLOBAL_SEARCH':
          return 'البحث الشامل';
        case 'COMPARATOR':
          return 'مقارن الشاشات المباشر';
        default:
          return screen;
      }
    };

    const recordVisit = async () => {
      const activeVisitId = sessionStorage.getItem('active_visit_id');
      const screenInfo = getScreenInfoString(currentScreen, selectedCategory, selectedBrand, selectedModel);
      
      if (activeVisitId) {
        // Session exists, update the last active screen and heartbeat
        try {
          await updateDoc(doc(db, 'visits', activeVisitId), {
            lastScreen: screenInfo,
            lastActive: Date.now(),
            userName: profile?.displayName || user.displayName || 'عضو مسجل'
          });
        } catch (e) {
          console.warn("Retrying session tracking creation...");
          sessionStorage.removeItem('active_visit_id');
          handleFirestoreError(e, OperationType.UPDATE, `visits/${activeVisitId}`);
        }
      } else {
        // Create a new visit session doc in firestore
        try {
          const sessionMeta = getSessionMeta();
          const visitRef = doc(collection(db, 'visits'));
          await setDoc(visitRef, {
            id: visitRef.id,
            userId: user.uid,
            userEmail: user.email || '',
            userName: profile?.displayName || user.displayName || 'عضو مسجل',
            referrer: sessionMeta.referrer,
            utmSource: sessionMeta.utmSource,
            utmMedium: sessionMeta.utmMedium,
            utmCampaign: sessionMeta.utmCampaign,
            userAgent: sessionMeta.userAgent,
            device: sessionMeta.device,
            os: sessionMeta.os,
            browser: sessionMeta.browser,
            lastScreen: screenInfo,
            screenResolution: sessionMeta.screenResolution,
            language: sessionMeta.language,
            countryCode: sessionMeta.countryCode,
            timestamp: Date.now(),
            lastActive: Date.now()
          });
          sessionStorage.setItem('active_visit_id', visitRef.id);
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, 'visits');
        }
      }
    };

    recordVisit();
  }, [user, profile, currentScreen, selectedCategory, selectedBrand, selectedModel]);

  const checkAndRecordSearch = (modelId: string): boolean => {
    if (!modelId) return true;

    // If subscribed, unlimited search!
    if (isSubscribedComputed) {
      return true;
    }

    const today = new Date().toISOString().split('T')[0];
    // If already view/search registered today, allow instantly
    if (searchUsageList.includes(modelId)) {
      return true;
    }

    const limit = user ? 20 : 5;
    if (searchUsageList.length >= limit) {
      return false; // Limit exceeded!
    }

    // Record it
    const newList = [...searchUsageList, modelId];
    setSearchUsageList(newList);
    localStorage.setItem('lcd_dalule_search_tracker', JSON.stringify({
      date: today,
      viewedModelIds: newList
    }));
    return true;
  };

  const handleSetGuestMode = (val: boolean) => {
    setGuestMode(val);
    if (val) {
      localStorage.setItem('guest_mode', 'true');
    } else {
      localStorage.removeItem('guest_mode');
    }
  };

  // Sync suggestions from Firestore
  useEffect(() => {
    const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunitySuggestion));
      setSuggestions(data);
    }, (error) => {
      console.warn("Error subscribing to suggestions:", error);
    });
    return unsubscribe;
  }, []);

  // Sync model metadata from Firestore
  useEffect(() => {
    const q = query(collection(db, 'model_metadata'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Record<string, { imageUrl: string }> = {};
      snapshot.docs.forEach(doc => {
        data[doc.id] = { imageUrl: doc.data().imageUrl };
      });
      setModelMetadata(data);
    }, (error) => {
      console.warn("Error subscribing to model metadata:", error);
    });
    return unsubscribe;
  }, []);

  // Sync AI-generated hardware models from Firestore 'ai_models' (DeepSeek Studio)
  const [cloudAiModels, setCloudAiModels] = useState<PhoneModel[]>([]);
  useEffect(() => {
    try {
      const q = query(collection(db, 'ai_models'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PhoneModel));
        setCloudAiModels(list);
      }, (error) => {
        console.warn("Error subscribing to ai_models:", error);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Could not setup ai_models listener:", e);
    }
  }, []);

  // Fetch user votes (perform one-shot getDoc calls to avoid N continuous onSnapshot listeners that cause rate limit errors)
  useEffect(() => {
    if (!user || suggestions.length === 0) {
      setUserVotes({});
      return;
    }

    let isMounted = true;

    const fetchVotes = async () => {
      const votesMap: Record<string, boolean> = {};
      try {
        // Fetch matching suggestions' votes in parallel using getDoc
        await Promise.all(
          suggestions.map(async (s) => {
            const voteRef = doc(db, 'suggestions', s.id, 'votes', user.uid);
            const docSnap = await getDoc(voteRef);
            if (isMounted && docSnap.exists()) {
              votesMap[s.id] = docSnap.data().isLike;
            }
          })
        );
        if (isMounted) {
          setUserVotes(votesMap);
        }
      } catch (err) {
        console.error("Error fetching user votes:", err);
      }
    };

    fetchVotes();

    return () => {
      isMounted = false;
    };
  }, [user, suggestions.map(s => s.id).join(',')]);

  const isLimitExceeded = () => {
    if (isSubscribedComputed) return false;
    const limit = user ? 20 : 5;
    return searchUsageList.length >= limit;
  };

  const navigateTo = (screen: Screen) => {
    if (screen === 'AI_ASSISTANT' && !isSubscribedComputed) {
      // Logic handled in Nav or Modal
      return;
    }

    // Completely block navigation to search & compatibility flows if limit is exceeded!
    if (['GLOBAL_SEARCH', 'BRAND_SELECT', 'MODEL_SELECT', 'RESULTS'].includes(screen) && isLimitExceeded()) {
      setLimitExceededType(user ? 'MEMBER' : 'GUEST');
      setShowLimitModal(true);
      return;
    }

    setCurrentScreen(screen);

    // Sync clean URL for browser history and indexing
    if (typeof window !== 'undefined' && window.history) {
      try {
        const screenParamMap: Partial<Record<Screen, string>> = {
          HOME: '/',
          COMPARATOR: '/?screen=comparator',
          COMMUNITY: '/?screen=community',
          GLOBAL_SEARCH: '/?screen=search',
          AI_ASSISTANT: '/?screen=ai',
          SETTINGS: '/?screen=settings',
          BRAND_SELECT: '/?screen=brands',
          ABOUT_US: '/?screen=about',
          PRIVACY_POLICY: '/?screen=privacy',
          TERMS_OF_SERVICE: '/?screen=terms',
          CONTACT_US: '/?screen=contact',
          NOT_FOUND: '/404'
        };
        const targetUrl = screenParamMap[screen];
        if (targetUrl) {
          window.history.pushState({ screen }, '', targetUrl);
        }
      } catch (e) {
        // ignore pushState errors
      }
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    resetFlow();
    navigateTo('BRAND_SELECT');
  };

  const resetFlow = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSearchQuery('');
  };

  const handleViewCompatibility = (model: PhoneModel, category: Category) => {
    const allowed = checkAndRecordSearch(model.id);
    if (!allowed) {
      setLimitExceededType(user ? 'MEMBER' : 'GUEST');
      setShowLimitModal(true);
      return;
    }
    const mBrand = brands.find(b => b.id === model.brandId) || null;
    setSelectedBrand(mBrand);
    setSelectedModel(model);
    setSelectedCategory(category);
    navigateTo('RESULTS');

    if (typeof window !== 'undefined' && window.history) {
      try {
        window.history.pushState(
          { modelId: model.id, category },
          '',
          `/?model=${encodeURIComponent(model.id)}&category=${encodeURIComponent(category)}`
        );
      } catch (e) {
        // ignore pushState errors
      }
    }
  };

  const voteForSuggestion = async (suggestionId: string, isLike: boolean) => {
    if (!user) return;

    const voteRef = doc(db, 'suggestions', suggestionId, 'votes', user.uid);
    const suggestionRef = doc(db, 'suggestions', suggestionId);

    try {
      await runTransaction(db, async (transaction) => {
        const voteSnap = await transaction.get(voteRef);
        const suggestionSnap = await transaction.get(suggestionRef);

        if (!suggestionSnap.exists()) return;

        const data = suggestionSnap.data();
        let newLikes = data.likesCount || 0;
        let newDislikes = data.dislikesCount || 0;

        if (voteSnap.exists()) {
          const prevIsLike = voteSnap.data().isLike;
          if (prevIsLike === isLike) {
            // User clicked the identical option again.
            // Under existing security rules, we don't allow delete operations.
            // So we gracefully do nothing and exit without throwing an error!
            return;
          } else {
            // Flipping the vote (changing choice)
            if (isLike) {
              // Changed from Dislike to Like
              newLikes += 1;
              newDislikes = Math.max(0, newDislikes - 1);
            } else {
              // Changed from Like to Dislike
              newDislikes += 1;
              newLikes = Math.max(0, newLikes - 1);
            }
          }
        } else {
          // New vote
          if (isLike) {
            newLikes += 1;
          } else {
            newDislikes += 1;
          }
        }

        // Threshold: 50 likes AND likes > dislikes
        const approved = newLikes > 50 && newLikes > newDislikes;

        transaction.set(voteRef, {
          userId: user.uid,
          suggestionId,
          isLike,
          createdAt: Date.now()
        });

        transaction.update(suggestionRef, {
          likesCount: newLikes,
          dislikesCount: newDislikes,
          isApproved: approved || data.isApproved
        });
      });

      // Update local state after successful transaction
      setUserVotes((prev) => ({
        ...prev,
        [suggestionId]: isLike,
      }));
    } catch (e: any) {
      console.error("Vote failed:", e.message);
      alert("Vote failed: " + e.message);
    }
  };

  const deleteSuggestion = async (suggestionId: string) => {
    if (!isAdmin) return;
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الاقتراح نهائياً؟' : 'Are you sure you want to delete this suggestion?')) return;
    try {
      await deleteDoc(doc(db, 'suggestions', suggestionId));
      alert(language === 'ar' ? 'تم الحذف بنجاح.' : 'Deleted successfully.');
    } catch (e: any) {
      console.error("Delete failed:", e);
      alert("Delete failed: " + e.message);
    }
  };

  const toggleApproveSuggestion = async (suggestionId: string, currentStatus: boolean) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, 'suggestions', suggestionId), {
        isApproved: !currentStatus
      });
      alert(language === 'ar' ? 'تم تحديث حالة الموافقة.' : 'Approval status updated.');
    } catch (e: any) {
      console.error("Toggle approval failed:", e);
      alert("Verification failed: " + e.message);
    }
  };

  const addSuggestion = async (brand: string, model: string, code: string, imageUrl?: string) => {
    if (!user) return;

    const newSuggestionRef = doc(collection(db, 'suggestions'));
    const newSuggestion = {
      id: newSuggestionRef.id,
      brand,
      model,
      suggestedCompatibleCode: code,
      likesCount: 0,
      dislikesCount: 0,
      isApproved: false,
      createdBy: user.uid,
      createdByEmail: user.email,
      createdAt: Date.now(),
      imageUrl: imageUrl || ''
    };

    try {
      await setDoc(newSuggestionRef, newSuggestion);
      setShowAddModal(false);
    } catch (e) {
      console.error("Failed to add suggestion:", e);
    }
  };

  // Inject approved models into the current view
  const approvedModelsAsPhoneModels: PhoneModel[] = suggestions
    .filter(s => s.isApproved)
    .map(s => ({
      id: `approved-${s.id}`,
      brandId: brands.find(b => b.name.toLowerCase() === s.brand.toLowerCase())?.id || 'other',
      modelName: s.model,
      lcdScreenCode: s.suggestedCompatibleCode
    }));

  const rawPhoneModelsObj = [...phoneModels, ...approvedModelsAsPhoneModels, ...cloudAiModels].map(m => ({
    ...m,
    imageUrl: modelMetadata[m.id]?.imageUrl || m.imageUrl
  }));

  const allPhoneModels = rawPhoneModelsObj.map(m => {
    if (m.imageUrl) return m;
    const matchingModelWithImage = rawPhoneModelsObj.find(
      other => other.lcdScreenCode && other.lcdScreenCode === m.lcdScreenCode && other.imageUrl
    );
    return {
      ...m,
      imageUrl: matchingModelWithImage ? matchingModelWithImage.imageUrl : undefined
    };
  });

  const currentSelectedModel = selectedModel ? allPhoneModels.find(m => m.id === selectedModel.id) || selectedModel : null;

  const compatibleModels = currentSelectedModel
    ? allPhoneModels.filter(m => {
        const selectedCode = getCategoryCode(currentSelectedModel, selectedCategory);
        const codeToMatch = getCategoryCode(m, selectedCategory);
        return selectedCode === codeToMatch && m.id !== currentSelectedModel.id;
      })
    : [];

  if (loading) {
    return (
      <div className="flex flex-col h-[100dvh] bg-obsidian items-center justify-center px-6 relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Soft, beautiful background light-beam ambient gradients to enhance visual weight immediately */}
        <div className="absolute top-[-25%] left-[-25%] w-[90%] h-[90%] bg-cyber-cyan/5 rounded-full blur-[90px]" />
        <div className="absolute bottom-[-25%] right-[-25%] w-[90%] h-[90%] bg-cyber-cyan/5 rounded-full blur-[90px]" />

        <div className="z-10 text-center flex flex-col items-center max-w-[320px] animate-pulse">
          {/* Smooth, lightweight SVG Logo - renders immediately in sub-milliseconds without network dependencies */}
          <div className="relative w-24 h-24 mb-6">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,210,210,0.30)]">
              <rect x='20' y='15' width='40' height='70' rx='8' fill='none' stroke='#00D2D2' strokeWidth='6' transform='rotate(15 40 50)' />
              <rect x='40' y='15' width='40' height='70' rx='8' fill='none' stroke='#FFFFFF' strokeWidth='6' transform='rotate(-15 60 50)' />
            </svg>
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-widest leading-none mb-1">LCD DALULE</h1>
          <h2 className="text-xs font-black text-cyber-cyan uppercase tracking-widest mb-3 font-mono">Screen Matching System</h2>
          
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent mb-4 font-sans"></div>
          
          <h3 className="text-sm font-bold text-slate-200 leading-relaxed mb-1">
            {language === 'ar' ? 'دليل الشاشات والمطابقات الهندسية' : 'Hardware Parts Compatibility Guide'}
          </h3>
          <p className="text-[10px] text-gray-green font-medium">
            {language === 'ar' ? 'أكبر تجمع وتكامل لفنيي صيانة الهواتف الذكية' : 'The ultimate workspace for smartphone repair technicians'}
          </p>

          <div className="flex items-center gap-2.5 mt-8 bg-slate-teal border border-midnight-teal px-4.5 py-2.5 rounded-full shadow-lg backdrop-blur-sm">
            <div className="w-3.5 h-3.5 border-2 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin"></div>
            <span className="text-[11px] text-slate-200 font-bold leading-none tracking-wide">
              {language === 'ar' ? 'جاري مزامنة قاعدة البيانات والترقيات...' : 'Syncing database and optimizations...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !guestMode) {
    return <LoginScreen onGuestAccess={() => handleSetGuestMode(true)} language={language} t={t} appBranding={appBranding} />;
  }

  if (isPrinting) {
    const lcdGroups: Record<string, any[]> = {};
    allPhoneModels.forEach((model: any) => {
      const code = getCategoryCode(model, 'LCD');
      const brandObj = brands.find((b: any) => b.id === model.brandId);
      const brandName = brandObj ? brandObj.name : '';
      if (code) {
        if (!lcdGroups[code]) {
          lcdGroups[code] = [];
        }
        lcdGroups[code].push({ ...model, brandName });
      }
    });

    return (
      <PrintCheatSheetView
        lcdGroups={lcdGroups}
        language={language}
        onClose={() => setIsPrinting(false)}
      />
    );
  }

  return (
    <div 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`flex flex-col h-[100dvh] bg-obsidian font-sans text-slate-100 overflow-hidden max-w-[450px] mx-auto shadow-[0_0_65px_rgba(0,210,210,0.15)] relative border-x border-midnight-teal ${language === 'ar' ? 'text-right' : 'text-left'}`}
    >
      {/* Ad Banner for non-subscribers */}
      {!isSubscribedComputed && (
        <div className="bg-slate-teal px-4 py-2 flex items-center justify-between text-[10px] font-bold text-cyber-cyan border-b border-midnight-teal relative z-50 font-sans">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-cyber-cyan" />
            <span>{t.proTip}</span>
          </div>
          <button onClick={() => navigateTo('SETTINGS')} className="underline hover:text-white transition-colors">{language === 'ar' ? 'ترقية' : 'UPGRADE'}</button>
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-[155px] bg-gradient-to-b from-slate-teal to-obsidian border-b border-midnight-teal/65 rounded-b-[40px] z-0 overflow-hidden shadow-lg shadow-cyber-cyan/5 flex flex-col items-center justify-center px-8">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl wave"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 z-10 relative custom-scrollbar ${
        currentScreen === 'AI_ASSISTANT' 
          ? 'overflow-hidden flex flex-col h-full min-h-0 pt-4 px-6 pb-28' 
          : currentScreen === 'BRAND_SELECT' 
          ? 'overflow-y-auto pt-0 px-0' 
          : 'overflow-y-auto px-6 pt-4 pb-32'
      }`}>
        <AnimatePresence mode="wait">
          {currentScreen === 'HOME' && (
            <HomeScreen 
              key="home" 
              onSelectCategory={handleCategorySelect} 
              onNavigateComparator={() => navigateTo('COMPARATOR')}
              onNavigateLegal={(screen: Screen) => navigateTo(screen)}
              onSearchQueryClick={(query: string) => {
                setInitialSearchQuery(query);
                navigateTo('GLOBAL_SEARCH');
              }}
              onPrintPdfClick={() => setIsPrinting(true)}
              t={t} 
              profile={profile}
              user={user}
              searchUsageList={searchUsageList}
              onUpgradeClick={() => navigateTo('SETTINGS')}
              onLoginClick={() => {
                localStorage.removeItem('guest_mode');
                window.location.reload();
              }}
              googleAds={googleAds}
              isPremium={isSubscribedComputed}
              appBranding={appBranding}
              onInstallApp={handleInstallApp}
            />
          )}

          {currentScreen === 'COMPATIBILITY_FLOW' && (
            <CompatibilityFlowScreen 
              key="flow"
              category={selectedCategory}
              brand={selectedBrand}
              model={selectedModel}
              allPhoneModels={allPhoneModels}
              onSelectBrand={() => navigateTo('BRAND_SELECT')}
              onSelectModel={() => navigateTo('MODEL_SELECT')}
              onSelectModelDirect={(model: PhoneModel, brand: Brand) => {
                const allowed = checkAndRecordSearch(model.id);
                if (!allowed) {
                  setLimitExceededType(user ? 'MEMBER' : 'GUEST');
                  setShowLimitModal(true);
                  return;
                }
                setSelectedBrand(brand);
                setSelectedModel(model);
                navigateTo('RESULTS');
              }}
              onShowResults={() => navigateTo('RESULTS')}
              onBack={() => {
                resetFlow();
                navigateTo('HOME');
              }}
            />
          )}

          {currentScreen === 'BRAND_SELECT' && (
            <BrandSelectScreen
              key="brand-select"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              allPhoneModels={allPhoneModels}
              category={selectedCategory}
              onSelect={(brand) => {
                setSelectedBrand(brand);
                setSelectedModel(null);
                setSearchQuery('');
                navigateTo('MODEL_SELECT');
              }}
              onSelectModelDirect={(model, brand) => {
                const allowed = checkAndRecordSearch(model.id);
                if (!allowed) {
                  setLimitExceededType(user ? 'MEMBER' : 'GUEST');
                  setShowLimitModal(true);
                  return;
                }
                setSelectedBrand(brand);
                setSelectedModel(model);
                setSearchQuery('');
                navigateTo('RESULTS');
              }}
              onBack={() => {
                if (!selectedBrand) {
                  navigateTo('HOME');
                } else {
                  navigateTo('COMPATIBILITY_FLOW');
                }
              }}
            />
          )}

          {currentScreen === 'MODEL_SELECT' && (
            <ModelSelectScreen
              key="model-select"
              brand={selectedBrand}
              allPhoneModels={allPhoneModels}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              category={selectedCategory}
              onSelect={(model) => {
                const allowed = checkAndRecordSearch(model.id);
                if (!allowed) {
                  setLimitExceededType(user ? 'MEMBER' : 'GUEST');
                  setShowLimitModal(true);
                  return;
                }
                setSelectedModel(model);
                navigateTo('RESULTS');
              }}
              onBack={() => {
                navigateTo('COMPATIBILITY_FLOW');
              }}
            />
          )}

          {currentScreen === 'RESULTS' && (
            <ResultsScreen
              key="results"
              selectedModel={currentSelectedModel}
              compatibleModels={compatibleModels}
              category={selectedCategory}
              onBack={() => navigateTo('COMPATIBILITY_FLOW')}
              onAddImage={addImageToModel}
              isAdmin={user?.email === 'dracola.33@gmail.com' || profile?.role === 'admin' || profile?.isAdmin || profile?.email === 'dracola.33@gmail.com'}
              googleAds={googleAds}
              isPremium={isSubscribedComputed}
            />
          )}

          {currentScreen === 'COMMUNITY' && (
            <CommunityPage
              key="community"
              suggestions={suggestions}
              userVotes={userVotes}
              onVote={voteForSuggestion}
              onAddClick={() => setShowAddModal(true)}
              onBack={() => navigateTo('HOME')}
              isAdmin={isAdmin}
              onDelete={deleteSuggestion}
              onToggleApprove={toggleApproveSuggestion}
            />
          )}

          {currentScreen === 'SETTINGS' && (
            <SettingsPage
              key="settings"
              profile={profile}
              language={language}
              onChangeLanguage={handleSetLanguage}
              onBack={() => navigateTo('HOME')}
              onNavigate={(screen: Screen) => navigateTo(screen)}
              isAdmin={isAdmin}
              allPhoneModels={allPhoneModels}
              brands={brands}
              googleAds={googleAds}
              onSaveGoogleAds={handleSaveGoogleAds}
              appBranding={appBranding}
              onSaveAppBranding={handleSaveAppBranding}
              isPremium={isSubscribedComputed}
              onSubscribe={() => setGuestIsSubscribed(true)}
              onInstallApp={handleInstallApp}
            />
          )}

          {currentScreen === 'AI_ASSISTANT' && (
            <AIAssistantScreen 
              key="ai"
              initialPrompt={aiAssistantInitialPrompt}
              onClearInitialPrompt={() => setAiAssistantInitialPrompt('')}
              onBack={() => navigateTo('HOME')}
            />
          )}

          {currentScreen === 'GLOBAL_SEARCH' && (
            <GlobalSearchScreen
              key="global-search"
              allPhoneModels={allPhoneModels}
              brands={brands}
              language={language}
              t={t}
              initialQuery={initialSearchQuery}
              onClearInitialQuery={() => setInitialSearchQuery('')}
              onOpenAiWithQuery={(promptText: string) => {
                setAiAssistantInitialPrompt(promptText);
                navigateTo('AI_ASSISTANT');
              }}
              onViewCompatibility={handleViewCompatibility}
              onExpandModel={(modelId: string) => {
                const allowed = checkAndRecordSearch(modelId);
                if (!allowed) {
                  setLimitExceededType(user ? 'MEMBER' : 'GUEST');
                  setShowLimitModal(true);
                  return false;
                }
                return true;
              }}
              onBack={() => navigateTo('HOME')}
            />
          )}

          {currentScreen === 'COMPARATOR' && (
            <ComparatorScreen
              key="comparator"
              allPhoneModels={allPhoneModels}
              brands={brands}
              language={language}
              onBack={() => navigateTo('HOME')}
              isPremium={isSubscribedComputed}
            />
          )}

          {currentScreen === 'PRIVACY_POLICY' && (
            <LegalPage
              key="privacy"
              pageType="PRIVACY"
              language={language}
              onBack={() => navigateTo('HOME')}
            />
          )}

          {currentScreen === 'TERMS_OF_SERVICE' && (
            <LegalPage
              key="terms"
              pageType="TERMS"
              language={language}
              onBack={() => navigateTo('HOME')}
            />
          )}

          {currentScreen === 'ABOUT_US' && (
            <LegalPage
              key="about"
              pageType="ABOUT"
              language={language}
              onBack={() => navigateTo('HOME')}
            />
          )}

          {currentScreen === 'CONTACT_US' && (
            <LegalPage
              key="contact"
              pageType="CONTACT"
              language={language}
              onBack={() => navigateTo('HOME')}
            />
          )}

          {currentScreen === 'NOT_FOUND' && (
            <NotFoundPage
              key="not-found"
              language={language}
              onNavigateHome={() => navigateTo('HOME')}
              onNavigateSearch={(query?: string) => {
                if (query) setInitialSearchQuery(query);
                navigateTo('GLOBAL_SEARCH');
              }}
              onSelectBrand={(brand) => {
                setSelectedBrand(brand);
                navigateTo('MODEL_SELECT');
              }}
              onSelectCategory={(cat) => handleCategorySelect(cat)}
              onNavigateScreen={(screen: Screen) => navigateTo(screen)}
            />
          )}
        </AnimatePresence>

        {showAddModal && <AddSuggestionModal onClose={() => setShowAddModal(false)} onAdd={addSuggestion} />}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[450px] flex justify-center px-4 z-50">
        <nav className="w-full max-w-[390px] bg-slate-teal/90 backdrop-blur-xl border-2 border-midnight-teal shadow-[0_15px_35px_rgba(0,0,0,0.45)] rounded-[30px] px-2.5 py-1.5 flex justify-around items-center gap-1 font-sans">
          <NavButton 
            icon={<Home size={20} />} 
            active={currentScreen === 'HOME'} 
            label={t.home}
            onClick={() => navigateTo('HOME')} 
          />
          <NavButton 
            icon={<Search size={20} />} 
            active={currentScreen === 'GLOBAL_SEARCH'} 
            label={t.search}
            onClick={() => {
              setSearchQuery('');
              navigateTo('GLOBAL_SEARCH');
            }} 
          />
          <NavButton 
            icon={<Users size={20} />} 
            active={currentScreen === 'COMMUNITY'} 
            label={t.community}
            onClick={() => navigateTo('COMMUNITY')} 
          />
          {isSubscribedComputed && (
            <NavButton 
              icon={<Sparkles size={20} />} 
              active={currentScreen === 'AI_ASSISTANT'} 
              label={t.aiAssistant}
              onClick={() => navigateTo('AI_ASSISTANT')} 
            />
          )}
          <NavButton 
            icon={<Settings size={20} />} 
            active={currentScreen === 'SETTINGS'} 
            label={t.settings}
            onClick={() => navigateTo('SETTINGS')} 
          />
        </nav>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-right" dir="rtl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4 border border-slate-100 text-center"
          >
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 text-center">
                {limitExceededType === 'GUEST' ? t.guestLimitTitle : t.memberLimitTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed text-center">
                {limitExceededType === 'GUEST' ? t.guestLimitDesc : t.memberLimitDesc}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {limitExceededType === 'GUEST' ? (
                <>
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      localStorage.removeItem('guest_mode');
                      window.location.reload();
                    }}
                    className="w-full py-3 bg-[#4A7BFF] hover:bg-blue-600 text-white font-black rounded-2xl text-xs tracking-wide shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User size={14} />
                    {t.loginNow}
                  </button>
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      setGuestMode(false);
                      localStorage.removeItem('guest_mode');
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'الرجوع لصفحة الدخول 🔑' : 'Back to Login 🔑'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      navigateTo('SETTINGS');
                    }}
                    className="w-full py-3 bg-[#4A7BFF] hover:bg-blue-600 text-white font-black rounded-2xl text-xs tracking-wide shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    {t.proNeeded}
                  </button>
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    {t.understandClose}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {showInstallInstructions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 text-right" dir="rtl">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-teal border-2 border-midnight-teal max-w-sm w-full rounded-[30px] p-6 text-right space-y-5 shadow-2xl relative font-sans"
          >
            {/* Header */}
            <div className="text-center space-y-1.5 pb-2 border-b border-midnight-teal/30">
              <div className="w-12 h-12 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan rounded-full flex items-center justify-center mx-auto mb-2 relative">
                <Download size={22} className="animate-pulse" />
              </div>
              <h3 className="text-base font-black text-white">نزّل دليل الشاشات والمطابقات</h3>
              <p className="text-[10px] font-bold text-gray-green">خطوات تثبيت أيقونة التطبيق على شاشة هاتفك المحمول</p>
            </div>

            {/* Instruction Body */}
            <div className="space-y-4">
              {/* iOS / Safari Instructions */}
              <div className="space-y-2 p-3.5 bg-obsidian/60 border border-midnight-teal/60 rounded-2xl relative">
                <div className="flex items-center gap-2 text-cyber-cyan font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-cyber-cyan/15 text-cyber-cyan flex items-center justify-center text-[10px] font-sans font-bold">1</span>
                  <span>هواتف آيفون (iPhone - Safari):</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200 font-semibold pr-1">
                  1. اضغط على زر <strong className="text-cyber-cyan text-[10px] border border-cyber-cyan/30 px-1 py-0.5 rounded bg-cyber-cyan/10 font-bold">مشاركة (Share)</strong> في شريط سفلي متصفح Safari.<br/>
                  2. مرر للأسفل واختر <strong className="text-cyber-cyan text-[10px] border border-cyber-cyan/30 px-1 py-0.5 rounded bg-cyber-cyan/10 font-bold">إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.<br/>
                  3. اضغط على <strong className="text-[#00D2D2] text-[10px] border border-cyber-cyan/30 px-1 py-0.5 rounded bg-cyber-cyan/10 font-bold">إضافة (Add)</strong> في الزاوية العلوية.
                </p>
              </div>

              {/* Android / Chrome Instructions */}
              <div className="space-y-2 p-3.5 bg-obsidian/60 border border-midnight-teal/60 rounded-2xl relative">
                <div className="flex items-center gap-2 text-cyber-cyan font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-cyber-cyan/15 text-cyber-cyan flex items-center justify-center text-[10px] font-sans font-bold">2</span>
                  <span>هواتف أندرويد (Android - Chrome):</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200 font-semibold pr-1">
                  1. اضغط على <strong className="text-cyber-cyan text-[10px] border border-cyber-cyan/30 px-1 py-0.5 rounded bg-cyber-cyan/10 font-bold">النقاط الثلاثة</strong> أعلى الزاوية في متصفح Chrome.<br/>
                  2. اختر خيار <strong className="text-cyber-cyan text-[10px] border border-cyber-cyan/30 px-1 py-0.5 rounded bg-cyber-cyan/10 font-bold">التثبيت / إضافة للشاشة الرئيسية (Install App / Add)</strong>.<br/>
                  3. أكد التثبيت لتظهر الأيقونة فوراً على سطح هاتفك.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setShowInstallInstructions(false)}
              className="w-full py-3 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian rounded-2xl font-black text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer text-center"
            >
              فهمت (تمت إضافة الأيقونة)
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Google Ads Banner Component
function GoogleAdBanner({ googleAds, isPremium, language, isAdminView = false }: any) {
  if (!googleAds || !googleAds.isEnabled) return null;
  if (isPremium && !isAdminView) return null;

  const t = translations[language === 'ar' ? 'ar' : 'en'] || translations['ar'];
  const isHtml = googleAds.bannerUrlOrHtml && (
    googleAds.bannerUrlOrHtml.includes('<script') || 
    googleAds.bannerUrlOrHtml.includes('<iframe') || 
    googleAds.bannerUrlOrHtml.includes('</div>') ||
    googleAds.bannerUrlOrHtml.includes('</a>')
  );

  useEffect(() => {
    if (googleAds.adFormat === 'adsense' && googleAds.adSenseClient) {
      try {
        let script = document.querySelector('script[src*="pagead2.googlesyndication.com"]') as HTMLScriptElement | null;
        if (!script) {
          const newScript = document.createElement('script');
          newScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAds.adSenseClient}`;
          newScript.async = true;
          newScript.crossOrigin = "anonymous";
          document.head.appendChild(newScript);
        }
        
        const timer = setTimeout(() => {
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (_) {}
        }, 200);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("AdSense integration error:", err);
      }
    }
  }, [googleAds.adSenseClient, googleAds.adSenseSlot, googleAds.adFormat]);

  return (
    <div className="my-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3 shadow-[0_2px_12px_rgba(245,158,11,0.05)] text-slate-800 text-right overflow-hidden relative">
      <div className="flex justify-between items-center mb-1.5 border-b border-amber-100 pb-1">
        <span className="text-[8px] uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full font-black">
          {googleAds.adTitle || (language === 'ar' ? 'إعلان ممول من جوجل' : 'Google Sponsored')}
        </span>
        {isAdminView && (
          <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
            {language === 'ar' ? 'معاينة مسؤول' : 'Admin Preview'}
          </span>
        )}
      </div>

      {googleAds.adFormat === 'adsense' && googleAds.adSenseClient ? (
        <div className="w-full flex justify-center py-2 overflow-hidden" key={`${googleAds.adSenseClient}-${googleAds.adSenseSlot}`}>
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', minWidth: '250px', width: '100%', minHeight: '90px' }}
            data-ad-client={googleAds.adSenseClient}
            data-ad-slot={googleAds.adSenseSlot || ''}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : isHtml ? (
        <div 
          className="text-xs text-center justify-center flex flex-col ad-embed-container"
          dangerouslySetInnerHTML={{ __html: googleAds.bannerUrlOrHtml }} 
        />
      ) : (
        <a 
          href={googleAds.linkUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group anim-pulse-once"
        >
          {googleAds.bannerImageUrl ? (
            <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200">
              <img src={googleAds.bannerImageUrl} alt="Google Ad Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
          ) : (
            <div className="p-3 bg-white rounded-xl border border-amber-100 group-hover:border-amber-400 transition-colors text-xs font-semibold text-slate-800 leading-relaxed text-right rtl:text-right ltr:text-left shadow-sm">
              {googleAds.bannerUrlOrHtml}
            </div>
          )}
        </a>
      )}

      {!isPremium && !isAdminView && (
        <div className="mt-1.5 flex justify-end">
          <span className="text-[8px] text-slate-400 font-bold block">
            {language === 'ar' ? 'الترقية تمنحك تجربة خالية تماماً من الإعلانات 🚀' : 'Upgrade to remove Ads 🚀'}
          </span>
         </div>
      )}
    </div>
  );
}

// Sub-components

function HomeScreen({ onSelectCategory, onNavigateComparator, onNavigateLegal, onSearchQueryClick, onPrintPdfClick, t, profile, user, searchUsageList = [], onUpgradeClick, onLoginClick, googleAds, isPremium, appBranding, onInstallApp }: any) {
  const isAr = !t.appName.includes("Compatibility");
  const [activeTab, setActiveTab] = useState<'LCD' | 'IC' | 'SCREEN_PROTECTOR' | 'BATTERY' | 'COMPARATOR'>('LCD');

  const shortcuts = [
    {
      id: 'LCD' as const,
      title: isAr ? 'شاشات LCD' : 'LCD Screens',
      subtitle: isAr ? 'مطابقات شاشات' : 'Screen Matches',
      themeColor: '#00D2D2',
      icon: <Smartphone size={18} />,
      action: () => onSelectCategory('LCD')
    },
    {
      id: 'IC' as const,
      title: isAr ? 'قطع IC' : 'Chips / IC',
      subtitle: isAr ? 'بدائل الدوائر' : 'Power & Charge',
      themeColor: '#FB8C00',
      icon: <Cpu size={18} />,
      action: () => onSelectCategory('IC')
    },
    {
      id: 'SCREEN_PROTECTOR' as const,
      title: isAr ? 'واقي زجاج' : 'Cover Glass',
      subtitle: isAr ? 'أبعاد متوافقة' : 'Dimension Match',
      themeColor: '#4CAF50',
      icon: <ShieldAlert size={18} />,
      action: () => onSelectCategory('SCREEN_PROTECTOR')
    },
    {
      id: 'BATTERY' as const,
      title: isAr ? 'البطارية' : 'Batteries',
      subtitle: isAr ? 'توافق السعة' : 'Capacity Match',
      themeColor: '#F44336',
      icon: <Battery size={18} />,
      action: () => onSelectCategory('BATTERY')
    },
    {
      id: 'COMPARATOR' as const,
      title: isAr ? 'المقارن' : 'Comparator',
      subtitle: isAr ? 'مقارن الدبابيس' : 'Pin-to-Pin Check',
      themeColor: '#9C27B0',
      icon: <Sparkles size={18} />,
      action: onNavigateComparator
    }
  ];

  const handleShortcutClick = (shortcut: any) => {
    setActiveTab(shortcut.id);
    setTimeout(() => {
      shortcut.action();
    }, 180);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 font-sans"
    >
      <div className="flex justify-between items-center text-white">
        <div className="p-2 bg-slate-teal/60 rounded-full border border-midnight-teal backdrop-blur-md">
          <Info size={20} className="text-cyber-cyan" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-cyber-cyan font-sans">{t.appName}</span>
          {appBranding?.appIconUrl ? (
            <img src={appBranding.appIconUrl} alt="App Icon" className="w-5 h-5 object-contain rounded bg-white p-0.5" />
          ) : (
            <Smartphone size={20} className="text-cyber-cyan" />
          )}
        </div>
      </div>

      {/* Daily Search Limits Tracker card */}
      <div className="bg-slate-teal rounded-3xl p-4 shadow-sm border border-midnight-teal flex items-center justify-between gap-3 text-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-obsidian text-cyber-cyan rounded-2xl border border-midnight-teal/65">
            <Search size={18} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-extrabold text-gray-green block tracking-wide uppercase">{t.searchRemaining}</span>
            <span className="font-extrabold text-sm text-slate-150">
              {isPremium ? (
                <span className="text-cyber-cyan flex items-center gap-1">
                  <Sparkles size={14} className="inline animate-pulse text-cyber-cyan" /> {t.unlimitedSearch}
                </span>
              ) : (
                <span>
                  {user ? (20 - searchUsageList.length) : (5 - searchUsageList.length)} / {user ? 20 : 5}
                </span>
              )}
            </span>
          </div>
        </div>
        {!isPremium && (
          <button 
            onClick={() => {
              if (user) {
                onUpgradeClick?.();
              } else {
                onLoginClick?.();
              }
            }}
            className="text-[10px] font-black bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian px-3.5 py-2 rounded-full hover:scale-102 hover:brightness-115 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            {user ? t.proNeeded : t.signInWithGoogle}
          </button>
        )}
      </div>

      {/* PWA Promo Install Card */}
      <div className="bg-gradient-to-l from-cyber-cyan/15 to-transparent border border-cyber-cyan/25 rounded-3xl p-4 flex items-center justify-between gap-4 text-slate-100 relative overflow-hidden backdrop-blur-sm shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cyber-cyan/10 to-transparent pointer-events-none blur-sm" />
        <div className="flex items-center gap-3 relative z-10 text-right">
          <div className="p-3 bg-obsidian text-cyber-cyan rounded-2xl border border-cyber-cyan/35 shadow-inner">
            <Download size={18} className="animate-bounce" />
          </div>
          <div className="text-right">
            <span className="text-[11px] font-black text-slate-100 block">تنزيل أيقونة التطبيق على سطح الهاتف</span>
            <span className="text-[9px] font-extrabold text-[#00D2D2] block mt-0.5">وصول سريع وفوري لدليل DALULE بلمسة واحدة</span>
          </div>
        </div>
        <button 
          onClick={onInstallApp}
          className="relative z-10 text-[10px] font-black bg-gradient-to-r from-[#00D2D2] to-cyan-400 text-obsidian px-4 py-2.5 rounded-full hover:scale-102 hover:brightness-115 transition-all shadow-[0_4px_12px_rgba(0,210,210,0.25)] active:scale-98 cursor-pointer shrink-0"
        >
          تثبيت الآن
        </button>
      </div>

      {/* Quick Access Menu & Navigation Tab Layout */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black tracking-wider text-gray-green uppercase">
            {isAr ? 'الوصول السريع للأقسام والأدوات' : 'Quick Access Shortcuts'}
          </span>
          <span className="text-[8px] font-bold text-cyber-cyan tracking-widest uppercase">
            {isAr ? 'توافق فوري' : 'Instant Match'}
          </span>
        </div>
        
        <div className="flex space-x-4 space-x-reverse overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-0.5" style={{ WebkitOverflowScrolling: 'touch' }}>
          {shortcuts.map((shortcut) => {
            const isActive = activeTab === shortcut.id;
            return (
              <button
                key={shortcut.id}
                id={`shortcut-tab-${shortcut.id}`}
                onClick={() => handleShortcutClick(shortcut)}
                className={`flex-shrink-0 rounded-3xl p-4 w-[114px] text-center space-y-3 flex flex-col items-center transition-all border duration-300 transform active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#00D2D2] border-[#00D2D2] text-[#021419] shadow-[0_4px_20px_rgba(0,210,210,0.3)] font-black'
                    : 'bg-[#0A262D] border-[#143B45] text-slate-100 hover:border-[#00D2D2] hover:shadow-[0_0_15px_rgba(0,210,210,0.3)]'
                }`}
              >
                {/* Center Icon Container */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center border transition-colors"
                  style={{ 
                    backgroundColor: `${shortcut.themeColor}1A`, 
                    borderColor: `${shortcut.themeColor}33` 
                  }}
                >
                  <div style={{ color: isActive ? '#021419' : shortcut.themeColor }} className="transition-all scale-105">
                    {shortcut.icon}
                  </div>
                </div>

                {/* Text Labels */}
                <div className="space-y-1 w-full">
                  <h4 
                    className="text-[11px] font-black leading-tight truncate w-full text-center tracking-tight font-display"
                    style={{ color: isActive ? '#021419' : '#FFFFFF' }}
                  >
                    {shortcut.title}
                  </h4>
                  <p 
                    className="text-[8px] font-bold truncate w-full text-center"
                    style={{ color: isActive ? '#021419' : '#7C989E' }}
                  >
                    {shortcut.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 pt-1">
        <CategoryCard 
          icon={<Smartphone size={24} className="text-[#00D2D2]" />}
          title={t.lcdTitle}
          desc={t.lcdDesc}
          iconBg="bg-cyber-cyan/10 border border-cyber-cyan/25"
          onClick={() => onSelectCategory('LCD')}
        />
        
        <CategoryCard 
          icon={<Cpu size={24} className="text-[#FB8C00]" />}
          title={t.icTitle}
          desc={t.icDesc}
          iconBg="bg-orange-950/20 border border-orange-500/20"
          onClick={() => onSelectCategory('IC')}
        />

        <CategoryCard 
          icon={<ShieldAlert size={24} className="text-[#4CAF50]" />}
          title={t.spTitle}
          desc={t.spDesc}
          iconBg="bg-emerald-950/20 border border-emerald-500/20"
          onClick={() => onSelectCategory('SCREEN_PROTECTOR')}
        />

        <CategoryCard 
          icon={<Battery size={24} className="text-[#F44336]" />}
          title={t.batteryTitle}
          desc={t.batteryDesc}
          iconBg="bg-rose-950/20 border border-rose-500/20"
          onClick={() => onSelectCategory('BATTERY')}
        />

        {/* Advanced Spec Comparison Dual Tool */}
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigateComparator}
          className="w-full flex items-center gap-4 p-4 rounded-[20px] shadow-[0_4px_18px_rgba(0,210,210,0.06)] border-2 border-dashed border-cyber-cyan/30 bg-gradient-to-r from-slate-teal to-obsidian hover:border-cyber-cyan transition-all cursor-pointer group text-right justify-between"
          dir="rtl"
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="p-3 bg-obsidian text-cyber-cyan rounded-[15px] border border-midnight-teal shrink-0">
              <Sparkles size={24} className="animate-pulse text-cyber-cyan animate-duration-1500" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-[#00D2D2] text-base tracking-tight truncate">
                {isAr ? 'مقارن المطابقات والبدائل الاحترافي 🔍' : 'Professional Match Comparator Tool 🔍'}
              </h3>
              <p className="text-xs text-gray-green leading-tight truncate">
                {isAr ? 'مقارنة فنية لشاشتين ودبابيس الفلاتة وجهاً لوجه' : 'Compare pins, sizing, and compatibility of 2 models'}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-cyber-cyan group-hover:translate-x-[-4px] transition-transform shrink-0" />
        </motion.button>
      </div>

      {/* Trending Search Keywords Section to optimize Google SEO and aid phone technicians */}
      <div className="bg-gradient-to-l from-slate-teal to-[#0A262D] border border-cyber-cyan/15 rounded-3xl p-5 text-slate-200 shadow-md">
        <h3 className="text-xs font-black text-[#00D2D2] tracking-wider uppercase mb-3 flex items-center gap-1.5 justify-start">
          <Sparkles size={14} className="text-cyber-cyan animate-pulse shrink-0" />
          <span>{isAr ? 'الكلمات الأكثر بحثاً ومطابقة شاشات LCD 🚀' : 'Trending LCD Compatibility Searches 🚀'}</span>
        </h3>
        <p className="text-[11px] text-gray-green mb-4 leading-relaxed">
          {isAr 
            ? 'انقر على أي من الكلمات الأكثر طلباً في محركات البحث لعرض بدائل الشاشات والمطابقة فوراً، أو حمل دليل المطابقة الكامل:' 
            : 'Click on any of the trending Google search terms below to view screen compatibilities instantly or export the full guide:'}
        </p>

        <div className="flex flex-wrap gap-2 justify-start mb-4">
          {[
            { label: 'lcd compatible itel a70', query: 'itel a70' },
            { label: 'lcd compatible spark go 1', query: 'tecno spark go 1' },
            { label: 'lcd compatible redmi 9t', query: 'redmi 9t' },
            { label: 'lcd compatible oppo a15', query: 'oppo a15' },
            { label: 'lcd compatible oppo a18', query: 'oppo a18' },
            { label: 'lcd compatible redmi a3', query: 'redmi a3' },
            { label: 'lcd compatible itel s23', query: 'itel s23' },
            { label: 'lcd compatible x665', query: 'x665' },
            { label: 'lcd compatible oppo a55', query: 'oppo a55' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSearchQueryClick?.(item.query)}
              className="text-[10px] font-bold bg-[#0A2E35] hover:bg-cyber-cyan hover:text-obsidian text-slate-200 px-3 py-1.5 rounded-xl border border-[#14444F] transition-all active:scale-95 cursor-pointer"
            >
              🔍 {item.label}
            </button>
          ))}

          {/* PDF Guide Export Button */}
          <button
            onClick={onPrintPdfClick}
            className="text-[10px] font-black bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-100 px-3.5 py-1.5 rounded-xl border border-emerald-600 transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
          >
            📄 lcd compatible list pdf
          </button>
        </div>
      </div>

      {/* Google Sponsored Ads Insertion */}
      <GoogleAdBanner googleAds={googleAds} isPremium={isPremium} language={isAr ? 'ar' : 'en'} />

      <div className="bg-slate-teal border border-midnight-teal rounded-3xl p-5 text-slate-200 shadow-md relative mt-4">
        <p className="text-xs font-semibold leading-relaxed text-center text-gray-green mb-4">
          {t.techSupport}
        </p>
        <div className="border-t border-midnight-teal/30 pt-4 mt-2">
          <div className="grid grid-cols-2 gap-3 text-center">
            <button 
              onClick={() => onNavigateLegal('ABOUT_US')}
              className="text-[11px] font-black text-cyber-cyan hover:underline hover:text-white transition-colors bg-obsidian/30 py-2 px-3 rounded-xl border border-midnight-teal/40 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Info size={12} />
              <span>{isAr ? 'من نحن' : 'About Us'}</span>
            </button>
            <button 
              onClick={() => onNavigateLegal('CONTACT_US')}
              className="text-[11px] font-black text-[#00D2D2] hover:underline hover:text-white transition-colors bg-obsidian/30 py-2 px-3 rounded-xl border border-midnight-teal/40 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Mail size={12} />
              <span>{isAr ? 'اتصل بنا' : 'Contact Us'}</span>
            </button>
            <button 
              onClick={() => onNavigateLegal('PRIVACY_POLICY')}
              className="text-[11px] font-black text-cyber-cyan hover:underline hover:text-white transition-colors bg-obsidian/30 py-2 px-3 rounded-xl border border-midnight-teal/40 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Shield size={12} />
              <span>{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            </button>
            <button 
              onClick={() => onNavigateLegal('TERMS_OF_SERVICE')}
              className="text-[11px] font-black text-cyber-cyan hover:underline hover:text-white transition-colors bg-obsidian/30 py-2 px-3 rounded-xl border border-midnight-teal/40 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText size={12} />
              <span>{isAr ? 'شروط الخدمة' : 'Terms of Service'}</span>
            </button>
          </div>

          {/* Crawlable SEO & Indexing Links for Bots and Users */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-midnight-teal/20 text-[10px] text-gray-green font-bold">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-obsidian/40 hover:bg-slate-teal border border-midnight-teal/40 rounded-lg text-cyber-cyan hover:text-white transition-all flex items-center gap-1"
            >
              <ExternalLink size={10} />
              <span>{isAr ? 'خريطة الفهرسة (Sitemap.xml)' : 'Sitemap.xml'}</span>
            </a>
            <a
              href="/amp.html"
              className="px-2.5 py-1 bg-obsidian/40 hover:bg-slate-teal border border-midnight-teal/40 rounded-lg text-amber-400 hover:text-white transition-all flex items-center gap-1"
            >
              <Sparkles size={10} />
              <span>{isAr ? 'نسخة AMP السريعة' : 'AMP Fast View'}</span>
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-obsidian/40 hover:bg-slate-teal border border-midnight-teal/40 rounded-lg text-gray-green hover:text-white transition-all flex items-center gap-1"
            >
              <FileText size={10} />
              <span>robots.txt</span>
            </a>
            <button
              onClick={() => onNavigateLegal('NOT_FOUND')}
              className="px-2.5 py-1 bg-obsidian/40 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 hover:text-rose-100 transition-all flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle size={10} />
              <span>{isAr ? 'صفحة 404 (تجربة)' : 'Test 404 Page'}</span>
            </button>
          </div>

          <div className="text-center mt-3 text-[9px] text-gray-green/60 font-mono tracking-wider font-extrabold uppercase">
            © {new Date().getFullYear()} LCD DALULE • ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CompatibilityFlowScreen({ 
  category, 
  brand, 
  model, 
  allPhoneModels = [],
  onSelectBrand, 
  onSelectModel, 
  onSelectModelDirect,
  onShowResults, 
  onBack 
}: any) {
  const language = localStorage.getItem('app_language') === 'en' ? 'en' : 'ar';
  const t = translations[language];
  const config = categoryConfigs[category as Category] || categoryConfigs.LCD;
  const isAr = language === 'ar';

  const [directQuery, setDirectQuery] = useState('');

  const matchingDirectModels = directQuery.trim().length >= 2
    ? allPhoneModels.filter((m: PhoneModel) => {
        const q = directQuery.toLowerCase().trim();
        const mName = (m.modelName || '').toLowerCase();
        const alt = (m.alternativeNames || '').toLowerCase();
        const brandObj = brands.find((b: Brand) => b.id === m.brandId);
        const bName = brandObj ? brandObj.name.toLowerCase() : '';
        const code = getCategoryCode(m, category).toLowerCase();
        return mName.includes(q) || alt.includes(q) || (bName + ' ' + mName).includes(q) || code.includes(q);
      }).slice(0, 8)
    : [];

  const currentCategoryDesc = () => {
    switch(category) {
      case 'LCD': return language === 'ar' ? 'شاشات الـ LCD' : 'LCD screens';
      case 'IC': return language === 'ar' ? 'قطع الـ IC وأي سيهات الباور' : 'IC power chips';
      case 'SCREEN_PROTECTOR': return language === 'ar' ? 'واقيات شاشة وعناوين زجاجية' : 'glass screen covers';
      case 'BATTERY': return language === 'ar' ? 'البطاريات البديلة القابلة للاستبدال' : 'interchangeable batteries';
      default: return language === 'ar' ? 'الأجزاء المتطابقة' : 'hardware parts';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 font-sans"
    >
      <div className="flex items-center gap-4 text-white">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal/60 rounded-full transition-colors border border-midnight-teal shrink-0 cursor-pointer">
          <ArrowLeft size={20} className="rtl:rotate-180" />
        </button>
        <div className="flex-1 text-center pr-8 pl-8">
          <h2 className="text-lg font-bold text-cyber-cyan">{language === 'ar' ? (category === 'LCD' ? t.lcdTitle : category === 'IC' ? t.icTitle : category === 'SCREEN_PROTECTOR' ? t.spTitle : t.batteryTitle) : config.title}</h2>
          <p className="text-[10px] text-gray-green">{language === 'ar' ? (category === 'LCD' ? t.lcdDesc : category === 'IC' ? t.icDesc : category === 'SCREEN_PROTECTOR' ? t.spDesc : t.batteryDesc) : config.subtitle}</p>
        </div>
      </div>

      <div className="bg-slate-teal rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] space-y-5 mt-4 border border-midnight-teal">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-100">{t.selectModelTitle}</h3>
          <p className="text-xs text-gray-green font-medium">
            {language === 'ar' ? `البحث والمطابقة لـ ${currentCategoryDesc()}` : `Find matching ${currentCategoryDesc()}`}
          </p>
        </div>

        {/* Quick Direct Model Search Box */}
        <div className="bg-obsidian/70 p-3.5 rounded-2xl border border-midnight-teal space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-cyber-cyan uppercase tracking-wider flex items-center gap-1">
              <Search size={12} />
              {isAr ? 'بحث سريع عن الموديل مباشرة (بدون اختيار الشركة)' : 'Quick direct model search (any brand)'}
            </span>
          </div>
          <div className="relative">
            <input 
              type="text"
              placeholder={isAr ? 'اكتب اسم الموديل (مثال: A12, Note 10, Redmi, Y20)...' : 'Type model name (e.g. A12, Note 10, Redmi)...'}
              value={directQuery}
              onChange={(e) => setDirectQuery(e.target.value)}
              className={`w-full bg-slate-teal/80 border border-midnight-teal rounded-xl py-2.5 ${isAr ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'} text-slate-100 placeholder-gray-green/60 text-xs font-semibold focus:outline-none focus:border-cyber-cyan/60`}
            />
            <Search size={14} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-green`} />
            {directQuery && (
              <button 
                onClick={() => setDirectQuery('')}
                className={`absolute ${isAr ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5`}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Direct Matching Results Dropdown */}
          {matchingDirectModels.length > 0 && (
            <div className="mt-2 divide-y divide-midnight-teal/40 bg-obsidian rounded-xl border border-midnight-teal/80 max-h-48 overflow-y-auto custom-scrollbar">
              {matchingDirectModels.map((m: PhoneModel) => {
                const mBrand = brands.find((b: Brand) => b.id === m.brandId);
                const partCode = getCategoryCode(m, category);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (onSelectModelDirect && mBrand) {
                        onSelectModelDirect(m, mBrand);
                      } else {
                        onSelectBrand && onSelectBrand();
                      }
                    }}
                    className="w-full p-2.5 hover:bg-slate-teal flex items-center justify-between text-right rtl:text-right ltr:text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <SafeBrandLogo brand={mBrand} className="w-5 h-5 rounded object-contain shrink-0" textClassName="text-[8px] font-black" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-100 group-hover:text-cyber-cyan truncate">
                          {m.modelName}
                        </span>
                        <span className="text-[9px] text-gray-green font-mono">
                          {mBrand?.name}
                        </span>
                      </div>
                    </div>
                    {partCode && (
                      <span className="font-mono text-[9.5px] bg-cyber-cyan/15 border border-cyber-cyan/25 text-cyber-cyan px-2 py-0.5 rounded-lg shrink-0">
                        {partCode}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-midnight-teal/50"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-green font-bold uppercase tracking-wider">
            {isAr ? 'أو اختر عبر القائمة التقليدية' : 'Or choose via classic selectors'}
          </span>
          <div className="flex-grow border-t border-midnight-teal/50"></div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1 rtl:text-right ltr:text-left">
            <span className="text-xs font-bold text-gray-green">{t.brandRef}</span>
            <button 
              onClick={onSelectBrand}
              className="w-full flex items-center justify-between p-3.5 bg-obsidian border border-midnight-teal rounded-xl hover:bg-midnight-teal/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <SafeBrandLogo brand={brand} className="w-5 h-5 rounded-md object-contain shrink-0" textClassName="text-[8px] font-black text-cyber-cyan" />
                <span className={brand ? 'font-bold text-slate-100' : 'text-gray-green italic text-sm'}>
                  {brand?.name || t.selectBrandPlaceholder}
                </span>
              </div>
              <ChevronDown size={18} className="text-gray-green group-hover:text-cyber-cyan transition-colors shrink-0" />
            </button>
          </div>

          <div className="space-y-1 rtl:text-right ltr:text-left">
            <span className="text-xs font-bold text-gray-green">{t.modelRef}</span>
            <button 
              onClick={brand ? onSelectModel : undefined}
              className={`w-full flex items-center justify-between p-3.5 bg-obsidian border border-midnight-teal rounded-xl hover:bg-midnight-teal/40 transition-colors group cursor-pointer ${!brand ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-cyber-cyan" />
                <span className={model ? 'font-bold text-slate-100' : 'text-gray-green italic text-sm'}>
                  {model?.modelName || t.selectModelPlaceholder}
                </span>
              </div>
              <ChevronDown size={18} className="text-gray-green group-hover:text-cyber-cyan transition-colors shrink-0" />
            </button>
          </div>
        </div>

        {model && (
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={onShowResults}
            className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian font-black rounded-xl shadow-lg active:scale-95 hover:brightness-110 transition-all text-sm tracking-wide uppercase cursor-pointer"
          >
            {t.executeCompatibilityCheck}
          </motion.button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center p-6 text-center text-gray-green space-y-3">
        {!model ? (
          <>
            <div className="w-14 h-14 bg-slate-teal rounded-full shadow-md border border-midnight-teal flex items-center justify-center">
              <Smartphone size={24} className="text-cyber-cyan" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-200">{language === 'ar' ? 'حدد تفاصيل الهاتف' : 'Select a phone model'}</h4>
              <p className="text-xs text-gray-green leading-relaxed max-w-[250px] mx-auto text-center font-medium">
                {language === 'ar' 
                  ? `اختر الماركة أو ابحث بكتابة 3 أحرف من الموديل مباشرة لعرض القطع والأجزاء البديلة المتطابقة بالكامل.`
                  : `Choose brand or type 3 characters of any model to see compatible hardware components instantly.`}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 bg-cyber-cyan/10 border border-cyber-cyan/20 p-4 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-cyber-cyan text-obsidian rounded-lg flex items-center justify-center shrink-0">
              <Search size={18} />
            </div>
            <div className="rtl:text-right ltr:text-left">
              <h4 className="text-xs font-bold text-cyber-cyan uppercase font-sans">{t.analysisReady}</h4>
              <p className="text-[10px] text-slate-200 mt-0.5">{t.analysisReadyDesc} {model.modelName}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BrandLogo({ brand, textClassName = "font-black text-sm" }: { brand: Brand; textClassName?: string }) {
  const [logoFailed, setLogoFailed] = useState(false);
  
  const getBrandColorStyles = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('samsung')) return 'bg-blue-950/20 text-blue-300 border-blue-500/20';
    if (name.includes('apple')) return 'bg-slate-900 border-midnight-teal text-slate-100';
    if (name.includes('huawei')) return 'bg-rose-950/20 text-rose-300 border-rose-500/20';
    if (name.includes('xiaomi')) return 'bg-orange-950/20 text-orange-300 border-orange-500/20';
    if (name.includes('oppo')) return 'bg-emerald-950/20 text-emerald-300 border-emerald-500/20';
    if (name.includes('vivo')) return 'bg-sky-950/20 text-sky-300 border-sky-500/20';
    if (name.includes('realme')) return 'bg-amber-950/20 text-amber-300 border-amber-500/20';
    if (name.includes('honor')) return 'bg-purple-950/20 text-purple-300 border-purple-500/20';
    return 'bg-slate-950/20 text-slate-300 border-midnight-teal';
  };

  const initial = brand.name.charAt(0).toUpperCase();

  return (
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm transition-all overflow-hidden p-1.5 shrink-0 group-hover:scale-105 group-hover:shadow-md ${getBrandColorStyles(brand.name)}`}>
      {brand.logoUrl && !logoFailed ? (
        <img 
          src={brand.logoUrl} 
          className="w-full h-full object-contain" 
          alt="" 
          referrerPolicy="no-referrer"
          onError={() => setLogoFailed(true)} 
        />
      ) : (
        <span className={textClassName}>{initial}</span>
      )}
    </div>
  );
}

function SafeBrandLogo({ brand, className = "w-5 h-5 rounded object-contain grayscale opacity-50 shrink-0", textClassName = "text-[9px] font-black" }: { brand: Brand | undefined; className?: string; textClassName?: string }) {
  const [logoFailed, setLogoFailed] = useState(false);
  
  useEffect(() => {
    setLogoFailed(false);
  }, [brand?.id]);

  if (!brand) {
    return <Smartphone className={className.split(' ').filter(c => c.startsWith('w-') || c.startsWith('h-') || c.includes('shrink')).join(' ') + " text-sky-500"} />;
  }

  const getBrandColorStyles = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('samsung')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (name.includes('apple')) return 'bg-slate-50 text-slate-800 border-slate-200';
    if (name.includes('huawei')) return 'bg-rose-50 text-rose-600 border-rose-100';
    if (name.includes('xiaomi')) return 'bg-orange-50 text-orange-600 border-orange-100';
    if (name.includes('oppo')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (name.includes('vivo')) return 'bg-sky-50 text-sky-600 border-sky-100';
    if (name.includes('realme')) return 'bg-amber-50 text-amber-600 border-amber-200';
    if (name.includes('honor')) return 'bg-purple-50 text-purple-600 border-purple-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const initial = brand.name.charAt(0).toUpperCase();

  return (
    <div className={`flex items-center justify-center border rounded font-black shrink-0 ${className} ${getBrandColorStyles(brand.name)}`}>
      {brand.logoUrl && !logoFailed ? (
        <img 
          src={brand.logoUrl} 
          className="w-[90%] h-[90%] object-contain rounded-sm" 
          alt={brand.name} 
          referrerPolicy="no-referrer"
          onError={() => setLogoFailed(true)} 
        />
      ) : (
        <span className={textClassName}>{initial}</span>
      )}
    </div>
  );
}

function BrandSelectScreen({ 
  searchQuery, 
  setSearchQuery, 
  allPhoneModels = [], 
  category = 'LCD',
  onSelect, 
  onSelectModelDirect,
  onBack 
}: { 
  searchQuery: string; 
  setSearchQuery: (q: string) => void; 
  allPhoneModels?: PhoneModel[];
  category?: Category;
  onSelect: (brand: Brand) => void; 
  onSelectModelDirect?: (model: PhoneModel, brand: Brand) => void;
  onBack: () => void; 
}) {
  const language = localStorage.getItem('app_language') === 'en' ? 'en' : 'ar';
  const t = translations[language];
  const isAr = language === 'ar';

  const cleanQuery = searchQuery.trim().toLowerCase();

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(cleanQuery)
  );

  // Search models across ALL brands (e.g. typing 3 letters like A12, Redmi, Note, Pro, etc.)
  const matchingModels = cleanQuery.length >= 1
    ? allPhoneModels.filter((m: PhoneModel) => {
        const modelName = (m.modelName || '').toLowerCase();
        const altNames = (m.alternativeNames || '').toLowerCase();
        const brandObj = brands.find((b: Brand) => b.id === m.brandId);
        const brandName = brandObj ? brandObj.name.toLowerCase() : '';
        const code = getCategoryCode(m, category).toLowerCase();

        return modelName.includes(cleanQuery) || 
               altNames.includes(cleanQuery) || 
               (brandName + ' ' + modelName).includes(cleanQuery) ||
               code.includes(cleanQuery);
      })
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="bg-slate-teal border border-midnight-teal border-b-none rounded-t-[40px] shadow-2xl h-[85dvh] flex flex-col overflow-hidden pb-10 font-sans"
    >
      {/* Drag handle */}
      <div className="flex justify-center py-4 shrink-0">
        <div className="w-10 h-1.5 bg-midnight-teal/60 rounded-full" />
      </div>

      <div className="px-6 flex flex-col space-y-4 flex-1 overflow-hidden">
        {/* Title Aligned */}
        <div className="flex justify-between items-center shrink-0">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-green hover:text-white shrink-0 cursor-pointer">
            <X size={24} />
          </button>
          <div className="text-center flex-1">
            <h2 className="text-xl font-extrabold text-slate-100 font-display">{t.selectBrandTitle}</h2>
            <p className="text-[10.5px] text-cyber-cyan font-bold">
              {isAr ? 'أو اكتب 3 أحرف من الموديل للبحث المباشر بدون اختيار الشركة' : 'Or type 3 letters to search model directly across all brands'}
            </p>
          </div>
          <div className="w-8 shrink-0" />
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <input 
            type="text"
            placeholder={isAr ? 'ابحث عن الماركة أو موديل الهاتف مباشرة (مثال: A12, Note, Redmi)...' : 'Search brand or phone model directly (e.g. A12, Note, Redmi)...'}
            className={`w-full bg-obsidian border border-midnight-teal text-slate-100 placeholder-gray-green rounded-full py-4 ${isAr ? 'pr-12 pl-10' : 'pl-12 pr-10'} outline-none focus:ring-1 focus:ring-cyber-cyan/50 text-sm font-semibold transition-all font-sans`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className={`absolute ${isAr ? 'right-4.5' : 'left-4.5'} top-1/2 -translate-y-1/2 text-cyber-cyan`}>
            <Search size={19} />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`absolute ${isAr ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 bg-slate-teal p-1 rounded-full text-gray-300 hover:text-white cursor-pointer`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Informational helper banner when query is empty */}
        {!cleanQuery && (
          <div className="bg-obsidian/60 border border-midnight-teal/80 rounded-2xl p-3 flex items-center gap-3 shrink-0 text-right rtl:text-right ltr:text-left">
            <div className="w-8 h-8 rounded-xl bg-cyber-cyan/15 text-cyber-cyan flex items-center justify-center shrink-0">
              <Smartphone size={16} />
            </div>
            <p className="text-[11px] text-gray-300 leading-snug">
              {isAr 
                ? '💡 ميزة البحث المباشر: يمكنك كتابة أي 3 أحرف من موديل هاتفك في خانة البحث أعلاه لعرض الموديلات فوراً بدون اختيار الشركة المصنعة.' 
                : '💡 Direct Search: Type 3 letters of your phone model above to view matching models instantly without selecting brand first.'}
            </p>
          </div>
        )}

        {/* Content List: Direct Models & Brands */}
        <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 pb-10 space-y-5">
          
          {/* Section 1: DIRECT MATCHING MODELS (Shown when user types query) */}
          {matchingModels.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-cyber-cyan flex items-center gap-1.5">
                  <Smartphone size={14} />
                  {isAr ? 'موديلات الهواتف المتطابقة (اختيار مباشر)' : 'Matching Phone Models (Direct Selection)'}
                </span>
                <span className="text-[10px] font-mono font-bold bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded-full border border-cyber-cyan/30">
                  {matchingModels.length} {isAr ? 'موديل' : 'models'}
                </span>
              </div>

              <div className="divide-y divide-midnight-teal/40 bg-obsidian/80 rounded-2xl border border-midnight-teal overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
                {matchingModels.map((model) => {
                  const brandObj = brands.find((b: Brand) => b.id === model.brandId);
                  const partCode = getCategoryCode(model, category);
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        if (onSelectModelDirect && brandObj) {
                          onSelectModelDirect(model, brandObj);
                        } else if (brandObj) {
                          onSelect(brandObj);
                        }
                      }}
                      className="w-full flex items-center justify-between p-3.5 hover:bg-slate-teal/80 transition-colors text-right rtl:text-right ltr:text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Brand Badge */}
                        <div className="shrink-0 flex items-center justify-center">
                          <SafeBrandLogo brand={brandObj} className="w-8 h-8 rounded-xl object-contain shrink-0 border border-midnight-teal" textClassName="text-[9px] font-black" />
                        </div>
                        
                        <div className="flex flex-col min-w-0 text-right rtl:text-right ltr:text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">
                              {brandObj?.name}
                            </span>
                          </div>
                          <span className="font-extrabold text-slate-100 group-hover:text-cyber-cyan text-sm tracking-tight truncate">
                            {model.modelName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {partCode && (
                          <span className="font-mono text-[10px] bg-cyber-cyan/15 border border-cyber-cyan/25 text-cyber-cyan px-2.5 py-1 rounded-lg font-black">
                            {partCode}
                          </span>
                        )}
                        <div className="w-7 h-7 rounded-full bg-slate-teal border border-midnight-teal flex items-center justify-center text-gray-green group-hover:bg-cyber-cyan group-hover:text-obsidian transition-all">
                          <ChevronRight size={14} className={isAr ? 'rotate-180' : ''} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: BRANDS LIST */}
          <div className="space-y-2">
            {matchingModels.length > 0 && (
              <div className="px-2 pt-2">
                <span className="text-xs font-black text-gray-300">
                  {isAr ? 'الشركات المصنعة (الماركات)' : 'Phone Brands'}
                </span>
              </div>
            )}

            <div className="divide-y divide-midnight-teal/30" dir={isAr ? 'rtl' : 'ltr'}>
              {filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => onSelect(brand)}
                  className="w-full flex items-center justify-between py-3.5 group hover:bg-midnight-teal/35 rounded-2xl px-3 transition-colors text-right ltr:text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Beautiful Brand Logo Badge */}
                    <BrandLogo brand={brand} />
                    
                    {/* Brand name */}
                    <div className="flex flex-col text-right ltr:text-left">
                      <span className="font-extrabold text-slate-100 tracking-wider uppercase text-sm group-hover:text-cyber-cyan transition-colors">
                        {brand.name}
                      </span>
                      <span className="text-[10px] text-gray-green font-semibold uppercase tracking-tight">
                        {isAr ? 'استعراض كل موديلات هذه الماركة' : 'Explore all models from this brand'}
                      </span>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="w-8 h-8 rounded-full bg-obsidian border border-midnight-teal flex items-center justify-center text-gray-green group-hover:bg-cyber-cyan/10 group-hover:text-cyber-cyan transition-all">
                    <ChevronRight size={16} className={isAr ? 'rotate-180' : ''} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {filteredBrands.length === 0 && matchingModels.length === 0 && (
            <div className="py-16 text-center text-gray-green text-sm font-sans space-y-2">
              <div className="w-12 h-12 rounded-full bg-obsidian border border-midnight-teal mx-auto flex items-center justify-center text-gray-green">
                <Search size={22} />
              </div>
              <p className="font-bold text-slate-200">
                {isAr ? `لم نجد ماركة أو موديلاً مطابقاً لـ "${cleanQuery}"` : `No matching brand or model found for "${cleanQuery}"`}
              </p>
              <p className="text-xs text-gray-400">
                {isAr ? 'تأكد من كتابة اسم الموديل أو جرب البحث الشامل' : 'Check spelling or try using global search'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ModelSelectScreen({ brand, allPhoneModels, searchQuery, setSearchQuery, category, onSelect, onBack }: { brand: Brand | null, allPhoneModels: PhoneModel[], searchQuery: string, setSearchQuery: (q: string) => void, category: Category, onSelect: (model: PhoneModel) => void, onBack: () => void }) {
  const language = localStorage.getItem('app_language') === 'en' ? 'en' : 'ar';
  const t = translations[language];
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  
  const filteredModels = allPhoneModels
    .filter((m) => m.brandId === brand?.id)
    .filter((m) => m.modelName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 font-sans"
    >
      <div className="flex items-center justify-between text-white pb-2 border-b border-midnight-teal/65">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal/60 rounded-full transition-colors border border-midnight-teal shrink-0 cursor-pointer">
          <ArrowLeft size={24} className="rtl:rotate-180" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-cyber-cyan font-display">{brand?.name} {language === 'ar' ? 'موديلات' : 'Models'}</h2>
          <p className="text-xs text-gray-green">{t.selectModelTitle}</p>
        </div>
        <div className="w-10 shrink-0" />
      </div>

      <div className="relative mt-4 shrink-0 font-sans">
        <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-green`} size={18} />
        <input 
          type="text"
          placeholder={language === 'ar' ? `ابحث في موديلات هاتف ${brand?.name}...` : `Search ${brand?.name} models...`}
          className={`w-full bg-obsidian border border-midnight-teal rounded-3xl py-4 ${language === 'ar' ? 'pr-12 pl-12' : 'pl-12 pr-12'} text-slate-100 placeholder-gray-green shadow-lg outline-none focus:ring-1 focus:ring-cyber-cyan/50 focus:border-cyber-cyan/65 transition-all text-sm font-sans`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-green hover:text-white cursor-pointer`}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="bg-slate-teal rounded-2xl overflow-hidden shadow-2xl border border-midnight-teal max-h-[400px] overflow-y-auto custom-scrollbar">
        <div className="divide-y divide-midnight-teal/30">
          {filteredModels.map((model) => (
            <button
              key={model.id}
              onClick={() => onSelect(model)}
              className="w-full flex items-center justify-between p-5 hover:bg-midnight-teal/40 transition-colors rtl:text-right ltr:text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                {model.imageUrl ? (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImage(model.imageUrl || null);
                      setLightboxTitle(model.modelName);
                    }}
                    className="w-12 h-12 rounded-lg bg-obsidian shrink-0 border border-midnight-teal flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyber-cyan/60 transition-all active:scale-95 shadow-md"
                    title={language === 'ar' ? 'عرض الصورة بالحجم الكامل' : 'View full image'}
                  >
                    <img src={model.imageUrl} className="w-full h-full object-contain p-0.5" alt="" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-obsidian flex items-center justify-center border border-midnight-teal text-gray-green shrink-0">
                    <Smartphone size={24} className="stroke-[1.5]" />
                  </div>
                )}
                <div className="flex flex-col min-w-0 text-right ltr:text-left">
                  <span className="font-bold text-slate-100 group-hover:text-cyber-cyan transition-colors text-sm tracking-tight truncate">{model.modelName}</span>
                  <span className="font-mono text-[9px] text-cyber-cyan bg-cyber-cyan/15 border border-cyber-cyan/25 px-1.5 py-0.5 rounded mt-1 self-start inline-block uppercase tracking-wider">
                    {formatDisplayCode(getCategoryCode(model, category), language)}
                  </span>
                </div>
              </div>
              <div className="p-1.5 bg-obsidian border border-midnight-teal rounded-lg group-hover:bg-cyber-cyan/15 group-hover:text-cyber-cyan transition-colors shrink-0">
                <ChevronRight size={16} className="text-gray-green rtl:rotate-180" />
              </div>
            </button>
          ))}
        </div>
        {filteredModels.length === 0 && (
          <div className="p-12 text-center text-gray-green text-xs italic font-sans">
            {language === 'ar' ? 'لم نجد موديلات مطابقة لهذا الماركة حالياً.' : 'No matching models for this brand.'}
          </div>
        )}
      </div>

      {/* Lightbox / Full Screen Image Preview Modal */}
      {lightboxImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setLightboxImage(null); setLightboxTitle(''); }}
          className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center p-4 select-none backdrop-blur-md"
        >
          {/* Close button top right */}
          <div className="absolute top-4 right-4 z-[210]">
            <button 
              onClick={() => { setLightboxImage(null); setLightboxTitle(''); }}
              className="bg-obsidian/80 border border-midnight-teal text-white p-3 rounded-full hover:bg-rose-600 hover:border-rose-500 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-[85vh] flex flex-col items-center justify-center bg-obsidian border border-midnight-teal/40 rounded-3xl p-3 shadow-2xl overflow-hidden"
          >
            <img 
              src={lightboxImage} 
              alt={lightboxTitle} 
              className="max-w-[90vw] max-h-[70vh] rounded-2xl object-contain select-none"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center px-4 mb-2">
              <h3 className="text-base font-extrabold text-cyber-cyan">{lightboxTitle}</h3>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ResultsScreen({ selectedModel, compatibleModels, category, onBack, onAddImage, isAdmin, googleAds, isPremium }: any) {
  const language = localStorage.getItem('app_language') === 'en' ? 'en' : 'ar';
  const t = translations[language];
  const [showImageInput, setShowImageInput] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedFb, setCopiedFb] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const config = categoryConfigs[category as Category] || categoryConfigs.LCD;

  const shareUrl = `https://dalule.app/?model=${selectedModel?.id}&category=${category}`;
  
  const getShareMessage = () => {
    const partType = language === 'ar' 
      ? (category === 'LCD' ? 'شاشة LCD' : category === 'IC' ? 'آي سي' : category === 'SCREEN_PROTECTOR' ? 'حامي شاشة' : 'بطارية') 
      : (category === 'LCD' ? 'LCD Screen' : category === 'IC' ? 'IC Chip' : category === 'SCREEN_PROTECTOR' ? 'Screen Protector' : 'Battery');
    
    if (language === 'ar') {
      const compatibilityText = compatibleModels && compatibleModels.length > 0 
        ? `متطابق ومتوافق مع الأجهزة البديلة: ${compatibleModels.map((m: any) => m.modelName).join(' ، ')}`
        : 'تمت المراجعة والتحقق من التوافق الفني في دليل المطابقات';
      return `دليل شاشات ومطابقات الهواتف - LCD DALULE 📲\n\nالجهاز: *${selectedModel?.modelName}*\nالقطعة المصنفة: *${partType}*\n\nالنتيجة:\n${compatibilityText}\n\nلمعاينة كافة البدائل الفنية وجدول التوافق بالكامل:\n${shareUrl}`;
    } else {
      const compatibilityText = compatibleModels && compatibleModels.length > 0
        ? `Compatible with interchangeable alternatives: ${compatibleModels.map((m: any) => m.modelName).join(', ')}`
        : 'Parameters checked and verified in matching database';
      return `LCD DALULE - Smartphone Parts Compatibility Guide 📲\n\nDevice: *${selectedModel?.modelName}*\nCategory: *${partType}*\n\nResult:\n${compatibilityText}\n\nFor full specs & compatibility, check live here:\n${shareUrl}`;
    }
  };

  const handleCopy = async () => {
    const text = getShareMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowShareToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareToast(false);
      }, 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFacebookShareClick = async () => {
    const text = getShareMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFb(true);
      setTimeout(() => {
        setCopiedFb(false);
      }, 8000);
      
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank', 'width=600,height=450');
    } catch (e) {
      console.error(e);
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank');
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `دليل ومطابقات - ${selectedModel?.modelName}`,
          text: getShareMessage(),
          url: shareUrl
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Only images are allowed / يسمح بالصور فقط');
      return;
    }
    
    setIsCompressing(true);
    setUploadError('');
    try {
      const base64Str = await compressFile(file);
      setNewImageUrl(base64Str);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process image / فشل في معالجة الصورة');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const compressFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve(dataUrl);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onAddImage(selectedModel.id, newImageUrl.trim());
      setShowImageInput(false);
      setNewImageUrl('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 font-sans"
    >
      <div className="flex items-center gap-4 text-white">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal/60 rounded-full transition-colors border border-midnight-teal shrink-0 cursor-pointer">
          <ArrowLeft size={24} className="rtl:rotate-180" />
        </button>
        <div className="flex-1 min-w-0 text-center">
          <h2 className="text-xl font-bold font-display text-cyber-cyan whitespace-nowrap overflow-hidden text-ellipsis pr-4 pl-4">
            {selectedModel?.modelName} - {language === 'ar' ? (category === 'LCD' ? t.partLcd : category === 'IC' ? t.partIc : category === 'SCREEN_PROTECTOR' ? t.partSp : t.partBattery) : config.title}
          </h2>
        </div>
      </div>

      <div className="bg-slate-teal rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] space-y-6 mt-4 border border-midnight-teal font-sans">
        <div className="flex flex-col gap-4 border-b border-midnight-teal/50 pb-6">
          <div className="flex items-start gap-4">
            <div 
              onClick={() => { if (selectedModel?.imageUrl) { setLightboxImage(selectedModel.imageUrl); setLightboxTitle(selectedModel.modelName); } }}
              className={`w-20 h-20 bg-obsidian rounded-xl border border-midnight-teal flex items-center justify-center overflow-hidden shrink-0 group relative shadow-md transition-all ${selectedModel?.imageUrl ? 'cursor-pointer hover:border-cyber-cyan/50 active:scale-95' : ''}`}
              title={selectedModel?.imageUrl ? (language === 'ar' ? 'عرض الصورة بالحجم الكامل' : 'View full image') : undefined}
            >
              {selectedModel?.imageUrl ? (
                <img src={selectedModel.imageUrl} className="w-full h-full object-contain p-1" alt={selectedModel.modelName} />
              ) : (
                <Smartphone size={40} className="text-cyber-cyan opacity-80" />
              )}
              {isAdmin && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowImageInput(!showImageInput); }}
                  className="absolute inset-0 bg-obsidian/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cyber-cyan cursor-pointer"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0 rtl:text-right ltr:text-left">
              <span className="text-[10px] font-bold text-gray-green uppercase tracking-widest block mb-0.5">
                {language === 'ar' ? t.verifiedCompatibleCode : config.codeLabel}
              </span>
              <h3 className="text-lg font-extrabold text-slate-100 tracking-tight truncate">{selectedModel?.modelName}</h3>
              <div className="font-mono text-xs mt-2 px-2.5 py-1 bg-cyber-cyan/15 border border-cyber-cyan/25 text-cyber-cyan rounded-lg inline-block uppercase tracking-wider font-extrabold text-center">
                {formatDisplayCode(getCategoryCode(selectedModel, category), language)}
              </div>
              
              {isAdmin && (
                <button 
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-cyber-cyan hover:text-white transition-colors uppercase cursor-pointer"
                >
                  <ImageIcon size={14} />
                  {selectedModel?.imageUrl 
                    ? (language === 'ar' ? 'تعديل صورة الهاتف' : 'Edit phone image') 
                    : (language === 'ar' ? 'إضافة صورة للهاتف' : 'Add phone image')}
                </button>
              )}
            </div>
          </div>

          {isAdmin && showImageInput && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-2 space-y-3 font-sans"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" 
              />

              {!newImageUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging 
                      ? 'border-cyber-cyan bg-cyber-cyan/10' 
                      : 'border-midnight-teal hover:border-cyber-cyan/50 hover:bg-obsidian/30'
                  }`}
                >
                  {isCompressing ? (
                    <Loader2 size={32} className="text-cyber-cyan animate-spin" />
                  ) : (
                    <Upload size={32} className="text-gray-green hover:text-cyber-cyan" />
                  )}
                  
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-100">
                      {isCompressing ? (language === 'ar' ? 'جاري معالجة وتبسيط الملف...' : 'Processing image...') : (language === 'ar' ? 'ارفع صورة للهاتف مباشرة' : 'Upload Phone Image')}
                    </p>
                    <p className="text-[10px] text-gray-green">
                      {language === 'ar' ? 'اسحب الصورة وأفلتها هنا أو اضغط للاختيار' : 'Drag & drop here or click to browse'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-4 bg-obsidian rounded-xl border border-midnight-teal">
                  <div className="relative w-24 h-24 bg-slate-teal rounded-lg overflow-hidden shadow-sm border border-midnight-teal animate-pulse-once">
                    <img src={newImageUrl} className="w-full h-full object-contain p-1" alt="Preview"/>
                    <button 
                      onClick={() => setNewImageUrl('')}
                      className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => setNewImageUrl('')}
                      className="flex-1 py-2 bg-slate-teal hover:bg-midnight-teal text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {language === 'ar' ? 'تغيير' : 'Change'}
                    </button>
                    <button 
                      onClick={handleAddImage}
                      className="flex-1 py-2 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian rounded-lg text-xs font-black transition-colors cursor-pointer"
                    >
                      {language === 'ar' ? 'حفظ الصورة' : 'Save Photo'}
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-[10px] text-rose-400 font-semibold text-center mt-1">
                  {uploadError}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Advanced Specifications Diagnostic Card for Repair Technicians */}
        {(selectedModel?.displayType || selectedModel?.fpcPins || selectedModel?.screenSize || selectedModel?.alternativeNames || selectedModel?.touchIcModel) && (
          <div className="bg-obsidian border border-midnight-teal rounded-2xl p-4.5 space-y-3.5 rtl:text-right ltr:text-left mt-1 font-sans" dir="rtl">
            <div className="flex items-center gap-1.5 border-b border-midnight-teal/40 pb-2 justify-end">
              <h4 className="text-xs font-black text-slate-100 uppercase tracking-wide">
                {language === 'ar' ? 'التفاصيل الفنية والمواصفات المعتمدة للموديل' : 'Advanced Specifications & Part Diagnostics'}
              </h4>
              <Cpu size={15} className="text-cyber-cyan" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]" dir="rtl">
              {selectedModel.displayType && (
                <div className="space-y-0.5 bg-slate-teal/50 p-2.5 rounded-xl border border-midnight-teal/80 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-right">
                  <span className="text-gray-green font-extrabold text-[9px] block">
                    {language === 'ar' ? 'نوع شاشة وموديل العرض' : 'DISPLAY TYPE'}
                  </span>
                  <span className="font-bold text-slate-100 block text-ellipsis overflow-hidden">{selectedModel.displayType}</span>
                </div>
              )}
              {selectedModel.screenSize && (
                <div className="space-y-0.5 bg-slate-teal/50 p-2.5 rounded-xl border border-midnight-teal/80 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-right">
                  <span className="text-gray-green font-extrabold text-[9px] block">
                    {language === 'ar' ? 'مقاس شاشة العرض' : 'SCREEN SIZE'}
                  </span>
                  <span className="font-bold text-slate-100 block">{selectedModel.screenSize}</span>
                </div>
              )}
              {selectedModel.fpcPins && (
                <div className="space-y-0.5 bg-slate-teal/50 p-2.5 rounded-xl border border-midnight-teal/80 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-right">
                  <span className="text-gray-green font-extrabold text-[9px] block">
                    {language === 'ar' ? 'عدد دبابيس الفلاتة FPC' : 'FPC PIN COUNT'}
                  </span>
                  <span className="font-mono font-bold bg-cyber-cyan/15 border border-cyber-cyan/25 text-cyber-cyan px-2 py-0.5 rounded-md inline-block leading-none">{selectedModel.fpcPins}</span>
                </div>
              )}
              {selectedModel.touchIcModel && (
                <div className="space-y-0.5 bg-slate-teal/50 p-2.5 rounded-xl border border-midnight-teal/80 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-right">
                  <span className="text-gray-green font-extrabold text-[9px] block">
                    {language === 'ar' ? 'رقاقة آي سي اللمس' : 'TOUCH IC CHIP'}
                  </span>
                  <span className="font-mono font-bold text-rose-300 bg-rose-950/20 border border-rose-500/25 px-2 py-0.5 rounded-md inline-block leading-none">{selectedModel.touchIcModel}</span>
                </div>
              )}
              {selectedModel.alternativeNames && (
                <div className="space-y-0.5 bg-slate-teal/50 p-2.5 rounded-xl border border-midnight-teal/80 shadow-[0_2px_4px_rgba(0,0,0,0.1)] col-span-2 text-right">
                  <span className="text-gray-green font-extrabold text-[9px] block text-right">
                    {language === 'ar' ? 'أسماء أو موديلات لوحة بديلة' : 'ALTERNATIVE MOTHERBOARD NAMES'}
                  </span>
                  <span className="font-bold text-slate-150 block text-ellipsis overflow-hidden font-mono text-[10px]">{selectedModel.alternativeNames}</span>
                </div>
              )}
              {selectedModel.repairDifficulty && (
                <div className="space-y-0.5 bg-slate-teal/50 p-2.5 rounded-xl border border-midnight-teal/80 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-right col-span-2 lg:col-span-1">
                  <span className="text-gray-green font-extrabold text-[9px] block text-right">
                    {language === 'ar' ? 'صعوبة الصيانة والفك' : 'REPAIR DIFFICULTY'}
                  </span>
                  <span className={`font-black uppercase tracking-tight text-[10px] rounded-full px-2.5 py-0.5 inline-block text-center leading-none ${
                    selectedModel.repairDifficulty === 'Easy' || selectedModel.repairDifficulty === 'سهل'
                      ? 'bg-emerald-950/25 border border-emerald-500/25 text-emerald-300'
                      : selectedModel.repairDifficulty === 'Medium' || selectedModel.repairDifficulty === 'متوسط'
                      ? 'bg-amber-950/25 border border-amber-500/25 text-amber-300'
                      : 'bg-rose-950/25 border border-rose-500/25 text-rose-300'
                  }`}>
                    {selectedModel.repairDifficulty}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Share Section for Repair Technicians */}
        <div className="bg-slate-teal/40 border border-midnight-teal/70 rounded-2xl p-4 space-y-3.5 rtl:text-right ltr:text-left mt-2">
          <div className="flex items-center gap-2 justify-between border-b border-midnight-teal/30 pb-2.5">
            <div className="flex items-center gap-1.5 justify-start">
              <Share2 size={15} className="text-cyber-cyan" />
              <h4 className="text-xs font-black text-slate-100 uppercase tracking-wide">
                {language === 'ar' ? 'مشاركة تقرير التوافق والمطابقة الفنية' : 'Share Technical Compatibility Report'}
              </h4>
            </div>
            
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-950/25 text-emerald-300 border border-emerald-500/20 shadow-sm' 
                  : 'bg-obsidian text-slate-200 border border-midnight-teal hover:text-cyber-cyan hover:border-cyber-cyan/40 shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={12} className="text-emerald-400 animate-pulse" />
                  <span>{language === 'ar' ? 'تم نسخ التقرير!' : 'Report Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>{language === 'ar' ? 'نسخ التقرير الفني' : 'Copy Tech Report'}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-gray-green leading-relaxed font-semibold">
            {language === 'ar' 
              ? 'تسهيل عمل الفنيين الزملاء! يمكنك الآن مشاركة هذه المطابقة مباشرة عبر منصات التواصل لنشر الفائدة هندسياً وتقنياً:'
              : 'Empower fellow repair engineers! Share this verified interchangeability result across communication networks directly:'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* WhatsApp Outbound */}
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareMessage())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/25 text-emerald-400 rounded-xl text-xs font-black transition-all border border-[#25D366]/25 cursor-pointer text-center"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.706 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>واتساب WhatsApp</span>
            </a>

            {/* Telegram Outbound */}
            <a 
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(getShareMessage().replace(shareUrl, ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0088cc]/10 hover:bg-[#0088cc]/25 text-sky-450 rounded-xl text-xs font-black transition-all border border-[#0088cc]/25 cursor-pointer text-center"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.64-.35-1 .22-1.58.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.19-5.34 3.52-.5.35-.96.52-1.37.51-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.84.03-.23.35-.46.96-.71 3.76-1.63 6.27-2.71 7.53-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.19.38-.02.04-.02.13-.03.22z"/>
              </svg>
              <span>تيليجرام Telegram</span>
            </a>

            {/* Facebook Outbound */}
            <button 
              onClick={handleFacebookShareClick}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/25 text-blue-400 rounded-xl text-xs font-black transition-all border border-[#1877F2]/25 cursor-pointer text-center w-full shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>فيسبوك Facebook</span>
            </button>

            {/* Twitter / X Outbound */}
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareMessage().replace(shareUrl, ''))}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-obsidian hover:bg-midnight-teal/40 text-slate-100 rounded-xl text-xs font-black transition-all border border-midnight-teal cursor-pointer text-center"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>تويتر / X</span>
            </a>
          </div>

          {copiedFb && (
            <div className="bg-cyber-cyan/15 border border-cyber-cyan/25 rounded-xl p-3 text-xs font-semibold flex flex-col gap-1 shadow-sm transition-all animate-fade-in my-1.5 text-right font-sans">
              <p className="font-bold flex items-center gap-1.5 justify-start text-cyber-cyan">
                <CheckCircle2 size={14} className="text-cyber-cyan animate-bounce" />
                <span>{language === 'ar' ? 'تم نسخ التقرير الفني بنجاح! 📋' : 'Technical Report Copied! 📋'}</span>
              </p>
              <p className="text-[10px] text-gray-green leading-relaxed font-semibold">
                {language === 'ar'
                  ? 'لأن شركة فيسبوك تمنع إدخال النصوص تلقائياً لحماية خصوصية المستخدمين، يرجى فقط الضغط على "لصق" (Paste) بداخل صندوق مشاركة فيسبوك المفتوح الآن، لتظهر تفاصيل التوافق وجدول البدائل والروابط للجميع!'
                  : "Since Facebook blocks automatic dynamic message pre-filling, simply click inside Facebook's draft box and select 'Paste' (Ctrl+V) to share complete technical specifications and hyperlinks!"}
              </p>
            </div>
          )}

          {/* Quick System Sheets share if available */}
          {typeof navigator !== 'undefined' && !!(navigator as any).share && (
            <div className="pt-2 border-t border-midnight-teal/30 flex justify-center">
              <button 
                onClick={handleNativeShare}
                className="flex items-center gap-1.5 px-4.5 py-2 hover:bg-slate-teal/60 rounded-full text-[10px] font-black text-cyber-cyan border border-midnight-teal transition-colors cursor-pointer"
              >
                <Share2 size={12} />
                <span>{language === 'ar' ? 'استخدام مشاركة النظام السريع والمنصات الأخرى 📲' : 'Use quick system share & other apps 📲'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2 font-sans">
          <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-green uppercase tracking-widest justify-start">
            <ShieldAlert size={14} className="text-cyber-cyan" />
            {t.compatibleMatrixTitle} ({compatibleModels.length} {language === 'ar' ? t.compatibleEntriesSuffix : 'Entries'})
          </h4>

          {compatibleModels.length > 0 ? (
            <div className="space-y-2">
              {compatibleModels.map((model: any) => {
                const brand = brands.find(b => b.id === model.brandId);
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={model.id} 
                    className="flex items-center justify-between p-4 bg-obsidian border border-midnight-teal/80 rounded-xl hover:bg-midnight-teal/35 transition-all text-right"
                  >
                    <div className="flex items-center gap-3">
                      {model.imageUrl ? (
                        <div 
                          onClick={() => { setLightboxImage(model.imageUrl || null); setLightboxTitle(model.modelName); }}
                          className="w-10 h-10 bg-obsidian rounded-lg border border-midnight-teal flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-cyber-cyan transition-all active:scale-95 shadow-sm"
                          title={language === 'ar' ? 'عرض الصورة بالحجم الكامل' : 'View full image'}
                        >
                          <img src={model.imageUrl} className="w-full h-full object-contain p-0.5" alt="" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-obsidian rounded-lg border border-midnight-teal flex items-center justify-center text-gray-green shrink-0">
                          <Smartphone size={18} className="stroke-[1.5]" />
                        </div>
                      )}
                      <SafeBrandLogo brand={brand} className="w-5 h-5 object-contain rounded shrink-0 text-cyber-cyan" textClassName="text-[8px] font-black" />
                      <div className="rtl:text-right ltr:text-left">
                        <div className="font-extrabold text-sm text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 px-2.5 py-0.5 rounded-md inline-block">{model.modelName}</div>
                        <div className="text-[10px] text-gray-green font-bold uppercase tracking-wider mt-0.5">{brand?.name}</div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-950/20 border border-emerald-500/25 text-emerald-300 text-[9px] font-extrabold rounded-full uppercase italic tracking-wider shrink-0 mr-1 ml-1">
                      {language === 'ar' ? t.approvedScreens : config.badgeLabel}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-teal/20 rounded-xl border border-dashed border-midnight-teal">
              <Search size={32} className="mx-auto text-midnight-teal mb-3" />
              <p className="text-[10px] text-gray-green leading-relaxed uppercase">
                {language === 'ar' ? 'لا توجد مطابقات بديلة معتمدة لهذا الرمز حتى الآن في قاعدتنا.' : 'No shared hardware IDs detected for this specific configuration.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Google Sponsored Ads Insertion */}
      <GoogleAdBanner googleAds={googleAds} isPremium={isPremium} language={language} />

      <div className="bg-amber-950/15 border border-amber-500/20 p-4 rounded-xl flex gap-3 font-sans">
        <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-100/90 leading-relaxed font-semibold rtl:text-right ltr:text-left">
          <b>{language === 'ar' ? 'توجيه فني وقائي:' : 'TECHNICIAN ADVISORY:'}</b> {t.technicianAdvisory}
        </p>
      </div>

      {/* Lightbox / Full Screen Image Preview Modal */}
      {lightboxImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setLightboxImage(null); setLightboxTitle(''); }}
          className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center p-4 select-none backdrop-blur-md"
        >
          {/* Close button top right */}
          <div className="absolute top-4 right-4 z-[210]">
            <button 
              onClick={() => { setLightboxImage(null); setLightboxTitle(''); }}
              className="bg-obsidian/80 border border-midnight-teal text-white p-3 rounded-full hover:bg-rose-600 hover:border-rose-500 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-[85vh] flex flex-col items-center justify-center bg-obsidian border border-midnight-teal/40 rounded-3xl p-3 shadow-2xl overflow-hidden"
          >
            <img 
              src={lightboxImage} 
              alt={lightboxTitle} 
              className="max-w-[90vw] max-h-[70vh] rounded-2xl object-contain select-none"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center px-4 mb-2">
              <h3 className="text-base font-extrabold text-cyber-cyan">{lightboxTitle}</h3>
              <div className="font-mono text-xs mt-2 px-2.5 py-1 bg-cyber-cyan/15 border border-cyber-cyan/25 text-cyber-cyan rounded-lg inline-block uppercase tracking-wider font-extrabold leading-none">
                {formatDisplayCode(getCategoryCode(selectedModel, category), language)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function CategoryCard({ icon, title, desc, onClick, iconBg }: any) {
  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-slate-teal rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-midnight-teal hover:border-cyber-cyan/40 rtl:text-right ltr:text-left group transition-all cursor-pointer font-sans"
    >
      <div className={`p-3 ${iconBg} rounded-[15px] shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="min-w-0 flex-1 pr-2 pl-2">
          <h3 className="font-bold text-slate-100 group-hover:text-cyber-cyan transition-colors text-base tracking-tight truncate">{title}</h3>
          <p className="text-xs text-gray-green leading-tight truncate">{desc}</p>
        </div>
        <ChevronRight size={20} className="text-gray-green group-hover:text-cyber-cyan transition-colors shrink-0 rtl:rotate-180" />
      </div>
    </motion.button>
  );
}

function CommunityPage({ suggestions, userVotes = {}, onVote, onAddClick, onBack, isAdmin, onDelete, onToggleApprove }: any) {
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 font-sans text-right"
    >
      <div className="flex items-center gap-4 text-white">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal/60 rounded-full transition-colors border border-midnight-teal shrink-0 cursor-pointer">
          <ArrowLeft size={24} className="rtl:rotate-180" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-center pr-8 font-display text-cyber-cyan">مقترحات مجتمع الفنيين</h2>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={onAddClick}
          className="w-full py-4 bg-obsidian border-2 border-dashed border-midnight-teal hover:border-cyber-cyan/50 text-cyber-cyan rounded-2xl flex items-center justify-center gap-2 font-extrabold hover:bg-slate-teal/20 transition-all cursor-pointer"
        >
          <PlusCircle size={20} />
          إضافة اقتراح توافق جديد
        </button>

        <div className="space-y-3 pb-24">
          {suggestions.map((s: CommunitySuggestion) => {
            const userVote = userVotes[s.id]; // true for Like, false for Dislike, undefined for no vote

            return (
              <div key={s.id} className="bg-slate-teal rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-midnight-teal/80 relative overflow-hidden group font-sans">
                {s.isApproved && (
                  <div className="absolute top-0 right-0 p-2 text-cyber-cyan font-black">
                    <CheckCircle2 size={24} className="fill-cyber-cyan/10" />
                  </div>
                )}
                
                <div className="space-y-3 font-semibold text-right" dir="rtl">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-green uppercase tracking-widest text-right justify-start">
                    <Users size={14} className="text-cyber-cyan" />
                    إقتراح مطابقة
                  </div>
                  
                  <div className="flex gap-4 items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="text-sm font-bold text-slate-100 tracking-tight text-right">
                        {s.brand} {s.model}
                      </div>
                      <div className="text-[10px] text-gray-green text-right">
                        الموديل المتوافق المقترح: <span className="font-mono text-cyber-cyan bg-cyber-cyan/15 border border-cyber-cyan/20 px-2 py-0.5 rounded leading-none mr-1">{s.suggestedCompatibleCode}</span>
                      </div>
                    </div>
                    {s.imageUrl && (
                      <div 
                        className="shrink-0 relative group/img cursor-zoom-in" 
                        onClick={() => setSelectedZoomImage(s.imageUrl || null)}
                      >
                        <img 
                          src={s.imageUrl} 
                          alt="Compatible Hardware" 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-xl border border-midnight-teal/85 bg-obsidian shadow-sm group-hover/img:border-cyber-cyan/50 transition-all duration-200" 
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 rounded-b-xl opacity-0 group-hover/img:opacity-100 flex items-center justify-center p-0.5 transition-opacity">
                          <span className="text-[8px] text-cyber-cyan font-bold leading-none">تكبير</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => onVote(s.id, true)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
                        userVote === true 
                          ? "border-emerald-500/40 bg-emerald-950/50 text-emerald-300 font-bold" 
                          : "border-midnight-teal bg-obsidian text-emerald-400/80 hover:bg-emerald-950/15 hover:text-emerald-400 hover:border-emerald-500/30"
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span className="text-xs">{s.likesCount}</span>
                      <span className="text-[9px] font-medium">متطابقة</span>
                    </button>

                    <button 
                      onClick={() => onVote(s.id, false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
                        userVote === false 
                          ? "border-rose-500/40 bg-rose-950/50 text-rose-300 font-bold" 
                          : "border-midnight-teal bg-obsidian text-rose-450 hover:bg-rose-950/15 hover:text-rose-400 hover:border-rose-500/30"
                      }`}
                    >
                      <ThumbsDown size={16} />
                      <span className="text-xs">{s.dislikesCount}</span>
                      <span className="text-[9px] font-medium">غير متطابقة</span>
                    </button>
                  </div>
                  
                  {s.isApproved && (
                    <div className="pt-2 text-right">
                      <div className="bg-emerald-950/30 border border-emerald-500/25 text-emerald-300 text-[9px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 uppercase tracking-widest leading-none">
                        <CheckCircle2 size={10} />
                        تم التضمين تلقائياً
                      </div>
                    </div>
                  )}

                  {/* Admin controls panel inside suggestions card */}
                  {isAdmin && (
                    <div className="flex gap-2 bg-rose-950/10 p-2.5 rounded-xl border border-dashed border-rose-500/20 justify-end items-center mt-3">
                      <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest leading-none mr-auto">تحكم المدير</span>
                      <button
                        onClick={() => onToggleApprove(s.id, !!s.isApproved)}
                        className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer bg-slate-teal border-midnight-teal text-slate-200 hover:text-cyber-cyan hover:border-cyber-cyan/35`}
                      >
                        <CheckCircle2 size={10} />
                        {s.isApproved ? 'إلغاء الاعتماد' : 'اعتماد يدوي'}
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="text-[9px] font-bold bg-rose-950/20 border border-rose-500/20 text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/45 hover:text-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X size={10} />
                        حذف الاقتراح
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedZoomImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" 
          onClick={() => setSelectedZoomImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img 
              src={selectedZoomImage} 
              alt="Zoomed Compatible Model Screen" 
              referrerPolicy="no-referrer"
              className="max-w-[95dvw] max-h-[85dvh] rounded-2xl object-contain border border-white/10 shadow-2xl" 
            />
            <button 
              onClick={() => setSelectedZoomImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-cyber-cyan bg-slate-900 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-colors cursor-pointer"
            >
              إغلاق (Close)
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AddSuggestionModal({ onClose, onAdd }: any) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح.');
      return;
    }
    setCompressing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 450;
        const MAX_HEIGHT = 450;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setImageUrl(compressedBase64);
        setCompressing(false);
      };
      img.onerror = () => {
        setCompressing(false);
        alert('حدث خطأ أثناء معالجة الصورة.');
      };
    };
    reader.onerror = () => {
      setCompressing(false);
      alert('حدث خطأ أثناء قراءة الملف.');
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brand && model && code) {
      onAdd(brand, model, code, imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-obsidian/75 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-teal border border-midnight-teal max-w-lg w-full rounded-[35px] p-8 relative z-[61] shadow-2xl space-y-5 font-sans"
      >
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold font-display text-slate-100">إضافة اقتراح توافق</h3>
          <p className="text-xs text-gray-green uppercase tracking-widest font-black leading-none pt-1">ساهم مع مجتمع فنيين الصيانة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-green uppercase block text-right">اسم الشركة (Brand)</label>
            <input 
              required
              dir="rtl"
              className="w-full p-3.5 bg-obsidian border border-midnight-teal text-slate-100 placeholder-gray-green rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 focus:border-cyber-cyan/40 text-sm font-bold transition-all font-sans"
              placeholder="مثال: Infinix"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-green uppercase block text-right">الموديل (Model)</label>
            <input 
              required
              dir="rtl"
              className="w-full p-3.5 bg-obsidian border border-midnight-teal text-slate-100 placeholder-gray-green rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 focus:border-cyber-cyan/40 text-sm font-bold transition-all font-sans"
              placeholder="مثال: Hot 40 Pro"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-green uppercase block text-right">الموديل المتوافق (Compatible Model)</label>
            <input 
              required
              dir="rtl"
              className="w-full p-3.5 bg-obsidian border border-midnight-teal text-slate-100 placeholder-gray-green rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 focus:border-cyber-cyan/40 text-sm font-bold transition-all font-sans"
              placeholder="مثال: Hot 40 Pro أو C55"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-green uppercase block text-right">صورة الشاشة المتطابقة (اختياري)</label>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all relative ${
                isDragging 
                  ? 'border-cyber-cyan bg-cyber-cyan/10' 
                  : imageUrl 
                    ? 'border-emerald-500/50 bg-emerald-950/10' 
                    : 'border-midnight-teal hover:border-cyber-cyan/40 hover:bg-slate-teal/30'
              }`}
            >
              {compressing ? (
                <div className="py-3 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-cyber-cyan" size={20} />
                  <span className="text-[10px] text-gray-green font-bold">جاري ضغط ومعالجة الصورة...</span>
                </div>
              ) : imageUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-midnight-teal shadow-md" />
                  <button 
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-[10px] font-bold text-rose-400 bg-rose-950/30 border border-rose-500/30 px-3 py-1 rounded-full hover:bg-rose-950/60 transition-colors"
                  >
                    حذف الصورة
                  </button>
                </div>
              ) : (
                <label htmlFor="suggestion-image-upload" className="cursor-pointer block py-2 space-y-1">
                  <input 
                    type="file" 
                    id="suggestion-image-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                  <div className="flex justify-center">
                    <Upload size={18} className="text-cyber-cyan/80 animate-pulse" />
                  </div>
                  <div className="text-xs font-bold text-slate-200">اسحب وأسقط صورة الشاشة هنا، أو اضغط للتصفح</div>
                  <div className="text-[9px] text-gray-green">تدعم صور الكابلات، الفلكسات، شريحة الأي سي، أو الموديلات المطابقة</div>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-green hover:text-white font-bold text-sm transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian rounded-2xl font-black shadow-lg hover:brightness-110 transition-all text-sm cursor-pointer"
            >
              نشر للمجتمع
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function NavButton({ icon, active, label, onClick }: { icon: React.ReactNode, active: boolean, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all min-w-[56px] cursor-pointer ${
        active 
          ? 'bg-cyber-cyan/15 text-cyber-cyan glow-cyan-sm font-bold' 
          : 'text-gray-green hover:text-slate-200'
      }`}
    >
      <div className="transition-transform duration-200">
        {icon}
      </div>
      <span className="text-[9px] font-black mt-0.5 tracking-tight leading-none whitespace-nowrap">{label}</span>
    </button>
  );
}

function SettingsPage({ profile, language, onChangeLanguage, onBack, onNavigate, isAdmin, allPhoneModels, brands, googleAds, onSaveGoogleAds, appBranding, onSaveAppBranding, isPremium, onSubscribe, onInstallApp }: any) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Google Pay Simulation States
  const [showGPayModal, setShowGPayModal] = useState(false);
  const [gpayStatus, setGpayStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [selectedCard, setSelectedCard] = useState('visa');

  const [localAdSettings, setLocalAdSettings] = useState(() => {
    return googleAds || {
      isEnabled: true,
      bannerUrlOrHtml: '',
      linkUrl: '',
      adFormat: 'text',
      adTitle: '',
      bannerImageUrl: '',
      adSenseClient: '',
      adSenseSlot: ''
    };
  });
  const [isSavingAds, setIsSavingAds] = useState(false);

  const [localBrandingSettings, setLocalBrandingSettings] = useState(() => {
    return appBranding || {
      appIconUrl: '',
      faviconUrl: ''
    };
  });
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  useEffect(() => {
    if (googleAds) {
      setLocalAdSettings(googleAds);
    }
  }, [googleAds]);

  useEffect(() => {
    if (appBranding) {
      setLocalBrandingSettings(appBranding);
    }
  }, [appBranding]);

  const handleSaveAds = async () => {
    setIsSavingAds(true);
    try {
      await onSaveGoogleAds(localAdSettings);
      alert(language === 'ar' ? "تم حفظ إعدادات إعلان Google وتحديثها لجميع الأجهزة النشطة والزوار بنجاح! 🎉" : "Google Ad Settings saved and active for all visitors and members! 🎉");
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? "فشلت عملية الحفظ: " + e.message : "Failed to save: " + e.message);
    } finally {
      setIsSavingAds(false);
    }
  };

  const handleSaveBranding = async () => {
    setIsSavingBranding(true);
    try {
      await onSaveAppBranding(localBrandingSettings);
      alert(language === 'ar' ? "تم حفظ وتطبيق إعدادات أيقونة التطبيق والـ Favicon بنجاح! 🎉" : "App branding & Favicon settings saved and applied successfully! 🎉");
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? "فشلت عملية حفظ الأيقونات: " + e.message : "Failed to save branding: " + e.message);
    } finally {
      setIsSavingBranding(false);
    }
  };

  const t = translations[language as 'ar' | 'en'] || translations['ar'];

  const stats = {
    suggested: 24,
    approved: 18
  };

  const [visitsData, setVisitsData] = useState<any[]>([]);
  const [filterReferrer, setFilterReferrer] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'visits'), orderBy('lastActive', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setVisitsData(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'visits');
    });
    return unsubscribe;
  }, [isAdmin]);

  const handleSubscribe = () => {
    // Open the official looking Google Pay checkout sheet modal
    setShowGPayModal(true);
    setGpayStatus('idle');
  };

  const handleExecutePayment = async () => {
    setGpayStatus('processing');
    setTimeout(async () => {
      try {
        if (profile && profile.id) {
          await subscribeUser(profile.id);
        }
        localStorage.setItem('guest_is_subscribed', 'true');
        if (onSubscribe) {
          onSubscribe();
        }
        setGpayStatus('success');
        setTimeout(() => {
          setShowGPayModal(false);
        }, 1500);
      } catch (e: any) {
        console.error("Subscription payment failed:", e);
        alert(language === 'ar' ? "فشلت عملية الدفع وتفعيل الاشتراك: " + e.message : "Payment block failed: " + e.message);
        setGpayStatus('idle');
      }
    }, 2500);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/212677421903", "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 pb-40 text-right font-sans"
    >
      <div className="flex items-center gap-4 text-white">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal/60 rounded-full transition-colors border border-midnight-teal shrink-0 cursor-pointer">
          <ArrowLeft size={24} className={language === 'ar' ? 'rotate-180' : ''} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-center pr-8 font-display text-cyber-cyan">{t.settings}</h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            {!profile ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('guest_mode');
                  window.location.reload();
                }} 
                className="text-[10px] font-bold text-emerald-300 uppercase bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
              >
                <LogIn size={12} />
                {t.loginNow}
              </button>
            ) : (
              <button 
                onClick={() => {
                  logout();
                  localStorage.removeItem('guest_mode');
                }} 
                className="text-[10px] font-bold text-rose-300 uppercase bg-rose-950/40 border border-rose-500/20 px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
              >
                <LogOut size={12} />
                {t.logout}
              </button>
            )}
            <h3 className="text-[10px] font-bold text-cyber-cyan uppercase tracking-widest text-right">{t.profile}</h3>
          </div>
          <div className="bg-slate-teal rounded-[25px] p-5 border border-midnight-teal flex items-center gap-4 shadow-md">
            <div className="w-14 h-14 bg-obsidian rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-midnight-teal">
              {profile?.photoURL ? (
                <img src={profile.photoURL} className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-gray-green" />
              )}
            </div>
            <div className="flex-1 text-right">
              <h4 className="font-bold text-slate-100">{profile?.displayName || t.guestBadge}</h4>
              <p className="text-xs text-gray-green">{profile?.email || (language === 'ar' ? 'تصفح كزائر (محدود بـ 5 عمليات بحث)' : 'Browsing as Guest (Limit 5 searches)')}</p>
              {isPremium && (
                <div className="mt-1 bg-emerald-950/50 border border-emerald-500/25 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 leading-none shadow-none">
                  <Sparkles size={10} />
                  PREMIUM PRO
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DeepSeek In-App Development & Security Studio */}
        <section className="space-y-3">
          <DeepSeekDevStudio
            language={language}
            isAdmin={isAdmin}
            allPhoneModels={allPhoneModels || []}
            brands={brands || []}
            profile={profile}
          />
        </section>

        {/* Google Ads Admin Section */}
        {isAdmin && (
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold text-rose-450 uppercase tracking-widest px-2 text-right">لوحة التحكم الفني والمدير المسؤول 🛠️</h3>
            <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-[0_4px_20px_rgba(0,0,0,0.15)] space-y-4 text-right" dir="rtl">
              <div className="flex items-center justify-start gap-2 border-b border-midnight-teal pb-3">
                <Shield className="text-rose-450" size={18} />
                <span className="font-black text-slate-200 text-sm">إدارة إعلانات جوجل المروّجة</span>
              </div>
              
              <div className="space-y-4">
                {/* Is Enabled */}
                <div className="flex justify-between items-center p-3 bg-obsidian rounded-xl border border-midnight-teal">
                  <label className="text-xs font-bold text-slate-200">تفعيل ظهور الإعلان للأعضاء والزوار</label>
                  <button 
                    onClick={() => {
                      const updated = { ...localAdSettings, isEnabled: !localAdSettings.isEnabled };
                      setLocalAdSettings(updated);
                    }}
                    className={`w-12 h-6 rounded-full relative transition-colors shrink-0 cursor-pointer ${localAdSettings.isEnabled ? 'bg-emerald-500 glow-emerald-sm' : 'bg-midnight-teal'}`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${localAdSettings.isEnabled ? 'right-7' : 'right-1'}`}
                    />
                  </button>
                </div>

                {/* Ad Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-green block text-right">عنوان الإعلان (ملاحظة صغيرة بالرأس)</label>
                  <input
                    type="text"
                    dir="rtl"
                    className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 text-xs font-bold text-slate-100 placeholder-gray-green text-right"
                    placeholder="مثال: إعلان ممول من جوجل"
                    value={localAdSettings.adTitle || ''}
                    onChange={(e) => setLocalAdSettings({ ...localAdSettings, adTitle: e.target.value })}
                  />
                </div>

                {/* Ad Format Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-green block text-right">نوع الإعلان المعروض</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setLocalAdSettings({ ...localAdSettings, adFormat: 'text' })}
                      className={`p-2 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${localAdSettings.adFormat === 'text' ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-black' : 'bg-obsidian border-midnight-teal text-gray-green hover:text-slate-200 hover:border-cyber-cyan/35'}`}
                    >
                      نص ورابط
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalAdSettings({ ...localAdSettings, adFormat: 'image' })}
                      className={`p-2 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${localAdSettings.adFormat === 'image' ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-black' : 'bg-obsidian border-midnight-teal text-gray-green hover:text-slate-200 hover:border-cyber-cyan/35'}`}
                    >
                      بانر (صورة)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalAdSettings({ ...localAdSettings, adFormat: 'html' })}
                      className={`p-2 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${localAdSettings.adFormat === 'html' ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-black' : 'bg-obsidian border-midnight-teal text-gray-green hover:text-slate-200 hover:border-cyber-cyan/35'}`}
                    >
                      كود HTML مخصص
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalAdSettings({ ...localAdSettings, adFormat: 'adsense' })}
                      className={`p-2 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${localAdSettings.adFormat === 'adsense' ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-black animate-pulse' : 'bg-obsidian border-midnight-teal text-gray-green hover:text-slate-200 hover:border-cyber-cyan/35'}`}
                    >
                      ربط كود AdSense 🔑
                    </button>
                  </div>
                </div>

                {/* AdSense inputs */}
                {localAdSettings.adFormat === 'adsense' && (
                  <div className="space-y-4 p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/25 flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 border-b border-emerald-500/10 pb-2">
                      <Sparkles size={14} className="text-emerald-400 animate-pulse" />
                      <span className="text-xs font-black text-emerald-300">إعدادات حساب Google AdSense</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-green block text-right">رقم الناشر (Publisher Client ID - ca-pub)</label>
                      <input
                        type="text"
                        dir="ltr"
                        className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-emerald-500/30 text-xs font-mono text-emerald-300 text-left font-bold"
                        placeholder="مثال: ca-pub-1234567890123456"
                        value={localAdSettings.adSenseClient || ''}
                        onChange={(e) => setLocalAdSettings({ ...localAdSettings, adSenseClient: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-green block text-right">معرف الوحدة الإعلانية (Ad Slot ID - اختياري)</label>
                      <input
                        type="text"
                        dir="ltr"
                        className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-emerald-500/30 text-xs font-mono text-emerald-300 text-left font-bold"
                        placeholder="مثال: 9876543210"
                        value={localAdSettings.adSenseSlot || ''}
                        onChange={(e) => setLocalAdSettings({ ...localAdSettings, adSenseSlot: e.target.value })}
                      />
                    </div>
                    <p className="text-[9px] text-emerald-400 font-bold leading-normal text-right">
                      * عند الحفظ والتفعيل، سيتم تحميل وعرض إعلانات Google AdSense الرسمية بشكل متجاوب تلقائياً في الشاشات الرئيسية وشاشات النتائج لكل الزوار غير المشتركين في باقة PRO.
                    </p>
                  </div>
                )}

                {/* Banner Text / HTML code  */}
                {localAdSettings.adFormat !== 'adsense' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-green block text-right">
                      {localAdSettings.adFormat === 'html' ? 'كود الـ HTML البرمجي للإعلان (AdSense / iFrame)' : 'نص الإعلان والرسالة الدعائية المكتوبة'}
                    </label>
                    <textarea
                      rows={3}
                      dir={localAdSettings.adFormat === 'html' ? 'ltr' : 'rtl'}
                      className={`w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 text-xs font-semibold text-slate-100 placeholder-gray-green leading-relaxed ${localAdSettings.adFormat === 'html' ? 'text-left font-mono' : 'text-right font-sans'}`}
                      placeholder={localAdSettings.adFormat === 'html' ? '<div>... AdSense Script ...</div>' : 'اكتب نص الإعلان الذي سيظهر للمستخدمين والزوار'}
                      value={localAdSettings.bannerUrlOrHtml || ''}
                      onChange={(e) => setLocalAdSettings({ ...localAdSettings, bannerUrlOrHtml: e.target.value })}
                    />
                  </div>
                )}

                {/* Target Link URL */}
                {localAdSettings.adFormat !== 'html' && localAdSettings.adFormat !== 'adsense' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-green block text-right">رابط التوجيه عند الضغط (Link URL)</label>
                    <input
                      type="text"
                      dir="ltr"
                      className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 text-xs font-mono text-slate-100 text-left placeholder-gray-green"
                      placeholder="https://wa.me/... or https://..."
                      value={localAdSettings.linkUrl || ''}
                      onChange={(e) => setLocalAdSettings({ ...localAdSettings, linkUrl: e.target.value })}
                    />
                  </div>
                )}

                {/* Banner Image URL */}
                {localAdSettings.adFormat === 'image' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-green block text-right">رابط صورة البانر (Banner Image URL)</label>
                    <input
                      type="text"
                      dir="ltr"
                      className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 text-xs font-mono text-slate-100 text-left placeholder-gray-green"
                      placeholder="https://example.com/ad-banner.jpg"
                      value={localAdSettings.bannerImageUrl || ''}
                      onChange={(e) => setLocalAdSettings({ ...localAdSettings, bannerImageUrl: e.target.value })}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveAds}
                  disabled={isSavingAds}
                  className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSavingAds ? (
                    <div className="w-4 h-4 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={14} />
                      حفظ وتحديث الإعلان مباشرة للجميع 🚀
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* App Branding Customization Card */}
            <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-[0_4px_20px_rgba(0,0,0,0.15)] space-y-4 text-right mt-4" dir="rtl">
              <div className="flex items-center justify-start gap-2 border-b border-midnight-teal pb-3">
                <ImageIcon className="text-cyber-cyan" size={18} />
                <span className="font-black text-slate-200 text-sm">تخصيص أيقونات التطبيق (Branding)</span>
              </div>
              
              <div className="space-y-4">
                {/* App Icon Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-green block text-right">رابط أيقونة التطبيق (App Icon URL)</label>
                  <input
                    type="text"
                    dir="ltr"
                    className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 text-xs font-mono text-slate-100 placeholder-gray-green text-left"
                    placeholder="https://example.com/logo.png"
                    value={localBrandingSettings.appIconUrl || ''}
                    onChange={(e) => setLocalBrandingSettings({ ...localBrandingSettings, appIconUrl: e.target.value })}
                  />
                  <p className="text-[9px] text-gray-green font-bold">
                    * يفضل استخدام رابط لصورة شفافة (PNG / SVG) لتظهر بشكل منسق في الشاشة الرئيسية وشاشة تسجيل الدخول.
                  </p>
                </div>

                {/* Favicon Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-green block text-right">رابط أيقونة المتصفح (Favicon URL)</label>
                  <input
                    type="text"
                    dir="ltr"
                    className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl outline-none focus:ring-1 focus:ring-cyber-cyan/30 text-xs font-mono text-slate-100 placeholder-gray-green text-left"
                    placeholder="https://example.com/favicon.ico"
                    value={localBrandingSettings.faviconUrl || ''}
                    onChange={(e) => setLocalBrandingSettings({ ...localBrandingSettings, faviconUrl: e.target.value })}
                  />
                  <p className="text-[9px] text-gray-green font-bold">
                    * أيقونة الـ favicon تظهر في شريط عناوين المتصفح وعلامات التبويب.
                  </p>
                </div>

                {/* Preview Icons */}
                {(localBrandingSettings.appIconUrl || localBrandingSettings.faviconUrl) && (
                  <div className="p-3 bg-obsidian rounded-xl border border-midnight-teal flex items-center justify-around">
                    {localBrandingSettings.appIconUrl && (
                      <div className="text-center space-y-1">
                        <span className="text-[9px] font-bold text-gray-green block">معاينة الأيقونة</span>
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-teal rounded border border-midnight-teal p-1 shadow-sm mx-auto overflow-hidden">
                          <img src={localBrandingSettings.appIconUrl} alt="App Icon Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                      </div>
                    )}
                    {localBrandingSettings.faviconUrl && (
                      <div className="text-center space-y-1">
                        <span className="text-[9px] font-bold text-gray-green block">معاينة الـ Favicon</span>
                        <div className="w-8 h-8 flex items-center justify-center bg-slate-teal rounded border border-midnight-teal p-0.5 shadow-sm mx-auto overflow-hidden">
                          <img src={localBrandingSettings.faviconUrl} alt="Favicon Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveBranding}
                  disabled={isSavingBranding}
                  className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSavingBranding ? (
                    <div className="w-4 h-4 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={14} />
                      حفظ وتطبيق شعارات التطبيق فوراً 🎨
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* لوحة تحليلات وإحصائيات حركة مرور زوار الموقع */}
            <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-[0_4px_20px_rgba(0,0,0,0.15)] space-y-6 text-right mt-4" dir="rtl">
              <div className="flex items-center justify-between border-b border-midnight-teal pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="text-cyber-cyan animate-pulse" size={18} />
                  <span className="font-black text-slate-200 text-sm">إحصائيات المنصة ومصادر الزيارة 📈</span>
                </div>
                {(() => {
                  const FIVE_MIN = 5 * 60 * 1000;
                  const activeNow = visitsData.filter(v => (v.lastActive || v.timestamp || 0) > (Date.now() - FIVE_MIN)).length;
                  if (activeNow > 0) {
                    return (
                      <span className="px-3 py-1 text-[9px] font-bold bg-emerald-950/65 text-emerald-400 border border-emerald-500/25 rounded-full flex items-center gap-1.5 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {activeNow} {language === 'ar' ? 'فنيي صيانة نشطين الآن' : 'Active techs now'}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* KPI Counters Grid */}
              {(() => {
                const totalVisits = visitsData.length;
                const FIVE_MIN = 5 * 60 * 1000;
                const activeNow = visitsData.filter(v => (v.lastActive || v.timestamp || 0) > (Date.now() - FIVE_MIN)).length;
                
                const devices = { Mobile: 0, Tablet: 0, Desktop: 0 };
                const referrals: Record<string, number> = {};
                const osBreakdown: Record<string, number> = {};
                const browsers: Record<string, number> = {};
                const campaigns: Record<string, number> = {};

                visitsData.forEach(v => {
                  // Device
                  const d = (v.device || 'Desktop') as 'Mobile' | 'Tablet' | 'Desktop';
                  if (devices[d] !== undefined) devices[d] += 1;

                  // Referrer domain parsing
                  let ref = v.referrer || 'Direct (No Referrer)';
                  if (ref.includes('google.com')) ref = 'Google Search 🔍';
                  else if (ref.includes('facebook.com')) ref = 'Facebook 👥';
                  else if (ref.includes('wa.me') || ref.includes('whatsapp.com')) ref = 'WhatsApp 🟢';
                  else if (ref.includes('t.co') || ref.includes('twitter.com')) ref = 'Twitter / X 🐦';
                  else if (ref.includes('instagram.com')) ref = 'Instagram 📷';
                  else if (ref.includes('youtube.com')) ref = 'YouTube 🔴';
                  else if (ref.includes('localhost') || ref.includes('127.0.0.1')) ref = 'Local Development 🛠️';
                  else if (ref.includes('europe-west')) ref = 'Google Cloud Run ⚡';
                  else {
                    try {
                      if (ref.startsWith('http')) {
                        const url = new URL(ref);
                        ref = url.hostname;
                      }
                    } catch (_) {}
                  }
                  referrals[ref] = (referrals[ref] || 0) + 1;

                  // OS
                  const os = v.os || 'Unknown';
                  osBreakdown[os] = (osBreakdown[os] || 0) + 1;

                  // Browser
                  const br = v.browser || 'Unknown';
                  browsers[br] = (browsers[br] || 0) + 1;

                  // Campaigns
                  if (v.utmSource) {
                    const campKey = `${v.utmSource}${v.utmMedium ? ' / ' + v.utmMedium : ''}`;
                    campaigns[campKey] = (campaigns[campKey] || 0) + 1;
                  }
                });

                const formatTimeAgo = (ts: number) => {
                  if (!ts) return '';
                  const diff = Date.now() - ts;
                  const secs = Math.floor(diff / 1000);
                  const mins = Math.floor(secs / 60);
                  const hours = Math.floor(mins / 60);
                  const days = Math.floor(hours / 24);

                  if (secs < 60) return 'الآن';
                  if (mins < 60 && mins === 1) return 'منذ دقيقة';
                  if (mins < 60 && mins === 2) return 'منذ دقيقتين';
                  if (mins < 60 && mins < 11) return `منذ ${mins} دقائق`;
                  if (mins < 60) return `منذ ${mins} دقيقة`;
                  if (hours < 24 && hours === 1) return 'منذ ساعة';
                  if (hours < 24 && hours === 2) return 'منذ ساعتين';
                  if (hours < 24 && hours < 11) return `منذ ${hours} ساعات`;
                  if (hours < 24) return `منذ ${hours} ساعة`;
                  if (days === 1) return 'منذ يوم';
                  if (days === 2) return 'منذ يومين';
                  if (days < 11) return `منذ ${days} أيام`;
                  return `منذ ${days} يوم`;
                };

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-right">
                      <div className="bg-obsidian border border-midnight-teal/60 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-black text-cyber-cyan">{totalVisits}</div>
                        <div className="text-[9px] font-bold text-gray-green uppercase mt-1 leading-none">إجمالي زيارات الأعضاء</div>
                      </div>
                      <div className="bg-obsidian border border-midnight-teal/60 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-black text-emerald-400">{activeNow}</div>
                        <div className="text-[9px] font-bold text-gray-green uppercase mt-1 leading-none">فنيين يطابقون الآن</div>
                      </div>
                      <div className="bg-obsidian border border-midnight-teal/60 rounded-2xl p-4 text-center col-span-2 lg:col-span-1">
                        <div className="text-xl font-black text-amber-400">
                          {Math.round(((Object.values(devices).reduce((sum, current) => sum + current, 0) || 1) / (totalVisits || 1)) * 100)}%
                        </div>
                        <div className="text-[9px] font-bold text-gray-green uppercase mt-1 leading-none">جلسات تتبع نشطة دقيقة</div>
                      </div>
                    </div>

                    {/* Referrals Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 justify-start">
                        <Compass size={14} className="text-cyber-cyan" />
                        <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">مصادر حركة المرور والزيارات (من أين تأتي الزيارات لتطبيق؟)</h4>
                      </div>
                      <div className="bg-obsidian rounded-2xl border border-midnight-teal/50 p-4 space-y-3.5">
                        {Object.keys(referrals).length === 0 ? (
                          <div className="text-center py-6 text-gray-green text-[11px]">بإنتظار تسجيل تتبع حركة زوار ومطابات الأعضاء...</div>
                        ) : (
                          Object.entries(referrals)
                            .sort((a,b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([ref, count]) => {
                              const pct = Math.round((count / (totalVisits || 1)) * 100);
                              return (
                                <div key={ref} className="space-y-1.5">
                                  <div className="flex justify-between items-center text-[10px] font-bold leading-none">
                                    <span className="text-slate-300 flex items-center gap-1 text-right">
                                      <Globe size={11} className="text-cyber-cyan shrink-0" />
                                      {ref}
                                    </span>
                                    <span className="text-cyber-cyan font-mono font-black">{count} زيارة ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-teal/40 h-1.5 rounded-full overflow-hidden border border-midnight-teal/20">
                                    <div 
                                      className="bg-gradient-to-r from-cyan-600 to-cyber-cyan h-full rounded-full transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>

                    {/* Devices and Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Device breakdown */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-bold text-gray-green uppercase tracking-wide flex items-center gap-1 justify-start">
                          <Smartphone size={12} className="text-cyber-cyan" /> أنواع الأجهزة المستخدمة
                        </h5>
                        <div className="bg-obsidian/75 rounded-2xl border border-midnight-teal/30 p-4 space-y-3">
                          {['Mobile', 'Desktop', 'Tablet'].map((item) => {
                            const count = devices[item as 'Mobile' | 'Tablet' | 'Desktop'] || 0;
                            const pct = Math.round((count / (totalVisits || 1)) * 100);
                            return (
                              <div key={item} className="space-y-1">
                                <div className="flex justify-between items-center text-[9px] font-bold text-slate-300">
                                  <span>{item === 'Mobile' ? '📱 الهواتف (Mobile)' : item === 'Desktop' ? '💻 الحواسيب (Desktop)' : '📟 الأجهزة المحمولة الأخرى'}</span>
                                  <span className="font-mono text-cyber-cyan">{count} ({pct}%)</span>
                                </div>
                                <div className="w-full bg-slate-teal/20 h-1 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-cyber-cyan h-full transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Systems and Browsers */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-bold text-gray-green uppercase tracking-wide flex items-center gap-1 justify-start">
                          <TrendingUp size={12} className="text-cyber-cyan" /> أنظمة التشغيل والمتصفحات
                        </h5>
                        <div className="bg-obsidian/75 rounded-2xl border border-midnight-teal/30 p-4 space-y-2.5 max-h-[140px] overflow-y-auto custom-scrollbar text-[10px] font-medium text-slate-350">
                          <div className="border-b border-midnight-teal/35 pb-1 flex justify-between font-bold text-gray-green text-[9px]">
                            <span>النظام / المتصفح</span>
                            <span>النشاط</span>
                          </div>
                          {Object.entries(osBreakdown).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([os, count]) => (
                            <div key={os} className="flex justify-between items-center py-0.5">
                              <span>⚙️ {os}</span>
                              <span className="font-mono text-slate-400 font-bold">{count}</span>
                            </div>
                          ))}
                          {Object.entries(browsers).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([br, count]) => (
                            <div key={br} className="flex justify-between items-center py-0.5 border-t border-midnight-teal/15 pt-1">
                              <span>🌐 {br}</span>
                              <span className="font-mono text-slate-400 font-bold">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Campaigns UTM */}
                    {Object.keys(campaigns).length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-bold text-gray-green uppercase tracking-wide flex items-center gap-1 justify-start">
                          <Link size={12} className="text-cyber-cyan" /> حملات ومعرفات التسويق والشركاء (UTM)
                        </h5>
                        <div className="bg-obsidian/75 rounded-2xl border border-midnight-teal/30 p-4 text-[9px] font-bold">
                          <div className="grid grid-cols-2 text-gray-green border-b border-midnight-teal/30 pb-2 mb-2">
                            <div>تفاصيل حملة التسويق (UTM Source)</div>
                            <div className="text-left">عدد الدخول</div>
                          </div>
                          <div className="space-y-2 max-h-[150px] overflow-y-auto">
                            {Object.entries(campaigns).map(([camp, count]) => (
                              <div key={camp} className="flex justify-between items-center text-slate-300">
                                <div>📢 {camp}</div>
                                <div className="text-cyber-cyan font-mono">{count}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Log block */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center flex-row-reverse">
                        <h4 className="text-[11px] font-bold text-cyber-cyan uppercase tracking-wide">سجل تتبع نشاطات وحركة الفنيين الأعضاء المباشر 🔴</h4>
                        <span className="text-[9px] font-bold text-gray-green">العدد الكلي للزوار المتتبعين: {totalVisits}</span>
                      </div>

                      {/* Filter selection controls */}
                      <div className="flex gap-1.5 p-1.5 bg-obsidian/50 rounded-xl border border-midnight-teal/40 overflow-x-auto text-[10px]" dir="rtl">
                        <button 
                          type="button"
                          onClick={() => { setFilterReferrer('all'); setFilterDevice('all'); }}
                          className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${filterReferrer === 'all' && filterDevice === 'all' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20' : 'text-gray-green'}`}
                        >
                          الكل
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setFilterReferrer('Google Search 🔍'); setFilterDevice('all'); }}
                          className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${filterReferrer === 'Google Search 🔍' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20' : 'text-gray-green'}`}
                        >
                          جوجل 🔍
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setFilterReferrer('WhatsApp 🟢'); setFilterDevice('all'); }}
                          className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${filterReferrer === 'WhatsApp 🟢' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20' : 'text-gray-green'}`}
                        >
                          واتساب 🟢
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setFilterReferrer('Direct (No Referrer)'); setFilterDevice('all'); }}
                          className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${filterReferrer === 'Direct (No Referrer)' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20' : 'text-gray-green'}`}
                        >
                          رابط مباشر 🔗
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setFilterDevice('Mobile'); setFilterReferrer('all'); }}
                          className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${filterDevice === 'Mobile' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20' : 'text-gray-green'}`}
                        >
                          موبايل 📱
                        </button>
                      </div>

                      <div className="bg-obsidian border border-midnight-teal/50 rounded-2xl overflow-hidden shadow-inner max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-midnight-teal/20">
                        {totalVisits === 0 ? (
                          <div className="p-8 text-center text-gray-green text-xs font-semibold">بانتظار حركة الأعضاء المسجلين حالياً...</div>
                        ) : (
                          visitsData
                            .filter(v => {
                              if (filterDevice !== 'all') return v.device === filterDevice;
                              if (filterReferrer !== 'all') {
                                let refString = v.referrer || '';
                                if (filterReferrer === 'Google Search 🔍') return refString.includes('google.com') || refString.includes('Google Search');
                                if (filterReferrer === 'WhatsApp 🟢') return refString.includes('wa.me') || refString.includes('whatsapp.com') || refString.includes('WhatsApp');
                                if (filterReferrer === 'Direct (No Referrer)') return !refString || refString.includes('Direct') || refString.includes('No Referrer');
                                return refString === filterReferrer;
                              }
                              return true;
                            })
                            .map((visit) => {
                              const isNowActive = (visit.lastActive || visit.timestamp || 0) > (Date.now() - FIVE_MIN);
                              return (
                                <div key={visit.id} className="p-4 flex gap-3 text-right hover:bg-slate-teal/15 transition-all text-xs">
                                  {/* User Avatar */}
                                  <div className="w-9 h-9 rounded-full bg-slate-teal border border-midnight-teal shrink-0 flex items-center justify-center relative">
                                    {visit.userEmail ? (
                                      <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(visit.userEmail)}`} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      <User size={16} className="text-gray-green" />
                                    )}
                                    {isNowActive && (
                                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-obsidian" />
                                    )}
                                  </div>

                                  <div className="flex-1 space-y-1 overflow-hidden">
                                    <div className="flex flex-wrap justify-between items-center gap-1 items-baseline">
                                      <span className="font-extrabold text-slate-200 text-[11px] truncate" title={visit.userName}>
                                        {visit.userName || 'فني دليل دالول'}
                                      </span>
                                      <span className="text-[9px] font-mono text-gray-green select-all truncate">
                                        {visit.userEmail}
                                      </span>
                                    </div>

                                    <div className="text-[10px] text-slate-300">
                                      📍 يتصفح: <span className="text-cyber-cyan font-bold">{visit.lastScreen || 'الصفحة الرئيسية'}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1 pt-1 justify-start">
                                      <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-slate-teal/60 text-slate-300 border border-midnight-teal/30">
                                        ⚙️ {visit.os || 'OS'} - {visit.browser || 'Browser'}
                                      </span>
                                      <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-slate-teal/60 text-slate-300 border border-midnight-teal/30">
                                        📱 {visit.device === 'Mobile' ? 'موبايل' : visit.device === 'Tablet' ? 'تابلت' : 'مكتبي ورئيسي'}
                                      </span>
                                      {visit.referrer && (
                                        <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/10 truncate max-w-[150px]" title={visit.referrer}>
                                          🔗 مصدر: {visit.referrer}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Active / Idle Timing */}
                                  <div className="flex flex-col items-end justify-between shrink-0 pl-1 text-[9px] font-bold min-w-[70px]">
                                    {isNowActive ? (
                                      <span className="text-[8px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase font-black">نشط الآن</span>
                                    ) : (
                                      <span className="text-[8px] text-gray-green font-medium">خامل</span>
                                    )}
                                    <span className="text-[8px] text-gray-green flex items-center gap-0.5 mt-1 font-medium select-none">
                                      <Clock size={8} />
                                      {formatTimeAgo(visit.lastActive || visit.timestamp || 0)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        {/* Subscription Section */}
        {!isPremium && (
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold text-amber-300 uppercase tracking-widest px-2 text-right">{t.upgrade}</h3>
            <div className="bg-gradient-to-br from-slate-teal to-obsidian rounded-[25px] p-6 text-slate-100 border border-midnight-teal relative overflow-hidden shadow-xl">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-cyber-cyan/5 rounded-full blur-2xl"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="bg-cyber-cyan/10 p-2.5 rounded-xl border border-cyber-cyan/20">
                    <Sparkles size={24} className="text-amber-300" />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-slate-100">{t.proPlan}</div>
                    <div className="text-[10px] text-gray-green font-mono font-bold leading-none pt-1">{t.monthlyPrice}</div>
                  </div>
                </div>
                <ul className="space-y-2 text-[10px] font-medium text-gray-green text-right">
                  {t.proFeatures.map((feat: string, i: number) => (
                    <li key={i} className="flex items-center justify-end gap-2 text-slate-200">{feat} <CheckCircle2 size={12} className="text-cyber-cyan" /></li>
                  ))}
                </ul>
                <button 
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian py-3.5 rounded-xl font-black flex items-center justify-center gap-2 hover:brightness-110 transition-all text-xs shadow-md cursor-pointer"
                >
                  <CreditCard size={15} className="text-obsidian" />
                  {language === 'ar' ? 'شراء الاشتراك بـ Google Pay 💳' : 'Buy Subscription via Google Pay 💳'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-green uppercase tracking-widest px-2 text-right">{t.myStats}</h3>
          <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal flex justify-around items-center shadow-md">
            <div className="text-center">
              <div className="text-2xl font-black text-cyber-cyan">{stats.suggested}</div>
              <div className="text-[10px] font-bold text-gray-green uppercase">{t.suggestedScreens}</div>
            </div>
            <div className="w-[1px] h-10 bg-midnight-teal" />
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400 glow-emerald-sm">{stats.approved}</div>
              <div className="text-[10px] font-bold text-gray-green uppercase">{t.approvedScreens}</div>
            </div>
          </div>
        </section>

        {/* App Preferences */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-green uppercase tracking-widest px-2 text-right">{t.appPreferences}</h3>
          <div className="bg-slate-teal rounded-[25px] border border-midnight-teal overflow-hidden shadow-md divide-y divide-midnight-teal/40">
            {/* Language toggle trigger inside options list */}
            <div className="flex items-center justify-between p-5">
              <div className="w-10 h-10 bg-obsidian border border-midnight-teal rounded-xl flex items-center justify-center">
                <Globe size={20} className="text-cyber-cyan" />
              </div>
              <div className="flex-1 text-right px-3">
                <h4 className="text-sm font-bold text-slate-100">{t.languageSetting}</h4>
                <p className="text-[10px] text-gray-green">
                  {language === 'ar' ? 'العربية أو الانجليزية' : 'Arabic or English'}
                </p>
              </div>
              <div className="flex gap-1 bg-obsidian rounded-xl p-1 border border-midnight-teal">
                <button 
                  onClick={() => onChangeLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${language === 'en' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20 font-extrabold' : 'text-gray-green hover:text-slate-200 border border-transparent'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => onChangeLanguage('ar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${language === 'ar' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20 font-extrabold' : 'text-gray-green hover:text-slate-200 border border-transparent'}`}
                >
                  العربية
                </button>
              </div>
            </div>

            <SettingsToggle 
              icon={<Moon size={20} className="text-cyber-cyan" />}
              title={t.darkMode}
              value={isDarkMode}
              onChange={setIsDarkMode}
            />
            <SettingsToggle 
              icon={<Bell size={20} className="text-cyber-cyan" />}
              title={t.newMatchNotifications}
              value={notifications}
              onChange={setNotifications}
            />
            <SettingsToggle 
              icon={<CloudOff size={20} className="text-cyber-cyan" />}
              title={t.offlineMode}
              value={offlineMode}
              onChange={setOfflineMode}
            />
          </div>
        </section>

        {/* تثبيت التطبيق على الشاشة */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-cyber-cyan uppercase tracking-widest px-2 text-right">أيقونة التطبيق وتثبيت الشاشة</h3>
          <div className="bg-slate-teal rounded-[25px] overflow-hidden border border-midnight-teal shadow-md">
            <SettingsItem 
              icon={<Smartphone size={20} className="text-cyber-cyan animate-pulse" />}
              title="تثبيت أيقونة التطبيق على شاشة الهاتف"
              desc="أضف أيقونة تطبيق دليل الشاشات والمطابقات مباشرة على شاشة الهاتف للوصول السريع بضغطة زر واحدة"
              onClick={onInstallApp}
            />
          </div>
        </section>

        {/* Support & Community */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-green uppercase tracking-widest px-2 text-right">الدعم والمجتمع</h3>
          <div className="bg-slate-teal rounded-[25px] overflow-hidden border border-midnight-teal shadow-md">
            <SettingsItem 
              icon={<HelpCircle size={20} className="text-amber-400" />}
              title="مركز المساعدة وقواعد الاستخدام"
              desc="كيفية التصويت واحتساب التوافق التلقائي (قاعدة الـ 50 إعجاب)"
              onClick={() => setShowHelp(true)}
            />
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-green uppercase tracking-widest px-2 text-right">حول تطبيق LCD DALULE</h3>
          <div className="bg-obsidian/80 rounded-[25px] overflow-hidden border border-midnight-teal divide-y divide-midnight-teal/50">
            <div className="p-4 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-100">LCD DALULE v1.0.0</span>
              <span className="text-[10px] font-bold text-gray-green">اسم التطبيق</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-100 font-sans">عثمان الرايس</span>
              <span className="text-[10px] font-bold text-gray-green">المطور</span>
            </div>
            <button 
              onClick={openWhatsApp}
              className="w-full p-4 flex justify-between items-center hover:bg-emerald-950/15 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-emerald-400">
                <PlusCircle size={14} />
                <span className="text-xs font-bold font-sans">+212 682-862591</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">تواصل عبر الواتساب</span>
            </button>
          </div>
        </section>

        {/* Legal Policies Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-[#00D2D2] uppercase tracking-widest px-2 text-right">
            {language === 'ar' ? 'السياسات والخصوصية المعتمدة لـ Google AdSense' : 'AdSense Required Policies & Legal Info'}
          </h3>
          <div className="bg-slate-teal rounded-[25px] overflow-hidden border border-midnight-teal divide-y divide-midnight-teal/40 shadow-md">
            <SettingsItem 
              icon={<Shield size={20} className="text-cyber-cyan" />}
              title={language === 'ar' ? 'سياسة الخصوصية وملفات تعريف الارتباط' : 'Privacy & Cookie Policy'}
              desc={language === 'ar' ? 'كيف نحمي بياناتك واستخدام ملفات ارتباط الإعلانات لطرف ثالث' : 'GDPR/CCPA user safety and third-party advertising cookies'}
              onClick={() => onNavigate('PRIVACY_POLICY')}
            />
            <SettingsItem 
              icon={<FileText size={20} className="text-cyber-cyan" />}
              title={language === 'ar' ? 'شروط الخدمة والاتفاقية الفنية' : 'Terms of Service'}
              desc={language === 'ar' ? 'شروط استخدام مطابقة شاشات الهاتف وإخلاء المسؤولية الفنية' : 'Phone hardware mapping and usage disclaimer rules'}
              onClick={() => onNavigate('TERMS_OF_SERVICE')}
            />
            <SettingsItem 
              icon={<Info size={20} className="text-[#00D2D2]" />}
              title={language === 'ar' ? 'من نحن ورسالة التطبيق الفنية' : 'About Us'}
              desc={language === 'ar' ? 'دليل الشاشات والمطابقات وأهدافه لدعم مهندسي صيانة الموبايل' : 'Learn about our interactive directory aims and builders'}
              onClick={() => onNavigate('ABOUT_US')}
            />
            <SettingsItem 
              icon={<Mail size={20} className="text-[#00D2D2]" />}
              title={language === 'ar' ? 'اتصل بنا والدعم الإداري والتقني' : 'Contact Us'}
              desc={language === 'ar' ? 'أرسل لنا رسالة فورية أو استفسار تجاري أو فكرة توافق جديدة' : 'Send an interactive message or suggest compatible spare parts'}
              onClick={() => onNavigate('CONTACT_US')}
            />
          </div>
        </section>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-obsidian/75 backdrop-blur-md"
            onClick={() => setShowHelp(false)}
          />
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-slate-teal border border-midnight-teal w-full max-w-md rounded-[35px] p-8 relative z-[101] shadow-2xl space-y-4"
          >
            <div className="text-right space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center justify-end gap-2">
                شروط احتساب التوافق التلقائي 🛠️
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-semibold">
                <p>1. ميزة التوافق معتمدة كلياً على تصويت مجتمع الفنيين المحترفين داخل التطبيق.</p>
                <p>2. عندما يقوم أي عضو باقتراح بديل شاشة لموديل معين، يتاح الاقتراح فوراً للتصويت العلني.</p>
                <p>3. يُدرج الموديل تلقائياً في قائمة الهواتف والمطابقات الرسمية بمجرد حصوله على أكثر من 50 إعجاباً (👍)، شريطة أن تكون الأصوات المتوافقة أكبر من الأصوات غير المتطابقة (👎).</p>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian rounded-2xl font-black mt-4 cursor-pointer"
              >
                فهمت ذلك
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Google Pay Bottom Sheet Overlay Sim */}
      {showGPayModal && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-obsidian/85 backdrop-blur-xs animate-fade-in"
            onClick={() => {
              if (gpayStatus !== 'processing') {
                setShowGPayModal(false);
              }
            }}
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="bg-slate-teal w-full max-w-md rounded-t-[28px] p-6 relative z-[121] shadow-2xl text-slate-100 font-sans border-t border-midnight-teal pb-10"
            style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
          >
            {/* Header / Brand */}
            <div className="flex items-center justify-between border-b border-midnight-teal/40 pb-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="bg-white text-black font-extrabold px-2.5 py-1.5 rounded-[6px] text-xs flex items-center justify-center tracking-tight h-[28px] select-none font-sans">
                  <span className="text-blue-500 font-black mr-0.5 font-sans">G</span>
                  <span className="font-sans text-slate-900">Pay</span>
                </div>
                <div className="text-[10px] bg-obsidian text-cyber-cyan font-bold px-2 py-0.5 rounded border border-midnight-teal">
                  {language === 'ar' ? 'بوابة دفع آمنة تشفير SSL' : 'Secure SSL Checkout'}
                </div>
              </div>
              <button 
                onClick={() => setShowGPayModal(false)}
                disabled={gpayStatus === 'processing'}
                className="p-1 hover:bg-slate-teal/40 border border-transparent hover:border-midnight-teal transition-all rounded-full text-slate-300 disabled:opacity-30 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content states */}
            {gpayStatus === 'idle' && (
              <div className="space-y-4">
                <div className="bg-obsidian rounded-2xl p-4 border border-midnight-teal space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="text-right">
                      <h4 className="font-bold text-sm text-white">LCD DALULE PRO</h4>
                      <p className="text-[10px] text-gray-green mt-0.5 font-medium">
                        {language === 'ar' ? 'اشتراك النسخة الاحترافية الكامل لفك جميع الحدود' : 'Full access premium pro subscription'}
                      </p>
                    </div>
                    <div className="text-left font-sans">
                      <span className="text-cyber-cyan font-extrabold text-sm block">3.00 USD</span>
                      <span className="text-[8px] text-gray-green block font-bold">{language === 'ar' ? 'عضوية شهرية' : 'Monthly Premium'}</span>
                    </div>
                  </div>

                  {/* Account email representation */}
                  <div className="pt-2.5 border-t border-midnight-teal/30 flex justify-between items-center text-[10px] font-bold text-gray-green">
                    <span>{language === 'ar' ? 'الحساب المستفيد:' : 'Beneficiary Account:'}</span>
                    <span className="text-slate-200 font-mono">{profile?.email || 'guest@dalule.com'}</span>
                  </div>
                </div>

                {/* Card input details mimicking authentic Google Pay selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-green uppercase tracking-wider block">
                    {language === 'ar' ? 'اختر بطاقة الدفع لـ Google Pay' : 'Choose GPay Payment Method'}
                  </label>
                  
                  <div className="space-y-1.5">
                    {/* Card Option 1 */}
                    <button 
                      onClick={() => setSelectedCard('visa')}
                      className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all text-right cursor-pointer ${
                        selectedCard === 'visa' 
                          ? 'border-cyber-cyan bg-cyber-cyan/15 text-white' 
                          : 'border-midnight-teal bg-obsidian text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-obsidian border border-midnight-teal rounded-md px-2 py-1 flex items-center justify-center font-extrabold font-mono text-[10px] leading-none text-cyber-cyan">
                          VISA
                        </div>
                        <span className="text-xs font-bold font-mono">•••• •••• •••• 7164</span>
                      </div>
                      <div className="text-[10px] text-gray-green font-bold">
                        {language === 'ar' ? 'مستحقة في 2029' : 'Expiry 2029'}
                      </div>
                    </button>

                    {/* Card Option 2 */}
                    <button 
                      onClick={() => setSelectedCard('mastercard')}
                      className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all text-right cursor-pointer ${
                        selectedCard === 'mastercard' 
                          ? 'border-cyber-cyan bg-cyber-cyan/15 text-white' 
                          : 'border-midnight-teal bg-obsidian text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-obsidian border border-midnight-teal rounded-md px-2 py-1 flex items-center justify-center font-extrabold font-mono text-[10px] leading-none text-amber-400">
                          MC
                        </div>
                        <span className="text-xs font-bold font-mono">•••• •••• •••• 4242</span>
                      </div>
                      <div className="text-[10px] text-gray-green font-bold">
                        {language === 'ar' ? 'مستحقة في 2028' : 'Expiry 2028'}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Terms disclaimer */}
                <div className="text-[9px] text-gray-green font-semibold leading-relaxed">
                  {language === 'ar' 
                    ? 'بالضغط على "تأكيد والدفع"، فإنك توافق على شروط خدمة Google Pay وسياسة خصوصية LCD DALULE. سيتم خصم 3.00 دولار أمريكي مكررة شهرياً وتجدد تلقائياً ما لم يتم إلغاؤها.' 
                    : 'By clicking "Authorize Pay", you agree to Google Pay Terms of Service and LCD DALULE privacy policy. Recurring charges of 3.00 USD apply monthly unless canceled.'}
                </div>

                {/* Pay Action Button */}
                <button 
                  onClick={handleExecutePayment}
                  className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-cyan-500 hover:brightness-110 active:scale-[0.99] text-obsidian font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/10 mt-2 font-sans cursor-pointer"
                >
                  <CreditCard size={14} />
                  {language === 'ar' 
                    ? `تأكيد ودفع 3.00 USD عبر Google Pay` 
                    : `Authorize & Pay 3.00 USD via Google Pay`}
                </button>
              </div>
            )}

            {gpayStatus === 'processing' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-cyber-cyan/25 border-t-cyber-cyan rounded-full animate-spin"></div>
                  <div className="absolute font-sans font-black text-[10px] text-cyber-cyan">G Pay</div>
                </div>
                <div className="text-center space-y-1 font-sans">
                  <h4 className="font-bold text-sm text-white">
                    {language === 'ar' ? 'جاري معالجة المعاملة بأمان...' : 'Processing secure payment...'}
                  </h4>
                  <p className="text-[10px] text-gray-green mt-0.5 font-bold font-sans">
                    {language === 'ar' ? 'يرجى عدم إغلاق النافذة أو الرجوع للخلف' : 'Please do not close or navigate back'}
                  </p>
                </div>
              </div>
            )}

            {gpayStatus === 'success' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 font-sans">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-emerald-950/40 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 font-sans"
                >
                  <CheckCircle2 size={36} />
                </motion.div>
                <div className="text-center space-y-1 font-sans">
                  <h4 className="font-bold text-sm text-emerald-400">
                    {language === 'ar' ? 'تمت عملية الدفع بنجاح! 🎉' : 'Payment Approved! 🎉'}
                  </h4>
                  <p className="text-[10px] text-emerald-300 font-bold font-mono text-center">
                    {language === 'ar' ? 'رقم المعاملة : TXN-GPAY-98442' : 'Receipt ID: TXN-GPAY-98442'}
                  </p>
                  <p className="text-[10px] text-gray-green mt-1 font-sans">
                    {language === 'ar' ? 'أنت الآن عضو محترف PRO مع كامل الميزات' : 'Your account is now activated to PREMIUM PRO'}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function LoginScreen({ onGuestAccess, language, t, appBranding }: any) {
  const displayT = t || translations[language as 'ar' | 'en'] || translations['ar'];
  
  const [mode, setMode] = useState<'MAIN' | 'EMAIL_LOGIN' | 'EMAIL_REGISTER'>('MAIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cleanInputs = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      const code = err.code || '';
      const message = err.message || '';
      
      if (code.includes('unauthorized-domain') || message.includes('unauthorized-domain') || message.includes('auth/unauthorized-domain')) {
        setError(
          language === 'ar'
            ? 'عذراً، هذا النطاق غير معتمد في لوحة تحكم Firebase حالياً. لحل المشكلة، يرجى إضافة هذا النطاق (Authorized Domain) في تبويب الإعدادات داخل Firebase Auth في لوحة التحكم الخاصة بك.'
            : 'Sorry, this domain is not authorized in your Firebase backend configuration. Please add this hostname to the Authorized Domains list in Firebase console -> Auth -> Settings.'
        );
      } else if (code.includes('popup-blocked') || message.includes('popup-blocked')) {
        setError(
          language === 'ar'
            ? 'تم حظر النافذة المنبثقة من قبل المتصفح. يرجى تفعيل النوافذ المنبثقة أو استخدام خيار الدخول بالبريد الإلكتروني أدناه.'
            : 'The Google Auth popup was blocked by your browser. Please enable popups or use the Email Login option below.'
        );
      } else {
        setError(
          language === 'ar'
            ? 'لم نتمكن من إكمال تسجيل الدخول عبر Google. هذا الخلل يحدث غالباً بسبب قيود ملفات تعريف الارتباط الخارجية (Iframe) في بيئة التطوير. يرجى تفعيل المتصفح لدعم الكوكيز الخارجية أو الدخول بالبريد الإلكتروني أدناه.'
            : 'Could not complete Google login. This error frequently happens in sandboxed iframes due to cookie blocking. Please enable third-party cookies or use the Email Login option below.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || '';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError(language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.');
      } else if (msg.includes('operation-not-allowed')) {
        setError(
          language === 'ar'
            ? 'تسجيل الدخول بالبريد غير مفعل في إعدادات Firebase. يرجى تفعيل "Email/Password" في صفحة Sign-in method في لوحة تحكم Firebase.'
            : 'Email/Password sign-in is disabled. Please enable "Email/Password" in Firebase console Authentication -> Sign-in providers.'
        );
      } else {
        setError(err.message || String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    if (password.length < 6) {
      setError(language === 'ar' ? 'يجب أن لا تقل كلمة السر عن 6 أحرف' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUpWithEmail(email, password, name);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || '';
      if (msg.includes('email-already-in-use')) {
        setError(language === 'ar' ? 'هذا البريد الإلكتروني مستخدم بالفعل.' : 'This email is already in use.');
      } else if (msg.includes('operation-not-allowed')) {
        setError(
          language === 'ar'
            ? 'إنشاء الحساب بالبريد غير مفعل في إعدادات Firebase. يرجى تفعيل "Email/Password" في لوحة تحكم Firebase Auth.'
            : 'Email registration is disabled in your Firebase console. Please enable Email/Password provider in Firebase console Auth Settings.'
        );
      } else {
        setError(err.message || String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-obsidian overflow-y-auto max-w-[450px] mx-auto relative px-8 py-10 justify-between text-white text-center font-sans border-x border-midnight-teal">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-slate-teal/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="space-y-4 relative z-10 pt-4 shrink-0">
        <div className="w-20 h-20 bg-slate-teal rounded-[26px] border border-midnight-teal shadow-2xl mx-auto flex items-center justify-center overflow-hidden">
          {appBranding?.appIconUrl ? (
            <img src={appBranding.appIconUrl} alt="App Icon" className="w-full h-full object-contain p-2" />
          ) : (
            <Smartphone size={42} className="text-cyber-cyan" />
          )}
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white font-display">LCD DALULE</h1>
          <p className="text-cyber-cyan/80 font-bold tracking-wide uppercase text-[10px] font-sans">
            {language === 'ar' ? 'مجتمع فنيي صيانة الهواتف الذكية' : 'The Ultimate Smartphone Technician Network'}
          </p>
        </div>
      </div>

      <div className="my-6 relative z-10 flex-1 flex flex-col justify-center">
        {/* Error notification */}
        {error && (
          <div className="mb-4 bg-rose-950/30 border border-rose-500/30 rounded-2xl p-3.5 text-xs text-rose-300 text-right leading-relaxed animate-pulse">
            <div className="font-black mb-1 flex items-center gap-1.5 justify-end">
              <span>{language === 'ar' ? 'تنبيه الأمان والاتصال' : 'Security Alert'}</span>
              <AlertTriangle size={14} className="shrink-0 text-rose-400" />
            </div>
            <p className="font-bold">{error}</p>
          </div>
        )}

        {mode === 'MAIN' && (
          <div className="space-y-3">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-slate-teal hover:bg-midnight-teal text-slate-100 border border-midnight-teal py-3.5 rounded-[22px] font-extrabold flex items-center justify-center gap-4.5 shadow-xl hover:-translate-y-0.5 transition-all text-xs cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin"></div>
              ) : (
                <div className="bg-cyber-cyan rounded-full p-0.5 text-obsidian flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
              )}
              <span className="font-black">{displayT.signInWithGoogle || 'Login with Google'}</span>
            </button>

            <button 
              onClick={() => { cleanInputs(); setMode('EMAIL_LOGIN'); }}
              className="w-full bg-obsidian hover:bg-slate-teal/65 text-slate-200 border border-midnight-teal/70 hover:border-cyber-cyan/40 py-3.5 rounded-[22px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all text-xs cursor-pointer"
            >
              <Cpu size={15} className="text-cyber-cyan" />
              <span>{language === 'ar' ? 'الدخول كعضو بالبريد البسيط' : 'Standard Email Credentials LogIn'}</span>
            </button>

            {onGuestAccess && (
              <button
                onClick={onGuestAccess}
                className="w-full bg-slate-teal/30 hover:bg-slate-teal/60 text-gray-green hover:text-white border border-midnight-teal/40 py-3 rounded-[22px] font-extrabold text-[10.5px] tracking-wide transition-all cursor-pointer"
              >
                {displayT.continueAsGuest || 'Continue as Guest'}
              </button>
            )}
          </div>
        )}

        {mode === 'EMAIL_LOGIN' && (
          <form onSubmit={handleEmailLogin} className="space-y-3 bg-slate-teal/60 p-5 rounded-3xl border border-midnight-teal text-right font-sans">
            <h3 className="text-sm font-black text-cyber-cyan text-center mb-1">
              {language === 'ar' ? 'تسجيل الدخول بالبريد' : 'Classic Credential Login'}
            </h3>
            
            <div className="space-y-1 text-right">
              <label className="text-[10px] uppercase font-bold text-gray-green px-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Mail ID'}
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tech@dalule.com"
                className="w-full bg-obsidian text-slate-100 placeholder-gray-green/60 text-xs px-4 py-3 rounded-xl border border-midnight-teal outline-none focus:ring-1 focus:ring-cyber-cyan/50 focus:border-cyber-cyan/60 font-sans"
                required
              />
            </div>

            <div className="space-y-1 text-right">
              <label className="text-[10px] uppercase font-bold text-gray-green px-1">
                {language === 'ar' ? 'رمز المرور (أكثر من 6 خانات)' : 'Secret Key (Min 6 chars)'}
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-obsidian text-slate-100 placeholder-gray-green/60 text-xs px-4 py-3 rounded-xl border border-midnight-teal outline-none focus:ring-1 focus:ring-cyber-cyan/50 focus:border-cyber-cyan/60 font-sans"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian py-3 rounded-xl font-black mt-3 text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin"></div>
              ) : (
                <Save size={14} />
              )}
              <span>{language === 'ar' ? 'تسجيل الملف والتحقق' : 'Register & Sync'}</span>
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-midnight-teal/50 mt-2 text-[10.5px]">
              <button 
                type="button" 
                onClick={() => { cleanInputs(); setMode('MAIN'); }} 
                className="text-gray-green hover:text-cyber-cyan transition-colors underline"
              >
                {language === 'ar' ? 'إلغاء والرجوع' : 'Cancel'}
              </button>
              
              <button 
                type="button" 
                onClick={() => { cleanInputs(); setMode('EMAIL_LOGIN'); }} 
                className="text-cyber-cyan hover:text-white font-black transition-colors underline"
              >
                {language === 'ar' ? 'تسجيل الدخول للحساب' : 'Already registered'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-2 relative z-10 shrink-0">
        <p className="text-[9.5px] text-blue-100/55 leading-relaxed uppercase tracking-tighter">
          {language === 'ar' 
            ? 'بتسجيل الدخول، فإنك توافق على شروط الخدمة وتوجيهات مجتمع الفنيين لدليل الشاشات.' 
            : 'By logging in you agree to our terms of service and technician community guidelines.'}
        </p>
        
        <div className="pt-2 flex justify-center gap-8 opacity-45">
          <Smartphone size={18} />
          <Cpu size={18} />
          <Battery size={18} />
        </div>
      </div>
    </div>
  );
}

function AIAssistantScreen({ onBack, initialPrompt, onClearInitialPrompt }: any) {
  const language = localStorage.getItem('app_language') === 'en' ? 'en' : 'ar';
  const t = translations[language];
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: language === 'ar' 
        ? 'أهلاً بك في المساعد الذكي لقاعدة LCD DALULE. كيف يمكنني مساعدتك في مطابقة وبدائل غيار الهواتف والشاشات اليوم؟ يمكنك السؤال عن أي موديل غير موجود في القائمة وسأبحث لك عن مطابقاته فوراً.' 
        : 'Welcome to LCD DALULE AI Assistant. How can I assist you with matching phone parts or finding compatible screens today? You can ask about any phone model not currently listed and I will find its cross-compatibility instantly.' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (userMessage: string, currentHistory: any[] = messages) => {
    if (!userMessage.trim()) return;
    const newMessages = [...currentHistory, { role: 'user', text: userMessage.trim() }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.trim(),
          history: currentHistory.slice(1),
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      setMessages([...newMessages, { 
        role: 'ai', 
        text: data?.text || (language === 'ar' ? 'عذراً، لم أستطع الحصول على رد مناسب.' : 'Sorry, I couldn\'t retrieve an appropriate response.')
      }]);
    } catch (e: any) {
      console.error("AI Assistant response failed:", e);
      const errText = language === 'ar'
        ? "عذراً، حدث خطأ أثناء التحدث مع الخادم الذكي. يرجى مراجعة اتصالك ومحاولة إرسال الرسالة ثانية."
        : "Sorry, an error occurred while connecting to the smart server. Please verify your connection and try again.";
      setMessages([...newMessages, { 
        role: 'ai', 
        text: errText
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      const promptToSend = initialPrompt.trim();
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
      sendMessage(promptToSend);
    }
  }, [initialPrompt]);

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col flex-1 h-full min-h-0 space-y-4 text-right"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-4 text-white p-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal border border-midnight-teal rounded-full transition-colors shrink-0 cursor-pointer">
          <ArrowLeft size={24} className="rtl:rotate-180" />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-cyber-cyan animate-bounce" />
            <h2 className="text-xl font-bold font-display text-cyber-cyan">{language === 'ar' ? 'المساعد الذكي لكشف التوافق' : 'Compatibility AI Assistant'}</h2>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-cyber-cyan/80 font-black">Powered by DeepSeek AI</span>
        </div>
      </div>

      <div className="flex-1 bg-slate-teal/60 backdrop-blur-xl rounded-[40px] border border-midnight-teal p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div 
              className={`max-w-[85%] p-4 rounded-[20px] text-xs font-semibold shadow-md leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian font-black rounded-tr-none text-right' 
                  : 'bg-obsidian text-slate-200 border border-midnight-teal rounded-tl-none text-right'
              }`}
              style={{
                unicodeBidi: 'plaintext',
                textAlign: language === 'ar' ? 'right' : 'left'
              }}
            >
              {m.role === 'user' ? (
                m.text
              ) : (
                <div className="markdown-body">
                  <Markdown
                    components={{
                      ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1.5 my-2 rtl:text-right ltr:text-left" style={{ paddingInlineStart: '0.5rem' }} {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1.5 my-2 rtl:text-right ltr:text-left" style={{ paddingInlineStart: '0.5rem' }} {...props} />,
                      li: ({node, ...props}) => <li className="mb-1 leading-relaxed text-slate-200 font-semibold" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-200 font-semibold" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-cyber-cyan font-black text-[11px] bg-cyber-cyan/15 border border-cyber-cyan/35 px-1.5 py-0.5 rounded mx-0.5 inline-block shrink-0" style={{ direction: 'ltr', unicodeBidi: 'embed' }} {...props} />,
                    }}
                  >
                    {m.text}
                  </Markdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-obsidian/60 border border-midnight-teal text-cyber-cyan p-3 rounded-2xl rounded-tl-none italic text-[10px] animate-pulse">
              {language === 'ar' ? 'جاري تجهيز الإجابة وبحث البيانات...' : 'AI is thinking and searching database...'}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center bg-slate-teal p-2.5 rounded-[25px] shadow-2xl border border-midnight-teal">
        <input 
          className="flex-1 p-3 text-xs outline-none bg-transparent font-bold text-slate-100 placeholder-gray-green rtl:text-right ltr:text-left"
          placeholder={language === 'ar' ? "اسأل المساعد الذكي عن توافق الشاشات والقطع..." : "Ask AI about screen & parts compatibility..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian p-3 rounded-full shadow-lg active:scale-90 transition-all cursor-pointer font-bold"
        >
          <Search size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function SettingsToggle({ icon, title, desc, value, onChange }: any) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="w-10 h-10 bg-obsidian border border-midnight-teal text-cyber-cyan rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 rtl:text-right ltr:text-left min-w-0">
        <h4 className="text-sm font-bold text-slate-100 truncate">{title}</h4>
        {desc && <p className="text-[10px] text-gray-green leading-tight block truncate">{desc}</p>}
      </div>
      <button 
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${value ? 'bg-cyber-cyan glow-cyan-sm' : 'bg-midnight-teal'}`}
      >
        <motion.div 
          animate={{ x: value ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}

function SettingsItem({ icon, title, desc, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-5 hover:bg-obsidian/45 transition-colors border-b border-midnight-teal/20 text-right">
      <div className="w-10 h-10 bg-obsidian border border-midnight-teal text-cyber-cyan rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-right min-w-0">
        <h4 className="text-sm font-bold text-slate-100 truncate">{title}</h4>
        <p className="text-[10px] text-gray-green tracking-tight truncate">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-green shrink-0" />
    </button>
  );
}

function GlobalSearchScreen({ allPhoneModels, brands, language, t, onViewCompatibility, onExpandModel, onBack, initialQuery, onClearInitialQuery, onOpenAiWithQuery }: any) {
  const [searchWord, setSearchWord] = useState(initialQuery || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiSearchedQuery, setAiSearchedQuery] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedAi, setCopiedAi] = useState(false);

  const handleAskAiForMissingModel = async (queryText: string) => {
    if (!queryText || !queryText.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiSearchedQuery(queryText.trim());
    try {
      const response = await fetch('/api/ai/search-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText.trim(),
          language: language || 'ar'
        })
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiResult(data.result);
    } catch (err: any) {
      console.error('Error fetching AI compatibility:', err);
      setAiError(
        language === 'ar'
          ? 'تعذر الاتصال بخادم الذكاء الاصطناعي حالياً. يرجى التحقق من الاتصال أو إدخال اسم الموديل بدقة.'
          : 'Could not connect to AI server. Please check connection or try a more specific model name.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchWord(initialQuery);
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
    }
  }, [initialQuery, onClearInitialQuery]);
  const [activeBrandId, setActiveBrandId] = useState<string>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  // Filter models based on user query + selected filters
  const filteredModels = allPhoneModels.filter((model: any) => {
    // 1. Brand filter
    if (activeBrandId !== 'ALL' && model.brandId !== activeBrandId) {
      return false;
    }

    // 2. Search query split by words, checking raw and formatted fields
    if (searchWord.trim() !== '') {
      const qs = searchWord.toLowerCase().split(/\s+/).filter(Boolean);
      
      const modelName = (model.modelName || '').toLowerCase();
      const brandObj = brands.find((b: any) => b.id === model.brandId);
      const brandName = brandObj ? brandObj.name.toLowerCase() : '';
      
      const lcdRaw = getCategoryCode(model, 'LCD').toLowerCase();
      const icRaw = getCategoryCode(model, 'IC').toLowerCase();
      const batRaw = getCategoryCode(model, 'BATTERY').toLowerCase();
      const spRaw = getCategoryCode(model, 'SCREEN_PROTECTOR').toLowerCase();
      
      const lcdFormatted = (formatDisplayCode(getCategoryCode(model, 'LCD'), 'en') + ' ' + formatDisplayCode(getCategoryCode(model, 'LCD'), 'ar')).toLowerCase();
      const icFormatted = (formatDisplayCode(getCategoryCode(model, 'IC'), 'en') + ' ' + formatDisplayCode(getCategoryCode(model, 'IC'), 'ar')).toLowerCase();
      const batFormatted = (formatDisplayCode(getCategoryCode(model, 'BATTERY'), 'en') + ' ' + formatDisplayCode(getCategoryCode(model, 'BATTERY'), 'ar')).toLowerCase();
      const spFormatted = (formatDisplayCode(getCategoryCode(model, 'SCREEN_PROTECTOR'), 'en') + ' ' + formatDisplayCode(getCategoryCode(model, 'SCREEN_PROTECTOR'), 'ar')).toLowerCase();

      const altNames = (model.alternativeNames || '').toLowerCase();

      // All search parts must match at least one of these fields
      const matchesAllParts = qs.every((part: string) => {
        return modelName.includes(part) || 
               brandName.includes(part) || 
               lcdRaw.includes(part) || 
               icRaw.includes(part) || 
               batRaw.includes(part) || 
               spRaw.includes(part) ||
               lcdFormatted.includes(part) ||
               icFormatted.includes(part) ||
               batFormatted.includes(part) ||
               spFormatted.includes(part) ||
               altNames.includes(part);
      });

      if (!matchesAllParts) return false;
    }

    // 3. Category spec filter (ensure the model actually has a registered code for the selected category)
    if (activeCategory !== 'ALL') {
      const code = getCategoryCode(model, activeCategory);
      if (!code) return false;
    }

    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-5 pb-32 text-right"
    >
      {/* Header */}
      <div className="flex items-center gap-3 text-white">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal border border-midnight-teal rounded-full transition-colors shrink-0 cursor-pointer">
          <ArrowLeft size={24} className="rtl:rotate-180" />
        </button>
        <div className="flex-1 text-center min-w-0">
          <h2 className="text-xl font-black font-display text-cyber-cyan pr-8 pl-8 truncate">{t.globalSearchTitle}</h2>
        </div>
      </div>

      {/* Modern Search bar */}
      <div className="relative shrink-0">
        <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-3.5 text-gray-green`} size={20} />
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder={t.globalSearchPlaceholder}
          className={`w-full bg-slate-teal text-slate-100 rounded-[20px] ${language === 'ar' ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3.5 text-sm font-semibold border border-midnight-teal placeholder-gray-green focus:outline-none focus:ring-1 focus:ring-cyber-cyan/35 focus:border-cyber-cyan/40 transition-all rtl:text-right ltr:text-left`}
        />
        {searchWord && (
          <button 
            onClick={() => setSearchWord('')}
            className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-3.5 p-0.5 bg-obsidian hover:bg-midnight-teal rounded-full border border-midnight-teal text-gray-green cursor-pointer`}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Brand Horizontal Filter */}
      <div className="space-y-1.5 shrink-0">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black tracking-wider text-gray-green uppercase">
            {language === 'ar' ? 'البحث حسب الماركة' : 'Search by Brand'}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 custom-scrollbar no-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setActiveBrandId('ALL')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap border cursor-pointer ${
              activeBrandId === 'ALL'
                ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30 glow-cyan-sm font-black'
                : 'bg-slate-teal text-gray-green border-midnight-teal hover:border-cyber-cyan/25'
            }`}
          >
            {t.allBrands}
          </button>
          {brands.map((brand: any) => (
            <button
              key={brand.id}
              onClick={() => setActiveBrandId(brand.id)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap border cursor-pointer ${
                activeBrandId === brand.id
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30 glow-cyan-sm font-black'
                  : 'bg-slate-teal text-gray-green border-midnight-teal hover:border-cyber-cyan/25'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category specs Filter Tabs */}
      <div className="grid grid-cols-5 gap-1.5 bg-obsidian p-1 rounded-2xl border border-midnight-teal shadow-inner shrink-0 text-center">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`py-2 text-[10px] font-black rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'ALL' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25' : 'text-gray-green hover:text-slate-200 border border-transparent'
          }`}
        >
          {t.allCategories}
        </button>
        <button
          onClick={() => setActiveCategory('LCD')}
          className={`py-2 text-[10px] font-black rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'LCD' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25' : 'text-gray-green hover:text-slate-200 border border-transparent'
          }`}
        >
          {t.partLcd}
        </button>
        <button
          onClick={() => setActiveCategory('IC')}
          className={`py-2 text-[10px] font-black rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'IC' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25' : 'text-gray-green hover:text-slate-200 border border-transparent'
          }`}
        >
          {t.partIc}
        </button>
        <button
          onClick={() => setActiveCategory('SCREEN_PROTECTOR')}
          className={`py-2 text-[10px] font-black rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'SCREEN_PROTECTOR' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25' : 'text-gray-green hover:text-slate-200 border border-transparent'
          }`}
        >
          {t.partSp}
        </button>
        <button
          onClick={() => setActiveCategory('BATTERY')}
          className={`py-2 text-[10px] font-black rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'BATTERY' ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25' : 'text-gray-green hover:text-slate-200 border border-transparent'
          }`}
        >
          {t.partBattery}
        </button>
      </div>

      {/* Search results */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] font-bold text-gray-green">
            {filteredModels.length} {language === 'ar' ? 'جهاز تم العثور عليه' : 'devices found'}
          </span>
          <span className="text-[10px] font-black text-gray-green uppercase tracking-widest">{t.clickToReveal}</span>
        </div>

        {filteredModels.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-slate-teal rounded-3xl p-6 border border-midnight-teal shadow-2xl text-center space-y-3">
              <div className="w-14 h-14 bg-obsidian border border-midnight-teal rounded-2xl mx-auto flex items-center justify-center text-cyber-cyan shadow-inner">
                <Sparkles size={28} className="animate-pulse" />
              </div>
              <p className="text-sm font-bold text-slate-100">{t.noMatchesFound} "{searchWord}"</p>
              <p className="text-xs text-gray-green leading-normal max-w-sm mx-auto">
                {language === 'ar' 
                  ? 'هذا الموديل غير مسجل في قاعدة البيانات المحلية بعد، أو قد يكون إصداراً نادراً/جديداً. يمكنك البحث عنه فوراً باستخدام الذكاء الاصطناعي لكشف الشاشات والقطع المتوافقة معه بدقة.' 
                  : 'This model is not currently in the local database. You can instantly run an AI hardware search to detect compatible LCDs, batteries, and IC chips.'}
              </p>

              {searchWord.trim() !== '' && (
                <div className="pt-2">
                  <button
                    onClick={() => handleAskAiForMissingModel(searchWord)}
                    disabled={aiLoading}
                    className="w-full bg-gradient-to-r from-cyber-cyan to-cyan-500 hover:from-cyan-400 hover:to-cyan-600 text-obsidian py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{language === 'ar' ? 'جاري البحث بالذكاء الاصطناعي وتدقيق التوافق...' : 'Searching AI hardware database...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>
                          {language === 'ar' 
                            ? `بحث ذكي بالذكاء الاصطناعي عن "${searchWord}"` 
                            : `Smart AI Compatibility Search for "${searchWord}"`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* AI Search Result display */}
            {aiLoading && (
              <div className="bg-obsidian/80 rounded-3xl p-6 border border-cyber-cyan/30 text-center space-y-3 animate-pulse">
                <div className="w-10 h-10 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mx-auto"></div>
                <div className="text-xs font-bold text-cyber-cyan">
                  {language === 'ar' ? 'جاري استخراج مواصفات الشاشة والـ IC والبطاريات المتوافقة...' : 'Extracting display, IC, and battery compatibility specifications...'}
                </div>
                <div className="text-[10px] text-gray-green font-medium">
                  {language === 'ar' ? 'يتم فحص الموديلات ومراجعة التوافق الهندسي' : 'Cross-referencing hardware engineering tables'}
                </div>
              </div>
            )}

            {aiError && (
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 text-xs text-rose-300 text-right space-y-1">
                <div className="font-black flex items-center justify-end gap-1.5 text-rose-400">
                  <span>{language === 'ar' ? 'تنبيه الاتصال' : 'Connection Alert'}</span>
                  <AlertTriangle size={14} />
                </div>
                <p>{aiError}</p>
              </div>
            )}

            {aiResult && !aiLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-teal/90 rounded-3xl p-5 border border-cyber-cyan/40 shadow-2xl text-right space-y-4"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center justify-between border-b border-midnight-teal pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-cyber-cyan/20 text-cyber-cyan rounded-xl border border-cyber-cyan/30">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">
                        {language === 'ar' ? 'نتيجة التحليل والتوافق بالذكاء الاصطناعي' : 'AI Hardware Compatibility Report'}
                      </h4>
                      <span className="text-[10px] text-cyber-cyan font-mono font-bold">
                        {aiSearchedQuery}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiResult);
                      setCopiedAi(true);
                      setTimeout(() => setCopiedAi(false), 2000);
                    }}
                    className="p-2 bg-obsidian hover:bg-midnight-teal border border-midnight-teal rounded-xl text-gray-green hover:text-white transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedAi ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs leading-relaxed text-slate-200 space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar p-1">
                  <div className="markdown-body">
                    <Markdown
                      components={{
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1.5 my-2 rtl:text-right ltr:text-left" style={{ paddingInlineStart: '0.5rem' }} {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1.5 my-2 rtl:text-right ltr:text-left" style={{ paddingInlineStart: '0.5rem' }} {...props} />,
                        li: ({node, ...props}) => <li className="mb-1 leading-relaxed text-slate-200 font-semibold" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-200 font-semibold" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-cyber-cyan font-black text-[11px] bg-cyber-cyan/15 border border-cyber-cyan/35 px-1.5 py-0.5 rounded mx-0.5 inline-block shrink-0" style={{ direction: 'ltr', unicodeBidi: 'embed' }} {...props} />,
                      }}
                    >
                      {aiResult}
                    </Markdown>
                  </div>
                </div>

                {onOpenAiWithQuery && (
                  <div className="pt-2 border-t border-midnight-teal flex justify-end">
                    <button
                      onClick={() => onOpenAiWithQuery(`ما هي القطع والشاشات البديلة المتوافقة مع جهاز ${aiSearchedQuery} بالتفصيل؟`)}
                      className="text-[11px] font-bold text-cyber-cyan hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'ar' ? 'متابعة النقاش مع المساعد الذكي' : 'Follow up in AI Assistant'}</span>
                      <ChevronRight size={14} className="rtl:rotate-180" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredModels.map((model: any) => {
              const brandObj = brands.find((b: any) => b.id === model.brandId);
              const isExpanded = expandedModelId === model.id;

              const renderRelatedCompatibles = (category: string, code: string) => {
                if (!code) return null;
                // find other devices that share the exact same code
                const otherDevices = allPhoneModels.filter((m: any) => m.id !== model.id && getCategoryCode(m, category) === code);
                if (otherDevices.length === 0) return null;

                return (
                  <div className="mt-1.5 px-3 py-2 bg-obsidian/45 border border-midnight-teal/40 rounded-xl space-y-1 text-[11px] rtl:text-right ltr:text-left">
                    <div className="font-extrabold text-cyber-cyan flex items-center gap-1">
                      <Smartphone size={11} className="shrink-0" />
                      <span>
                        {language === 'ar' 
                          ? `الأجهزة المطابقة المتاحة (${otherDevices.length}):` 
                          : `Compatible devices available (${otherDevices.length}):`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {otherDevices.slice(0, 8).map((od: any) => {
                        const odBrand = brands.find((b: any) => b.id === od.brandId);
                        return (
                          <span key={od.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-teal border border-midnight-teal rounded text-[9px] font-bold text-slate-200 hover:border-cyber-cyan/30 transition-all">
                            <span className="text-[7.5px] text-gray-green uppercase tracking-widest font-black shrink-0">{odBrand?.name || 'Device'}</span>
                            <span className="text-slate-100 font-extrabold">{od.modelName}</span>
                          </span>
                        );
                      })}
                      {otherDevices.length > 8 && (
                        <span className="text-[8px] text-gray-green font-extrabold italic px-1 self-center">
                          +{otherDevices.length - 8} {language === 'ar' ? 'أخرى' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                <div 
                  key={model.id}
                  className="bg-slate-teal rounded-3xl border border-midnight-teal shadow-md overflow-hidden transition-all duration-300 hover:border-midnight-teal"
                >
                  {/* Summary Card Header */}
                  <div 
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedModelId(null);
                      } else {
                        const allowed = onExpandModel ? onExpandModel(model.id) : true;
                        if (allowed) {
                          setExpandedModelId(model.id);
                        }
                      }
                    }}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-obsidian/25 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Interactive Image or Fallback */}
                      <div 
                        onClick={(e) => {
                          if (model.imageUrl) {
                            e.stopPropagation();
                            setLightboxImage(model.imageUrl || null);
                            setLightboxTitle(model.modelName);
                          }
                        }}
                        className={`w-12 h-12 bg-obsidian rounded-2xl flex items-center justify-center overflow-hidden border border-midnight-teal flex-shrink-0 relative transition-all ${model.imageUrl ? 'cursor-pointer hover:border-cyber-cyan/60 active:scale-95 shadow-md' : ''}`}
                        title={model.imageUrl ? (language === 'ar' ? 'عرض الصورة بالحجم الكامل' : 'View full image') : undefined}
                      >
                        {model.imageUrl ? (
                          <img src={model.imageUrl} alt={model.modelName} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <Smartphone size={22} className="text-gray-green" />
                        )}
                      </div>
                      
                      {/* Name Details */}
                      <div className="rtl:text-right ltr:text-left min-w-0">
                        <span className="text-[9px] font-extrabold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/15 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          {brandObj?.name || 'Device'}
                        </span>
                        <h4 className="font-extrabold text-slate-100 text-sm tracking-tight truncate">{model.modelName}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-gray-green">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} className="rtl:rotate-180" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded compatibility codes detail list */}
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-midnight-teal/50 bg-obsidian/45 p-4 space-y-3"
                    >
                      {/* LCD Row */}
                      {getCategoryCode(model, 'LCD') && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between py-2 px-3 bg-slate-teal rounded-2xl border border-midnight-teal text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-bold text-slate-200 truncate">{t.partLcd}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 px-3 py-1 rounded-xl text-[11px] font-black">
                                {getCategoryCode(model, 'LCD')}
                              </span>
                              <button
                                onClick={() => onViewCompatibility(model, 'LCD')}
                                className="text-[10px] font-black text-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan/25 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer border border-cyber-cyan/10"
                              >
                                {t.findCompatibles}
                              </button>
                            </div>
                          </div>
                          {renderRelatedCompatibles('LCD', getCategoryCode(model, 'LCD'))}
                        </div>
                      )}

                      {/* IC Row */}
                      {getCategoryCode(model, 'IC') && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between py-2 px-3 bg-slate-teal rounded-2xl border border-midnight-teal text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-bold text-slate-200 truncate">{t.partIc}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono bg-amber-950/40 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-xl text-[11px] font-black">
                                {getCategoryCode(model, 'IC')}
                              </span>
                              <button
                                onClick={() => onViewCompatibility(model, 'IC')}
                                className="text-[10px] font-black text-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan/25 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer border border-cyber-cyan/10"
                              >
                                {t.findCompatibles}
                              </button>
                            </div>
                          </div>
                          {renderRelatedCompatibles('IC', getCategoryCode(model, 'IC'))}
                        </div>
                      )}

                      {/* Cover Glass Row */}
                      {getCategoryCode(model, 'SCREEN_PROTECTOR') && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between py-2 px-3 bg-slate-teal rounded-2xl border border-midnight-teal text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-bold text-slate-200 truncate">{t.partSp}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl text-[11px] font-black">
                                {getCategoryCode(model, 'SCREEN_PROTECTOR')}
                              </span>
                              <button
                                onClick={() => onViewCompatibility(model, 'SCREEN_PROTECTOR')}
                                className="text-[10px] font-black text-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan/25 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer border border-cyber-cyan/10"
                              >
                                {t.findCompatibles}
                              </button>
                            </div>
                          </div>
                          {renderRelatedCompatibles('SCREEN_PROTECTOR', getCategoryCode(model, 'SCREEN_PROTECTOR'))}
                        </div>
                      )}

                      {/* Battery Row */}
                      {getCategoryCode(model, 'BATTERY') && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between py-2 px-3 bg-slate-teal rounded-2xl border border-midnight-teal text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-bold text-slate-200 truncate">{t.partBattery}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono bg-rose-950/40 border border-rose-500/20 text-rose-300 px-3 py-1 rounded-xl text-[11px] font-black">
                                {getCategoryCode(model, 'BATTERY')}
                              </span>
                              <button
                                onClick={() => onViewCompatibility(model, 'BATTERY')}
                                className="text-[10px] font-black text-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan/25 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer border border-cyber-cyan/10"
                              >
                                {t.findCompatibles}
                              </button>
                            </div>
                          </div>
                          {renderRelatedCompatibles('BATTERY', getCategoryCode(model, 'BATTERY'))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Full Screen Image Preview Modal */}
      {lightboxImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setLightboxImage(null); setLightboxTitle(''); }}
          className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center p-4 select-none backdrop-blur-md"
        >
          {/* Close button top right */}
          <div className="absolute top-4 right-4 z-[210]">
            <button 
              onClick={() => { setLightboxImage(null); setLightboxTitle(''); }}
              className="bg-obsidian/80 border border-midnight-teal text-white p-3 rounded-full hover:bg-rose-600 hover:border-rose-500 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-[85vh] flex flex-col items-center justify-center bg-obsidian border border-midnight-teal/40 rounded-3xl p-3 shadow-2xl overflow-hidden"
          >
            <img 
              src={lightboxImage} 
              alt={lightboxTitle} 
              className="max-w-[90vw] max-h-[70vh] rounded-2xl object-contain select-none"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center px-4 mb-2">
              <h3 className="text-base font-extrabold text-cyber-cyan">{lightboxTitle}</h3>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function PrintCheatSheetView({ lcdGroups, language, onClose }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-white text-black p-8 relative font-sans text-right" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-xl flex items-center justify-between print:hidden">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 active:scale-95 transition-all cursor-pointer text-sm"
        >
          {isAr ? '← العودة للتطبيق' : '← Back to App'}
        </button>
        <div className="text-right">
          <h2 className="text-sm font-black text-slate-800">
            {isAr ? 'جاهز للطباعة / الحفظ كـ PDF 🖨️' : 'Ready to print / Save as PDF 🖨️'}
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            {isAr 
              ? 'تم تنسيق هذا الجدول خصيصاً ليناسب أوراق الطباعة A4 وبدقة عالية كمرجع لورشة الصيانة.' 
              : 'This layout is custom tailored to fit A4 paper beautifully for repair workshops.'}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-bold hover:from-emerald-500 hover:to-green-500 active:scale-95 transition-all cursor-pointer text-sm animate-pulse"
        >
          {isAr ? 'طباعة الآن 🖨️' : 'Print Now 🖨️'}
        </button>
      </div>

      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-black uppercase tracking-wide">
          {isAr ? 'دليل مطابقة شاشات الهواتف الذكية - LCD DALULE' : 'Smart Phone LCD Compatibility Guide - LCD DALULE'}
        </h1>
        <p className="text-xs text-gray-600 mt-1 font-mono">
          {isAr ? 'مرجع المهندس الفني لقطع الغيار والمطابقات' : 'The Ultimate Repair Technician Compatibility Sheet'}
        </p>
        <p className="text-[10px] text-gray-500 mt-2">
          {isAr ? `تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}` : `Export Date: ${new Date().toLocaleDateString()}`}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border border-gray-400 px-4 py-2 text-right font-black w-1/3">
                {isAr ? 'كود شاشة الـ LCD (المشترك)' : 'LCD Screen Code (Universal)'}
              </th>
              <th className="border border-gray-400 px-4 py-2 text-right font-black">
                {isAr ? 'الهواتف المتوافقة مع هذا كلياً' : 'Compatible Phone Models'}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(lcdGroups).sort().map((code) => {
              const models = lcdGroups[code];
              return (
                <tr key={code} className="hover:bg-gray-50">
                  <td className="border border-gray-400 px-4 py-3 font-mono font-bold text-black text-right align-top">
                    {code}
                  </td>
                  <td className="border border-gray-400 px-4 py-3 text-right">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {models.map((model: any, mIdx: number) => (
                        <span key={model.id} className="text-black font-semibold">
                          • {model.brandName} {model.modelName}
                          {mIdx < models.length - 1 && <span className="text-gray-400 ml-1">,</span>}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-12 pt-4 border-t border-gray-300 text-[10px] text-gray-500 font-mono">
        © {new Date().getFullYear()} LCD DALULE • ALL COMPATIBILITIES ARE RIGOROUSLY VERIFIED BY TECHNICIANS • WWW.LCD-DALULE.COM
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Home, 
  Search, 
  ArrowRight, 
  Compass, 
  Layers, 
  Smartphone, 
  Battery, 
  Cpu, 
  ShieldCheck, 
  MessageSquare, 
  ExternalLink,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { brands, Brand } from '../data';

export type Category = 'LCD' | 'IC' | 'SCREEN_PROTECTOR' | 'BATTERY';

interface NotFoundPageProps {
  language: 'ar' | 'en';
  onNavigateHome: () => void;
  onNavigateSearch: (initialQuery?: string) => void;
  onSelectBrand?: (brand: Brand) => void;
  onSelectCategory?: (category: Category) => void;
  onNavigateScreen?: (screen: any) => void;
}

export default function NotFoundPage({
  language,
  onNavigateHome,
  onNavigateSearch,
  onSelectBrand,
  onSelectCategory,
  onNavigateScreen
}: NotFoundPageProps) {
  const isAr = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');

  // Set document title and tell search engines not to index this 404 page while following links
  useEffect(() => {
    const originalTitle = document.title;
    document.title = isAr 
      ? '404 - الصفحة غير موجودة | LCD DALULE دليل الشاشات' 
      : '404 - Page Not Found | LCD DALULE';

    // Inject or update robots meta tag for 404
    let robotsMeta = document.querySelector('meta[name="robots"]');
    let originalRobotsContent = robotsMeta ? robotsMeta.getAttribute('content') : null;
    
    if (robotsMeta) {
      robotsMeta.setAttribute('content', 'noindex, follow');
    } else {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      robotsMeta.setAttribute('content', 'noindex, follow');
      document.head.appendChild(robotsMeta);
    }

    return () => {
      document.title = originalTitle;
      if (robotsMeta && originalRobotsContent) {
        robotsMeta.setAttribute('content', originalRobotsContent);
      }
    };
  }, [isAr]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigateSearch(searchTerm.trim());
    }
  };

  const popularBrands = [
    { id: 'samsung', name: 'Samsung', nameAr: 'سامسونج' },
    { id: 'xiaomi', name: 'Xiaomi', nameAr: 'شاومي' },
    { id: 'apple', name: 'iPhone / Apple', nameAr: 'آبل آيفون' },
    { id: 'infinix', name: 'Infinix', nameAr: 'إنفينيكس' },
    { id: 'tecno', name: 'Tecno', nameAr: 'تكنو' },
    { id: 'oppo', name: 'Oppo', nameAr: 'أوبو' },
    { id: 'realme', name: 'Realme', nameAr: 'ريلمي' },
    { id: 'vivo', name: 'Vivo', nameAr: 'فيفو' }
  ];

  const categories = [
    { id: 'LCD' as Category, name: isAr ? 'شاشات الهواتف' : 'LCD Screens', icon: Smartphone, color: 'text-cyber-cyan border-cyber-cyan/30' },
    { id: 'BATTERY' as Category, name: isAr ? 'البطاريات' : 'Batteries', icon: Battery, color: 'text-amber-400 border-amber-500/30' },
    { id: 'IC' as Category, name: isAr ? 'أيسيهات الشحن والباور' : 'Power / IC Chips', icon: Cpu, color: 'text-emerald-400 border-emerald-500/30' },
    { id: 'SCREEN_PROTECTOR' as Category, name: isAr ? 'لاصقات الحماية' : 'Screen Protectors', icon: ShieldCheck, color: 'text-purple-400 border-purple-500/30' }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 text-center" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl w-full bg-slate-teal/80 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-cyber-cyan/30 shadow-[0_16px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-cyber-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-black font-mono mb-4">
          <AlertTriangle size={14} className="text-rose-400 animate-bounce" />
          <span>HTTP 404: {isAr ? 'الصفحة غير موجودة' : 'NOT FOUND'}</span>
        </div>

        {/* Glitch Big 404 */}
        <div className="text-7xl sm:text-8xl font-black font-mono tracking-wider bg-gradient-to-r from-cyber-cyan via-teal-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.3)] mb-2 select-none">
          404
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white mb-2 font-display">
          {isAr ? 'عذراً، الصفحة أو القطعة المطلوبة غير موجودة!' : 'Oops, Page or Model Not Found!'}
        </h1>

        <p className="text-gray-green text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed font-medium">
          {isAr 
            ? 'يبدو أن الرابط الذي طلبته غير صحيح أو تم نقل الموديل، ولكن لا تقلق يمكنك البحث الفوري عن أي شاشة أو موديل، أو تصفح الأقسام الأكثر زيارة أدناه:'
            : 'The page or model code you requested might have been moved or does not exist. Use the search bar below or explore popular sections:'}
        </p>

        {/* In-page Fast Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-8 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-green`} size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAr ? "ابحث عن أي موديل (مثل: A15, Note 13, X6515)..." : "Search model (e.g. A15, Note 13, X6515)..."}
              className={`w-full py-3 ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} bg-obsidian/90 border border-midnight-teal rounded-xl text-xs text-white placeholder-gray-green/60 outline-none focus:ring-1 focus:ring-cyber-cyan font-medium transition-all shadow-inner`}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian font-black text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md shrink-0"
          >
            {isAr ? 'بحث' : 'Search'}
          </button>
        </form>

        {/* Categories Grid */}
        <div className="mb-6 text-right">
          <h2 className="text-xs font-black text-slate-200 mb-2 flex items-center gap-1.5">
            <Layers size={14} className="text-cyber-cyan" />
            <span>{isAr ? 'تصفح أقسام قطع الغيار:' : 'Explore Parts Categories:'}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                  className={`p-3 bg-obsidian/70 hover:bg-obsidian border rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-102 cursor-pointer ${cat.color}`}
                >
                  <IconComp size={18} />
                  <span className="text-[11px] font-bold text-slate-200">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Brands Chips */}
        <div className="mb-8 text-right">
          <h2 className="text-xs font-black text-slate-200 mb-2 flex items-center gap-1.5">
            <Smartphone size={14} className="text-cyber-cyan" />
            <span>{isAr ? 'أشهر الماركات العالمية:' : 'Popular Brands:'}</span>
          </h2>
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {popularBrands.map((b) => {
              const matched = brands.find(item => item.id.toLowerCase() === b.id.toLowerCase());
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => matched && onSelectBrand && onSelectBrand(matched)}
                  className="px-3 py-1.5 bg-obsidian/80 hover:bg-slate-teal border border-midnight-teal hover:border-cyber-cyan/40 text-slate-300 hover:text-cyber-cyan text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                >
                  {isAr ? b.nameAr : b.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-4 border-t border-midnight-teal flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian font-black text-xs rounded-xl flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-md"
          >
            <Home size={15} />
            <span>{isAr ? 'الصفحة الرئيسية' : 'Back to Home'}</span>
          </button>

          {onNavigateScreen && (
            <>
              <button
                type="button"
                onClick={() => onNavigateScreen('COMPARATOR')}
                className="px-4 py-2.5 bg-obsidian hover:bg-slate-teal border border-midnight-teal hover:border-cyber-cyan/40 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Compass size={14} className="text-cyber-cyan" />
                <span>{isAr ? 'مقارن الشاشات' : 'Comparator'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateScreen('COMMUNITY')}
                className="px-4 py-2.5 bg-obsidian hover:bg-slate-teal border border-midnight-teal hover:border-emerald-500/40 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare size={14} className="text-emerald-400" />
                <span>{isAr ? 'مجتمع الفنيين' : 'Community'}</span>
              </button>
            </>
          )}

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-obsidian/60 hover:bg-slate-teal border border-midnight-teal text-gray-green hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <ExternalLink size={13} />
            <span>{isAr ? 'خريطة الفهرسة (Sitemap)' : 'Sitemap.xml'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

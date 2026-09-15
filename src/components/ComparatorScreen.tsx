import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Smartphone, 
  Cpu, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { PhoneModel, Brand, getCategoryCode, formatDisplayCode } from '../data';

interface ComparatorScreenProps {
  allPhoneModels: PhoneModel[];
  brands: Brand[];
  language: 'ar' | 'en';
  onBack: () => void;
  isPremium: boolean;
}

export default function ComparatorScreen({ 
  allPhoneModels, 
  brands, 
  language, 
  onBack,
  isPremium
}: ComparatorScreenProps) {
  const isAr = language === 'ar';

  const [deviceA, setDeviceA] = useState<PhoneModel | null>(null);
  const [deviceB, setDeviceB] = useState<PhoneModel | null>(null);

  const [searchQueryA, setSearchQueryA] = useState('');
  const [searchQueryB, setSearchQueryB] = useState('');

  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  // Filter models for selection
  const filteredModelsA = searchQueryA.trim() === '' 
    ? [] 
    : allPhoneModels.filter(m => 
        m.modelName.toLowerCase().includes(searchQueryA.toLowerCase()) ||
        (m.alternativeNames && m.alternativeNames.toLowerCase().includes(searchQueryA.toLowerCase())) ||
        m.lcdScreenCode.toLowerCase().includes(searchQueryA.toLowerCase())
      ).slice(0, 8);

  const filteredModelsB = searchQueryB.trim() === '' 
    ? [] 
    : allPhoneModels.filter(m => 
        m.modelName.toLowerCase().includes(searchQueryB.toLowerCase()) ||
        (m.alternativeNames && m.alternativeNames.toLowerCase().includes(searchQueryB.toLowerCase())) ||
        m.lcdScreenCode.toLowerCase().includes(searchQueryB.toLowerCase())
      ).slice(0, 8);

  const codeA = deviceA ? getCategoryCode(deviceA, 'LCD') : '';
  const codeB = deviceB ? getCategoryCode(deviceB, 'LCD') : '';

  // Compatibility diagnosis
  const getCompatibilityDiagnosis = () => {
    if (!deviceA || !deviceB) return null;

    if (codeA === codeB) {
      return {
        status: 'full',
        labelAr: 'مطابقة كاملة بنسبة 100% ⭐',
        labelEn: '100% Fully Compatible Match! ⭐',
        descAr: `الجهزان ${deviceA.modelName} و ${deviceB.modelName} يتشاركان في نفس كود تصنيع الشاشة الفرعي (${codeA}). يمكنك تركيب واستبدال الشاشات بينهما مباشرة بكل أمان.`,
        descEn: `Devices ${deviceA.modelName} and ${deviceB.modelName} share the identical LCD part code (${codeA}). Screens are physically and programmatically interchangeable.`,
        colorClass: 'bg-emerald-950/20 text-emerald-300 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        icon: <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
      };
    }

    const pinsA = deviceA.fpcPins || '';
    const pinsB = deviceB.fpcPins || '';

    if (pinsA && pinsB && pinsA === pinsB) {
      return {
        status: 'partial',
        labelAr: 'تطابق في منافذ الفلاتة فقط ⚠️',
        labelEn: 'Connector Pins Match Only ⚠️',
        descAr: `يتطابق كابل التوصيل (${pinsA}) في كلا الجهازين، ولكن كود الشاشة المعتمد مختلف (${codeA} مقابل ${codeB}). قد ينجح التوصيل الهيكلي، ولكن يرجى الحذر من عدم توافق نظام التشغيل أو السطوع أو معرّف المشغّل (Drivers).`,
        descEn: `Both devices share the same layout of FPC pins (${pinsA}), but their active LCD codes differ (${codeA} vs ${codeB}). Physical coupling may fit, but check driver identifiers or controller variations.`,
        colorClass: 'bg-amber-950/20 text-amber-300 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]',
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        icon: <AlertTriangle className="text-amber-400 shrink-0" size={24} />
      };
    }

    return {
      status: 'none',
      labelAr: 'لا يوجد أي توافق معتمد 🚫',
      labelEn: 'No Compatibility Detected 🚫',
      descAr: `لا يتشارك الجهازان في كود الشاشة أو مواصفات فلاتة التوصيل الشائعة. تركيب شاشة أحدهما على الآخر قد يؤدي لتلف الفلاتة أو منفذ اللوحة الأم (Board Connector).`,
      descEn: `No part codes or FPC configurations match between these models. Attempting to fit these screens will cause electrical/connector damage.`,
      colorClass: 'bg-rose-950/20 text-rose-300 border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]',
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      icon: <ShieldAlert className="text-rose-400 shrink-0" size={24} />
    };
  };

  const diagnosis = getCompatibilityDiagnosis();

  // Helper to fetch brand
  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || 'Other';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 pb-24"
    >
      {/* Header */}
      <div className="flex items-center gap-4 text-white">
        <button onClick={onBack} className="p-2 hover:bg-slate-teal/60 rounded-full transition-colors shrink-0 border border-midnight-teal">
          <ArrowLeft size={24} className="rtl:rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-display font-extrabold text-center pr-8 pl-8 whitespace-nowrap overflow-hidden text-ellipsis text-cyber-cyan tracking-tight">
            {isAr ? 'مقارن المطابقات والبدائل الاحترافي' : 'Professional Match Comparator'}
          </h2>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-teal rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] space-y-6 border border-midnight-teal">
        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-slate-100">
            {isAr ? 'مقارنة فنية ثنائية للهواتف' : 'Dual Phone Specification Comparison'}
          </h3>
          <p className="text-xs text-gray-green max-w-sm mx-auto leading-relaxed">
            {isAr 
              ? 'اختر هاتفين للمقارنة الفورية للمطابقة، عدد دبابيس التوصيل، كود الشاشة، ونوع آي سي اللمس.' 
              : 'Pick any two devices to run full diagnostic compatibility tests on their screens, sizes, pins & controllers.'
            }
          </p>
        </div>

        {/* Picker Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Device A Selection */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-gray-green uppercase tracking-widest block text-right rtl:text-right ltr:text-left">
              {isAr ? 'الهاتف الأول (A)' : 'FIRST DEVICE (A)'}
            </label>
            
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-green" size={16} />
              <input 
                type="text" 
                value={searchQueryA}
                onChange={(e) => {
                  setSearchQueryA(e.target.value);
                  setShowDropdownA(true);
                }}
                onFocus={() => setShowDropdownA(true)}
                placeholder={isAr ? 'اكتب اسم الهاتف الأول... (مثال: A12)' : 'Type first phone name...'}
                className="w-full pl-4 pr-10 py-3 bg-obsidian rounded-2xl border border-midnight-teal text-xs font-bold text-slate-150 placeholder-gray-green focus:outline-none focus:ring-1 focus:ring-cyber-cyan focus:border-cyber-cyan/50 transition-all font-sans"
              />
              
              {showDropdownA && filteredModelsA.length > 0 && (
                <div className="absolute z-30 mt-1 w-full bg-slate-teal rounded-2xl border border-midnight-teal shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredModelsA.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setDeviceA(m);
                        setSearchQueryA('');
                        setShowDropdownA(false);
                      }}
                      className="w-full px-4 py-3 hover:bg-midnight-teal/40 border-b border-midnight-teal/30 last:border-0 flex items-center justify-between text-right cursor-pointer transition-colors"
                      dir="rtl"
                    >
                      <div className="flex flex-col items-start text-right">
                        <span className="text-xs font-black text-slate-100">{m.modelName}</span>
                        <span className="text-[9px] text-gray-green uppercase font-bold">{getBrandName(m.brandId)}</span>
                      </div>
                      <span className="font-mono text-[9px] font-extrabold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 px-2 py-0.5 rounded">
                        {m.lcdScreenCode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Device A Selected Badge */}
            {deviceA && (
              <div className="flex items-center justify-between bg-obsidian/40 border border-midnight-teal rounded-2xl p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-teal rounded-xl border border-midnight-teal flex items-center justify-center shrink-0">
                    <Smartphone size={20} className="text-cyber-cyan" />
                  </div>
                  <div className="text-right" dir="rtl">
                    <h4 className="text-xs font-black text-slate-100 leading-tight">{deviceA.modelName}</h4>
                    <span className="text-[9px] text-gray-green font-bold uppercase">{getBrandName(deviceA.brandId)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDeviceA(null)} 
                  className="text-[10px] font-bold text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {isAr ? 'تغيير' : 'Clear'}
                </button>
              </div>
            )}
          </div>

          {/* Device B Selection */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-gray-green uppercase tracking-widest block text-right rtl:text-right ltr:text-left">
              {isAr ? 'الهاتف الثاني (B)' : 'SECOND DEVICE (B)'}
            </label>
            
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-green" size={16} />
              <input 
                type="text" 
                value={searchQueryB}
                onChange={(e) => {
                  setSearchQueryB(e.target.value);
                  setShowDropdownB(true);
                }}
                onFocus={() => setShowDropdownB(true)}
                placeholder={isAr ? 'اكتب اسم الهاتف الثاني... (مثال: Smart 7)' : 'Type second phone name...'}
                className="w-full pl-4 pr-10 py-3 bg-obsidian rounded-2xl border border-midnight-teal text-xs font-bold text-slate-150 placeholder-gray-green focus:outline-none focus:ring-1 focus:ring-cyber-cyan focus:border-cyber-cyan/50 transition-all font-sans"
              />
              
              {showDropdownB && filteredModelsB.length > 0 && (
                <div className="absolute z-30 mt-1 w-full bg-slate-teal rounded-2xl border border-midnight-teal shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredModelsB.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setDeviceB(m);
                        setSearchQueryB('');
                        setShowDropdownB(false);
                      }}
                      className="w-full px-4 py-3 hover:bg-midnight-teal/40 border-b border-midnight-teal/30 last:border-0 flex items-center justify-between text-right cursor-pointer transition-colors"
                      dir="rtl"
                    >
                      <div className="flex flex-col items-start text-right">
                        <span className="text-xs font-black text-slate-100">{m.modelName}</span>
                        <span className="text-[9px] text-gray-green uppercase font-bold">{getBrandName(m.brandId)}</span>
                      </div>
                      <span className="font-mono text-[9px] font-extrabold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 px-2 py-0.5 rounded">
                        {m.lcdScreenCode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Device B Selected Badge */}
            {deviceB && (
              <div className="flex items-center justify-between bg-obsidian/40 border border-midnight-teal rounded-2xl p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-teal rounded-xl border border-midnight-teal flex items-center justify-center shrink-0">
                    <Smartphone size={20} className="text-cyber-cyan" />
                  </div>
                  <div className="text-right" dir="rtl">
                    <h4 className="text-xs font-black text-slate-100 leading-tight">{deviceB.modelName}</h4>
                    <span className="text-[9px] text-gray-green font-bold uppercase">{getBrandName(deviceB.brandId)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDeviceB(null)} 
                  className="text-[10px] font-bold text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {isAr ? 'تغيير' : 'Clear'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Diagnosis Result Box */}
        {diagnosis && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-3xl p-5 ${diagnosis.colorClass} space-y-3`}
          >
            <div className="flex items-center gap-3">
              {diagnosis.icon}
              <div className="text-right" dir="rtl">
                <span className="text-[9px] font-black uppercase tracking-wider block text-gray-green">{isAr ? 'نتيجة الفحص الفني والتحليل' : 'DIAGNOSTIC TEST RUN RESULT'}</span>
                <h4 className="text-sm font-extrabold">{isAr ? diagnosis.labelAr : diagnosis.labelEn}</h4>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-right font-medium" dir="rtl">
              {isAr ? diagnosis.descAr : diagnosis.descEn}
            </p>
          </motion.div>
        )}

        {/* Technical Side-by-Side Specs Grid */}
        {deviceA && deviceB && (
          <div className="border border-midnight-teal rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] bg-obsidian/45">
            <div className="bg-slate-teal border-b border-midnight-teal px-4 py-3 text-right flex items-center gap-1.5 justify-end" dir="rtl">
              <Cpu size={14} className="text-cyber-cyan" />
              <span className="text-[10px] font-black text-gray-green uppercase tracking-wider">
                {isAr ? 'جدول مقارنة المواصفات المعيارية' : 'SPECIFICATION SCORECARD'}
              </span>
            </div>
            
            <div className="divide-y divide-midnight-teal/40 text-right text-[11px]" dir="rtl">
              
              {/* Row: Alternate Name */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-midnight-teal/20 transition-colors">
                <div className="text-gray-green font-extrabold">{isAr ? 'أسماء وموديلات بديلة' : 'Alt Models'}</div>
                <div className="font-bold text-slate-100 truncate pr-2">{deviceA.alternativeNames || '-'}</div>
                <div className="font-bold text-slate-100 truncate pr-2 border-r border-midnight-teal/30">{deviceB.alternativeNames || '-'}</div>
              </div>

              {/* Row: LCD Code */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-midnight-teal/20 transition-colors">
                <div className="text-gray-green font-extrabold">{isAr ? 'كود الشاشة المصنعي' : 'LCD Screen Code'}</div>
                <div className="font-mono font-black text-cyber-cyan bg-cyber-cyan/15 border border-cyber-cyan/20 px-2 py-0.5 rounded-md inline-block max-w-fit">{deviceA.lcdScreenCode}</div>
                <div className="font-mono font-black text-cyber-cyan bg-cyber-cyan/15 border border-cyber-cyan/20 px-2 py-0.5 rounded-md inline-block max-w-fit pr-2 border-r border-midnight-teal/30">
                  <span className="mr-2">{deviceB.lcdScreenCode}</span>
                </div>
              </div>

              {/* Row: Screen size */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-midnight-teal/20 transition-colors">
                <div className="text-gray-green font-extrabold">{isAr ? 'حجم الشاشة (بالبوصة)' : 'Screen Size'}</div>
                <div className="font-extrabold text-slate-100">{deviceA.screenSize || '-'}</div>
                <div className="font-extrabold text-slate-100 pr-2 border-r border-midnight-teal/30">{deviceB.screenSize || '-'}</div>
              </div>

              {/* Row: Screen resolution/Hz */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-midnight-teal/20 transition-colors">
                <div className="text-gray-green font-extrabold">{isAr ? 'نوع الشاشة والتردد' : 'Display Core'}</div>
                <div className="font-bold text-slate-100 truncate">{deviceA.displayType || '-'}</div>
                <div className="font-bold text-slate-100 truncate pr-2 border-r border-midnight-teal/30">{deviceB.displayType || '-'}</div>
              </div>

              {/* Row: FPC Pins */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-midnight-teal/20 transition-colors">
                <div className="text-gray-green font-extrabold">{isAr ? 'عدد دبابيس التوصيل FPC' : 'Connector Pins'}</div>
                <div>
                  {deviceA.fpcPins ? (
                    <span className="font-mono font-bold bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/25 px-2 py-0.5 rounded leading-none">{deviceA.fpcPins}</span>
                  ) : <span className="text-gray-green">-</span>}
                </div>
                <div className="pr-2 border-r border-midnight-teal/30">
                  {deviceB.fpcPins ? (
                    <span className="font-mono font-bold bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/25 px-2 py-0.5 rounded leading-none mr-2">{deviceB.fpcPins}</span>
                  ) : <span className="text-gray-green">-</span>}
                </div>
              </div>

              {/* Row: Touch IC */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-midnight-teal/20 transition-colors">
                <div className="text-gray-green font-extrabold">{isAr ? 'موديل معالج اللمس Touch IC' : 'Touch Controller'}</div>
                <div>
                  {deviceA.touchIcModel ? (
                    <span className="font-mono font-bold bg-orange-950/30 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded leading-none">{deviceA.touchIcModel}</span>
                  ) : <span className="text-gray-green">-</span>}
                </div>
                <div className="pr-2 border-r border-midnight-teal/30">
                  {deviceB.touchIcModel ? (
                    <span className="font-mono font-bold bg-orange-950/30 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded leading-none mr-2">{deviceB.touchIcModel}</span>
                  ) : <span className="text-gray-green">-</span>}
                </div>
              </div>

              {/* Row: Difficulty */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-midnight-teal/20 transition-colors">
                <div className="text-gray-green font-extrabold">{isAr ? 'مستوى صعوبة الفتح' : 'Disassembly Level'}</div>
                <div>
                  {deviceA.repairDifficulty ? (
                    <span className="font-extrabold text-[10px] text-amber-300 bg-amber-950/30 border border-amber-500/25 px-2 py-0.5 rounded-full">{deviceA.repairDifficulty}</span>
                  ) : <span className="text-gray-green">-</span>}
                </div>
                <div className="pr-2 border-r border-midnight-teal/30">
                  {deviceB.repairDifficulty ? (
                    <span className="font-extrabold text-[10px] text-amber-300 bg-amber-950/30 border border-amber-500/25 px-2 py-0.5 rounded-full mr-2">{deviceB.repairDifficulty}</span>
                  ) : <span className="text-gray-green">-</span>}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Visual Connector Comparison Diagram Simulation */}
        {deviceA && deviceB && (
          <div className="border border-midnight-teal rounded-3xl p-5 bg-obsidian text-slate-100 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <h4 className="text-xs font-black text-center text-gray-green tracking-wider uppercase">
              {isAr ? 'محاكاة هيكلية لكابل الفلكس (Flex Connector Simulation)' : 'VISUAL FLEX CONNECTOR PORT MATCH'}
            </h4>
            
            <div className="flex justify-around items-center gap-4 py-2">
              
              {/* Connector Pinout A */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-gray-green text-center uppercase">{deviceA.modelName}</span>
                <div className="w-16 h-28 bg-slate-teal rounded-lg p-2 flex flex-col justify-between border-2 border-midnight-teal relative">
                  <div className="w-full h-4 bg-cyber-cyan text-obsidian rounded flex items-center justify-center font-mono text-[9px] font-black">
                    {deviceA.fpcPins ? deviceA.fpcPins.split('-')[0] : '34'}P
                  </div>
                  <div className="flex-1 flex flex-wrap gap-1 justify-center py-2 relative">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-sm shadow-sm ${
                          diagnosis?.status === 'full' 
                            ? 'bg-emerald-400 animate-pulse' 
                            : diagnosis?.status === 'partial' 
                            ? 'bg-amber-400' 
                            : 'bg-rose-500'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="w-1.5 h-6 bg-cyber-cyan/35 absolute left-1/2 -translate-x-1/2 bottom-0 rounded-t" />
                </div>
              </div>

              {/* Match Connection Lines */}
              <div className="flex-1 flex flex-col items-center justify-center gap-1.5 font-sans">
                <span className={`text-[10px] font-black uppercase text-center px-3 py-1 rounded-full ${
                  diagnosis?.status === 'full' 
                    ? 'bg-emerald-500/15 text-emerald-400' 
                    : diagnosis?.status === 'partial' 
                    ? 'bg-amber-500/15 text-amber-400' 
                    : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {diagnosis?.status === 'full' ? 'Match 100%' : diagnosis?.status === 'partial' ? 'Pin Coupling' : 'Incompatible'}
                </span>
                
                {/* SVG Connecting lines */}
                <svg className="w-full h-8" viewBox="0 0 100 30">
                  <path 
                    d="M 10 15 L 90 15" 
                    fill="none" 
                    stroke={
                      diagnosis?.status === 'full' 
                        ? '#10b981' 
                        : diagnosis?.status === 'partial' 
                        ? '#f59e0b' 
                        : '#ef4444'
                    } 
                    strokeWidth="2" 
                    strokeDasharray={diagnosis?.status === 'none' ? '4 4' : '0'}
                  />
                  {diagnosis?.status === 'full' && (
                    <circle cx="50" cy="15" r="4" fill="#10b981" />
                  )}
                </svg>
              </div>

              {/* Connector Pinout B */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-gray-green text-center uppercase">{deviceB.modelName}</span>
                <div className="w-16 h-28 bg-slate-teal rounded-lg p-2 flex flex-col justify-between border-2 border-midnight-teal relative">
                  <div className="w-full h-4 bg-cyber-cyan text-obsidian rounded flex items-center justify-center font-mono text-[9px] font-black">
                    {deviceB.fpcPins ? deviceB.fpcPins.split('-')[0] : '34'}P
                  </div>
                  <div className="flex-1 flex flex-wrap gap-1 justify-center py-2 relative">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-sm shadow-sm ${
                          diagnosis?.status === 'full' 
                            ? 'bg-emerald-400 animate-pulse' 
                            : diagnosis?.status === 'partial' 
                            ? 'bg-amber-400' 
                            : 'bg-rose-500'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="w-1.5 h-6 bg-cyber-cyan/35 absolute left-1/2 -translate-x-1/2 bottom-0 rounded-t" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Advisory Tips */}
        <div className="bg-slate-teal/65 border border-midnight-teal p-4 rounded-2xl flex gap-3 shadow-md">
          <Info size={18} className="text-cyber-cyan shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-200 leading-relaxed font-semibold rtl:text-right ltr:text-left">
            <b className="text-cyber-cyan">{isAr ? 'تنبيه صيانة وقائي للفنيين:' : 'TECHNICIAN COUPLE ADVISORY:'}</b>{' '}
            {isAr 
              ? 'تطابق عدد المخرجات PIN على الفلاتة لا يضمن دائمًا سلامة البيانات (Data lines) أو معرّف الإضاءة الخلفية (Backlight Driver). يرجى التأكد أولا من تشابه كود الشاشة أو فحص الشاشة على تستر شاشات خارجي (LCD Tester) قبل اللحام أو التجريب على اللوحة الأم تفاديًا لأي التماس كهربائي.'
              : 'Pin counting congruence on FPC is only physical layout matching. Bus driver variations or LED backlight voltage pins might differ. Always pre-test displays on external LCD hardware modules before active motherboard coupling to guarantee complete component safety.'
            }
          </p>
        </div>

      </div>
    </motion.div>
  );
}

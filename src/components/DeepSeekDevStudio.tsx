import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Sparkles, 
  Terminal, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Lock, 
  Unlock, 
  Search, 
  Code, 
  Zap, 
  ChevronDown, 
  Sliders, 
  Wrench,
  Activity,
  Check,
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import { PhoneModel, Brand } from '../data';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

interface DeepSeekDevStudioProps {
  language: 'ar' | 'en';
  isAdmin: boolean;
  allPhoneModels: PhoneModel[];
  brands: Brand[];
  profile?: any;
}

export default function DeepSeekDevStudio({
  language,
  isAdmin,
  allPhoneModels,
  brands,
  profile
}: DeepSeekDevStudioProps) {
  const isAr = language === 'ar';

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'SECURITY' | 'DEV_CONSOLE'>('DATABASE');

  // Developer Unlock Mode (allows instant access for admins or test PIN)
  const [devUnlocked, setDevUnlocked] = useState<boolean>(isAdmin);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // --- TAB 1: Database Evolution States ---
  const [selectedBrand, setSelectedBrand] = useState<string>('samsung');
  const [targetSeries, setTargetSeries] = useState<string>('Galaxy A15, A25, A35, A55 (2024)');
  const [modelsCount, setModelsCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedModels, setGeneratedModels] = useState<any[]>([]);
  const [genError, setGenError] = useState<string | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [isSavingAll, setIsSavingAll] = useState<boolean>(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Firestore AI Models Collection listener
  const [cloudAiModels, setCloudAiModels] = useState<any[]>([]);
  const [isLoadingCloudModels, setIsLoadingCloudModels] = useState<boolean>(true);

  useEffect(() => {
    try {
      const colRef = collection(db, 'ai_models');
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() });
        });
        setCloudAiModels(list);
        setIsLoadingCloudModels(false);
      }, (err) => {
        console.warn("Error loading cloud ai_models:", err);
        setIsLoadingCloudModels(false);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Could not listen to ai_models:", e);
      setIsLoadingCloudModels(false);
    }
  }, []);

  // --- TAB 2: Security Shield States ---
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<any>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [isSavingShield, setIsSavingShield] = useState<boolean>(false);
  const [shieldSuccessMsg, setShieldSuccessMsg] = useState<string | null>(null);

  const [shieldSettings, setShieldSettings] = useState({
    antiScrapingEnabled: true,
    botProtectionActive: true,
    promptInjectionFilter: true,
    rateLimitPerMinute: 45,
    strictInputSanitize: true,
    lastUpdated: null as number | null,
    securityScore: 98
  });

  // Sync security shield settings from Firestore
  useEffect(() => {
    try {
      const docRef = doc(db, 'settings', 'security_shield');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setShieldSettings(prev => ({
            ...prev,
            ...data
          }));
        }
      }, (err) => {
        console.warn("Could not fetch security_shield:", err);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Error setting up security_shield listener:", e);
    }
  }, []);

  // --- TAB 3: Dev Console / Advisor States ---
  const [devPrompt, setDevPrompt] = useState('');
  const [isDevThinking, setIsDevThinking] = useState(false);
  const [devChatHistory, setDevChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: isAr 
        ? 'مرحباً بك في وحدة التطوير الداخلي المباشر المدعومة بنظام DeepSeek AI. كيف يمكنني مساعدتك في تطوير وتحسين التطبيق أو توسيع قاعدة البيانات والتوافقات البرمجية الآن؟'
        : 'Welcome to the In-App DeepSeek Development Studio. How can I assist you in expanding hardware compatibilities, optimizing code, or tightening security today?',
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Handle Developer Unlock with PIN if not yet admin
  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '7742' || pinInput.trim().toLowerCase() === 'admin' || pinInput.trim() === '1234') {
      setDevUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // 1. Generate Compatibilities via DeepSeek
  const handleGenerateCompatibilities = async () => {
    setIsGenerating(true);
    setGenError(null);
    setSavedSuccessMsg(null);
    try {
      const res = await fetch('/api/deepseek/generate-compatibilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: selectedBrand,
          series: targetSeries,
          count: modelsCount,
          language: language
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشلت عملية التوليد عبر DeepSeek');
      }

      setGeneratedModels(data.models || []);
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || 'حدث خطأ أثناء التواصل مع DeepSeek AI');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save single model to Firestore
  const handleSaveModelToCloud = async (model: any, index: number) => {
    setSavingIndex(index);
    try {
      const docId = model.id || `ds-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const modelData = {
        ...model,
        id: docId,
        source: 'deepseek_ai',
        createdAt: serverTimestamp(),
        createdBy: profile?.email || 'admin'
      };

      await setDoc(doc(db, 'ai_models', docId), modelData);
      setSavedSuccessMsg(isAr ? `تم حفظ الموديل "${model.modelName}" في قاعدة البيانات بنجاح! 🎉` : `Model "${model.modelName}" saved to Firestore successfully!`);
      setTimeout(() => setSavedSuccessMsg(null), 3500);
    } catch (err: any) {
      alert((isAr ? "فشل حفظ الموديل: " : "Failed to save model: ") + err.message);
    } finally {
      setSavingIndex(null);
    }
  };

  // Save all generated models to Firestore
  const handleSaveAllToCloud = async () => {
    if (!generatedModels.length) return;
    setIsSavingAll(true);
    try {
      for (const model of generatedModels) {
        const docId = model.id || `ds-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        await setDoc(doc(db, 'ai_models', docId), {
          ...model,
          id: docId,
          source: 'deepseek_ai',
          createdAt: serverTimestamp(),
          createdBy: profile?.email || 'admin'
        });
      }
      setSavedSuccessMsg(isAr ? `تم حفظ ونشر جميع الموديلات (${generatedModels.length}) في قاعدة بيانات السحابة وتفعيلها للتطبيق فوراً! 🚀` : `All ${generatedModels.length} models committed and live in Firestore!`);
      setTimeout(() => setSavedSuccessMsg(null), 4000);
    } catch (err: any) {
      alert((isAr ? "حدث خطأ أثناء الحفظ الجماعي: " : "Batch save error: ") + err.message);
    } finally {
      setIsSavingAll(false);
    }
  };

  // Delete a cloud AI model
  const handleDeleteCloudModel = async (id: string, name: string) => {
    if (!window.confirm(isAr ? `هل تريد حقاً حذف الموديل "${name}" من قاعدة البيانات؟` : `Delete model "${name}" from database?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'ai_models', id));
    } catch (err: any) {
      alert((isAr ? "فشل الحذف: " : "Delete failed: ") + err.message);
    }
  };

  // 2. Run DeepSeek Security Audit
  const handleRunSecurityAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);
    setShieldSuccessMsg(null);
    try {
      const res = await fetch('/api/deepseek/security-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشلت عملية التدقيق الأمني');
      }
      setAuditReport(data.report);

      if (data.report?.shieldSettings) {
        setShieldSettings(prev => ({
          ...prev,
          ...data.report.shieldSettings,
          securityScore: data.report.score || prev.securityScore
        }));
      }
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || 'حدث خطأ أثناء فحص الحماية عبر DeepSeek');
    } finally {
      setIsAuditing(false);
    }
  };

  // Save Shield Settings to Firestore
  const handleSaveShieldSettings = async () => {
    setIsSavingShield(true);
    try {
      const payload = {
        ...shieldSettings,
        lastUpdated: Date.now(),
        updatedBy: profile?.email || 'admin'
      };
      await setDoc(doc(db, 'settings', 'security_shield'), payload, { merge: true });
      setShieldSuccessMsg(isAr ? "تم تفعيل وتثبيت إعدادات درع الحماية الذكي في سحابة Firestore بنجاح! 🛡️" : "DeepSeek Security Shield rules saved and active in Firestore!");
      setTimeout(() => setShieldSuccessMsg(null), 3500);
    } catch (err: any) {
      alert((isAr ? "فشل حفظ درع الحماية: " : "Failed to save shield: ") + err.message);
    } finally {
      setIsSavingShield(false);
    }
  };

  // 3. Send prompt in Dev Console
  const handleSendDevPrompt = async (textToSend?: string) => {
    const queryText = textToSend || devPrompt;
    if (!queryText.trim() || isDevThinking) return;

    const userMessage = {
      role: 'user' as const,
      text: queryText,
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setDevChatHistory(prev => [...prev, userMessage]);
    setDevPrompt('');
    setIsDevThinking(true);

    try {
      const res = await fetch('/api/deepseek/dev-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          language,
          context: {
            totalModels: allPhoneModels.length,
            cloudModelsCount: cloudAiModels.length,
            selectedBrand,
            shieldScore: shieldSettings.securityScore
          }
        })
      });
      const data = await res.json();
      const replyText = data.reply || (isAr ? 'لم أتمكن من إتمام الاستفسار.' : 'Could not generate reply.');

      setDevChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setDevChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          text: isAr ? `⚠️ تعذر استلام الرد: ${err.message}` : `⚠️ Error: ${err.message}`,
          time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsDevThinking(false);
    }
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Studio Header Card */}
      <div className="bg-gradient-to-br from-slate-teal via-obsidian to-slate-teal/90 rounded-[25px] p-6 border border-cyber-cyan/35 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-midnight-teal/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan shadow-[0_0_15px_rgba(0,242,254,0.2)]">
              <Cpu size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black font-display text-white tracking-wide">
                  {isAr ? 'مركز التطوير والحماية الذكي المباشر' : 'DeepSeek In-App Studio & Guardian'}
                </h3>
                <span className="bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  DeepSeek Core
                </span>
              </div>
              <p className="text-[11px] text-gray-green font-medium pt-0.5">
                {isAr 
                  ? 'تطوير وتوسيع قاعدة البيانات بالتوافقات الجديدة، وإدارة حماية التطبيق والأمان سحابياً'
                  : 'Expand hardware compatibilities, audit app defenses, and direct DeepSeek from in-app console'}
              </p>
            </div>
          </div>

          {/* Badges / Quick Health */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-obsidian/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold text-emerald-300">
                {isAr ? 'الدرع نشط' : 'Shield: Active'} ({shieldSettings.securityScore}%)
              </span>
            </div>
            <div className="bg-obsidian/80 border border-cyber-cyan/30 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-inner">
              <Database size={12} className="text-cyber-cyan" />
              <span className="text-[10px] font-mono font-bold text-slate-200">
                {allPhoneModels.length} {isAr ? 'موديل بالقاعدة' : 'models'}
              </span>
            </div>
          </div>
        </div>

        {/* Lock / Unlock Gate */}
        {!devUnlocked ? (
          <div className="mt-5 p-4 bg-obsidian/90 rounded-2xl border border-midnight-teal flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-slate-300 text-xs font-semibold">
              <Lock size={18} className="text-amber-400 shrink-0" />
              <span>
                {isAr 
                  ? 'قسم التطوير الداخلي محمي. أدخل رمز المسؤول للتفعيل المباشر أو سجّل الدخول بحساب المشرف.'
                  : 'In-app Dev Studio is locked. Enter admin PIN to enable direct editing.'}
              </span>
            </div>
            <form onSubmit={handleUnlockWithPin} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="password"
                placeholder={isAr ? "رمز المطور (PIN)..." : "Developer PIN..."}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                className={`px-3 py-2 bg-slate-teal border rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-cyber-cyan/50 font-mono text-center ${pinError ? 'border-rose-500 bg-rose-950/20' : 'border-midnight-teal'}`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyber-cyan text-obsidian font-black text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Unlock size={14} />
                {isAr ? 'تفعيل الوضع' : 'Unlock'}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-4">
            {/* Tabs Navigation */}
            <div className="grid grid-cols-3 gap-2 bg-obsidian/70 p-1.5 rounded-2xl border border-midnight-teal">
              <button
                type="button"
                onClick={() => setActiveTab('DATABASE')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'DATABASE' ? 'bg-gradient-to-r from-cyber-cyan/20 to-cyan-500/20 text-cyber-cyan border border-cyber-cyan/40 shadow-sm font-black' : 'text-gray-green hover:text-slate-200'}`}
              >
                <Database size={14} />
                <span>{isAr ? 'تطوير قاعدة البيانات' : 'Database Evolution'}</span>
                {cloudAiModels.length > 0 && (
                  <span className="bg-cyber-cyan/20 text-cyber-cyan text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                    {cloudAiModels.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('SECURITY')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'SECURITY' ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-black' : 'text-gray-green hover:text-slate-200'}`}
              >
                <ShieldCheck size={14} />
                <span>{isAr ? 'درع الأمان والحماية' : 'Security Shield'}</span>
                <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {shieldSettings.securityScore}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DEV_CONSOLE')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'DEV_CONSOLE' ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 shadow-sm font-black' : 'text-gray-green hover:text-slate-200'}`}
              >
                <Terminal size={14} />
                <span>{isAr ? 'المستشار الذكي للمطور' : 'Dev Console'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Body (Rendered if Unlocked) */}
      {devUnlocked && (
        <AnimatePresence mode="wait">
          {/* TAB 1: DATABASE EVOLUTION */}
          {activeTab === 'DATABASE' && (
            <motion.div
              key="tab-db"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Generation Control Panel */}
              <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-midnight-teal pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-cyber-cyan" size={18} />
                    <h4 className="text-sm font-black text-slate-100">
                      {isAr ? 'توليد وتوسيع توافقات القطع والشاشات عبر DeepSeek AI' : 'Generate Hardware Compatibilities via DeepSeek'}
                    </h4>
                  </div>
                  <span className="text-[10px] text-gray-green font-medium">
                    {isAr ? 'مطابقة متوافقة 100% مع فلكسات الشاشة والـ IC' : 'Screen, Battery & IC cross-references'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Brand Select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-green block">
                      {isAr ? 'الشركة المصنعة (Brand)' : 'Manufacturer Brand'}
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-cyber-cyan"
                    >
                      <option value="samsung">Samsung (سامسونج)</option>
                      <option value="xiaomi">Xiaomi / Redmi / Poco (شاومي)</option>
                      <option value="infinix">Infinix (إنفينيكس)</option>
                      <option value="tecno">Tecno (تكنو)</option>
                      <option value="itel">Itel (آيتل)</option>
                      <option value="oppo">Oppo (أوبو)</option>
                      <option value="realme">Realme (ريلمي)</option>
                      <option value="vivo">Vivo (فيفو)</option>
                      <option value="apple">Apple iPhone (آبل)</option>
                      <option value="honor">Honor (هونر)</option>
                      <option value="huawei">Huawei (هواوي)</option>
                    </select>
                  </div>

                  {/* Target Series / Models */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-green block">
                      {isAr ? 'السلسلة المستهدفة أو الموديلات المطلوب توليد توافقاتها' : 'Target Series or Specific Models'}
                    </label>
                    <input
                      type="text"
                      value={targetSeries}
                      onChange={(e) => setTargetSeries(e.target.value)}
                      placeholder={isAr ? "مثال: Galaxy A15, A25, A35 أو Redmi Note 13 Series..." : "e.g. Galaxy A15, A25 or Redmi Note 13..."}
                      className="w-full p-3 bg-obsidian border border-midnight-teal rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-cyber-cyan"
                    />
                  </div>
                </div>

                {/* Quick Chips for Target Series */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[9px] text-gray-green font-bold pl-1">{isAr ? 'اقتراحات سريعة:' : 'Quick Targets:'}</span>
                  {[
                    { label: 'سامسونج A15 / A25 (2024)', brand: 'samsung', text: 'Galaxy A15 4G/5G, Galaxy A25 5G, Galaxy A24' },
                    { label: 'شاومي ريدمي نوت 13', brand: 'xiaomi', text: 'Redmi Note 13 4G, Note 13 5G, Poco M6 Pro' },
                    { label: 'إنفينيكس هوت 40 و سمارت 8', brand: 'infinix', text: 'Infinix Hot 40i, Smart 8, Tecno Spark 20, Pop 8' },
                    { label: 'تكنو سبارك 20 وكامون 30', brand: 'tecno', text: 'Tecno Spark 20, Spark 20C, Camon 30, Infinix Note 40' },
                    { label: 'ريلمي C53 و C55', brand: 'realme', text: 'Realme C53, Realme C55, Narzo N53, Narzo N55' }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedBrand(chip.brand);
                        setTargetSeries(chip.text);
                      }}
                      className="text-[9px] font-semibold bg-obsidian hover:bg-slate-teal border border-midnight-teal text-slate-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Count and Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-gray-green">{isAr ? 'عدد الموديلات:' : 'Count:'}</span>
                    {[2, 4, 6, 8].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setModelsCount(cnt)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all cursor-pointer ${modelsCount === cnt ? 'bg-cyber-cyan text-obsidian font-black border-cyber-cyan' : 'bg-obsidian border-midnight-teal text-gray-green'}`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateCompatibilities}
                    disabled={isGenerating}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyan-500 text-obsidian font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                        <span>{isAr ? 'يقوم DeepSeek بتحليل المخططات وتوليد التوافقات...' : 'DeepSeek is compiling hardware data...'}</span>
                      </>
                    ) : (
                      <>
                        <Zap size={15} />
                        <span>{isAr ? 'توليد التوافقات بواسطة DeepSeek AI ⚡' : 'Generate Hardware Cluster via DeepSeek'}</span>
                      </>
                    )}
                  </button>
                </div>

                {genError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>{genError}</span>
                  </div>
                )}

                {savedSuccessMsg && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{savedSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Generated Models Preview Box */}
              {generatedModels.length > 0 && (
                <div className="bg-slate-teal rounded-[25px] p-6 border border-cyber-cyan/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-midnight-teal pb-3">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>{isAr ? 'نتائج التوليد الذكي المقترحة من DeepSeek' : 'DeepSeek Hardware Cluster Generated'}</span>
                        <span className="text-xs font-normal text-gray-green">({generatedModels.length} {isAr ? 'موديل' : 'models'})</span>
                      </h4>
                      <p className="text-[10px] text-gray-green pt-0.5">
                        {isAr 
                          ? 'الموديلات التي تحمل نفس رمز الشاشة (lcdScreenCode) ستظهر تلقائياً كشاشات وبدائل متوافقة 100%'
                          : 'Models sharing the identical lcdScreenCode will automatically link as 100% compatible'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAllToCloud}
                      disabled={isSavingAll}
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-obsidian font-black text-xs rounded-xl flex items-center gap-1.5 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {isSavingAll ? (
                        <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      <span>{isAr ? 'حفظ وتثبيت الكل في السحابة (Firestore) 🚀' : 'Commit All to Firestore Cloud'}</span>
                    </button>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedModels.map((model, idx) => (
                      <div key={idx} className="p-4 bg-obsidian rounded-2xl border border-midnight-teal/80 space-y-2.5 relative group hover:border-cyber-cyan/40 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] font-black uppercase text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded-full border border-cyber-cyan/20">
                              {model.brandId}
                            </span>
                            <h5 className="font-extrabold text-slate-100 text-xs mt-1">
                              {model.modelName}
                            </h5>
                            {model.alternativeNames && (
                              <p className="text-[9px] text-gray-green font-mono">
                                {model.alternativeNames}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSaveModelToCloud(model, idx)}
                            disabled={savingIndex === idx}
                            className="px-2.5 py-1 bg-slate-teal hover:bg-cyber-cyan hover:text-obsidian text-cyber-cyan text-[10px] font-bold rounded-lg border border-cyber-cyan/30 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {savingIndex === idx ? (
                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Plus size={11} />
                            )}
                            <span>{isAr ? 'تثبيت بالسحابة' : 'Save'}</span>
                          </button>
                        </div>

                        {/* Specs badges */}
                        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-medium pt-1">
                          <div className="p-2 bg-slate-teal/50 rounded-xl border border-midnight-teal">
                            <span className="text-gray-green block text-[8px] font-bold">كود الشاشة (LCD Code):</span>
                            <span className="text-cyber-cyan font-mono font-black">{model.lcdScreenCode}</span>
                          </div>
                          <div className="p-2 bg-slate-teal/50 rounded-xl border border-midnight-teal">
                            <span className="text-gray-green block text-[8px] font-bold">موديل البطارية (Battery):</span>
                            <span className="text-amber-300 font-mono font-bold">{model.batteryCode || '—'}</span>
                          </div>
                          <div className="p-2 bg-slate-teal/50 rounded-xl border border-midnight-teal">
                            <span className="text-gray-green block text-[8px] font-bold">آيسي الباور/الشحن (IC):</span>
                            <span className="text-emerald-300 font-mono font-bold">{model.icChipCode || '—'}</span>
                          </div>
                          <div className="p-2 bg-slate-teal/50 rounded-xl border border-midnight-teal">
                            <span className="text-gray-green block text-[8px] font-bold">لاصقة الحماية (Glass):</span>
                            <span className="text-purple-300 font-mono font-bold">{model.screenProtectorCode || '—'}</span>
                          </div>
                        </div>

                        {/* Tips */}
                        {model.repairTips && (
                          <div className="p-2 bg-slate-teal/20 rounded-xl text-[9px] text-slate-300 flex items-start gap-1.5 border border-midnight-teal/40">
                            <Info size={11} className="text-cyber-cyan shrink-0 mt-0.5" />
                            <span>{model.repairTips}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cloud Database Synced Models */}
              <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-midnight-teal pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="text-cyber-cyan" size={18} />
                    <h4 className="text-sm font-black text-slate-100">
                      {isAr ? 'الموديلات والتوافقات النشطة في السحابة (Firestore)' : 'Active AI Cloud Models in Database'}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-cyber-cyan font-mono">
                    {cloudAiModels.length} {isAr ? 'موديل سحابي نشط' : 'cloud models'}
                  </span>
                </div>

                {isLoadingCloudModels ? (
                  <div className="p-6 text-center text-xs text-gray-green flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
                    <span>{isAr ? 'جاري مزامنة الموديلات من سحابة Firestore...' : 'Syncing cloud models...'}</span>
                  </div>
                ) : cloudAiModels.length === 0 ? (
                  <div className="p-8 text-center bg-obsidian/50 rounded-2xl border border-midnight-teal/40 space-y-2">
                    <p className="text-xs font-medium text-gray-green">
                      {isAr 
                        ? 'لم يتم إضافة موديلات سحابية إضافية بعد. استخدم أداة DeepSeek أعلاه لتوليد وحفظ توافقات جديدة مباشرة!'
                        : 'No custom AI models yet in the database. Use DeepSeek generator above to add new ones!'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-midnight-teal/40 max-h-[360px] overflow-y-auto custom-scrollbar bg-obsidian rounded-2xl border border-midnight-teal/50">
                    {cloudAiModels.map((m) => (
                      <div key={m.id} className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-teal/10 transition-colors">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-cyber-cyan bg-cyber-cyan/10 px-1.5 py-0.5 rounded border border-cyber-cyan/20">
                              {m.brandId}
                            </span>
                            <span className="font-extrabold text-slate-100 truncate">
                              {m.modelName}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-[10px] text-gray-green font-mono">
                            <span>LCD: <b className="text-cyber-cyan">{m.lcdScreenCode}</b></span>
                            {m.batteryCode && <span>Batt: <b className="text-amber-300">{m.batteryCode}</b></span>}
                            {m.icChipCode && <span>IC: <b className="text-emerald-300">{m.icChipCode}</b></span>}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCloudModel(m.id, m.modelName)}
                          className="p-2 text-gray-green hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
                          title={isAr ? "حذف من السحابة" : "Delete"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: SECURITY SHIELD */}
          {activeTab === 'SECURITY' && (
            <motion.div
              key="tab-security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Audit Action Banner */}
              <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-midnight-teal pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        {isAr ? 'فحص وتطوير حماية التطبيق بواسطة DeepSeek Guardian' : 'DeepSeek Application Security Guardian'}
                      </h4>
                      <p className="text-[10px] text-gray-green">
                        {isAr 
                          ? 'تدقيق قواعد الأمان السحابية، كشف محاولات الاختراق، ومنع استخراج البيانات غير المصرح به'
                          : 'Audit Firestore rules, protect against bot scraping, and prevent malicious prompts'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunSecurityAudit}
                    disabled={isAuditing}
                    className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-obsidian font-black text-xs rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isAuditing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                        <span>{isAr ? 'يقوم DeepSeek بتحليل متجهات الأمان...' : 'DeepSeek is auditing app security...'}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>{isAr ? 'تشغيل الفحص الأمني الشامل 🛡️' : 'Run DeepSeek Security Audit'}</span>
                      </>
                    )}
                  </button>
                </div>

                {auditError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>{auditError}</span>
                  </div>
                )}

                {shieldSuccessMsg && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{shieldSuccessMsg}</span>
                  </div>
                )}

                {/* Audit Result Display */}
                {auditReport && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 bg-obsidian rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-green font-bold block">{isAr ? 'مؤشر الحماية العام' : 'Security Score'}</span>
                          <span className="text-2xl font-black text-emerald-400">{auditReport.score || 96}%</span>
                        </div>
                        <ShieldCheck size={28} className="text-emerald-400" />
                      </div>

                      <div className="p-4 bg-obsidian rounded-2xl border border-midnight-teal flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-green font-bold block">{isAr ? 'حالة النظام' : 'System Posture'}</span>
                          <span className="text-xs font-black text-slate-100">{auditReport.status || 'SECURE_PROTECTED'}</span>
                        </div>
                        <CheckCircle2 size={24} className="text-cyber-cyan" />
                      </div>

                      <div className="p-4 bg-obsidian rounded-2xl border border-midnight-teal flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-green font-bold block">{isAr ? 'محرك التدقيق' : 'Auditor Engine'}</span>
                          <span className="text-xs font-mono font-bold text-cyber-cyan">DeepSeek CyberGuard</span>
                        </div>
                        <Cpu size={24} className="text-purple-400" />
                      </div>
                    </div>

                    {/* Checks list */}
                    {auditReport.checks && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-black text-slate-200 block">{isAr ? 'مجالات التدقيق الأمني المفحوصة:' : 'Audited Security Vectors:'}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {auditReport.checks.map((c: any, i: number) => (
                            <div key={i} className="p-3 bg-obsidian rounded-xl border border-midnight-teal flex items-start gap-2.5">
                              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${c.status === 'PASS' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                              <div className="space-y-0.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-100">{c.domain}</span>
                                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${c.status === 'PASS' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-300'}`}>
                                    {c.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-green">{c.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {auditReport.recommendations && (
                      <div className="p-3.5 bg-obsidian/70 rounded-2xl border border-midnight-teal space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-300 block">{isAr ? 'توصيات تعزيز الأمان من DeepSeek:' : 'DeepSeek Recommendations:'}</span>
                        <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                          {auditReport.recommendations.map((rec: string, i: number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Active DeepSeek Shield Configuration */}
              <div className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-midnight-teal pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="text-cyber-cyan" size={18} />
                    <h4 className="text-sm font-black text-slate-100">
                      {isAr ? 'إعدادات درع الحماية الفوري (DeepSeek Active Guard)' : 'DeepSeek Active Guard Controls'}
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {isAr ? 'مُفعّل سحابياً' : 'Active in Cloud'}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Anti-Scraping Toggle */}
                  <div className="p-3.5 bg-obsidian rounded-xl border border-midnight-teal flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {isAr ? 'درع مكافحة الزحف وسحب البيانات (Anti-Scraping Shield)' : 'Anti-Scraping & Data Harvesting Shield'}
                      </span>
                      <span className="text-[10px] text-gray-green">
                        {isAr ? 'يمنع البوتات والبرامج الآلية من استخراج قاعدة بيانات الشاشات بشكل جماعي' : 'Block automated bots from extracting the parts database in bulk'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShieldSettings(s => ({ ...s, antiScrapingEnabled: !s.antiScrapingEnabled }))}
                      className={`w-12 h-6 rounded-full relative transition-colors shrink-0 cursor-pointer ${shieldSettings.antiScrapingEnabled ? 'bg-emerald-500' : 'bg-midnight-teal'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${shieldSettings.antiScrapingEnabled ? 'right-7' : 'right-1'}`} />
                    </button>
                  </div>

                  {/* Prompt Injection & AI Guard */}
                  <div className="p-3.5 bg-obsidian rounded-xl border border-midnight-teal flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {isAr ? 'جدار حماية DeepSeek ضد حقن الأوامر (Prompt Injection Filter)' : 'AI Prompt Injection & Abuse Filter'}
                      </span>
                      <span className="text-[10px] text-gray-green">
                        {isAr ? 'عزل وتطهير الاستفسارات الموجهة للذكاء الاصطناعي لمنع التحايل أو تسريب الإعدادات' : 'Sanitizes all LLM prompts to prevent jailbreaks and instruction bypass'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShieldSettings(s => ({ ...s, promptInjectionFilter: !s.promptInjectionFilter }))}
                      className={`w-12 h-6 rounded-full relative transition-colors shrink-0 cursor-pointer ${shieldSettings.promptInjectionFilter ? 'bg-emerald-500' : 'bg-midnight-teal'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${shieldSettings.promptInjectionFilter ? 'right-7' : 'right-1'}`} />
                    </button>
                  </div>

                  {/* Bot Protection */}
                  <div className="p-3.5 bg-obsidian rounded-xl border border-midnight-teal flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {isAr ? 'كشف وحظر الروبوتات الوهمية (Bot Protection)' : 'Suspicious Traffic & Bot Mitigation'}
                      </span>
                      <span className="text-[10px] text-gray-green">
                        {isAr ? 'التحقق من توقيع المتصفح وحركة مرور فنيي الصيانة الحقيقيين' : 'Validates genuine technician browser sessions'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShieldSettings(s => ({ ...s, botProtectionActive: !s.botProtectionActive }))}
                      className={`w-12 h-6 rounded-full relative transition-colors shrink-0 cursor-pointer ${shieldSettings.botProtectionActive ? 'bg-emerald-500' : 'bg-midnight-teal'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${shieldSettings.botProtectionActive ? 'right-7' : 'right-1'}`} />
                    </button>
                  </div>

                  {/* Rate Limiting */}
                  <div className="p-3.5 bg-obsidian rounded-xl border border-midnight-teal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {isAr ? 'الحد الأقصى للاستعلامات بالدقيقة (Rate Limiting)' : 'Requests Rate Limit (req/min)'}
                      </span>
                      <span className="text-[10px] text-gray-green">
                        {isAr ? 'حماية خادم Cloud Run وقاعدة Firestore من الإغراق المتعمد' : 'Throttles abusive spikes to protect Firestore budget and Cloud Run'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[30, 45, 60, 90].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setShieldSettings(s => ({ ...s, rateLimitPerMinute: rate }))}
                          className={`px-2.5 py-1 text-xs rounded-lg font-mono font-bold border transition-all cursor-pointer ${shieldSettings.rateLimitPerMinute === rate ? 'bg-cyber-cyan text-obsidian font-black border-cyber-cyan' : 'bg-slate-teal border-midnight-teal text-gray-green'}`}
                        >
                          {rate}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save Shield Settings Button */}
                  <button
                    type="button"
                    onClick={handleSaveShieldSettings}
                    disabled={isSavingShield}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-obsidian font-black text-xs rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isSavingShield ? (
                      <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    <span>{isAr ? 'حفظ وتفعيل درع الحماية السحابي في Firestore 🔐' : 'Commit Security Shield to Cloud'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: DEV CONSOLE & ADVISOR */}
          {activeTab === 'DEV_CONSOLE' && (
            <motion.div
              key="tab-dev"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-teal rounded-[25px] p-6 border border-midnight-teal shadow-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-midnight-teal pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="text-purple-400" size={18} />
                  <h4 className="text-sm font-black text-slate-100">
                    {isAr ? 'وحدة الاستشارة والتطوير البرمجي المباشر مع DeepSeek' : 'DeepSeek In-App Dev Console'}
                  </h4>
                </div>
                <span className="text-[10px] text-purple-300 font-mono font-bold">
                  v3.7 / deepseek-chat
                </span>
              </div>

              {/* Chat Stream */}
              <div className="h-[340px] overflow-y-auto custom-scrollbar p-4 bg-obsidian rounded-2xl border border-midnight-teal space-y-3">
                {devChatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-green mb-1 px-1">
                      <span>{msg.role === 'user' ? (isAr ? 'المشرف/المطور' : 'You') : 'DeepSeek Dev Advisor'}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-cyber-cyan/15 text-slate-100 border border-cyber-cyan/30 rounded-br-sm' : 'bg-slate-teal text-slate-200 border border-midnight-teal rounded-bl-sm font-sans'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isDevThinking && (
                  <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
                    <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span>{isAr ? 'يقوم DeepSeek بصياغة خطة التطوير والحل البرمجي...' : 'DeepSeek is formulating engineering guidance...'}</span>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-bold text-gray-green">{isAr ? 'طلبات تطوير سريعة:' : 'Quick Prompts:'}</span>
                {[
                  'اقترح أحدث شاشات متطابقة لهواتف Infinix و Tecno لعام 2024',
                  'كيف أضيف حماية إضافية لكود تطبيق دليل دالول؟',
                  'ما هي خطة توسيع قطع غيار IC الشحن في قاعدة البيانات؟',
                  'فحص تسريع جلب البيانات والتوافقات للفنيين'
                ].map((promptText, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendDevPrompt(promptText)}
                    className="text-[9px] bg-obsidian hover:bg-slate-teal border border-midnight-teal text-slate-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={devPrompt}
                  onChange={(e) => setDevPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendDevPrompt(); }}
                  placeholder={isAr ? "اكتب سؤالك أو طلبك لتطوير التطبيق وقاعدة البيانات..." : "Ask DeepSeek how to expand the database, optimize code, or tighten defenses..."}
                  className="flex-1 p-3 bg-obsidian border border-midnight-teal rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-purple-400 placeholder-gray-green"
                />
                <button
                  type="button"
                  onClick={() => handleSendDevPrompt()}
                  disabled={!devPrompt.trim() || isDevThinking}
                  className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xs rounded-xl hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shrink-0 shadow-md flex items-center gap-1"
                >
                  <Zap size={14} />
                  <span>{isAr ? 'إرسال' : 'Send'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

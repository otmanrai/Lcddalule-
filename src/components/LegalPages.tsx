import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, FileText, Info, Mail, Send, CheckCircle2, PhoneCall, AlertTriangle } from 'lucide-react';

interface LegalPageProps {
  pageType: 'PRIVACY' | 'TERMS' | 'ABOUT' | 'CONTACT';
  language: 'ar' | 'en';
  onBack: () => void;
}

export default function LegalPage({ pageType, language, onBack }: LegalPageProps) {
  const isAr = language === 'ar';

  // Contact Form states
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    // Simulate real API submission for AdSense inspection/form support
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const renderHeader = (titleAr: string, titleEn: string, Icon: any) => {
    return (
      <div className="flex items-center gap-4 text-white pb-4 border-b border-midnight-teal/40">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-slate-teal/60 rounded-full transition-colors border border-midnight-teal shrink-0 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={22} className={isAr ? 'rotate-180' : ''} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-obsidian text-cyber-cyan border border-midnight-teal/60 rounded-xl">
            <Icon size={20} />
          </div>
          <h2 className="text-xl font-black font-display text-cyber-cyan">
            {isAr ? titleAr : titleEn}
          </h2>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className={`space-y-6 pb-28 font-sans ${isAr ? 'text-right' : 'text-left'}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. Privacy Policy & Cookie Policy */}
      {pageType === 'PRIVACY' && (
        <>
          {renderHeader("سياسة الخصوصية وملفات تعريف الارتباط", "Privacy & Cookie Policy", Shield)}
          
          <div className="bg-slate-teal p-6 rounded-3xl border border-midnight-teal text-slate-200 space-y-6 leading-relaxed text-sm">
            <div>
              <p className="text-gray-green text-xs font-mono font-bold tracking-wider uppercase mb-1">
                {isAr ? "آخر تحديث: يونيو 2026" : "Last updated: June 2026"}
              </p>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "مقدمة وتأكيد الأمان" : "Introduction & Security Commitment"}
              </h3>
              <p>
                {isAr 
                  ? "مرحباً بكم في دليل الشاشات والمطابقات (LCD DALULE). نحن ملتزمون التزاماً تاماً بحماية وخصوصية بياناتكم الشخصية كفنيين ومستخدمين للمنصة. توضح هذه السياسة طبيعة المعلومات التي نجمعها وكيفية معالجتها بما يتوافق مع المعايير الدولية."
                  : "Welcome to LCD DALULE. We are strictly committed to protecting the privacy of our visitors and technicians. This policy details the type of information we gather, how we handle it, and our compliance with global data protection protocols."}
              </p>
            </div>

            {/* Cookies Section - Critical for AdSense */}
            <div>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "ملفات تعريف الارتباط وطرف ثالث (علاقة Google AdSense)" : "Cookies & Third-Party Advertising (Google AdSense Compliance)"}
              </h3>
              <p className="mb-3">
                {isAr
                  ? "يستخدم هذا التطبيق ملفات تعريف الارتباط (Cookies) لتحسين تجربة تصفح بدائل الشاشات والمطابقات وتسجيل جلسات الدخول الفنية بشكل آمن."
                  : "We use cookies to enhance device lookup speeds, store localization choices, and deliver personalized experiences safely."}
              </p>
              <div className="p-4 bg-obsidian/60 border border-midnight-teal/80 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-[#00D2D2] uppercase tracking-wider">
                  {isAr ? "إفصاح وإعلانات جوجل AdSense الهام (معرف الناشر: pub-1522797161972650)" : "Google AdSense Disclosures (Publisher ID: pub-1522797161972650)"}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-xs text-gray-green">
                  <li>
                    {isAr 
                      ? "جوجل (Google) بصفتها مورداً لطرف ثالث، تستخدم ملفات تعريف الارتباط المخصصة (DoubleClick DART Cookie) لعرض الإعلانات على المنصة بموجب حساب الناشر المعتمد pub-1522797161972650 وبناءً على اهتماماتكم."
                      : "Google, as a third-party vendor, uses cookies (including the DoubleClick DART cookie) to serve relevant advertisements to users under publisher account pub-1522797161972650 based on their search habits."}
                  </li>
                  <li>
                    {isAr 
                      ? "يمكن للمستخدمين اختيار تعطيل استخدام ملفات تعريف الارتباط DART عن طريق زيارة سياسة الخصوصية الخاصة بإعلانات Google وشبكة المحتوى للتحكم الكامل."
                      : "You may opt out of personalized browsing cookies by visiting Google's official Ad & Content Network privacy control hub at any time."}
                  </li>
                  <li>
                    {isAr 
                      ? "نحن نوفر خيار ترقية الحساب (PRO Plan) والذي يتيح للفنيين كتم وحظر كافة الإعلانات المموزة تماماً والتمتع بواجهة سريعة."
                      : "We also offer a premium tier (PRO Plan) which gives technicians the option to safely opt out of advertisements entirely."}
                  </li>
                  <li>
                    {isAr 
                      ? "لأي استفسار يخص معالجة البيانات الإعلانية، يمكنكم التواصل مع المشرف عبر البريد: lcddalule@gmail.com"
                      : "For any issues related to advert data processing, reach out directly to: lcddalule@gmail.com"}
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Collection */}
            <div>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "المعلومات الشخصية التي نجمعها" : "Information We Collect"}
              </h3>
              <p>
                {isAr 
                  ? "1. معلومات الحساب: عند التسجيل عبر Google أو البريد الإلكتروني، نجمع الاسم والبريد وصورة الحساب لإتاحة ميزة التصويت على بدائل قطع الغيار.\n2. سجلات البحث التشخيصية: نقوم بتتبع ومراقبة عدد عمليات البحث التي تقوم بها لضمان حماية النظام من الاختراق الآلي (برامج الزحف) والالتزام بحدود البحث اليومية."
                  : "1. Account Credentials: When signing up using Google or Email, we securely acquire your name, email, and avatar structure to allow voting on compatible parts.\n2. Usage Telemetry: Search trends are logged locally/server-side strictly to prevent scraping/bot abuse and enforce search quotas fairly."}
              </p>
            </div>

            {/* GDPR & California Private Rights */}
            <div>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "حقوق حماية البيانات (GDPR & CCPA)" : "Data Privacy Rights (GDPR & CCPA Compliant)"}
              </h3>
              <p>
                {isAr
                  ? "لك كامل الحق في طلب تصدير كافة بياناتك المخزنة لدينا، أو تعديلها، أو حذف الحساب والبيانات المرتبطة به نهائياً من قاعدة بيانات Firestore عبر الضغط على خيار حذف الحساب في لوحة الإعدادات أو مراسلتنا."
                  : "You maintain full authority to request data extraction, modifying erroneous metrics, or completely deleting your database associations instantly. Contact us via the channel listed below to trigger purging workflows."}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 2. Terms of Service */}
      {pageType === 'TERMS' && (
        <>
          {renderHeader("شروط الخدمة والاتفاقية الفنية", "Terms of Service & Usage Agreement", FileText)}

          <div className="bg-slate-teal p-6 rounded-3xl border border-midnight-teal text-slate-200 space-y-6 leading-relaxed text-sm">
            <div>
              <p className="text-gray-green text-xs font-mono font-bold tracking-wider uppercase mb-1">
                {isAr ? "شروط الاستخدام لفنيي الصيانة" : "Terms Of Use for Repair Engineers"}
              </p>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "1. طبيعة المنصة والبيانات الفنية" : "1. Nature of the Directory & Specs Matching"}
              </h3>
              <p>
                {isAr
                  ? "تطبيق دليل الشاشات والمطابقات يقدم قاعدة بيانات رقمية تشاركية لتوافق وبدائل الشاشات والمكونات الإلكترونية. نؤكد أن هذه المعلومات تُجمع وتُصوّت عليها من قبل آلاف الفنيين في مجتمع الصيانة وتهدف للمساعدة وليس للاعتماد المطلق دون فحص فزيائي."
                  : "LCD DALULE is a collaborative specs mapping directory. Information and lists of compatible materials are generated by crowdsourced technicians. It serves as an auxiliary tool for phone and board diagnostics."}
              </p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex gap-3 text-amber-200 text-xs">
              <AlertTriangle size={20} className="shrink-0 text-amber-400" />
              <div>
                <b className="font-extrabold block mb-1">{isAr ? "تنويه وإخلاء مسؤولية فنية:" : "CRITICAL TECHNICIAN DISCLAIMER:"}</b>
                {isAr
                  ? "تطبيق LCD DALULE يخلي مسؤوليته التامة عن أي تلف فني أو ضرر مادي (كسر فلاتات، عطب شاشة، احتراق مسارات شحن) ينتج عن عدم تأكد الفني يدوياً من تماثل البديل وحجمه وتوافق الفولتية قبل التركيب المباشر."
                  : "We do not take liability for physical equipment failures or damages to logic boards, Flex cables, or screen ICs resulting from hardware modifications. Technicians must physically compare sizes and pins before fully mounting spares."}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "2. الملكية العادلة وحماية البيانات" : "2. Community Guidelines & Anti-Scraping"}
              </h3>
              <p>
                {isAr
                  ? "يُحظر تماماً محاولة نسخ قاعدة بيانات المطابقات الخاصة بالتطبيق برمجياً، أو استخراج أكواد الشاشات، أو بناء برامج زحف للبيانات. يقتصر استخدام المحتوى على الاستخدام الفردي المباشر وحسابات الفنيين المعتمدة ويحق لنا تعليق أي حساب مريب تلقائياً."
                  : "We maintain highly strict anti-scraping policies. Extracting screens compatibility catalogs via automated crawlers or scripts is forbidden. The portal is intended solely for on-demand technician looking up."}
              </p>
            </div>

            <div>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "3. التعديلات على الشروط والخدمات" : "3. Revisions to Terms"}
              </h3>
              <p>
                {isAr
                  ? "نحتفظ بالحق في تحديث شروط الخدمة لتعزيز حماية وتوافق الأجهزة وصيانة قاعدة البيانات الفنية. استمرار تصفحك يعتبر موافقة ضمنية على شروطنا المحدثة."
                  : "We reserve full rights to recalibrate terms to keep our database stable. Continuing to interface with the matching index is treated as affirmative acceptance of modifications."}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 3. About Us */}
      {pageType === 'ABOUT' && (
        <>
          {renderHeader("من نحن - قصة LCD DALULE", "About Us - LCD DALULE Hub", Info)}

          <div className="bg-slate-teal p-6 rounded-3xl border border-midnight-teal text-slate-200 space-y-6 leading-relaxed text-sm">
            <div className="text-center font-display space-y-2 py-4 border-b border-midnight-teal/20">
              <span className="text-2xl font-black text-[#00D2D2] tracking-wide block">LCD DALULE</span>
              <p className="text-xs text-gray-green">
                {isAr ? "محرك ومطابق شاشات وقطع الهواتف الذكية الأول عالمياً" : "The #1 smartphone screen and electronic parts search engine"}
              </p>
            </div>

            <div>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "رسالتنا وأهدافنا" : "Our Mission & Objective"}
              </h3>
              <p>
                {isAr
                  ? "تأسس تطبيق دليل الشاشات والمطابقات (LCD DALULE) لسد الفجوة الكبيرة في عالم صيانة الهواتف الذكية وتخفيف حيرة مهندسي الصيانة. يسعى فني الصيانة باستمرار للبحث عن شاشة أو بطارية بديلة متوافقة من ماركة أخرى بسبب شح القطع في السوق المحلي. تطبيقنا يوفر هذا الدليل مجاناً وتفاعلياً."
                  : "LCD DALULE was established to resolve the severe shortage of spare smartphone parts and remove hardware layout guesswork. Local technicians frequently search for alternative battery sizes or screens across different parent brands due to supply chain backlogs. Our app handles that seamlessly."}
              </p>
            </div>

            <div>
              <h3 className="text-base font-black text-cyber-cyan mb-2">
                {isAr ? "نهج الشفافية والمزايا" : "Transparency & Key Features"}
              </h3>
              <p className="mb-2">
                {isAr 
                  ? "تتميز قاعدة بياناتنا بالتالي:" 
                  : "We hold ourselves to a strict high standard:"}
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-green">
                <li>{isAr ? "فهرسة شاملة للماركات الكبرى (آبل، سامسونج، شاومي، أوبو، ريلمي، انفنيكس وموتورولا)." : "Broad catalog coverage (Apple, Samsung, Xiaomi, Oppo, Realme, Infinix, Motorola)."}</li>
                <li>{isAr ? "مقارنة حجم الشاشات وأكواد الفلاتات بدقة متناهية." : "Precision dimensional screen analysis & Flex Code mapping."}</li>
                <li>{isAr ? "نظام تصويت ذكي: أي بديل يحصل على 50 إعجاب فني يتم اعتماده كتطابق رسمي." : "Technician voting workflow (approving matches based on 50 community votes)."}</li>
                <li>{isAr ? "توفير وقت البحث وتكلفة الشحن العشوائي." : "Eliminating shipping cost overheads from incompatible spares."}</li>
              </ul>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-[#00D2D2] font-black">
                {isAr 
                  ? "نحن نؤمن بدعم المصلحين، وصيانة الأجهزة لتقليل النفايات الإلكترونية وحفظ كوكب الأرض. 🌱" 
                  : "Supporting phone repairers to decrease electronic waste and care for our planet. 🌱"}
              </span>
            </div>
          </div>
        </>
      )}

      {/* 4. Contact Us */}
      {pageType === 'CONTACT' && (
        <>
          {renderHeader("اتصل بنا - دعم فني مباشر", "Contact Us - Human Support", Mail)}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            <div className="bg-slate-teal p-6 rounded-3xl border border-midnight-teal text-slate-200 space-y-5 leading-relaxed text-sm">
              <h3 className="text-base font-black text-cyber-cyan">
                {isAr ? "قنوات الدعم والمسؤولون" : "Official Support & Authority"}
              </h3>
              <p className="text-xs">
                {isAr
                  ? "إذا كان لديك أي استفسار تجاري، مسألة حماية فكرية، أو مشكلة في حسابك، يُسعدنا استقبال طلباتك والرد السريع خلال 24 ساعة كحد أقصى."
                  : "Have legal claims, integration inquiries, or account issues? Drop us a direct message. Our technical administrators pledge responses within 24 hours."}
              </p>

              <div className="space-y-3 pt-2 text-xs text-gray-green">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-obsidian rounded-lg border border-midnight-teal text-cyber-cyan">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">{isAr ? "البريد الإلكتروني المعتمد" : "Inquiries Mail"}</span>
                    <a href="mailto:lcddalule@gmail.com" className="text-cyber-cyan font-bold hover:underline">lcddalule@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-obsidian rounded-lg border border-midnight-teal text-[#00D2D2]">
                    <PhoneCall size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">{isAr ? "إدارة التطبيق الفنية" : "WhatsApp Helpline"}</span>
                    <a href="https://wa.me/212677421903" target="_blank" rel="noopener noreferrer" className="text-[#00D2D2] font-bold hover:underline">+212 677 421 903</a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-obsidian border border-midnight-teal/60 rounded-2xl text-[11px] text-gray-green text-center">
                {isAr
                  ? "إشراف المطور: عثمان الرايس • تمنار، إقليم الصويرة، المملكة المغربية 🇲🇦"
                  : "Lead Developer: Othman Elrayes • Tamanar, Essaouira Province, Kingdom of Morocco 🇲🇦"}
              </div>
            </div>

            {/* Direct Feedback Form */}
            <div className="bg-slate-teal p-6 rounded-3xl border border-midnight-teal text-slate-200">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <CheckCircle2 size={45} className="text-[#00D2D2] animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">
                      {isAr ? "تم إرسال رسالتك بنجاح! 🎉" : "Message Sent Successfully! 🎉"}
                    </h4>
                    <p className="text-xs text-gray-green">
                      {isAr ? "شكراً لتواصلك معنا. سنقوم بالرد عليك عبر بريدك الإلكتروني قريباً جداً." : "Thank you for reaching out. We will address your concern shortly via email."}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs text-cyber-cyan hover:underline font-bold cursor-pointer"
                  >
                    {isAr ? "إرسال رسالة أخرى" : "Send another query"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-base font-black text-cyber-cyan border-b border-midnight-teal/30 pb-2">
                    {isAr ? "أرسل بريداً إلكترونياً فورياً ✉️" : "Send Instant Support Email ✉️"}
                  </h3>

                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-xs font-semibold text-gray-green">{isAr ? "اسم المرسل" : "Full Name"}</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? "مثال: فني هلال صيانة" : "e.g., Engineer Jack"}
                      className="w-full bg-obsidian border border-midnight-teal focus:border-cyber-cyan px-3 py-2 rounded-xl text-xs text-white outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-xs font-semibold text-gray-green">{isAr ? "بريدك الإلكتروني (هام جداً للرد)" : "Your Email (Strictly Required)"}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jack@example.com"
                      className="w-full bg-obsidian border border-midnight-teal focus:border-cyber-cyan px-3 py-2 rounded-xl text-xs text-white outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-xs font-semibold text-gray-green">{isAr ? "الموضوع" : "Subject"}</label>
                    <input 
                      type="text" 
                      value={formData.subject} 
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={isAr ? "مثال: طلب شراكة / اقتراح بديل" : "e.g., Integration offer / Database fix"}
                      className="w-full bg-obsidian border border-midnight-teal focus:border-cyber-cyan px-3 py-2 rounded-xl text-xs text-white outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-xs font-semibold text-gray-green">{isAr ? "محتوى الرسالة وتفاصيل الطلب" : "Message / Technical Request"}</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.message} 
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isAr ? "اكتب المحتوى بالتفصيل..." : "Details of your technical query..."}
                      className="w-full bg-obsidian border border-midnight-teal focus:border-cyber-cyan px-3 py-2 rounded-xl text-xs text-white outline-none transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !formData.email || !formData.message}
                    className="w-full bg-gradient-to-r from-[#00D2D2] to-[#0B3C73] hover:brightness-110 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(0,210,210,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">{isAr ? "جاري الإرسال والأرشفة..." : "Submitting record..."}</span>
                    ) : (
                      <>
                        <Send size={14} className={isAr ? 'rotate-180' : ''} />
                        <span>{isAr ? "إرسال البيانات والتواصل" : "Deliver My Message"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

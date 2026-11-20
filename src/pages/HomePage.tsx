import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  ArrowLeft,
  ArrowUpLeft,
  Smartphone,
  CreditCard,
  QrCode,
  Music,
  ShoppingBag,
  Coffee,
  Instagram,
  MessageCircle,
  Globe,
  MapPin,
  Sparkles,
  Star,
  Calendar,
  Layers,
  Utensils,
  Camera,
  Briefcase,
  User,
  Share2,
  CheckCircle2,
  X,
  Menu,
} from 'lucide-react';
import { navigate } from '../router';

export const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    brand: '',
    phone: '',
    field: '',
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitted(true);
    // WhatsApp direct fallback
    const msg = encodeURIComponent(
      `مرحباً TAPP! حابب أطلب كارت لبراندي:\n- الاسم: ${orderForm.name}\n- البراند: ${orderForm.brand}\n- الموبايل: ${orderForm.phone}\n- النشاط: ${orderForm.field}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/+201205288295?text=${msg}`, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FAFAF8] text-[#121211] relative flex flex-col justify-between selection:bg-[#121211] selection:text-[#FAFAF8] font-arabic antialiased"
    >
      {/* ─── 1. TOP NAVIGATION ─── */}
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E8E8E4]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-right cursor-pointer flex items-center gap-2.5"
            >
              <span
                dir="ltr"
                className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#121211]"
              >
                TAPP
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono-custom font-semibold tracking-wider text-[#706E6B] uppercase bg-[#EFEFEA] px-2.5 py-1 rounded-md border border-[#E2E2DC]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#121211]" />
                <span>NFC + SMART PAGES</span>
              </span>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#706E6B] font-medium">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#121211] transition-colors cursor-pointer"
            >
              الرئيسية
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-[#121211] transition-colors cursor-pointer"
            >
              كيف تعمل؟
            </button>
            <button
              onClick={() => scrollTo('examples')}
              className="hover:text-[#121211] transition-colors cursor-pointer"
            >
              الأمثلة
            </button>
            <button
              onClick={() => scrollTo('smart-page')}
              className="hover:text-[#121211] transition-colors cursor-pointer"
            >
              الصفحة الذكية
            </button>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-5 py-2.5 bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>ابدأ TAPP</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#121211] hover:bg-[#EFEFEA] rounded-lg transition-colors cursor-pointer"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#E8E8E4] bg-[#FAFAF8] px-6 py-4 flex flex-col gap-3 shadow-lg"
            >
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 text-sm font-semibold text-[#121211] border-b border-[#F0F0EB]"
              >
                الرئيسية
              </button>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="text-right py-2 text-sm font-semibold text-[#121211] border-b border-[#F0F0EB]"
              >
                كيف تعمل؟
              </button>
              <button
                onClick={() => scrollTo('examples')}
                className="text-right py-2 text-sm font-semibold text-[#121211] border-b border-[#F0F0EB]"
              >
                الأمثلة
              </button>
              <button
                onClick={() => scrollTo('smart-page')}
                className="text-right py-2 text-sm font-semibold text-[#121211] border-b border-[#F0F0EB]"
              >
                الصفحة الذكية
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOrderModalOpen(true);
                }}
                className="w-full mt-2 py-3 bg-[#121211] text-white text-center text-sm font-bold rounded-xl"
              >
                ابدأ TAPP الآن
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 2. HERO SECTION ─── */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Right Column: Hero Content */}
          <div className="lg:col-span-6 text-center lg:text-right">
            {/* Egyptian Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEFEA] border border-[#E2E2DC] text-xs font-semibold text-[#121211] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#121211] animate-pulse" />
              <span>كارت أعمال ذكي بتقنية NFC + QR</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#121211] tracking-tight leading-[1.2] lg:leading-[1.18]"
            >
              كارت واحد.
              <br />
              <span className="text-[#121211]">
                كل تفاصيل براندك في <span className="font-display underline decoration-[#C5A880] decoration-4 underline-offset-8">Tap</span> واحدة.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-[#555552] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
            >
              كارت ذكي بـ NFC وQR يوصّل عملاءك مباشرة بصفحة براندك — كل روابطك، خدماتك وتفاصيلك في مكان واحد.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5"
            >
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>ابدأ TAPP</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo('examples')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#F2F2ED] text-[#121211] border border-[#DFDFD8] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                شوف الأمثلة
              </button>
            </motion.div>

            {/* Trust Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-[#706E6B]"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#121211]" />
                <span>بدون أي تطبيق</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DFDFD8]" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#121211]" />
                <span>شغال على جميع الهواتف</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DFDFD8]" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#121211]" />
                <span>تحديث فوري للبيانات</span>
              </span>
            </motion.div>
          </div>

          {/* Left Column: Realistic Physical Card + Phone Screen Integration */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Visual Pathway Breadcrumb */}
            <div className="w-full max-w-md flex items-center justify-between pb-3 mb-4 text-[11px] font-mono-custom text-[#706E6B] border-b border-[#E8E8E4]">
              <span className="font-semibold tracking-wider">TAPP CARD</span>
              <span className="text-[#121211] font-bold">↓ TAP / SCAN</span>
              <span className="font-semibold tracking-wider">SMART PAGE</span>
            </div>

            {/* Realistic Physical + Digital Composition */}
            <div className="w-full max-w-md relative flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-4">
              {/* 1. TAPP Physical Card (Realistic Matte Obsidian Card) */}
              <div
                dir="ltr"
                className="w-full sm:w-56 aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-[#1C1C1A] via-[#121211] to-[#0A0A09] p-5 text-white shadow-xl border border-[#2B2B28] flex flex-col justify-between relative overflow-hidden select-none"
              >
                {/* Subtle matte sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />

                {/* Card Top: Wordmark & NFC Contactless Wave */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-display text-2xl font-black tracking-wider text-[#FAFAF8]">
                    TAPP
                  </span>
                  <div className="flex items-center gap-1 text-[#C5A880]">
                    <Radio className="w-4 h-4 text-[#C5A880]" />
                    <span className="text-[9px] font-mono-custom font-bold tracking-widest">NFC</span>
                  </div>
                </div>

                {/* Card Center: Typographic Deboss (No chip - clean, real contactless card) */}
                <div className="my-auto relative z-10">
                  <span className="text-[10px] font-mono-custom tracking-[0.25em] text-[#C5A880] uppercase block font-bold">
                    TAP TO CONNECT
                  </span>
                  <span className="text-[8px] font-mono-custom text-[#8C8A84] tracking-wider block mt-0.5">
                    SMART BUSINESS CARD
                  </span>
                </div>

                {/* Card Bottom: Minimal QR + Spec Stamp */}
                <div className="flex items-end justify-between relative z-10 border-t border-white/10 pt-2.5 text-[8px] font-mono-custom text-[#8C8A84]">
                  <div>
                    <span className="block text-white/90 font-medium">MATTE OBSIDIAN</span>
                    <span>NFC + DYNAMIC QR</span>
                  </div>
                  <div className="w-7 h-7 bg-white p-1 rounded-sm flex items-center justify-center shadow-xs">
                    <QrCode className="w-full h-full text-[#121211]" />
                  </div>
                </div>
              </div>

              {/* Connecting Wave Indicator */}
              <div className="flex sm:flex-col items-center justify-center gap-1.5 text-[#121211] text-xs font-mono-custom shrink-0 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#121211] animate-ping" />
                <span className="text-[10px] font-bold tracking-widest uppercase">TAP</span>
              </div>

              {/* 2. Smartphone Screen displaying Demo Smart Page */}
              <div className="w-56 sm:w-52 shrink-0 select-none">
                <div className="rounded-[28px] bg-[#141413] p-2 border-[2.5px] border-[#2A2A28] shadow-2xl">
                  {/* Phone screen */}
                  <div
                    dir="ltr"
                    className="rounded-[22px] bg-[#090909] text-[#F2F0EB] p-3 overflow-hidden flex flex-col justify-between border border-[#222220]"
                  >
                    {/* Status Bar */}
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/5 text-[8px] font-mono-custom text-[#777772]">
                      <span>9:41</span>
                      <div className="w-12 h-2.5 bg-black rounded-full border border-white/10 flex items-center justify-center">
                        <span className="text-[6px] text-[#C5A880] font-bold">TAPP</span>
                      </div>
                      <span>5G</span>
                    </div>

                    {/* Mini Profile Header */}
                    <div className="flex flex-col items-center text-center py-1">
                      <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#2C2C2A] flex items-center justify-center text-xs font-black text-[#C5A880] mb-1">
                        A
                      </div>
                      <span className="font-display text-xs font-extrabold text-white tracking-wider">
                        ATLAS
                      </span>
                      <span className="text-[7px] font-mono-custom text-[#C5A880] tracking-[0.18em] uppercase">
                        RAPPER • PRODUCER
                      </span>
                    </div>

                    {/* Smart Page Links Preview */}
                    <div className="space-y-1 my-2">
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-[#161616] border border-[#262624] text-[8px] font-mono-custom">
                        <span className="text-white truncate">NEW TRACK // حرب</span>
                        <span className="text-[#C5A880] font-bold">PLAY</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-[#161616] border border-[#262624] text-[8px] font-mono-custom">
                        <span className="text-[#999994] truncate">SPOTIFY & APPLE</span>
                        <span className="text-white/50">→</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-[#161616] border border-[#262624] text-[8px] font-mono-custom">
                        <span className="text-[#999994] truncate">INSTAGRAM & BOOKING</span>
                        <span className="text-white/50">→</span>
                      </div>
                    </div>

                    {/* Direct Button */}
                    <button
                      onClick={() => navigate('/atlas')}
                      className="w-full py-1.5 bg-[#C5A880] hover:bg-[#D4AF37] text-[#090909] text-[9px] font-mono-custom font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>تجربة الصفحة</span>
                      <ArrowLeft className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. WHAT IS TAPP? (إيه هي TAPP؟) ─── */}
      <section className="w-full border-t border-[#E8E8E4] bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl text-center sm:text-right mb-12">
            <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-1">
              المنتج والفكرة
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              إيه هي TAPP؟
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#555552] leading-relaxed">
              TAPP هي طريقة أذكى تخلي عملاءك يوصلوا لكل تفاصيل براندك من مكان واحد.
            </p>
          </div>

          {/* Core Concept: Physical to Digital Bridge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NFC Card */}
            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211] mb-5 shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#121211] mb-2">
                  كارت NFC فيزيائي
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  كارت أعمال ملموس وفخم مطبوع باسم وهوية براندك. بمجرد ما يقرب من أي موبايل، الصفحة بتفتح فوراً.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#EBEBE6] text-xs font-semibold text-[#706E6B]">
                بدون كتابة أرقام أو تبادل ورق
              </div>
            </div>

            {/* QR Code */}
            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211] mb-5 shadow-xs">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#121211] mb-2">
                  QR Code ذكي وديناميكي
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  مطبوع بالليزر على الكارت ليعمل مع أي كاميرا هاتف في ثانية واحدة، بدون الحاجة لأي تطبيق إضافي.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#EBEBE6] text-xs font-semibold text-[#706E6B]">
                متوافق 100% مع جميع الهواتف
              </div>
            </div>

            {/* Smart Brand Page */}
            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211] mb-5 shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#121211] mb-2">
                  Smart Brand Page
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  صفحة رقمية سريعة جداً تجمع كل قنواتك: منيو، لوكيشن، انستجرام، واتساب، وحجز مباشر بهوية بصرية كاملة.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#EBEBE6] text-xs font-semibold text-[#706E6B]">
                تعديل وتحديث الروابط في أي وقت
              </div>
            </div>
          </div>

          {/* Key Differentiator Callout */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-[#121211] text-[#FAFAF8] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center sm:text-right">
              <span className="text-xs font-mono-custom uppercase tracking-wider text-[#C5A880] block mb-1">
                TAPP ≠ Just another link in bio
              </span>
              <h4 className="text-lg sm:text-xl font-bold mb-1.5">
                TAPP بتربط بين العالم الفيزيائي والحضور الرقمي
              </h4>
              <p className="text-xs sm:text-sm text-[#A8A7A3] leading-relaxed">
                مش مجرد قائمة روابط عادية على الإنترنت؛ ده كارت في إيدك بتسيبه مع العميل، تحطه على طاولة الكافيه، أو تشاركه في معارض ومؤتمرات.
              </p>
            </div>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="px-5 py-3 bg-[#FAFAF8] hover:bg-white text-[#121211] text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
            >
              طريقة العمل بالتفصيل
            </button>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS (ببساطة. Tap. Scan. Connect.) ─── */}
      <section
        id="how-it-works"
        className="w-full border-t border-[#E8E8E4] bg-[#FAFAF8] py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center sm:text-right max-w-xl mb-12">
            <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-1">
              3 خطوات سهلة
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              ببساطة. Tap. Scan. Connect.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#555552]">
              تجربة سريعة بدون أي خطوات معقدة أو تطبيقات مطلوبة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01: TAP */}
            <div className="p-7 rounded-2xl bg-white border border-[#E8E8E4] flex flex-col justify-between shadow-2xs">
              <div>
                <span
                  dir="ltr"
                  className="font-mono-custom text-xs font-bold text-[#121211] tracking-widest block mb-4 text-right"
                >
                  01 — TAP
                </span>
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E8E8E4] flex items-center justify-center text-[#121211] mb-4">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#121211] mb-2">
                  قرّب موبايلك من كارت TAPP.
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  لمسة واحدة من ظهر أي هاتف ذكي على الكارت تشغل الإشارة فوراً عبر شريحة الـ NFC المدمجة.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#F0F0EB] text-xs text-[#706E6B]">
                استجابة فورية في أقل من ثانية
              </div>
            </div>

            {/* Step 02: SCAN */}
            <div className="p-7 rounded-2xl bg-white border border-[#E8E8E4] flex flex-col justify-between shadow-2xs">
              <div>
                <span
                  dir="ltr"
                  className="font-mono-custom text-xs font-bold text-[#121211] tracking-widest block mb-4 text-right"
                >
                  02 — SCAN
                </span>
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E8E8E4] flex items-center justify-center text-[#121211] mb-4">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#121211] mb-2">
                  أو امسح الـQR Code.
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  افتح كاميرا الموبايل العادية ووجهها نحو الكود المطبوع على الكارت لفتح الصفحة مباشرة.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#F0F0EB] text-xs text-[#706E6B]">
                حل بديل متاح دائماً
              </div>
            </div>

            {/* Step 03: CONNECT */}
            <div className="p-7 rounded-2xl bg-white border border-[#E8E8E4] flex flex-col justify-between shadow-2xs">
              <div>
                <span
                  dir="ltr"
                  className="font-mono-custom text-xs font-bold text-[#121211] tracking-widest block mb-4 text-right"
                >
                  03 — CONNECT
                </span>
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E8E8E4] flex items-center justify-center text-[#121211] mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#121211] mb-2">
                  افتح صفحة البراند ووصل لكل حاجة.
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  تظهر صفحة براندك المصممة بالكامل: حفظ جهة الاتصال، متابعة انستجرام، طلب عبر واتساب، أو حجز ميعاد.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#F0F0EB] text-xs text-[#706E6B]">
                عميلك متصل ببراندك بنقرة واحدة
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. SMART BRAND PAGE SECTION (صفحة واحدة لبراندك. كل حاجة فيها.) ─── */}
      <section
        id="smart-page"
        className="w-full border-t border-[#E8E8E4] bg-white py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl text-center sm:text-right mb-12">
            <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-1">
              الهوية الرقمية
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              صفحة واحدة لبراندك. كل حاجة فيها.
            </h2>
            <p className="mt-3 text-base text-[#555552] leading-relaxed">
              كل عميل لـ TAPP بيحصل على Smart Brand Page مخصصة بالكامل لما يناسب مجاله ونشاطه التجاري — مش مجرد فورمة ثابتة ومكررة للجميع.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4]">
              <span className="text-xs font-bold text-[#121211] uppercase tracking-wider block mb-1">
                تخصيص الهوية البصرية
              </span>
              <h3 className="text-xl font-bold text-[#121211] mb-2">
                تصميم يعكس روح ومزاج براندك
              </h3>
              <p className="text-sm text-[#555552] leading-relaxed mb-4">
                لو أنت فنان موسيقي، صفحتك هتحسها دارك وسينمائية. لو أنت براند فخار أو كافيه، صفحتك هتكون دافئة وأنيقة. الـ Smart Page بتتفصل على هوية نشاطك.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-[#706E6B]">
                <span className="px-2.5 py-1 bg-white border border-[#DFDFD8] rounded-md">ألوان وهوية مخصصة</span>
                <span className="px-2.5 py-1 bg-white border border-[#DFDFD8] rounded-md">لوجو وبروفايل احترافي</span>
                <span className="px-2.5 py-1 bg-white border border-[#DFDFD8] rounded-md">خطوط متناسقة</span>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4]">
              <span className="text-xs font-bold text-[#121211] uppercase tracking-wider block mb-1">
                مرونة المحتوى
              </span>
              <h3 className="text-xl font-bold text-[#121211] mb-2">
                روابط وخدمات متجددة بدون إعادة طباعة
              </h3>
              <p className="text-sm text-[#555552] leading-relaxed mb-4">
                غيرت رقم الواتساب؟ ضفت فرع جديد؟ نزلت منيو أو أغنية جديدة؟ عدل صفحتك الرقمية في أي ثانية، والكارت الملموس في جيب العميل هيفضل شغال بنفس الكفاءة.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-[#706E6B]">
                <span className="px-2.5 py-1 bg-white border border-[#DFDFD8] rounded-md">توفير تكاليف الطباعة</span>
                <span className="px-2.5 py-1 bg-white border border-[#DFDFD8] rounded-md">بيانات محدثة دايماً</span>
                <span className="px-2.5 py-1 bg-white border border-[#DFDFD8] rounded-md">حفظ جهة الاتصال بضغطة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SHOW THE TWO CURRENT EXAMPLES (ATLAS & SOVI ONLY) ─── */}
      <section
        id="examples"
        className="w-full border-t border-[#E8E8E4] bg-[#FAFAF8] py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-3">
            <div>
              <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-1">
                أمثلة حقيقية
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
                شوف TAPP مع براندات مختلفة
              </h2>
              <p className="mt-2 text-base text-[#555552]">
                كل براند له شخصيته. وTAPP بتتظبط عليه.
              </p>
            </div>
            <div className="text-xs text-[#706E6B] font-medium">
              اضغط على أي براند لتجربة صفحته الفعلية
            </div>
          </div>

          {/* THREE EXAMPLES: ATLAS, SOVI & BY MARCOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {/* EXAMPLE 1: ATLAS */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate('/atlas')}
              className="group cursor-pointer rounded-2xl bg-[#0A0A09] border border-[#222220] p-7 text-[#F2F0EB] flex flex-col justify-between shadow-md relative overflow-hidden"
            >
              <div
                dir="ltr"
                className="absolute top-0 right-0 p-5 text-[10px] font-mono-custom text-[#777772]"
              >
                /atlas
              </div>

              <div>
                <div className="w-12 h-12 rounded-full bg-[#181816] border border-[#2C2C28] flex items-center justify-center text-white mb-6">
                  <Music className="w-5 h-5 text-[#C5A880]" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#C5A880] tracking-wider uppercase">
                    Artist / Music Producer
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#333330]" />
                  <span className="text-[11px] text-[#888882]">فنان موسيقي</span>
                </div>

                <h3
                  dir="ltr"
                  className="font-display text-3xl font-black text-white group-hover:text-[#C5A880] transition-colors"
                >
                  ATLAS
                </h3>
                <p className="text-xs font-mono-custom text-[#777772] mt-0.5">
                  RAPPER • PRODUCER
                </p>

                <p className="mt-4 text-xs sm:text-sm text-[#A0A09A] leading-relaxed">
                  هوية بصرية سينمائية داكنة لعالم الموسيقى والإنتاج، بتعرض سنجل «حرب» مع إمكانية السماع الفوري، وروابط Spotify وApple Music وBooking الحفلات.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-mono-custom text-[#777772]">
                  <span className="px-2 py-1 rounded bg-[#141412] border border-[#222220]">AUDIO PLAYER</span>
                  <span className="px-2 py-1 rounded bg-[#141412] border border-[#222220]">SPOTIFY</span>
                  <span className="px-2 py-1 rounded bg-[#141412] border border-[#222220]">DIRECT BOOKING</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1C1C1A] flex items-center justify-between text-xs font-bold text-white group-hover:text-[#C5A880]">
                <span>شوف صفحة ATLAS</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </motion.div>

            {/* EXAMPLE 2: SOVI */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate('/sovi')}
              className="group cursor-pointer rounded-2xl bg-[#121110] border border-[#2B2724] p-7 text-[#F4F0EA] flex flex-col justify-between shadow-md relative overflow-hidden"
            >
              <div
                dir="ltr"
                className="absolute top-0 right-0 p-5 text-[10px] font-mono-custom text-[#9E968F]"
              >
                /sovi
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1C1A17] border border-[#332E29] flex items-center justify-center text-[#C88D6F] mb-6">
                  <ShoppingBag className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#C88D6F] tracking-wider uppercase">
                    Handmade Brand
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#38332E]" />
                  <span className="text-[11px] text-[#9E968F]">فخار يدوي راقي</span>
                </div>

                <h3
                  dir="ltr"
                  className="font-serif-custom text-4xl font-normal text-[#F4F0EA] tracking-wide group-hover:text-[#C88D6F] transition-colors"
                >
                  SOVI
                </h3>
                <p className="text-xs font-mono-custom text-[#9E968F] mt-0.5">
                  CERAMICS & OBJECTS
                </p>

                <p className="mt-4 text-xs sm:text-sm text-[#B8B0A8] leading-relaxed">
                  هوية دافئة من درجات الفخار والطين اليدوي والخطوط السيريف الكلاسيكية، مع حجز القطع المعمارية المحدودة ومواعيد المعارض والاستوديو.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-mono-custom text-[#9E968F]">
                  <span className="px-2 py-1 rounded bg-[#181614] border border-[#2B2724]">HANDMADE CATALOG</span>
                  <span className="px-2 py-1 rounded bg-[#181614] border border-[#2B2724]">STUDIO LOCATIONS</span>
                  <span className="px-2 py-1 rounded bg-[#181614] border border-[#2B2724]">COMMISSIONS</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#22201D] flex items-center justify-between text-xs font-bold text-[#C88D6F] group-hover:text-white">
                <span>شوف صفحة SOVI</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </motion.div>

            {/* EXAMPLE 3: BY MARCOS */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate('/bymarcos')}
              className="group cursor-pointer rounded-2xl bg-[#0B0B0D] border border-[#26262C] p-7 text-[#F2F0EC] flex flex-col justify-between shadow-md relative overflow-hidden md:col-span-2 lg:col-span-1"
            >
              <div
                dir="ltr"
                className="absolute top-0 right-0 p-5 text-[10px] font-mono-custom text-[#8E8C88]"
              >
                /bymarcos
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl bg-[#151519] border border-[#8B1E24]/50 flex items-center justify-center text-[#B42A32] mb-6">
                  <Camera className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#B42A32] tracking-wider uppercase">
                    Photography & Direction
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#33333A]" />
                  <span className="text-[11px] text-[#9A9893]">تصوير وإخراج بصري</span>
                </div>

                <h3
                  dir="ltr"
                  className="font-serif-custom text-3xl sm:text-4xl font-semibold text-[#F5F4F0] tracking-tight group-hover:text-[#D1434B] transition-colors"
                >
                  BY MARCOS
                </h3>
                <p
                  dir="ltr"
                  className="text-xs font-mono-custom text-[#8E8C88] mt-0.5 text-right"
                >
                  THE RED FRAME COLLECTIVE
                </p>

                <p className="mt-4 text-xs sm:text-sm text-[#A3A19D] leading-relaxed">
                  بوابة هوية رقمية أنيقة بلغة التحرير الفوتوغرافي بالأسود والأحمر القاتم، ثنائية اللغة (عربي / إنجليزي) مع حجز واتساب وعنوان المكتب.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-mono-custom text-[#8E8C88]">
                  <span className="px-2 py-1 rounded bg-[#141418] border border-[#26262C]">EDITORIAL IDENTITY</span>
                  <span className="px-2 py-1 rounded bg-[#141418] border border-[#26262C]">AR / EN</span>
                  <span className="px-2 py-1 rounded bg-[#141418] border border-[#26262C]">WHATSAPP BOOKING</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1E1E24] flex items-center justify-between text-xs font-bold text-[#F5F4F0] group-hover:text-[#D1434B]">
                <span>شوف صفحة BY MARCOS</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 7. EVERYTHING IN ONE PLACE (كل حاجة في مكان واحد.) ─── */}
      <section className="w-full border-t border-[#E8E8E4] bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center sm:text-right">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-1">
              جميع القنوات
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              كل حاجة في مكان واحد.
            </h2>
            <p className="mt-3 text-base text-[#555552] leading-relaxed">
              بدل ما عميلك يدور على كل لينك، TAPP تجمعهم في صفحة واحدة.
            </p>
          </div>

          {/* Clean Interactive Channels Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {[
              { name: 'Instagram', ar: 'انستجرام براندك', icon: <Instagram className="w-4 h-4" /> },
              { name: 'WhatsApp', ar: 'محادثة وطلب سريع', icon: <MessageCircle className="w-4 h-4" /> },
              { name: 'TikTok', ar: 'فيديوهات وتيك توك', icon: <Sparkles className="w-4 h-4" /> },
              { name: 'Website', ar: 'الموقع أو المتجر', icon: <Globe className="w-4 h-4" /> },
              { name: 'Menu', ar: 'قائمة ومنيو الطعام', icon: <Utensils className="w-4 h-4" /> },
              { name: 'Google Maps', ar: 'موقع الفروع واللوكيشن', icon: <MapPin className="w-4 h-4" /> },
              { name: 'Google Reviews', ar: 'تقييمات وآراء العملاء', icon: <Star className="w-4 h-4" /> },
              { name: 'Booking', ar: 'حجز المواعيد', icon: <Calendar className="w-4 h-4" /> },
              { name: 'Spotify & Music', ar: 'الموسيقى والبودكاست', icon: <Music className="w-4 h-4" /> },
              { name: 'Portfolio', ar: 'معرض الأعمال والمشاريع', icon: <Layers className="w-4 h-4" /> },
              { name: 'Contact Card', ar: 'حفظ الرقم في الموبايل', icon: <User className="w-4 h-4" /> },
              { name: 'Direct Share', ar: 'مشاركة الكارت مع غيرك', icon: <Share2 className="w-4 h-4" /> },
            ].map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] hover:border-[#121211] transition-colors flex items-center gap-3 text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#121211] block">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-[#706E6B] block">
                    {item.ar}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. WHO IS TAPP FOR? (مين يقدر يستخدم TAPP؟) ─── */}
      <section
        id="who-for"
        className="w-full border-t border-[#E8E8E4] bg-[#FAFAF8] py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center sm:text-right max-w-xl mb-12">
            <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-1">
              الأنشطة والمجالات
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              مين يقدر يستخدم TAPP؟
            </h2>
            <p className="mt-2 text-base text-[#555552]">
              صممنا TAPP ليناسب المحلات، الأنشطة التجارية، والمبدعين في السوق المصري.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: 'كافيهات ومطاعم', en: 'Cafés & Restaurants', icon: <Coffee className="w-4 h-4" /> },
              { title: 'محلات ومتاجر', en: 'Stores & Boutiques', icon: <ShoppingBag className="w-4 h-4" /> },
              { title: 'فنانين وموسيقيين', en: 'Artists & Musicians', icon: <Music className="w-4 h-4" /> },
              { title: 'صناع محتوى', en: 'Creators & Influencers', icon: <Sparkles className="w-4 h-4" /> },
              { title: 'مصورين واستوديوهات', en: 'Photographers', icon: <Camera className="w-4 h-4" /> },
              { title: 'مستقلين ومستشارين', en: 'Freelancers & Consultants', icon: <Briefcase className="w-4 h-4" /> },
              { title: 'أصحاب مشاريع', en: 'Small Businesses', icon: <Layers className="w-4 h-4" /> },
              { title: 'براندات شخصية', en: 'Personal Brands', icon: <User className="w-4 h-4" /> },
            ].map((cat) => (
              <div
                key={cat.title}
                className="p-5 rounded-xl bg-white border border-[#E8E8E4] hover:border-[#121211] transition-colors shadow-2xs flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E8E8E4] flex items-center justify-center text-[#121211] mb-3">
                  {cat.icon}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#121211] block mb-0.5">
                    {cat.title}
                  </span>
                  <span className="text-[10px] font-mono-custom text-[#706E6B] block">
                    {cat.en}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. FINAL CTA (خلّي براندك Tap واحدة بعيد.) ─── */}
      <section className="w-full border-t border-[#E8E8E4] bg-white py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-2">
            جاهز تنقل براندك لمستوى أذكى؟
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121211] tracking-tight">
            خلّي براندك Tap واحدة بعيد.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#555552] max-w-md mx-auto">
            كارت واحد. حضور رقمي أذكى.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full sm:w-auto px-9 py-4 bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] text-base font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ابدأ TAPP</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/+201205288295"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 bg-[#FAFAF8] hover:bg-[#EFEFEA] text-[#121211] border border-[#DFDFD8] text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>تواصل معنا على WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 10. FOOTER ─── */}
      <footer className="w-full border-t border-[#E8E8E4] bg-[#FAFAF8] pt-14 pb-10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center">
          {/* TAPP logo / wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer inline-block"
            aria-label="TAPP Home"
          >
            <span
              dir="ltr"
              className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#121211]"
            >
              TAPP
            </span>
          </button>

          {/* Short line */}
          <p className="mt-2 text-sm text-[#706E6B] font-medium">
            كل تفاصيل براندك في Tap واحدة.
          </p>

          {/* Social / Contact Icons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1C31kMehSm/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#DFDFD8] hover:border-[#121211] hover:bg-[#121211] text-[#121211] hover:text-white transition-all flex items-center justify-center shadow-2xs"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/its.1m1?stkn=MTkyb2dqcG5lbTEybw%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#DFDFD8] hover:border-[#121211] hover:bg-[#121211] text-[#121211] hover:text-white transition-all flex items-center justify-center shadow-2xs"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/+201205288295"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#DFDFD8] hover:border-[#121211] hover:bg-[#121211] text-[#121211] hover:text-white transition-all flex items-center justify-center shadow-2xs"
              aria-label="WhatsApp"
              title="تواصل معنا على WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>

          {/* Founder / Designer Credit at absolute bottom */}
          <div className="mt-12 pt-6 border-t border-[#E8E8E4]/80 w-full flex items-center justify-center">
            <span
              dir="ltr"
              className="text-[11px] font-mono-custom tracking-[0.18em] text-[#9E9B95] select-none"
            >
              By : Marwan M. Hammad
            </span>
          </div>
        </div>
      </footer>

      {/* ─── ORDER / INQUIRY MODAL (ابدأ TAPP) ─── */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E8E4] text-right"
            >
              <button
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setOrderSubmitted(false);
                }}
                className="absolute top-5 left-5 p-1.5 rounded-full hover:bg-[#FAFAF8] text-[#706E6B] hover:text-[#121211] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-semibold text-[#706E6B] uppercase tracking-wider block mb-1">
                  طلب وتجهيز الكارت
                </span>
                <h3 className="text-2xl font-black text-[#121211]">
                  ابدأ كارت TAPP لبراندك
                </h3>
                <p className="mt-1 text-sm text-[#555552]">
                  املأ بياناتك أو تواصل معنا مباشرة عبر WhatsApp لتجهيز كارتك وصفحتك.
                </p>
              </div>

              {orderSubmitted ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#121211] mb-2">
                    تم استلام طلبك بنجاح!
                  </h4>
                  <p className="text-sm text-[#555552] mb-6">
                    سيتم فتح محادثة WhatsApp الآن لمتابعة تفاصيل التصميم والكارت معك فوراً.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="https://wa.me/+201205288295"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تواصل معنا على WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsOrderModalOpen(false);
                        setOrderSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-[#121211] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#121211] mb-1.5">
                      اسمك بالكامل
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمود"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121211] mb-1.5">
                      اسم البراند أو النشاط
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: SOVI Studio / كافيه ومحمصة"
                      value={orderForm.brand}
                      onChange={(e) => setOrderForm({ ...orderForm, brand: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121211] mb-1.5">
                      رقم الموبايل / واتساب
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121211] mb-1.5">
                      نوع النشاط
                    </label>
                    <select
                      value={orderForm.field}
                      onChange={(e) => setOrderForm({ ...orderForm, field: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors"
                    >
                      <option value="">اختر المجال...</option>
                      <option value="كافيه أو مطعم">كافيه أو مطعم</option>
                      <option value="محل أو متجر">محل أو متجر تجاري</option>
                      <option value="فنان أو موسيقي">فنان أو موسيقي</option>
                      <option value="صانع محتوى">صانع محتوى أو مؤثر</option>
                      <option value="مصور أو استوديو">مصور أو استوديو</option>
                      <option value="شركة أو مشروع ناشئ">شركة أو مشروع ناشئ</option>
                      <option value="براند شخصي">براند شخصي</option>
                    </select>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#121211] hover:bg-[#262624] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                    >
                      تأكيد ومتابعة عبر WhatsApp
                    </button>
                    <a
                      href="https://wa.me/+201205288295"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تواصل معنا على WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Radio,
  ArrowLeft,
  Smartphone,
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
import { HeroPhoneSwitcher } from '../components/HeroPhoneSwitcher';
import { OrderBriefModal, TAPP_WHATSAPP_BASE_URL } from '../components/OrderBriefModal';

export type NavSectionId = 'top' | 'how-it-works' | 'examples' | 'smart-page';

export const NAV_ITEMS: ReadonlyArray<{ id: NavSectionId; label: string; href: string }> = [
  { id: 'top', label: 'الرئيسية', href: '#top' },
  { id: 'how-it-works', label: 'كيف تعمل؟', href: '#how-it-works' },
  { id: 'examples', label: 'الأمثلة', href: '#examples' },
  { id: 'smart-page', label: 'الصفحة الذكية', href: '#smart-page' },
];

const SMART_PAGE_CHANNELS = [
  { name: 'Instagram', ar: 'انستجرام براندك', icon: Instagram },
  { name: 'WhatsApp', ar: 'محادثة وطلب سريع', icon: MessageCircle },
  { name: 'TikTok', ar: 'فيديوهات وتيك توك', icon: Sparkles },
  { name: 'Website', ar: 'الموقع أو المتجر', icon: Globe },
  { name: 'Menu', ar: 'قائمة ومنيو الطعام', icon: Utensils },
  { name: 'Google Maps', ar: 'موقع الفروع واللوكيشن', icon: MapPin },
  { name: 'Google Reviews', ar: 'تقييمات وآراء العملاء', icon: Star },
  { name: 'Booking', ar: 'حجز المواعيد', icon: Calendar },
  { name: 'Spotify & Music', ar: 'الموسيقى والبودكاست', icon: Music },
  { name: 'Portfolio', ar: 'معرض الأعمال والمشاريع', icon: Layers },
  { name: 'Contact Card', ar: 'حفظ الرقم في الموبايل', icon: User },
  { name: 'Direct Share', ar: 'مشاركة الكارت مع غيرك', icon: Share2 },
] as const;

const USE_CASES = [
  {
    title: 'كافيهات ومطاعم',
    context: 'منيو سريع، لوكيشن الفروع، وتقييمات Google على كل ترابيزة.',
    icon: Coffee,
  },
  {
    title: 'محلات ومتاجر',
    context: 'تحويل الزبائن لصفحة المنتجات والانستجرام أو الطلب عبر واتساب.',
    icon: ShoppingBag,
  },
  {
    title: 'فنانين وموسيقيين',
    context: 'تجميع Spotify وAnghami وYouTube وحسابات السوشيال في لينك واحد.',
    icon: Music,
  },
  {
    title: 'صناع محتوى',
    context: 'واجهة منظمة لقنواتك وتعاونات البراندات بضغطة واحدة.',
    icon: Sparkles,
  },
  {
    title: 'مصورين واستوديوهات',
    context: 'عرض الخدمات الإبداعية، عنوان الاستوديو، وحجز الجلسات مباشرة.',
    icon: Camera,
  },
  {
    title: 'مستقلين ومستشارين',
    context: 'مشاركة البورتفوليو وبيانات التواصل في الاجتماعات والمؤتمرات.',
    icon: Briefcase,
  },
  {
    title: 'أصحاب مشاريع',
    context: 'نقطة وصول موحدة للعملاء بدل تشتيت اللينكات والأرقام.',
    icon: Layers,
  },
  {
    title: 'براندات شخصية',
    context: 'هوية رقمية خاصة تعبّر عن أسلوبك وتفضل محدثة دايماً.',
    icon: User,
  },
] as const;

export const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const performScrollToSection = useCallback(
    (id: NavSectionId | 'who-for', instant = false) => {
      const behavior: ScrollBehavior =
        instant || prefersReducedMotion ? 'auto' : 'smooth';

      if (id === 'top') {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      const el = document.getElementById(id);
      if (!el) return;

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 72;
      const targetTop = Math.max(
        0,
        Math.round(el.getBoundingClientRect().top + window.scrollY - headerHeight)
      );
      window.scrollTo({ top: targetTop, behavior });
    },
    [prefersReducedMotion]
  );

  const scrollToSection = useCallback(
    (id: NavSectionId | 'who-for') => {
      setMobileMenuOpen(false);

      const targetHash = id === 'top' ? '' : `#${id}`;
      const nextUrl = `${window.location.pathname}${window.location.search}${targetHash}`;
      if (window.location.hash !== targetHash) {
        try {
          window.history.pushState(null, '', nextUrl);
        } catch {
          // Ignore restricted history environments
        }
      }

      window.requestAnimationFrame(() => {
        performScrollToSection(id);
      });
    },
    [performScrollToSection]
  );

  useEffect(() => {
    const resolveHashTarget = (): NavSectionId | 'who-for' | null => {
      const raw = window.location.hash.replace(/^#/, '').toLowerCase();
      if (
        raw === 'top' ||
        raw === 'how-it-works' ||
        raw === 'examples' ||
        raw === 'smart-page' ||
        raw === 'who-for'
      ) {
        return raw;
      }
      return null;
    };

    const initialTarget = resolveHashTarget();
    let rafId: number | undefined;
    if (initialTarget && initialTarget !== 'top') {
      rafId = window.requestAnimationFrame(() => {
        performScrollToSection(initialTarget, true);
      });
    }

    const handleLocationChange = () => {
      const target = resolveHashTarget();
      if (target) {
        performScrollToSection(target);
      } else if (window.location.pathname === '/' && window.location.hash === '') {
        performScrollToSection('top');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      if (rafId !== undefined) window.cancelAnimationFrame(rafId);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [performScrollToSection]);

  useEffect(() => {
    if (!mobileMenuOpen && !isOrderModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isOrderModalOpen) {
        setIsOrderModalOpen(false);
      } else if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen, isOrderModalOpen]);

  const openOrderModal = () => {
    setMobileMenuOpen(false);
    setIsOrderModalOpen(true);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FAFAF8] text-[#121211] relative flex flex-col justify-between selection:bg-[#121211] selection:text-[#FAFAF8] font-arabic antialiased"
    >
      {/* ─── 1. TOP NAVIGATION ─── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 w-full bg-[#FAFAF8]/92 backdrop-blur-md border-b border-[#E8E8E4]"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand Wordmark */}
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="text-right cursor-pointer flex items-center gap-2.5 rounded-lg whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
          >
            <span
              dir="ltr"
              className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#121211]"
            >
              TAPP
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono-custom font-semibold tracking-wider text-[#706E6B] uppercase">
              NFC + SMART PAGES
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-8 text-sm text-[#706E6B] font-medium"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="hover:text-[#121211] transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-4"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openOrderModal}
              className="px-5 py-2.5 bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
            >
              <span>ابدأ TAPP</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-[#121211] hover:bg-[#EFEFEA] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Overlay so header height stays constant during scroll) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
              className="md:hidden absolute top-full inset-x-0 z-40 border-t border-b border-[#E8E8E4] bg-[#FAFAF8] shadow-xl overflow-hidden"
            >
              <nav
                aria-label="التنقل الرئيسي على الهاتف"
                className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain px-6 py-4 flex flex-col gap-1"
              >
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="w-full text-right py-3 px-2 text-sm font-semibold text-[#121211] border-b border-[#F0F0EB] rounded-lg hover:bg-[#EFEFEA]/70 active:bg-[#EFEFEA] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] block"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={openOrderModal}
                  className="w-full mt-3 py-3 bg-[#121211] hover:bg-[#262624] text-white text-center text-sm font-bold rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
                >
                  ابدأ TAPP الآن
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── 2. HERO SECTION ─── */}
      <section
        id="top"
        className="scroll-mt-20 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Hero Text Column */}
          <div className="lg:col-span-6 text-center lg:text-right">
            <span className="inline-block text-xs font-semibold text-[#706E6B] mb-4">
              كارت أعمال ذكي بتقنية NFC + QR
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-[#121211] tracking-tight leading-[1.2] lg:leading-[1.16] text-balance">
              كارت واحد.
              <br />
              كل تفاصيل براندك في{' '}
              <span className="font-display underline decoration-[#C5A880] decoration-4 underline-offset-8">
                Tap
              </span>{' '}
              واحدة.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#555552] leading-relaxed max-w-xl mx-auto lg:mx-0">
              كارت فيزيائي يوصّل عملاءك فوراً بصفحة براندك الرقمية — روابطك، حساباتك، وطرق التواصل معاك في مكان واحد بدون أي تطبيق.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={openOrderModal}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>ابدأ TAPP</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('examples')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#F2F2ED] text-[#121211] border border-[#DFDFD8] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                شوف الأمثلة
              </button>
            </div>

            {/* Clean Trust Points */}
            <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-[#666460]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#121211]" />
                <span>بدون أي تطبيق</span>
              </span>
              <span aria-hidden="true" className="text-[#D4D3CC]">
                ·
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#121211]" />
                <span>شغال بالـ NFC والـ QR</span>
              </span>
              <span aria-hidden="true" className="text-[#D4D3CC]">
                ·
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#121211]" />
                <span>تحديث فوري للبيانات</span>
              </span>
            </div>
          </div>

          {/* Interactive Hero Card + Live Phone Preview Switcher */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <HeroPhoneSwitcher />
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS + WHAT IS TAPP (#how-it-works) ─── */}
      <section
        id="how-it-works"
        className="scroll-mt-20 w-full border-t border-[#E8E8E4] bg-white py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          {/* Concise Product Definition + Section Lead */}
          <div className="max-w-2xl text-center sm:text-right mb-12">
            <span className="text-xs font-semibold text-[#706E6B] block mb-1.5">
              إيه هي TAPP وبتشتغل إزاي؟
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              ببساطة. Tap. Scan. Connect.
            </h2>
            <p className="mt-3 text-base text-[#555552] leading-relaxed">
              TAPP هي جسر مباشر بين كارتك الملموس وهويتك الرقمية: لمسة واحدة بالـ NFC أو مسح لـ QR Code تفتح صفحة براندك على أي موبايل في ثانية.
            </p>
          </div>

          {/* 3 Focused Interaction Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211]">
                    <Radio className="w-5 h-5" />
                  </div>
                  <span dir="ltr" className="font-mono-custom text-xs font-bold text-[#706E6B]">
                    01 · TAP
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#121211] mb-2">
                  قرّب موبايلك من الكارت
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  شريحة الـ NFC المدمجة في الكارت بتبعت رابط صفحتك بمجرد ما يلمس ظهر الموبايل.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#EAEAE4] text-xs font-medium text-[#706E6B]">
                بدون تنزيل تطبيقات أو كتابة أرقام
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span dir="ltr" className="font-mono-custom text-xs font-bold text-[#706E6B]">
                    02 · SCAN
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#121211] mb-2">
                  أو امسح الـ QR Code
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  كل كارت معاه QR Code ديناميكي يفتح بكاميرا أي موبايل عادية كبديل مضمون دايماً.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#EAEAE4] text-xs font-medium text-[#706E6B]">
                متوافق مع كل أنواع الهواتف
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span dir="ltr" className="font-mono-custom text-xs font-bold text-[#706E6B]">
                    03 · CONNECT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#121211] mb-2">
                  افتح صفحة براندك الذكية
                </h3>
                <p className="text-sm text-[#555552] leading-relaxed">
                  العميل بيشوف هويتك وروابطك في مكان واحد، ويتواصل أو يتابعك بضغطة واحدة.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#EAEAE4] text-xs font-medium text-[#706E6B]">
                تقدر تحدّث الروابط من غير ما تطبع تاني
              </div>
            </div>
          </div>

          {/* Focused Differentiator */}
          <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-[#121211] text-[#FAFAF8] flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="max-w-xl text-center sm:text-right">
              <span
                dir="ltr"
                className="text-[11px] font-mono-custom uppercase tracking-wider text-[#C5A880] block mb-1"
              >
                Physical Card + Digital Brand Page
              </span>
              <p className="text-sm sm:text-base font-semibold text-[#FAFAF8] leading-relaxed">
                مش مجرد لينك على الإنترنت — ده كارت بتسيبه على طاولة الكافيه أو في إيد عميلك، يوصّله بهوية براندك الحقيقية.
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('examples')}
              className="px-5 py-3 bg-[#FAFAF8] hover:bg-white text-[#121211] text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer whitespace-nowrap"
            >
              شوف صفحات حقيقية
            </button>
          </div>
        </div>
      </section>

      {/* ─── 4. REAL BRAND EXAMPLES (#examples) — Matches Navigation Order ─── */}
      <section
        id="examples"
        className="scroll-mt-20 w-full border-t border-[#E8E8E4] bg-[#FAFAF8] py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-3">
            <div>
              <span className="text-xs font-semibold text-[#706E6B] block mb-1.5">
                أمثلة فعلية شغالة على TAPP
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
                شوف TAPP مع براندات مختلفة
              </h2>
              <p className="mt-2 text-base text-[#555552]">
                كل صفحة متصممة بشخصية البراند بتاعها، مش فورمة واحدة متكررة.
              </p>
            </div>
            <span className="text-xs text-[#706E6B] font-medium">
              اضغط على أي كارت لتجربة الصفحة الفعلية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {/* EXAMPLE 1: ATLAS */}
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.2 }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/atlas')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/atlas');
                }
              }}
              className="group cursor-pointer rounded-2xl bg-[#05070E] border border-[#1E274A] p-7 text-[#F4F4F8] flex flex-col justify-between shadow-md relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
            >
              <div
                dir="ltr"
                className="flex items-center justify-between text-[10px] font-mono-custom text-[#7E8BAF] mb-6"
              >
                <span>ARTIST / RAPPER</span>
                <span>/atlas</span>
              </div>

              <div>
                <div className="w-11 h-11 rounded-full bg-[#0E1428] border border-[#232D54] flex items-center justify-center text-[#5C67DE] mb-5">
                  <Music className="w-5 h-5" />
                </div>

                <h3
                  dir="ltr"
                  className="font-display text-3xl font-black text-[#F4F4F8] group-hover:text-[#9BA7CF] transition-colors text-right"
                >
                  ATLAS
                </h3>
                <p
                  dir="ltr"
                  className="text-[11px] font-mono-custom text-[#7E8BAF] mt-0.5 text-right"
                >
                  ARTIST · RAPPER · PRODUCER
                </p>

                <p className="mt-4 text-xs sm:text-sm text-[#B8C2E0] leading-relaxed">
                  صفحة فنان داكنة بهوية موسيقية مميزة بتجمع روابط الاستماع على Spotify وAnghami وYouTube مع حساباته الرسمية ومشاركة QR.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1A203B] flex items-center justify-between text-xs font-bold text-[#F4F4F8] group-hover:text-[#9BA7CF]">
                <span>شوف صفحة ATLAS</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </motion.div>

            {/* EXAMPLE 2: SOVI */}
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.2 }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/sovi')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/sovi');
                }
              }}
              className="group cursor-pointer rounded-2xl bg-[#FAF8F5] border border-[#E2D4E8] p-7 text-[#34203B] flex flex-col justify-between shadow-sm relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
            >
              <div
                dir="ltr"
                className="flex items-center justify-between text-[10px] font-mono-custom text-[#8B6D93] mb-6"
              >
                <span>HANDMADE GOODS</span>
                <span>/sovi</span>
              </div>

              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#F3EDF7] border border-[#D6C7DE] flex items-center justify-center text-[#5C3D61] mb-5">
                  <ShoppingBag className="w-5 h-5" />
                </div>

                <h3
                  dir="ltr"
                  className="font-serif-custom text-4xl font-normal text-[#34203B] tracking-wide group-hover:text-[#5C3D61] transition-colors text-right"
                >
                  SOVI
                </h3>
                <p
                  dir="ltr"
                  className="text-[11px] font-mono-custom text-[#8B6D93] mt-0.5 text-right"
                >
                  MADE BY HAND · @sovi_storee
                </p>

                <p className="mt-4 text-xs sm:text-sm text-[#5C3D61] leading-relaxed">
                  هوية ناعمة ودافئة لبراند منتجات يدوية، بتجمع حساب Instagram ومجتمع WhatsApp وقصة البراند مع تصدير QR جاهز للطباعة.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E8DFEF] flex items-center justify-between text-xs font-bold text-[#34203B] group-hover:text-[#7D5B84]">
                <span>شوف صفحة SOVI</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </motion.div>

            {/* EXAMPLE 3: BY MARCOS (Accurate English-only creative studio description) */}
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.2 }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/bymarcos')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/bymarcos');
                }
              }}
              className="group cursor-pointer rounded-2xl bg-[#101010] border border-[#292929] p-7 text-[#F4F0EA] flex flex-col justify-between shadow-md relative overflow-hidden md:col-span-2 lg:col-span-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
            >
              <div
                dir="ltr"
                className="flex items-center justify-between text-[10px] font-mono-custom text-[#C4636D] mb-6"
              >
                <span>CREATIVE STUDIO</span>
                <span className="text-[#9E9990]">/bymarcos</span>
              </div>

              <div>
                <div className="w-11 h-11 rounded-xl bg-[#191919] border border-[#78343B]/70 flex items-center justify-center text-[#C4636D] mb-5">
                  <Camera className="w-5 h-5" />
                </div>

                <h3
                  dir="ltr"
                  className="font-serif-custom text-3xl sm:text-4xl font-semibold text-[#F4F0EA] tracking-tight group-hover:text-[#D8D3CA] transition-colors text-right"
                >
                  BY MARCOS
                </h3>
                <p
                  dir="ltr"
                  className="text-[11px] font-mono-custom text-[#9E9990] mt-0.5 text-right"
                >
                  THE RED FRAME COLLECTIVE · ENGLISH
                </p>

                <p className="mt-4 text-xs sm:text-sm text-[#BDB7AE] leading-relaxed">
                  هوية تحريرية بالإنجليزي لاستوديو تصوير وإخراج إبداعي في الإسكندرية، بتعرض قائمة الخدمات، عنوان الاستوديو، الحجز على WhatsApp، وتصدير QR.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#292929] flex items-center justify-between text-xs font-bold text-[#F4F0EA] group-hover:text-[#C4636D]">
                <span>شوف صفحة BY MARCOS</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 5. SMART BRAND PAGE (#smart-page) — What the destination offers ─── */}
      <section
        id="smart-page"
        className="scroll-mt-20 w-full border-t border-[#E8E8E4] bg-white py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl text-center sm:text-right mb-12">
            <span className="text-xs font-semibold text-[#706E6B] block mb-1.5">
              الصفحة الذكية
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              كل قنوات براندك في صفحة واحدة بتعبّر عنك.
            </h2>
            <p className="mt-3 text-base text-[#555552] leading-relaxed">
              بعد ما العميل يعمل Tap أو Scan، بتفتح له Smart Brand Page مصممة على هوية براندك وفيها كل اللي يحتاجه عشان يتواصل معاك فوراً.
            </p>
          </div>

          {/* Two Clear Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4]">
              <span className="text-xs font-mono-custom font-bold text-[#706E6B] block mb-2">
                01 · هوية بصرية مخصصة
              </span>
              <h3 className="text-xl font-bold text-[#121211] mb-2">
                تصميم لايق بمجال شغلك
              </h3>
              <p className="text-sm text-[#555552] leading-relaxed">
                من صفحة داكنة لفنان موسيقي، لهوية ناعمة لبراند هاند ميد، لصفحة تحريرية لاستوديو تصوير — التصميم والخطوط والألوان بتتبني على ذوق براندك.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4]">
              <span className="text-xs font-mono-custom font-bold text-[#706E6B] block mb-2">
                02 · مرونة بدون طباعة جديدة
              </span>
              <h3 className="text-xl font-bold text-[#121211] mb-2">
                تحديث الروابط في أي وقت
              </h3>
              <p className="text-sm text-[#555552] leading-relaxed">
                غيّرت رقم الواتساب، ضفت فرع جديد، أو أطلقت إصدار أو منيو جديد؟ صفحتك الرقمية بتتحدّث والكارت اللي في إيد العميل بيفضل شغال بنفس الكفاءة.
              </p>
            </div>
          </div>

          {/* Channels Grid consolidated right inside Smart Page */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <h3 className="text-sm font-bold text-[#121211]">
                إيه اللي ممكن تضيفه جوه صفحتك؟
              </h3>
              <span className="text-xs text-[#706E6B]">
                بتختار القنوات اللي تخدم شغلك فعلاً
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {SMART_PAGE_CHANNELS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.name}
                    className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] flex items-center gap-3 text-right"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211] shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#121211] block truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#706E6B] block truncate">
                        {item.ar}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. USE CASES (#who-for) ─── */}
      <section
        id="who-for"
        className="scroll-mt-20 w-full border-t border-[#E8E8E4] bg-[#FAFAF8] py-16 sm:py-24"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center sm:text-right max-w-xl mb-12">
            <span className="text-xs font-semibold text-[#706E6B] block mb-1.5">
              الأنشطة والمجالات
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight">
              مين يقدر يستخدم TAPP؟
            </h2>
            <p className="mt-2 text-base text-[#555552]">
              مصممة للمشاريع والبراندات والمستقلين اللي بيعتمدوا على التواصل السريع مع عملائهم.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="p-5 rounded-xl bg-white border border-[#E8E8E4] flex flex-col justify-between gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#FAFAF8] border border-[#E8E8E4] flex items-center justify-center text-[#121211]">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#121211] mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#666460] leading-relaxed">
                      {cat.context}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. FINAL CTA ─── */}
      <section className="w-full border-t border-[#E8E8E4] bg-white py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold text-[#706E6B] block mb-2">
            جاهز تنقل براندك لمستوى أذكى؟
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121211] tracking-tight">
            خلّي براندك Tap واحدة بعيد.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#555552] max-w-md mx-auto">
            كارت واحد. حضور رقمي منظم يوصّل عملاءك ليك فوراً.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={openOrderModal}
              className="w-full sm:w-auto px-9 py-4 bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] text-base font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ابدأ TAPP</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <a
              href={TAPP_WHATSAPP_BASE_URL}
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

      {/* ─── 8. FOOTER ─── */}
      <footer className="w-full border-t border-[#E8E8E4] bg-[#FAFAF8] pt-14 pb-10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center">
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="cursor-pointer inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
            aria-label="TAPP Home"
          >
            <span
              dir="ltr"
              className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#121211]"
            >
              TAPP
            </span>
          </button>

          <p className="mt-2 text-sm text-[#706E6B] font-medium">
            كل تفاصيل براندك في Tap واحدة.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="https://www.facebook.com/share/1C31kMehSm/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#DFDFD8] hover:border-[#121211] hover:bg-[#121211] text-[#121211] hover:text-white transition-all flex items-center justify-center shadow-2xs"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/its.1m1?stkn=MTkyb2dqcG5lbTEybw%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#DFDFD8] hover:border-[#121211] hover:bg-[#121211] text-[#121211] hover:text-white transition-all flex items-center justify-center shadow-2xs"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href={TAPP_WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#DFDFD8] hover:border-[#121211] hover:bg-[#121211] text-[#121211] hover:text-white transition-all flex items-center justify-center shadow-2xs"
              aria-label="WhatsApp"
              title="تواصل معنا على WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>

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

      {/* ─── SMART BRIEF BUILDER & ORDER MODAL (ابدأ TAPP) ─── */}
      <OrderBriefModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
};

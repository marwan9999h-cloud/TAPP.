import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Globe,
  QrCode,
  Radio,
  Smartphone,
} from 'lucide-react';
import { BRAND_FOOTER_CONFIG, BRAND_REGISTRY, BRAND_SLUGS } from '../config/brands';
import { GUIDE_SEO } from '../config/seoRoutes.mjs';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { navigate } from '../router';

type GuideLang = 'ar' | 'en';

interface GuideStep {
  code: string;
  title: string;
  description: string;
  note: string;
  icon: 'tap' | 'scan' | 'connect';
}

interface GuideFaqItem {
  id: string;
  question: string;
  answer: string;
}

interface GuideCopy {
  backHome: string;
  langToggleLabel: string;
  langToggleAria: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  stepsHeading: string;
  stepsSubheading: string;
  steps: readonly GuideStep[];
  faqHeading: string;
  faqSubheading: string;
  faqs: readonly GuideFaqItem[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  showcaseLabel: string;
}

const GUIDE_CONTENT: Record<GuideLang, GuideCopy> = {
  ar: {
    backHome: 'العودة للرئيسية',
    langToggleLabel: 'English',
    langToggleAria: 'Switch guide language to English',
    eyebrow: 'TAPP QUICK GUIDE & FAQ',
    title: 'دليل استخدام TAPP والأسئلة الشائعة',
    subtitle:
      'كل اللي محتاج تعرفه عشان تفتح أي صفحة براند ذكية على TAPP بالـ NFC أو الـ QR Code، وتشاركها أو تحفظ بياناتها بسهولة.',
    stepsHeading: 'تبدأ إزاي في 3 خطوات',
    stepsSubheading: 'طريقة واحدة مرنة للوصول — سواء بلمسة NFC أو بكاميرا الموبايل.',
    steps: [
      {
        code: '01 · TAP',
        title: 'لمسة بالـ NFC',
        description:
          'قرّب الكارت من موضع قراءة الـ NFC في الموبايل والشاشة منوّرة ليظهر إشعار فتح الرابط في المتصفح.',
        note: 'موضع القارئ غالباً أعلى ظهر الآيفون أو منتصف/أعلى ظهر أجهزة أندرويد',
        icon: 'tap',
      },
      {
        code: '02 · SCAN',
        title: 'مسح بالـ QR Code',
        description:
          'لو الـ NFC مقفول أو مش مدعوم في الجهاز، افتح كاميرا الموبايل العادية ووجّهها على الـ QR لفتح نفس الصفحة.',
        note: 'يفتح الرابط الرسمي الثابت بدون خطوات إضافية',
        icon: 'scan',
      },
      {
        code: '03 · CONNECT',
        title: 'تفاعل وحفظ ومشاركة',
        description:
          'من جوه الصفحة الذكية تقدر تفتح الروابط، تنسخ الرابط أو تشاركه، تنزّل ملفات QR، أو تحفظ جهة الاتصال (.vcf) في الصفحات المؤهلة.',
        note: 'بدون تنزيل تطبيق مخصوص للزائر',
        icon: 'connect',
      },
    ],
    faqHeading: 'الأسئلة الشائعة',
    faqSubheading: 'إجابات واضحة ومباشرة عن تجربة الاستخدام على الموبايل.',
    faqs: [
      {
        id: 'nfc-needed',
        question: 'هل لازم موبايلي يدعم NFC؟',
        answer:
          'أغلب أجهزة iPhone وأجهزة Android الحديثة بتدعم قراءة NFC مباشرة. ولو جهازك مش بيدعم NFC أو الخاصية مقفولة في الإعدادات، تقدر دايماً تمسح الـ QR Code بكاميرا الموبايل وتفتح نفس الصفحة.',
      },
      {
        id: 'tap-not-working',
        question: 'إيه الحل لو الـ Tap مشتغلش من أول مرة؟',
        answer:
          'اتأكد إن شاشة الموبايل منوّرة ومفتوحة، وإن NFC مفعّل في إعدادات Android. حرّك الكارت ببطء قرب أعلى ظهر الجهاز في iPhone أو منتصف/أعلى الظهر في Android، وجرّب إبعاد الجرابات السميكة أو المعدنية — أو امسح الـ QR مباشرة كبديل فوري.',
      },
      {
        id: 'qr-alternative',
        question: 'هل ينفع أستخدم الـ QR بدل الـ NFC؟',
        answer:
          'أكيد. كل صفحة براند على TAPP ليها QR Code مرتبط بنفس الرابط الرسمي، وأي زائر يقدر يفتحه بكاميرا الموبايل العادية أو قارئ QR ويوصل لنفس المحتوى بالظبط.',
      },
      {
        id: 'app-required',
        question: 'هل أحتاج أنزّل تطبيق عشان أفتح الصفحة؟',
        answer:
          'لأ. سواء دخلت بالـ NFC أو بالـ QR Code، الصفحة بتفتح مباشرة في متصفح الموبايل من غير أي تطبيقات إضافية.',
      },
      {
        id: 'save-contact',
        question: 'إزاي أحفظ جهة الاتصال من الصفحة؟',
        answer:
          'في صفحات البراندات اللي بتوفر بيانات تواصل مباشرة ومؤكدة (مثل رقم هاتف دولي أو بريد إلكتروني أو عنوان استوديو، ومتاح حالياً في صفحة BY MARCOS)، هتلاقي زر "Save Contact (.vcf)". بالضغط عليه بينزل ملف جهة اتصال قياسي يطلب منك الموبايل تأكيد إضافته لتطبيق جهات الاتصال. الصفحات المخصّصة للروابط والمنصات فقط بتخفي الزر ده عمداً.',
      },
      {
        id: 'update-info',
        question: 'هل ينفع تتحدّث بيانات الصفحة بعد ما الكارت يتعمل؟',
        answer:
          'أيوة. لأن الكارت والـ QR بيفتحوا رابط صفحة البراند الرقمية، تحديث الروابط أو بيانات التواصل بيتم على الموقع وإعادة النشر على نفس الرابط من غير ما تحتاج تطبع كارت جديد. التعديلات حالياً بتتم عن طريق المطور/الفريق القائم على المشروع ومفيش لوحة تحكم ذاتية داخل الموقع.',
      },
      {
        id: 'page-without-card',
        question: 'أقدر أطلب الصفحة من غير كارت؟',
        answer:
          'أيوه. صفحة البراند هي الأساس وبتشتغل لوحدها. الكارت الذكي والستاند إضافة اختيارية بتتفق عليها منفصلة.',
      },
    ],
    ctaTitle: 'تصفح المنصة أو أمثلة البراندات',
    ctaBody: 'تقدر ترجع للصفحة الرئيسية لـ TAPP أو تجرب صفحات البراندات الفعلية مباشرة.',
    ctaButton: 'العودة لصفحة TAPP',
    showcaseLabel: 'صفحات براندات شغالة على TAPP',
  },
  en: {
    backHome: 'Explore TAPP',
    langToggleLabel: 'العربية',
    langToggleAria: 'تبديل لغة الدليل إلى العربية',
    eyebrow: 'TAPP QUICK GUIDE & FAQ',
    title: 'Quick Guide & Frequently Asked Questions',
    subtitle:
      'Everything visitors and card holders need to know about opening TAPP smart brand pages via NFC or QR, sharing links, and saving contact files.',
    stepsHeading: 'How to use in 3 steps',
    stepsSubheading: 'Two reliable ways in — tap with NFC or scan with your camera.',
    steps: [
      {
        code: '01 · TAP',
        title: 'Tap via NFC',
        description:
          'Hold the physical card near your unlocked phone’s NFC antenna so the browser prompt appears cleanly.',
        note: 'Usually top back edge on iPhone, or upper/center back on Android',
        icon: 'tap',
      },
      {
        code: '02 · SCAN',
        title: 'Scan the QR Code',
        description:
          'If NFC is disabled or unavailable on a device, open your standard camera app and scan the QR code to open the exact same page.',
        note: 'Resolves directly to the canonical TAPP URL',
        icon: 'scan',
      },
      {
        code: '03 · CONNECT',
        title: 'Connect, Share & Save',
        description:
          'Browse official links, copy or share the URL, export SVG/PNG QR codes, or download a .vcf contact file on eligible pages.',
        note: 'Works directly in the mobile browser — no app install needed',
        icon: 'connect',
      },
    ],
    faqHeading: 'Frequently Asked Questions',
    faqSubheading: 'Straightforward answers grounded in how TAPP works today.',
    faqs: [
      {
        id: 'nfc-needed',
        question: 'Does my phone need NFC?',
        answer:
          'Most modern iPhone and Android devices support background NFC tag reading when enabled. If a phone does not have NFC or it is turned off, scanning the QR code opens the exact same smart brand page.',
      },
      {
        id: 'tap-not-working',
        question: 'What if tapping does not work?',
        answer:
          'Make sure your screen is awake and unlocked, and check that NFC is enabled in Android settings. Move the card slowly near the top back of an iPhone or the center/upper back of an Android phone, remove thick metallic cases if needed, or scan the QR code instead.',
      },
      {
        id: 'qr-alternative',
        question: 'Can I use QR instead of NFC?',
        answer:
          'Yes. Every TAPP brand page can be opened with any standard phone camera using its QR code, leading to the exact same canonical destination.',
      },
      {
        id: 'app-required',
        question: 'Do I need an application?',
        answer:
          'No application is required. Both NFC taps and QR scans open directly inside your phone’s web browser.',
      },
      {
        id: 'save-contact',
        question: 'How can I save a contact?',
        answer:
          'On brand pages that provide verified direct contact details (such as an international phone number, email, or studio address — currently active on BY MARCOS), tapping "Save Contact (.vcf)" downloads a standard vCard file that your phone prompts you to review and import into Contacts. Pages with only streaming or social links intentionally hide this option.',
      },
      {
        id: 'update-info',
        question: 'Can page information be updated?',
        answer:
          'Yes. Because NFC and QR codes point to the live digital brand URL, links and details can be updated and redeployed at that same address without reprinting the physical card. Content updates are currently managed by the developer rather than a self-service dashboard.',
      },
      {
        id: 'page-without-card',
        question: 'Can I request the page without a card?',
        answer:
          'Yes. The brand page is the core product and works on its own. The smart card and stand are optional add-ons arranged separately.',
      },
    ],
    ctaTitle: 'Explore TAPP & Live Brand Pages',
    ctaBody: 'Return to the main TAPP showcase or inspect the live brand pages directly.',
    ctaButton: 'Back to TAPP Home',
    showcaseLabel: 'Live TAPP Brand Examples',
  },
};

const StepIcon: React.FC<{ icon: GuideStep['icon'] }> = ({ icon }) => {
  if (icon === 'tap') return <Radio className="w-5 h-5" />;
  if (icon === 'scan') return <QrCode className="w-5 h-5" />;
  return <Smartphone className="w-5 h-5" />;
};

export const GuidePage: React.FC = () => {
  const [lang, setLang] = useState<GuideLang>('ar');
  const [openFaqId, setOpenFaqId] = useState<string>('nfc-needed');

  const localizedSeo = GUIDE_SEO.localized[lang];
  useDocumentMeta({
    title: localizedSeo.title,
    description: localizedSeo.description,
    canonicalPath: GUIDE_SEO.canonicalPath,
    lang: localizedSeo.lang,
    dir: localizedSeo.dir,
    ogLocale: localizedSeo.ogLocale,
    ogImagePath: GUIDE_SEO.ogImagePath,
    ogImageAlt: localizedSeo.ogImageAlt,
    ogType: GUIDE_SEO.ogType,
  });

  const copy = GUIDE_CONTENT[lang];
  const isRtl = lang === 'ar';

  const handleToggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? '' : id));
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#FAFAF8] text-[#121211] flex flex-col justify-between selection:bg-[#121211] selection:text-[#FAFAF8] antialiased ${
        isRtl ? 'font-arabic' : 'font-body'
      }`}
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#FAFAF8]/92 backdrop-blur-md border-b border-[#E8E8E4]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-flex items-center gap-2 rounded-lg py-1.5 px-1 text-[#121211] hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211]"
            >
              <span
                dir="ltr"
                className="font-display text-xl sm:text-2xl font-black tracking-tight"
              >
                TAPP
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono-custom font-semibold tracking-wider text-[#706E6B] uppercase">
                GUIDE
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
              aria-label={copy.langToggleAria}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-[#EFEFEA] border border-[#DFDFD8] text-xs font-semibold text-[#121211] inline-flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211]"
            >
              <Globe className="w-3.5 h-3.5 text-[#706E6B]" />
              <span>{copy.langToggleLabel}</span>
            </button>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
            >
              <span>{copy.backHome}</span>
              {isRtl ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Intro Hero */}
        <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-10 sm:pb-14">
          <div className="max-w-3xl">
            <span
              dir="ltr"
              className="inline-block text-[11px] font-mono-custom font-bold tracking-[0.18em] text-[#706E6B] uppercase mb-3"
            >
              {copy.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121211] tracking-tight leading-[1.2]">
              {copy.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#555552] leading-relaxed max-w-2xl">
              {copy.subtitle}
            </p>
          </div>
        </section>

        {/* 3 Steps Section */}
        <section className="w-full border-t border-[#E8E8E4] bg-white py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-[#121211] tracking-tight">
                {copy.stepsHeading}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#555552]">
                {copy.stepsSubheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {copy.steps.map((step) => (
                <article
                  key={step.code}
                  className="p-6 sm:p-7 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#DFDFD8] flex items-center justify-center text-[#121211]">
                        <StepIcon icon={step.icon} />
                      </div>
                      <span
                        dir="ltr"
                        className="font-mono-custom text-xs font-bold text-[#706E6B]"
                      >
                        {step.code}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#121211] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#555552] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <p className="mt-6 pt-3.5 border-t border-[#EAEAE4] text-xs font-medium text-[#706E6B]">
                    {step.note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Expandable FAQ Accordion */}
        <section
          aria-labelledby="guide-faq-heading"
          className="w-full border-t border-[#E8E8E4] bg-[#FAFAF8] py-12 sm:py-16"
        >
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <div className="mb-8">
              <h2
                id="guide-faq-heading"
                className="text-2xl sm:text-3xl font-black text-[#121211] tracking-tight"
              >
                {copy.faqHeading}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#555552]">
                {copy.faqSubheading}
              </p>
            </div>

            <div className="space-y-3">
              {copy.faqs.map((item) => {
                const isOpen = openFaqId === item.id;
                const buttonId = `faq-btn-${item.id}`;
                const panelId = `faq-panel-${item.id}`;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-colors ${
                      isOpen
                        ? 'bg-white border-[#C5A880]'
                        : 'bg-white border-[#E8E8E4] hover:border-[#D4D4CE]'
                    }`}
                  >
                    <h3 className="m-0">
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => handleToggleFaq(item.id)}
                        className="w-full min-h-[54px] px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-start text-sm sm:text-base font-bold text-[#121211] cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211]"
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`w-4 h-4 text-[#706E6B] shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                            isOpen ? 'rotate-180 text-[#121211]' : ''
                          }`}
                        />
                      </button>
                    </h3>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="px-5 sm:px-6 pb-5 pt-1 text-sm text-[#555552] leading-relaxed border-t border-[#F0F0EB]"
                    >
                      {item.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Navigation Callout */}
        <section className="w-full border-t border-[#E8E8E4] bg-white py-12">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#121211]">
                {copy.ctaTitle}
              </h2>
              <p className="mt-1.5 text-sm text-[#555552]">{copy.ctaBody}</p>
            </div>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="min-h-[46px] px-6 py-3 rounded-xl bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] text-sm font-bold inline-flex items-center gap-2 shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] focus-visible:ring-offset-2"
            >
              <span>{copy.ctaButton}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E8E8E4] bg-[#FAFAF8] py-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#706E6B]">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="px-3 py-1.5 rounded-lg hover:bg-[#EFEFEA] text-[#121211] font-semibold transition-colors"
            >
              {BRAND_FOOTER_CONFIG.exploreLabel}
            </a>
            <span aria-hidden="true" className="text-[#D4D3CC]">
              ·
            </span>
            <span className="text-[11px]">{copy.showcaseLabel}:</span>
            {BRAND_SLUGS.map((slug) => {
              const entry = BRAND_REGISTRY[slug];
              return (
                <a
                  key={slug}
                  href={entry.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(entry.path);
                  }}
                  dir="ltr"
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8E4] hover:border-[#121211] text-[#121211] font-mono-custom text-[11px] transition-colors"
                >
                  {entry.name}
                </a>
              );
            })}
          </div>

          <span
            dir="ltr"
            className="text-[11px] font-mono-custom tracking-[0.16em] text-[#73706B]"
          >
            {BRAND_FOOTER_CONFIG.attributionText}
          </span>
        </div>
      </footer>
    </div>
  );
};

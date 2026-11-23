import React, { useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { TAPP_WHATSAPP_BASE_URL, TAPP_WHATSAPP_NUMBER } from '../config/tapp';

export { TAPP_WHATSAPP_BASE_URL, TAPP_WHATSAPP_NUMBER };

export const USE_CASE_OPTIONS = [
  { id: 'personal', label: 'كارت شخصي' },
  { id: 'cafe', label: 'كافيه أو مطعم' },
  { id: 'store', label: 'متجر أو منتج' },
  { id: 'creator', label: 'فنان أو صانع محتوى' },
  { id: 'studio', label: 'تصوير أو استوديو إبداعي' },
  { id: 'company', label: 'شركة أو فريق عمل' },
  { id: 'other', label: 'أخرى' },
] as const;

export const VISUAL_DIRECTION_OPTIONS = [
  { id: 'dark-minimal', label: 'داكن وبسيط (Dark & Minimal)' },
  { id: 'warm-elegant', label: 'دافئ وأنيق (Warm & Elegant)' },
  { id: 'modern-clean', label: 'عصري ونظيف (Modern & Clean)' },
  { id: 'bold-editorial', label: 'جريء وتحريري (Bold & Editorial)' },
  { id: 'unsure', label: 'لسه مش متأكد' },
] as const;

export interface OrderBriefFormState {
  name: string;
  phone: string;
  brand: string;
  useCase: string;
  visualDirection: string;
  notes: string;
}

export function buildOrderWhatsAppMessage(form: OrderBriefFormState): string {
  const lines: string[] = ['مرحباً TAPP! حابب أبدأ كارت وصفحة ذكية:'];
  lines.push(`- الاسم: ${form.name.trim()}`);
  lines.push(`- الموبايل / واتساب: ${form.phone.trim()}`);

  if (form.brand.trim()) {
    lines.push(`- اسم البراند / النشاط: ${form.brand.trim()}`);
  }
  if (form.useCase.trim()) {
    lines.push(`- الاستخدام المطلوب: ${form.useCase.trim()}`);
  }
  if (form.visualDirection.trim()) {
    lines.push(`- التوجه البصري المفضّل: ${form.visualDirection.trim()}`);
  }
  if (form.notes.trim()) {
    lines.push(`- ملاحظات إضافية: ${form.notes.trim()}`);
  }

  return lines.join('\n');
}

export function buildOrderWhatsAppUrl(form: OrderBriefFormState): string {
  const message = buildOrderWhatsAppMessage(form);
  return `${TAPP_WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

interface OrderBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM_STATE: OrderBriefFormState = {
  name: '',
  phone: '',
  brand: '',
  useCase: '',
  visualDirection: '',
  notes: '',
};

export const OrderBriefModal: React.FC<OrderBriefModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<OrderBriefFormState>(INITIAL_FORM_STATE);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleClose = () => {
    setGeneratedUrl(null);
    onClose();
  };

  const toggleChip = (field: 'useCase' | 'visualDirection', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] === value ? '' : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildOrderWhatsAppUrl(form);
    setGeneratedUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E8E4] text-right"
          >
            <button
              type="button"
              aria-label="إغلاق"
              onClick={handleClose}
              className="absolute top-5 left-5 p-2 rounded-full hover:bg-[#FAFAF8] text-[#706E6B] hover:text-[#121211] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pl-8">
              <span className="text-xs font-semibold text-[#706E6B] block mb-1">
                تجهيز ملخص البراند
              </span>
              <h3 id="order-modal-title" className="text-2xl font-black text-[#121211]">
                ابدأ كارت TAPP لبراندك
              </h3>
              <p className="mt-1 text-sm text-[#555552]">
                اكتب بياناتك الأساسية واختَر شكل وتوجه صفحتك المبدئي عشان نجهزلك التفاصيل على WhatsApp.
              </p>
            </div>

            {generatedUrl ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#121211] mb-1.5">
                  ملخصك جاهز للإرسال على WhatsApp
                </h4>
                <p className="text-sm text-[#555552] mb-5">
                  لو نافذة WhatsApp ما فتحتش تلقائياً، اضغط الزرار بالأسفل لفتح المحادثة ببياناتك جاهزة.
                </p>

                <div className="mb-6 p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E4] text-right text-xs text-[#454542] space-y-1 whitespace-pre-line">
                  {buildOrderWhatsAppMessage(form)}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>افتح WhatsApp لإرسال الملخص</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setGeneratedUrl(null)}
                    className="w-full sm:w-auto px-5 py-3 bg-[#FAFAF8] hover:bg-[#EFEFEA] text-[#121211] border border-[#DFDFD8] text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    تعديل البيانات
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Required Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="tapp-order-name"
                      className="block text-xs font-bold text-[#121211] mb-1.5"
                    >
                      اسمك بالكامل <span className="text-[#8B1E24]">*</span>
                    </label>
                    <input
                      id="tapp-order-name"
                      type="text"
                      required
                      placeholder="مثال: أحمد محمود"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tapp-order-phone"
                      className="block text-xs font-bold text-[#121211] mb-1.5"
                    >
                      رقم الموبايل / واتساب <span className="text-[#8B1E24]">*</span>
                    </label>
                    <input
                      id="tapp-order-phone"
                      type="tel"
                      required
                      minLength={8}
                      placeholder="01XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors text-right"
                    />
                  </div>
                </div>

                {/* Optional Use Case Chips */}
                <div>
                  <span className="block text-xs font-bold text-[#121211] mb-2">
                    محتاج TAPP لإيه؟ <span className="font-normal text-[#706E6B]">(اختياري)</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {USE_CASE_OPTIONS.map((option) => {
                      const active = form.useCase === option.label;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleChip('useCase', option.label)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] ${
                            active
                              ? 'bg-[#121211] text-[#FAFAF8] border-[#121211]'
                              : 'bg-[#FAFAF8] text-[#454542] border-[#DFDFD8] hover:border-[#121211]'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Visual Style Direction Chips */}
                <div>
                  <span className="block text-xs font-bold text-[#121211] mb-1">
                    الستايل الأقرب لذوقك في الصفحة الذكية{' '}
                    <span className="font-normal text-[#706E6B]">(اختياري)</span>
                  </span>
                  <p className="text-[11px] text-[#706E6B] mb-2">
                    تفضيل بصري مبدئي لتوجيه التصميم الرقمي، وبنراجعه معاك بالتفصيل.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {VISUAL_DIRECTION_OPTIONS.map((option) => {
                      const active = form.visualDirection === option.label;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleChip('visualDirection', option.label)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] ${
                            active
                              ? 'bg-[#121211] text-[#FAFAF8] border-[#121211]'
                              : 'bg-[#FAFAF8] text-[#454542] border-[#DFDFD8] hover:border-[#121211]'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Brand Name + Notes */}
                <div className="grid grid-cols-1 gap-3.5 pt-1">
                  <div>
                    <label
                      htmlFor="tapp-order-brand"
                      className="block text-xs font-bold text-[#121211] mb-1.5"
                    >
                      اسم البراند أو التخصص{' '}
                      <span className="font-normal text-[#706E6B]">(اختياري)</span>
                    </label>
                    <input
                      id="tapp-order-brand"
                      type="text"
                      placeholder="مثال: SOVI / استوديو تصوير / كافيه"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tapp-order-notes"
                      className="block text-xs font-bold text-[#121211] mb-1.5"
                    >
                      ملاحظات إضافية{' '}
                      <span className="font-normal text-[#706E6B]">(اختياري)</span>
                    </label>
                    <textarea
                      id="tapp-order-notes"
                      rows={2}
                      placeholder="أي لينكات أو تفاصيل حابب تذكرها في البداية..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DFDFD8] bg-[#FAFAF8] text-sm text-[#121211] focus:outline-none focus:border-[#121211] transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#121211] hover:bg-[#262624] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    إرسال الملخص على WhatsApp
                  </button>
                  <a
                    href={TAPP_WHATSAPP_BASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 bg-[#FAFAF8] hover:bg-[#EFEFEA] text-[#121211] border border-[#DFDFD8] font-semibold text-sm rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>تواصل مباشر</span>
                  </a>
                </div>
              </form>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { navigate } from '../router';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FAFAF8] text-[#121211] flex flex-col justify-between selection:bg-[#121211] selection:text-[#FAFAF8] font-arabic antialiased"
    >
      {/* Minimal Header */}
      <header className="w-full border-b border-[#E8E8E4] bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-2.5"
            aria-label="العودة إلى الرئيسية TAPP"
          >
            <span
              dir="ltr"
              className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#121211]"
            >
              TAPP
            </span>
          </button>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md text-center">
          <span
            dir="ltr"
            className="inline-block font-mono-custom text-xs font-bold tracking-[0.24em] text-[#706E6B] uppercase bg-[#EFEFEA] border border-[#E2E2DC] px-3 py-1 rounded-full mb-6"
          >
            ERROR 404
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-[#121211] tracking-tight mb-3">
            الصفحة غير موجودة
          </h1>

          <p className="text-sm sm:text-base text-[#555552] leading-relaxed mb-8">
            الرابط الذي تحاول الوصول إليه غير متاح أو قد يكون تم تغييره.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#121211] hover:bg-[#262624] text-[#FAFAF8] font-bold text-sm rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>العودة للرئيسية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-[#E8E8E4] py-6 text-center">
        <span
          dir="ltr"
          className="font-mono-custom text-[11px] tracking-[0.2em] text-[#706E6B] uppercase"
        >
          TAPP — SMART BRAND PAGES
        </span>
      </footer>
    </div>
  );
};

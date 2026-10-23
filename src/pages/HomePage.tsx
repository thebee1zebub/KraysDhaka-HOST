import React, { useState } from 'react';
import { Link } from '../router';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PROCESS_STEPS, IMAGES, Product } from '../data/tailoringData';
import { ProductCard } from '../components/ProductCard';
import { useCatalog } from '../context/CatalogContext';

interface HomePageProps {
  onOpenConsultation: () => void;
  onSelectProductForConsultation: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenConsultation,
  onSelectProductForConsultation
}) => {
  const { products } = useCatalog();
  const [activeCollectionTab, setActiveCollectionTab] = useState<'All' | 'Essential' | 'Signature'>('All');

  const displayedProducts = products.filter((p) => {
    if (activeCollectionTab === 'All') return p.collection === 'Essential' || p.collection === 'Signature';
    return p.collection === activeCollectionTab;
  }).slice(0, 3);

  return (
    <div className="bg-white">
      {/* 1. HERO — Minimalist Editorial Presence */}
      <section className="border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
              <div className="space-y-3">
                <span className="text-[11px] tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
                  Bespoke & Made to Measure · Dhaka
                </span>
                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal leading-[1.08] tracking-tight">
                  KRAYS DHAKA
                </h1>
                <p className="font-editorial text-2xl sm:text-3xl text-[#333333] font-light italic">
                  Creating Icons, Not Suits.
                </p>
              </div>

              <div className="w-10 h-[1px] bg-[#111111]" />

              <p className="text-xs sm:text-sm text-[#555555] font-sans-ui leading-relaxed max-w-sm">
                Considered tailoring. Individual character. A fit that feels entirely your own.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/collections"
                  className="px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-medium text-[#111111] border border-[#111111] hover:bg-neutral-50 transition-colors text-center inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-6 border-t border-[#EAEAEA] flex items-center gap-8 text-xs text-[#666666]">
                <div>
                  <span className="block font-semibold text-[#111111] tabular-nums">From ৳6,000</span>
                  <span className="text-[11px] text-[#777777]">Essential Suits</span>
                </div>
                <div>
                  <span className="block font-semibold text-[#111111] tabular-nums">From ৳8,500</span>
                  <span className="text-[11px] text-[#777777]">Signature Suits</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Portrait */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-neutral-100 border border-[#E5E5E5]">
                <img
                  src={IMAGES.hero}
                  alt="KRAYS DHAKA tailored gentleman"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED COLLECTIONS — Uncluttered & Direct */}
      <section className="py-16 sm:py-24 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E5E5E5]">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
                The House Tailoring
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
                Curated Collections
              </h2>
            </div>

            {/* Restrained Filter Tabs */}
            <div className="flex items-center gap-2">
              {(['All', 'Essential', 'Signature'] as const).map((tab) => {
                const isActive = activeCollectionTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCollectionTab(tab)}
                    className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-white'
                        : 'text-[#666666] hover:text-[#111111] bg-neutral-100'
                    }`}
                  >
                    {tab === 'All' ? 'All Pieces' : tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectForConsultation={onSelectProductForConsultation}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase font-semibold text-[#111111] hover:opacity-70 transition-opacity"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. BESPOKE & THE PROCESS — Quiet Editorial Harmony */}
      <section className="py-16 sm:py-24 border-b border-[#E5E5E5] bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Atelier Image */}
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] bg-neutral-200 border border-[#E5E5E5] overflow-hidden">
                <img
                  src={IMAGES.craft}
                  alt="Tailor hands handcrafting bespoke canvas"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Narrative & Process */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
                  Craft & Atelier
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-normal leading-tight">
                  Made Around You.
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#555555] font-sans-ui leading-relaxed">
                Every commission begins with your preferences, your posture, and the way you wear a suit. From hand-padded floating canvas to custom silhouette drafting, clothing is made personal rather than standardised.
              </p>

              {/* 4 Simple Process Points */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {PROCESS_STEPS.map((step) => (
                  <div key={step.number} className="p-3 bg-white border border-[#EAEAEA]">
                    <span className="font-mono text-xs font-semibold text-[#111111] block mb-0.5">
                      {step.number}
                    </span>
                    <h3 className="text-xs font-medium text-[#111111]">{step.title}</h3>
                    <p className="text-[11px] text-[#666666] font-sans-ui mt-0.5 line-clamp-1">
                      {step.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/bespoke"
                  className="px-6 py-3 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Discover Bespoke</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="px-5 py-3 text-xs tracking-[0.14em] uppercase font-medium text-[#111111] border border-neutral-300 hover:border-black transition-colors cursor-pointer"
                >
                  Book Fitting
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UNDERSTATED INVITATION */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 space-y-5">
          <p className="font-editorial text-xl sm:text-2xl text-[#333333] font-light italic">
            "Personal style is not a uniform. It is a point of view."
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-normal">
            Your Next Suit Starts With a Conversation.
          </h2>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule a Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

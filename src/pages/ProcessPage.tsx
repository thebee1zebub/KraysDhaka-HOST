import React from 'react';
import { ArrowUpRight, MessageCircle, Check, HelpCircle } from 'lucide-react';
import { PROCESS_STEPS, BRAND_CONFIG, IMAGES } from '../data/tailoringData';
import { generateWhatsAppUrl } from '../utils/tailoring';

interface ProcessPageProps {
  onOpenConsultation: () => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ onOpenConsultation }) => {
  const whatsappUrl = generateWhatsAppUrl(
    BRAND_CONFIG.whatsappNumber,
    'Hello KRAYS DHAKA Atelier. I have a few questions regarding the tailoring process and timing.'
  );

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-[#E5E5E5] py-16 sm:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-4">
          <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
            The Journey
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal tracking-tight">
            The Tailoring Process
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans-ui max-w-2xl leading-relaxed">
            From the initial consultation in Dhaka to the final press, every step is designed to make tailoring transparent, enjoyable, and tailored to your individual rhythm.
          </p>
        </div>
      </section>

      {/* Preparation Guide: What to Bring & What to Expect */}
      <section className="py-16 sm:py-20 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-[#E5E5E5] bg-white space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#777777] font-mono block">Preparation</span>
              <h3 className="font-editorial text-2xl text-[#111111] font-medium">What to Prepare</h3>
              <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                Think about the occasions you intend to wear the suit for, your comfort in warmer versus cooler environments, and any personal fit preferences from garments you currently own.
              </p>
            </div>

            <div className="p-6 border border-[#E5E5E5] bg-white space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#777777] font-mono block">Reference</span>
              <h3 className="font-editorial text-2xl text-[#111111] font-medium">Style References</h3>
              <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                You are warmly encouraged to bring photos of lapel widths, silhouettes, or specific outfits you admire. We will review how to adapt them to your proportions.
              </p>
            </div>

            <div className="p-6 border border-[#E5E5E5] bg-white space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#777777] font-mono block">Timing</span>
              <h3 className="font-editorial text-2xl text-[#111111] font-medium">Clear Communication</h3>
              <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                We clearly communicate expected fitting schedules based on your selected service and fabric mill. You are kept informed throughout the garment assembly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Detailed Steps */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="max-w-xl space-y-2">
            <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
              Step-by-Step
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
              From Inquiry to Garment Completion
            </h2>
          </div>

          <div className="space-y-16">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-[#EAEAEA] last:border-b-0 items-start"
              >
                {/* Number & Headline */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#111111] tracking-wider">
                      {step.number}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#888888] font-sans-ui">
                      Phase {step.number}
                    </span>
                  </div>
                  <h3 className="font-editorial text-3xl text-[#111111] font-medium tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs tracking-wider uppercase text-[#666666] font-sans-ui">
                    {step.subtitle}
                  </p>
                </div>

                {/* Description & Concrete Actions */}
                <div className="lg:col-span-8 space-y-5">
                  <p className="text-sm sm:text-base text-[#444444] font-sans-ui leading-relaxed">
                    {step.description}
                  </p>

                  <div className="p-6 bg-neutral-50 border border-[#E5E5E5] space-y-3">
                    <h4 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#222222]">
                      Key Actions During this Step:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#555555]">
                      {step.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions & WhatsApp Dialogue Strip */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="font-editorial text-2xl sm:text-3xl text-white font-medium">
              Have Specific Questions Before Booking?
            </h3>
            <p className="text-xs text-neutral-400 font-sans-ui max-w-lg leading-relaxed">
              Our team is available to discuss fabric suitability, wedding timelines, or style recommendations directly via WhatsApp or phone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-[#111111] bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Schedule Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

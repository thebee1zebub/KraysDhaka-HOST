import React from 'react';
import { Link } from '../router';
import { ArrowUpRight, ArrowRight, Check, Scissors, Layers, Ruler, UserCheck } from 'lucide-react';
import { IMAGES, FAQS } from '../data/tailoringData';
import { FaqAccordion } from '../components/FaqAccordion';

interface BespokePageProps {
  onOpenConsultation: () => void;
}

export const BespokePage: React.FC<BespokePageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="border-b border-[#E5E5E5] py-16 sm:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
                The Zenith of Menswear
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal leading-[1.1] tracking-tight">
                Hand-Cut Bespoke Tailoring
              </h1>
              <p className="text-sm sm:text-base text-[#444444] font-sans-ui leading-relaxed max-w-xl">
                Bespoke is not simply custom clothing; it is the creation of a singular garment built entirely from a virgin paper pattern drafted around your anatomy, your posture, and your personal vision.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Commission Bespoke</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <Link
                  to="/process"
                  className="px-6 py-3.5 text-xs tracking-[0.14em] uppercase font-medium text-[#111111] border border-[#CCCCCC] hover:border-black transition-colors"
                >
                  View Fitting Stages
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200 border border-[#E5E5E5]">
                <img
                  src={IMAGES.craft}
                  alt="Master tailor handcrafting canvas lapel"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinction Table: Bespoke vs Made-to-Measure */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
              Clarity & Understanding
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
              Understanding the Distinction
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] font-sans-ui leading-relaxed">
              We offer both Made-to-Measure (Essential & Signature) and pure Hand-Cut Bespoke. Here is how they compare in craft, execution, and fitting stages.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#E5E5E5]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-xs uppercase tracking-wider text-[#333333]">
                  <th className="p-4 sm:p-5 font-semibold">Craft Dimension</th>
                  <th className="p-4 sm:p-5 font-semibold">Made-to-Measure (Essential & Signature)</th>
                  <th className="p-4 sm:p-5 font-semibold bg-[#F5F5F5] text-black">Bespoke Tailoring</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA] text-[#555555]">
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-[#111111]">Pattern Origin</td>
                  <td className="p-4 sm:p-5">Modifications applied to established house block master</td>
                  <td className="p-4 sm:p-5 bg-[#FAFAFA] font-medium text-[#111111]">Unique 2D paper pattern drafted from scratch</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-[#111111]">Measurements & Posture</td>
                  <td className="p-4 sm:p-5">15–20 measurements covering lengths, chest, and waist</td>
                  <td className="p-4 sm:p-5 bg-[#FAFAFA] font-medium text-[#111111]">30+ anatomical measurements plus slope, pitch, and posture</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-[#111111]">Internal Canvas</td>
                  <td className="p-4 sm:p-5">Half-canvas or signature canvas chest piece</td>
                  <td className="p-4 sm:p-5 bg-[#FAFAFA] font-medium text-[#111111]">Full floating horsehair canvas body, hand-padded</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-[#111111]">Fitting Stages</td>
                  <td className="p-4 sm:p-5">1 intermediate fitting + final delivery trial</td>
                  <td className="p-4 sm:p-5 bg-[#FAFAFA] font-medium text-[#111111]">Basted skeleton trial + intermediate + final refinement</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-[#111111]">Hand Finishes</td>
                  <td className="p-4 sm:p-5">Hand-shanked buttons, pick-stitched perimeters</td>
                  <td className="p-4 sm:p-5 bg-[#FAFAFA] font-medium text-[#111111]">Hand-sewn milanese buttonholes, hand-set collar & sleeves</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-[#111111]">Starting Price</td>
                  <td className="p-4 sm:p-5 font-semibold text-[#111111] tabular-nums">From ৳6,000 (Essential) / ৳8,500 (Signature)</td>
                  <td className="p-4 sm:p-5 bg-[#FAFAFA] font-semibold text-[#111111]">Individual quotation based on fabric and labor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The 4 Pillars of Bespoke */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5E5] bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
              The Pillars
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
              The Bespoke Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] font-sans-ui leading-relaxed">
              Every hand-cut garment relies on four interconnected tenets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white border border-[#E5E5E5] space-y-3">
              <Scissors className="w-5 h-5 text-[#111111]" />
              <h3 className="font-editorial text-xl font-medium text-[#111111]">Individual Pattern</h3>
              <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                We cut a bespoke paper pattern drafted solely for you. This physical pattern remains in our Dhaka archive for your future commissions.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E5E5E5] space-y-3">
              <Layers className="w-5 h-5 text-[#111111]" />
              <h3 className="font-editorial text-xl font-medium text-[#111111]">Full Floating Canvas</h3>
              <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                Horsehair and wool canvas is stitched between fabric and lining without adhesives. As you wear the suit, body warmth molds the canvas to your chest.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E5E5E5] space-y-3">
              <Ruler className="w-5 h-5 text-[#111111]" />
              <h3 className="font-editorial text-xl font-medium text-[#111111]">Basted Fittings</h3>
              <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                Experience a traditional white-thread basted trial. The suit is temporarily assembled so our cutter can alter balance and shoulder pitch.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E5E5E5] space-y-3">
              <UserCheck className="w-5 h-5 text-[#111111]" />
              <h3 className="font-editorial text-xl font-medium text-[#111111]">Complete Ownership</h3>
              <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                From monogramming and lapel belly width to internal pocket layouts and lining silk, you have complete creative authority over every detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atelier Fitting Gallery */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] bg-neutral-100 border border-[#E5E5E5] overflow-hidden">
                <img
                  src={IMAGES.fitting}
                  alt="Fitting session at KRAYS DHAKA atelier"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
                The Fitting Room
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium leading-tight">
                Where Nuance Becomes Perfection
              </h2>
              <p className="text-xs sm:text-sm text-[#444444] font-sans-ui leading-relaxed">
                A gentleman does not look in the mirror to judge the suit; he looks to judge how he feels within it. In our private Dhaka atelier, fittings are unhurried sessions focused on collar adherence, drape, and arm movement.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#555555]">
                  <Check className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Private one-on-one appointments without showroom distraction</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#555555]">
                  <Check className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Natural lighting evaluation for true cloth color perception</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#555555]">
                  <Check className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Continuous pattern calibration retained on file</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Reserve a Fitting</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke FAQ Section */}
      <section className="py-20 sm:py-28 bg-[#FAFAFA] border-b border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
              Inquiries & Guidance
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
              Frequently Asked Questions
            </h2>
          </div>

          <FaqAccordion limit={5} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 sm:py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-6">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
            Commission Your Bespoke Garment
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] font-sans-ui max-w-lg mx-auto leading-relaxed">
            Reach out to our Dhaka atelier to begin your pattern draft and cloth selection.
          </p>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="px-8 py-4 text-xs tracking-[0.18em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Book Private Consultation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

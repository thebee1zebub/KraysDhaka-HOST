import React from 'react';
import { Link } from '../router';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG, IMAGES } from '../data/tailoringData';

interface StoryPageProps {
  onOpenConsultation: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-[#E5E5E5] py-16 sm:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-4">
          <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
            The Atelier Philosophy
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal tracking-tight">
            Our Story
          </h1>
          <p className="font-editorial text-2xl sm:text-3xl text-[#333333] font-light italic">
            "{BRAND_CONFIG.tagline}"
          </p>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium leading-tight">
                  A More Personal Approach to Tailoring.
                </h2>
                <div className="w-12 h-[1px] bg-[#111111]" />
              </div>

              <div className="space-y-5 text-sm sm:text-base text-[#444444] font-sans-ui leading-relaxed">
                <p className="text-base sm:text-lg text-[#111111] font-medium leading-relaxed">
                  Rooted in the traditions of classic menswear and shaped by contemporary individuality, KRAYS DHAKA approaches tailoring as a process of creating garments around the person who wears them.
                </p>

                <p>
                  For generations, formal tailoring has too often oscillated between two extremes: rigid, stiff uniformity disconnected from daily comfort, or hurried mass production that ignores the subtleties of human posture and climate.
                </p>

                <p>
                  At KRAYS DHAKA, we see tailoring differently. A garment must be responsive. In Dhaka, where humidity, social gatherings, and professional demands intersect, clothing must maintain crisp structure without suffocating the wearer.
                </p>

                <p>
                  We focus on the dialogue: taking the time to understand your lifestyle, your stance, and how you naturally hold yourself. By harmonizing traditional floating canvas construction with breathable natural fibers and individualized proportions, we create garments that feel entirely your own from the very first wear.
                </p>
              </div>

              {/* Guiding Principles */}
              <div className="pt-6 border-t border-[#EAEAEA] grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-editorial text-xl font-medium text-[#111111]">
                    Proportion Over Trends
                  </h3>
                  <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                    Trends pass swiftly, but clean lines, balanced lapels, and proper trouser breaks retain their elegance across decades.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-editorial text-xl font-medium text-[#111111]">
                    Individual Dialogue
                  </h3>
                  <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
                    Tailoring is not a transaction; it is a partnership between cutter and wearer to express your authentic personal character.
                  </p>
                </div>
              </div>
            </div>

            {/* Atelier Image */}
            <div className="lg:col-span-5 space-y-6">
              <div className="aspect-[4/5] bg-neutral-100 border border-[#E5E5E5] overflow-hidden">
                <img
                  src={IMAGES.fitting}
                  alt="Fitting and dialogue in KRAYS DHAKA atelier"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-[#777777] font-sans-ui italic text-center">
                Atelier session in Dhaka: focusing on shoulder balance and collar line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Visual Block */}
      <section className="py-20 sm:py-28 bg-[#FAFAFA] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] bg-neutral-200 border border-[#E5E5E5] overflow-hidden">
                <img
                  src={IMAGES.craft}
                  alt="Tailor hands stitching lapel canvas"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
                The Touch of Hands
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
                The Integrity of Craft
              </h2>
              <p className="text-xs sm:text-sm text-[#555555] font-sans-ui leading-relaxed">
                We take immense pride in the unhurried craft of tailoring. Hand-padded lapels that hold their curve without harsh adhesives, hand-shanked horn buttons that pivot gracefully, and clean interior linings that whisper quiet luxury.
              </p>
              <div className="pt-2">
                <Link
                  to="/collections"
                  className="px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Our Garments</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-6">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium">
            Begin Your Tailoring Experience
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] font-sans-ui max-w-lg mx-auto leading-relaxed">
            We welcome you to visit our Dhaka atelier for an unhurried, thoughtful consultation.
          </p>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="px-8 py-4 text-xs tracking-[0.18em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Book a Consultation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

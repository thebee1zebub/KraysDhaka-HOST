import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/tailoringData';

interface FaqAccordionProps {
  items?: typeof FAQS;
  limit?: number;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items = FAQS, limit }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const displayItems = limit ? items.slice(0, limit) : items;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
      {displayItems.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="py-5">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer focus-visible:outline-neutral-900"
              aria-expanded={isOpen}
            >
              <span className="font-editorial text-lg sm:text-xl text-[#111111] group-hover:text-black font-medium transition-colors">
                {faq.question}
              </span>
              <span
                className={`p-1 text-[#666666] group-hover:text-black transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>
            {isOpen && (
              <div className="pt-3 pr-8 pb-1">
                <p className="text-xs sm:text-sm text-[#555555] font-sans-ui leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

import React, { useState } from 'react';
import { CRAFT_DETAILS } from '../data/tailoringData';

export const SartorialAnatomy: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Tab Navigation List */}
      <div className="lg:col-span-5 space-y-1">
        {CRAFT_DETAILS.map((detail, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`w-full text-left p-4 transition-all duration-200 border cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-[#222222] border-[#EAEAEA] hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] tracking-[0.2em] uppercase font-mono ${
                  isActive ? 'text-neutral-400' : 'text-[#888888]'
                }`}>
                  Detail 0{index + 1}
                </span>
                <span className={`text-xs ${isActive ? 'text-white' : 'text-[#888888]'}`}>
                  {isActive ? '●' : '○'}
                </span>
              </div>
              <h4 className="font-editorial text-lg sm:text-xl font-medium mt-1">
                {detail.title}
              </h4>
              <p className={`text-xs font-sans-ui mt-0.5 line-clamp-1 ${
                isActive ? 'text-neutral-300' : 'text-[#666666]'
              }`}>
                {detail.summary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail Display Panel */}
      <div className="lg:col-span-7 bg-[#FAFAFA] border border-[#E5E5E5] p-8 sm:p-12 relative">
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#777777] font-mono block mb-2">
          Sartorial Discipline · KRAYS DHAKA
        </span>
        <h3 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium leading-tight">
          {CRAFT_DETAILS[activeTab].title}
        </h3>
        <p className="text-sm font-medium text-[#444444] font-sans-ui mt-2">
          {CRAFT_DETAILS[activeTab].summary}
        </p>

        <div className="my-6 w-12 h-[1px] bg-[#111111]" />

        <p className="text-sm sm:text-base text-[#444444] font-sans-ui leading-relaxed">
          {CRAFT_DETAILS[activeTab].description}
        </p>

        <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#777777] font-sans-ui">
          <span>Atelier Standards</span>
          <span>Savile Row Heritage · Dhaka Climate Considered</span>
        </div>
      </div>
    </div>
  );
};

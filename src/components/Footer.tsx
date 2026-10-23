import React from 'react';
import { Link } from '../router';
import { ArrowUpRight, MessageCircle, Instagram } from 'lucide-react';
import { BRAND_CONFIG } from '../data/tailoringData';
import { generateWhatsAppUrl } from '../utils/tailoring';

interface FooterProps {
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  const currentYear = new Date().getFullYear();
  const directWhatsAppUrl = generateWhatsAppUrl(
    BRAND_CONFIG.whatsappNumber,
    `Hello KRAYS DHAKA Atelier. I would like to inquire about private tailoring consultations in Dhaka.`
  );

  return (
    <footer className="bg-[#0B0B0B] text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-10">
        {/* Main row: Brand + Quick Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl tracking-[0.18em] uppercase font-semibold text-white">
              {BRAND_CONFIG.name}
            </h2>
            <p className="text-xs text-[#888888] font-sans-ui italic">
              {BRAND_CONFIG.tagline}
            </p>
          </div>

          {/* Clean minimal nav */}
          <nav className="flex flex-wrap items-center gap-6 text-xs tracking-wider uppercase text-[#888888]">
            <Link to="/collections" className="hover:text-white transition-colors">
              Collections
            </Link>
            <Link to="/bespoke" className="hover:text-white transition-colors">
              Bespoke
            </Link>
            <Link to="/process" className="hover:text-white transition-colors">
              The Process
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenConsultation}
              className="px-4 py-2.5 text-xs tracking-[0.14em] uppercase font-semibold text-[#111111] bg-white hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 text-xs text-white border border-neutral-700 hover:border-neutral-500 transition-colors inline-flex items-center gap-1.5"
              aria-label="Direct WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#666666]">
          <p>© {currentYear} {BRAND_CONFIG.name}. Dhaka, Bangladesh.</p>
          <div className="flex items-center gap-4">
            <a
              href={BRAND_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{BRAND_CONFIG.instagramHandle}</span>
            </a>
            <span aria-hidden="true">·</span>
            <span>By Private Appointment Only</span>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-white transition-colors text-neutral-500">
              Atelier Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Check,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/tailoringData';
import {
  ConsultationInquiry,
  validateConsultationForm,
  generateWhatsAppMessage,
  generateWhatsAppUrl
} from '../utils/tailoring';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ConsultationInquiry>({
    fullName: '',
    phone: '',
    preferredContact: 'WhatsApp',
    garmentType: 'Single-Breasted Suit',
    collection: 'Essential',
    occasion: 'Executive / Business',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentReference, setAppointmentReference] = useState('');

  const directWhatsAppUrl = generateWhatsAppUrl(
    BRAND_CONFIG.whatsappNumber,
    'Hello KRAYS DHAKA Atelier. I would like to schedule a private tailoring appointment in Dhaka.'
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateConsultationForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `KD-${Math.floor(100000 + Math.random() * 900000)}`;
      setAppointmentReference(ref);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 350);
  };

  const whatsAppUrl = generateWhatsAppUrl(
    BRAND_CONFIG.whatsappNumber,
    generateWhatsAppMessage(formData)
  );

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-[#E5E5E5] py-12 sm:py-16 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-2">
          <span className="text-[10px] tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
            Atelier Inquiries
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#111111] font-normal tracking-tight">
            Contact & Consultation
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans-ui max-w-lg leading-relaxed">
            Private fittings and fabric consultations at our Dhaka salon, strictly by prior appointment.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 sm:py-20 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Atelier Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <h2 className="font-editorial text-2xl text-[#111111] font-medium">
                  The Dhaka Atelier
                </h2>
                <p className="text-xs text-[#666666] leading-relaxed">
                  We welcome you to visit for a private fitting and bespoke cloth selection.
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#444444] border-t border-[#EAEAEA] pt-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111]">Location</strong>
                    <p className="text-[#666666]">{BRAND_CONFIG.location}</p>
                    <p className="text-[11px] text-[#888888]">{BRAND_CONFIG.addressNote}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111]">Timings</strong>
                    <p className="text-[#666666]">{BRAND_CONFIG.consultationHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Instagram className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111]">Instagram</strong>
                    <a
                      href={BRAND_CONFIG.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#111111] hover:underline"
                    >
                      {BRAND_CONFIG.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-xs tracking-wider uppercase font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Streamlined Form */}
            <div className="lg:col-span-7 bg-white border border-[#E5E5E5] p-6 sm:p-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <h3 className="font-editorial text-2xl text-[#111111] font-medium pb-3 border-b border-[#E5E5E5]">
                    Request a Consultation
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-fullName" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className={`w-full px-3 py-2 text-xs text-[#111111] bg-white border ${
                          errors.fullName ? 'border-red-500' : 'border-[#CCCCCC] focus:border-[#111111]'
                        } outline-none`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                        Phone or WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+880 1700-000000"
                        className={`w-full px-3 py-2 text-xs text-[#111111] bg-white border ${
                          errors.phone ? 'border-red-500' : 'border-[#CCCCCC] focus:border-[#111111]'
                        } outline-none`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-collection" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                        Collection
                      </label>
                      <select
                        id="contact-collection"
                        name="collection"
                        value={formData.collection}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-2 text-xs text-[#111111] bg-white border border-[#CCCCCC] focus:border-[#111111] outline-none cursor-pointer"
                      >
                        <option value="Essential">Essential (from ৳6,000)</option>
                        <option value="Signature">Signature (from ৳8,500)</option>
                        <option value="Bespoke">Hand-Cut Bespoke</option>
                        <option value="Not Sure Yet">Not Sure Yet</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-garmentType" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                        Garment
                      </label>
                      <select
                        id="contact-garmentType"
                        name="garmentType"
                        value={formData.garmentType}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-2 text-xs text-[#111111] bg-white border border-[#CCCCCC] focus:border-[#111111] outline-none cursor-pointer"
                      >
                        <option value="Single-Breasted Suit">Single-Breasted Suit</option>
                        <option value="Double-Breasted Suit">Double-Breasted Suit</option>
                        <option value="Formalwear / Tuxedo">Formalwear / Tuxedo</option>
                        <option value="Hand-Cut Bespoke Suit">Bespoke Suit</option>
                        <option value="Shirt & Trouser Separates">Shirt & Trousers</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-notes" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                      Notes or Occasion <span className="text-[10px] text-[#888888] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="contact-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Wedding reception, charcoal wool preferred"
                      className="w-full px-3 py-2 text-xs text-[#111111] bg-white border border-[#CCCCCC] focus:border-[#111111] outline-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors cursor-pointer text-center"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Appointment'}
                    </button>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 text-xs tracking-wider uppercase font-medium text-[#111111] border border-[#CCCCCC] hover:border-black transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-10 h-10 mx-auto bg-[#111111] text-white flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl text-[#111111] font-medium">
                      Consultation Requested
                    </h3>
                    <p className="text-xs text-[#666666] font-sans-ui mt-1">
                      Reference: <strong className="font-mono text-[#111111]">{appointmentReference}</strong>
                    </p>
                  </div>
                  <p className="text-xs text-[#555555] max-w-sm mx-auto leading-relaxed">
                    Thank you, {formData.fullName}. We will contact you at {formData.phone} shortly to confirm your appointment at our Dhaka salon.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-2.5 text-xs uppercase tracking-wider font-medium text-[#111111] border border-[#CCCCCC] hover:border-black cursor-pointer"
                    >
                      New Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Check, ArrowUpRight, MessageCircle, AlertCircle } from 'lucide-react';
import { BRAND_CONFIG, Product } from '../data/tailoringData';
import {
  ConsultationInquiry,
  validateConsultationForm,
  generateWhatsAppMessage,
  generateWhatsAppUrl
} from '../utils/tailoring';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
  initialCollection?: 'Essential' | 'Signature' | 'Bespoke' | 'Not Sure Yet';
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedProduct,
  initialCollection
}) => {
  const [formData, setFormData] = useState<ConsultationInquiry>({
    fullName: '',
    phone: '',
    preferredContact: 'WhatsApp',
    garmentType: preselectedProduct ? preselectedProduct.name : 'Made-to-Measure Suit',
    collection: initialCollection || (preselectedProduct ? preselectedProduct.collection : 'Essential'),
    occasion: 'Executive / Business',
    notes: preselectedProduct ? `Inquiring about ${preselectedProduct.name}.` : ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentReference, setAppointmentReference] = useState('');

  if (!isOpen) return null;

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
      const refCode = `KD-${Math.floor(100000 + Math.random() * 900000)}`;
      setAppointmentReference(refCode);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 350);
  };

  const whatsAppUrl = generateWhatsAppUrl(
    BRAND_CONFIG.whatsappNumber,
    generateWhatsAppMessage(formData)
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
    >
      <div className="relative bg-white w-full max-w-lg border border-[#E5E5E5] shadow-xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="pb-4 mb-5 border-b border-[#E5E5E5] pr-6">
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#777777] font-mono block mb-1">
                KRAYS DHAKA Atelier
              </span>
              <h2
                id="consultation-modal-title"
                className="font-editorial text-2xl sm:text-3xl text-[#111111] font-medium"
              >
                Book a Consultation
              </h2>
              <p className="text-xs text-[#555555] font-sans-ui mt-1">
                Private fittings and cloth consultations in Dhaka.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="modal-name"
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
                <label htmlFor="modal-phone" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                  Phone or WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="modal-phone"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-collection" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                    Collection
                  </label>
                  <select
                    id="modal-collection"
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
                  <label htmlFor="modal-garment" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                    Garment
                  </label>
                  <select
                    id="modal-garment"
                    name="garmentType"
                    value={formData.garmentType}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-2 text-xs text-[#111111] bg-white border border-[#CCCCCC] focus:border-[#111111] outline-none cursor-pointer"
                  >
                    <option value="Single-Breasted Suit">Single-Breasted</option>
                    <option value="Double-Breasted Suit">Double-Breasted</option>
                    <option value="Formalwear / Tuxedo">Formal / Tuxedo</option>
                    <option value="Hand-Cut Bespoke Suit">Bespoke Suit</option>
                    <option value="Shirt & Trousers">Shirt & Trousers</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="modal-notes" className="block text-xs uppercase tracking-[0.12em] font-medium text-[#222222] mb-1">
                  Notes or Occasion <span className="text-[10px] text-[#888888] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="modal-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Wedding in December, navy wool"
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
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-10 h-10 mx-auto bg-[#111111] text-white flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-editorial text-2xl text-[#111111] font-medium">
                Appointment Requested
              </h3>
              <p className="text-xs text-[#666666] font-sans-ui mt-1">
                Reference: <strong className="font-mono text-[#111111]">{appointmentReference}</strong>
              </p>
            </div>

            <p className="text-xs text-[#555555] max-w-xs mx-auto leading-relaxed">
              We have received your request for <strong>{formData.fullName}</strong>. We will confirm your fitting time at our Dhaka salon shortly.
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
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-4 py-2.5 text-xs uppercase tracking-wider font-medium text-[#111111] border border-[#CCCCCC] hover:border-black cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

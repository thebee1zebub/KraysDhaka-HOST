import { Product, BRAND_CONFIG } from '../data/tailoringData';

export interface ConsultationInquiry {
  fullName: string;
  phone: string;
  email?: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  garmentType: string;
  collection: 'Essential' | 'Signature' | 'Bespoke' | 'Not Sure Yet';
  occasion: string;
  preferredDate?: string;
  budgetRange?: string;
  notes?: string;
}

export function formatBDT(amount: number | null): string {
  if (amount === null || amount === undefined) {
    return 'Quotation on Consultation';
  }
  return `৳${amount.toLocaleString('en-US')}`;
}

export function validateConsultationForm(data: Partial<ConsultationInquiry>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please provide your full name (at least 2 characters).';
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Please provide your phone or WhatsApp number.';
  } else {
    // Strip common formatting and check for at least 7 digits
    const digitsOnly = data.phone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 8) {
      errors.phone = 'Please provide a valid contact number (at least 8 digits).';
    }
  }

  if (data.email && data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  if (!data.garmentType) {
    errors.garmentType = 'Please select a garment or service type.';
  }

  if (!data.collection) {
    errors.collection = 'Please select your preferred collection or consultation route.';
  }

  return errors;
}

export function generateWhatsAppMessage(data: ConsultationInquiry): string {
  const lines: string[] = [
    `*KRAYS DHAKA — Tailoring Consultation Request*`,
    ``,
    `*Client Name:* ${data.fullName.trim()}`,
    `*Contact Number:* ${data.phone.trim()}`,
    data.email ? `*Email:* ${data.email.trim()}` : null,
    `*Preferred Contact Method:* ${data.preferredContact}`,
    `*Garment Type:* ${data.garmentType}`,
    `*Selected Collection:* ${data.collection}`,
    data.occasion ? `*Intended Occasion:* ${data.occasion}` : null,
    data.preferredDate ? `*Preferred Date / Timing:* ${data.preferredDate}` : null,
    data.budgetRange ? `*Budget Consideration:* ${data.budgetRange}` : null,
    data.notes ? `*Style Reference / Notes:* ${data.notes.trim()}` : null,
    ``,
    `I would appreciate confirming an appointment slot at the Dhaka atelier.`,
    `Thank you.`
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface ProductFilterOptions {
  collection?: string;
  category?: string;
  searchQuery?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'name';
}

export function filterProducts(products: Product[], options: ProductFilterOptions): Product[] {
  return products.filter((item) => {
    if (options.collection && options.collection !== 'All') {
      if (item.collection !== options.collection) return false;
    }
    if (options.category && options.category !== 'All') {
      if (item.category !== options.category) return false;
    }
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchFabric = item.fabricDetails.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchFabric && !matchCategory) return false;
    }
    return true;
  }).sort((a, b) => {
    if (options.sort === 'price-asc') {
      return (a.startingPrice ?? 999999) - (b.startingPrice ?? 999999);
    }
    if (options.sort === 'price-desc') {
      return (b.startingPrice ?? 0) - (a.startingPrice ?? 0);
    }
    if (options.sort === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0; // default featured order
  });
}

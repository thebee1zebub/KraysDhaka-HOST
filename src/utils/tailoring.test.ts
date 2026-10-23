import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBDT,
  validateConsultationForm,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  filterProducts,
  ConsultationInquiry
} from './tailoring';
import { PRODUCTS } from '../data/tailoringData';

test('formatBDT formats price numbers with BDT symbol', () => {
  assert.equal(formatBDT(6000), '৳6,000');
  assert.equal(formatBDT(8500), '৳8,500');
  assert.equal(formatBDT(null), 'Quotation on Consultation');
});

test('validateConsultationForm detects missing or invalid fields', () => {
  const invalidResult = validateConsultationForm({});
  assert.ok(invalidResult.fullName);
  assert.ok(invalidResult.phone);
  assert.ok(invalidResult.garmentType);
  assert.ok(invalidResult.collection);

  const shortPhoneResult = validateConsultationForm({
    fullName: 'Rahim Khan',
    phone: '123',
    garmentType: 'Bespoke Suit',
    collection: 'Signature'
  });
  assert.ok(shortPhoneResult.phone);
  assert.equal(shortPhoneResult.fullName, undefined);

  const validResult = validateConsultationForm({
    fullName: 'Rahim Khan',
    phone: '+8801711223344',
    garmentType: 'Bespoke Suit',
    collection: 'Signature'
  });
  assert.deepEqual(validResult, {});
});

test('generateWhatsAppMessage creates professional formal inquiry text', () => {
  const mockInquiry: ConsultationInquiry = {
    fullName: 'Tanvir Ahmed',
    phone: '+8801819999999',
    preferredContact: 'WhatsApp',
    garmentType: 'Double-Breasted Suit',
    collection: 'Signature',
    occasion: 'Winter Wedding Reception',
    preferredDate: '2026-11-15',
    budgetRange: '৳10,000 - ৳25,000',
    notes: 'Prefer dark navy with sharp peak lapels and side adjusters.'
  };

  const message = generateWhatsAppMessage(mockInquiry);
  assert.ok(message.includes('KRAYS DHAKA'));
  assert.ok(message.includes('Tanvir Ahmed'));
  assert.ok(message.includes('Signature'));
  assert.ok(message.includes('Double-Breasted Suit'));
  assert.ok(message.includes('Dhaka'));
});

test('generateWhatsAppUrl builds valid wa.me URL', () => {
  const url = generateWhatsAppUrl('8801700000000', 'Hello Atelier');
  assert.ok(url.startsWith('https://wa.me/8801700000000?text='));
  assert.ok(url.includes('Hello%20Atelier'));
});

test('filterProducts filters and sorts garments properly', () => {
  const essentialOnly = filterProducts(PRODUCTS, { collection: 'Essential' });
  assert.ok(essentialOnly.length > 0);
  assert.ok(essentialOnly.every(p => p.collection === 'Essential'));

  const signatureOnly = filterProducts(PRODUCTS, { collection: 'Signature' });
  assert.ok(signatureOnly.length > 0);
  assert.ok(signatureOnly.every(p => p.collection === 'Signature'));

  const searchResults = filterProducts(PRODUCTS, { searchQuery: 'pinstripe' });
  assert.ok(searchResults.length >= 2);
  assert.ok(searchResults.some(p => p.name.includes('Pinstripe')));

  const sortedByPriceAsc = filterProducts(PRODUCTS, { sort: 'price-asc' });
  assert.equal(sortedByPriceAsc[0].startingPrice, 6000);
});

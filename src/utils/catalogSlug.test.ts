import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProductSlug, generateUniqueProductId, formatPriceInput } from './catalogSlug';
import { calculateTargetDimensions, formatBytes } from './imageCompressor';

test('generateProductSlug handles standard English names', () => {
  assert.equal(generateProductSlug('Midnight Tuxedo'), 'midnight-tuxedo');
  assert.equal(generateProductSlug('  Royal 3-Piece Charcoal Suit!  '), 'royal-3-piece-charcoal-suit');
});

test('generateProductSlug handles accented and special characters', () => {
  assert.equal(generateProductSlug('Crêpe de Chine Blazer'), 'crepe-de-chine-blazer');
});

test('generateProductSlug handles non-ASCII / Bengali characters without empty result', () => {
  const bengaliSlug = generateProductSlug('নতুন শেরওয়ানি');
  assert.ok(bengaliSlug.startsWith('garment-'));
  assert.ok(bengaliSlug.length > 8);
});

test('generateUniqueProductId increments counter on duplicate collision', () => {
  const existing = ['midnight-tuxedo', 'midnight-tuxedo-1', 'charcoal-suit'];
  const uniqueId = generateUniqueProductId('Midnight Tuxedo', existing);
  assert.equal(uniqueId, 'midnight-tuxedo-2');
});

test('formatPriceInput parses clean numbers and strings', () => {
  assert.equal(formatPriceInput(8500), 8500);
  assert.equal(formatPriceInput('৳ 12,000'), 12000);
  assert.equal(formatPriceInput(''), null);
  assert.equal(formatPriceInput(null), null);
  assert.equal(formatPriceInput(-500), null);
});

test('calculateTargetDimensions scales down properly maintaining aspect ratio', () => {
  // Landscape 4000x3000 scaled to maxWidth 1000
  const landscape = calculateTargetDimensions(4000, 3000, 1000, 1333);
  assert.equal(landscape.width, 1000);
  assert.equal(landscape.height, 750);

  // Portrait 3000x4000 scaled to maxHeight 1200
  const portrait = calculateTargetDimensions(3000, 4000, 1000, 1200);
  assert.equal(portrait.height, 1200);
  assert.equal(portrait.width, 900);

  // Smaller image remains unscaled
  const small = calculateTargetDimensions(600, 800, 1000, 1333);
  assert.equal(small.width, 600);
  assert.equal(small.height, 800);
});

test('formatBytes formats file sizes correctly', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1024 * 45), '45.0 KB');
  assert.equal(formatBytes(1024 * 1024 * 2.5), '2.5 MB');
});

/**
 * Pure utility functions for catalog slug and ID generation.
 * Decoupled from React for deterministic testing with node:test.
 */

export function generateProductSlug(name: string, fallbackPrefix = 'garment'): string {
  if (!name || typeof name !== 'string') {
    return `${fallbackPrefix}-${Date.now()}`;
  }

  // Clean and normalize name
  const asciiSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (asciiSlug.length > 0) {
    return asciiSlug;
  }

  // If name contains only non-ASCII characters (e.g. Bengali), create a readable hash slug
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const cleanHash = Math.abs(hash).toString(36);
  return `${fallbackPrefix}-${cleanHash}`;
}

export function generateUniqueProductId(
  name: string,
  existingIds: string[],
  fallbackPrefix = 'garment'
): string {
  const baseSlug = generateProductSlug(name, fallbackPrefix);
  let candidate = baseSlug;
  let counter = 1;

  const idSet = new Set(existingIds.map((id) => id.toLowerCase()));

  while (idSet.has(candidate.toLowerCase())) {
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }

  return candidate;
}

export function formatPriceInput(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined || raw === '') return null;
  const num = typeof raw === 'number' ? raw : Number(String(raw).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num < 0) return null;
  return Math.round(num);
}

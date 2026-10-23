/**
 * KRAYS DHAKA - Cloudflare Worker API Client
 *
 * Interacts with:
 * - D1 Product Catalog API (/api/products, /api/admin/products)
 * - R2 Image Storage API (/api/admin/images/upload)
 * - Atelier Authentication API (/api/admin/login)
 */

import { Product } from '../data/tailoringData';

export interface BackendHealthResponse {
  status: string;
  service: string;
  d1: { configured: boolean; operational: boolean };
  r2: { configured: boolean };
  timestamp: number;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
}

export interface UploadImageResult {
  success: boolean;
  key: string;
  url: string;
  size: number;
  contentType: string;
}

const AUTH_TOKEN_KEY = 'krays_atelier_auth_token';

/**
 * Gets currently stored session token
 */
export function getStoredToken(): string | null {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Stores session token
 */
export function setStoredToken(token: string): void {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Clears session token
 */
export function clearStoredToken(): void {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Checks the operational status of Cloudflare D1 and R2 bindings
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse | null> {
  try {
    const res = await fetch('/api/health', {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as BackendHealthResponse;
  } catch {
    return null;
  }
}

/**
 * Authenticates with the atelier passcode or API key against the server
 */
export async function loginAdmin(passcode: string): Promise<AdminLoginResponse> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });

    const data = await res.json() as any;

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Atelier authentication rejected.',
      };
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    return {
      success: true,
      token: data.token,
      message: data.message,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unable to connect to atelier server.',
    };
  }
}

/**
 * Fetches all published products from Cloudflare D1
 */
export async function fetchPublishedProducts(): Promise<{ products: Product[]; error?: string }> {
  try {
    const res = await fetch('/api/products', {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        products: [],
        error: errData.error || `HTTP ${res.status}: Failed to fetch products.`,
      };
    }

    const data = await res.json() as { success: boolean; products: Product[] };
    return { products: data.products || [] };
  } catch (err: any) {
    return {
      products: [],
      error: err.message || 'Network error fetching catalog.',
    };
  }
}

/**
 * Fetches all products including drafts (admin only)
 */
export async function fetchAdminProducts(token?: string): Promise<{ products: Product[]; error?: string }> {
  const authToken = token || getStoredToken();
  if (!authToken) {
    return { products: [], error: 'Not authenticated as atelier administrator.' };
  }

  try {
    const res = await fetch('/api/admin/products', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        products: [],
        error: errData.error || `HTTP ${res.status}: Failed to fetch admin products.`,
      };
    }

    const data = await res.json() as { success: boolean; products: Product[] };
    return { products: data.products || [] };
  } catch (err: any) {
    return {
      products: [],
      error: err.message || 'Network error fetching admin catalog.',
    };
  }
}

/**
 * Uploads an image file to Cloudflare R2 via Worker endpoint
 */
export async function uploadImageToR2(
  file: File | Blob,
  token?: string
): Promise<UploadImageResult> {
  const authToken = token || getStoredToken();
  if (!authToken) {
    throw new Error('Unauthorized: please log in to the atelier portal first.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/images/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  });

  const data = await res.json() as any;

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload photography to Cloudflare R2.');
  }

  return data as UploadImageResult;
}

/**
 * Deletes an image from Cloudflare R2
 */
export async function deleteImageFromR2(key: string, token?: string): Promise<boolean> {
  const authToken = token || getStoredToken();
  if (!authToken) return false;

  try {
    const res = await fetch(`/api/admin/images/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Creates a new garment in Cloudflare D1
 */
export async function createProductInD1(
  product: Partial<Product> & { name: string; image: string },
  token?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const authToken = token || getStoredToken();
  if (!authToken) {
    return { success: false, error: 'Unauthorized: admin session missing.' };
  }

  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(product),
    });

    const data = await res.json() as any;

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.details || 'Failed to create garment in D1 database.',
      };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error saving garment.' };
  }
}

/**
 * Updates an existing garment in Cloudflare D1
 */
export async function updateProductInD1(
  id: string,
  updates: Partial<Product>,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const authToken = token || getStoredToken();
  if (!authToken) {
    return { success: false, error: 'Unauthorized: admin session missing.' };
  }

  try {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json() as any;

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.details || 'Failed to update garment in D1 database.',
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error updating garment.' };
  }
}

/**
 * Toggles product published/draft status in D1
 */
export async function toggleProductStatusInD1(
  id: string,
  status: 'published' | 'draft',
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const authToken = token || getStoredToken();
  if (!authToken) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json() as any;
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to update status.' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error.' };
  }
}

/**
 * Deletes a garment from Cloudflare D1 and removes its R2 imagery
 */
export async function deleteProductFromD1(
  id: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const authToken = token || getStoredToken();
  if (!authToken) {
    return { success: false, error: 'Unauthorized: admin session missing.' };
  }

  try {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await res.json() as any;

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.details || 'Failed to delete garment.',
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error deleting garment.' };
  }
}

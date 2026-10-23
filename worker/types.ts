/**
 * Cloudflare Worker Environment and Database Type Definitions
 */

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }>;
  first<T = any>(colName?: string): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: any }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = any>(statements: D1PreparedStatement[]): Promise<Array<{ results: T[]; success: boolean }>>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface R2ObjectBody {
  body: ReadableStream;
  httpMetadata?: {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
    cacheExpiry?: Date;
  };
  customMetadata?: Record<string, string>;
  size: number;
  httpEtag: string;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob,
    options?: {
      httpMetadata?: {
        contentType?: string;
        cacheControl?: string;
      };
      customMetadata?: Record<string, string>;
    }
  ): Promise<any>;
  delete(keys: string | string[]): Promise<void>;
}

export interface Fetcher {
  fetch(request: Request | string, init?: RequestInit): Promise<Response>;
}

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  ASSETS?: Fetcher;
  ADMIN_API_KEY?: string;
  ADMIN_PASSCODE?: string;
}

export interface ProductDbRow {
  id: string;
  slug: string;
  name: string;
  collection: 'Essential' | 'Signature' | 'Bespoke';
  category: 'Suit' | 'Double-Breasted' | 'Formalwear' | 'Separates';
  starting_price: number | null;
  price_note: string | null;
  short_description: string;
  description: string;
  silhouette: string | null;
  fabric_details: string | null;
  lapel_style: string | null;
  construction: string | null;
  vents: string | null;
  buttons: string | null;
  image: string;
  features: string; // JSON array string
  status: 'published' | 'draft';
  created_at: number;
  updated_at: number;
}

export interface ProductImageDbRow {
  id: string;
  product_id: string;
  r2_key: string | null;
  url: string;
  alt_text: string | null;
  display_order: number;
  created_at: number;
}

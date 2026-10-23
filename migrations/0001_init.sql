-- KRAYS DHAKA Atelier - Cloudflare D1 Database Schema
-- Migration: 0001_init.sql
-- Defines persistent products and product_images tables

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  collection TEXT NOT NULL CHECK(collection IN ('Essential', 'Signature', 'Bespoke')),
  category TEXT NOT NULL CHECK(category IN ('Suit', 'Double-Breasted', 'Formalwear', 'Separates')),
  starting_price INTEGER,
  price_note TEXT,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  silhouette TEXT,
  fabric_details TEXT,
  lapel_style TEXT,
  construction TEXT,
  vents TEXT,
  buttons TEXT,
  image TEXT NOT NULL,
  features TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published', 'draft')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  r2_key TEXT,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, display_order);

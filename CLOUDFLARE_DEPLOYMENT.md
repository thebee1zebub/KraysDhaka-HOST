# KRAYS DHAKA - Cloudflare Workers, D1 & R2 Deployment Architecture

This document provides complete instructions for deploying the **KRAYS DHAKA** bespoke tailoring application to Cloudflare using:
1. **Cloudflare Workers Static Assets** (`./dist` frontend SPA)
2. **Cloudflare D1** (Serverless SQLite database for the shared, persistent product catalog)
3. **Cloudflare R2** (Zero-egress object storage for garment photography)
4. **Cloudflare Worker API** (`worker/index.ts` handling `/api/*`, `/api/images/*`, and admin authorization)

---

## 🏛️ Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │    Cloudflare Edge Worker (kraysdhaka-host)   │
                      └──────────────────────┬───────────────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
       [Static Assets]                 [/api/products]             [/api/images/:key]
       React / Vite SPA            Cloudflare D1 Database       Cloudflare R2 Object Storage
       (HTML, CSS, JS)            (Shared Garment Catalog)      (Garment High-Res Photography)
```

- **Shared Catalog**: Product additions, edits, and deletions are saved directly to Cloudflare D1. Every visitor across all devices sees the exact same real-time catalog.
- **Image Persistence**: Photos uploaded from the Atelier Portal are streamed directly to Cloudflare R2 and served via `/api/images/:key` with edge caching headers (`Cache-Control: public, max-age=31536000`). No base64 bloat in browser storage.
- **Security**: Write operations (`/api/admin/*`) require server-validated Bearer tokens generated from `ADMIN_API_KEY` or `ADMIN_PASSCODE`.

---

## 📋 Step-by-Step Cloudflare Setup Guide

### Prerequisites
Make sure you have Wrangler CLI installed and are logged into your Cloudflare account:
```bash
npx wrangler login
```

---

### Step 1: Create the Cloudflare D1 Database

In your project root, run:
```bash
npx wrangler d1 create kraysdhaka-db
```

Wrangler will output information similar to:
```toml
[[d1_databases]]
binding = "DB"
database_name = "kraysdhaka-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Open `wrangler.toml` in your repository and replace `PLACEHOLDER_D1_DATABASE_ID` with your real `database_id`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "kraysdhaka-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

### Step 2: Apply D1 Migrations & Seed Baseline House Suits

Apply the table schema and seed all 9 baseline KRAYS DHAKA house suits (so no existing products are lost):

```bash
# 1. Create 'products' and 'product_images' tables
npx wrangler d1 execute kraysdhaka-db --remote --file=./migrations/0001_init.sql

# 2. Seed baseline suits with exact IDs and details
npx wrangler d1 execute kraysdhaka-db --remote --file=./migrations/0002_seed_products.sql
```

*(For local testing with `wrangler dev`, replace `--remote` with `--local`).*

---

### Step 3: Create the Cloudflare R2 Bucket

Create the R2 bucket for storing uploaded garment photography:
```bash
npx wrangler r2 bucket create kraysdhaka-images
```

Your `wrangler.toml` is already pre-configured to bind this bucket:
```toml
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "kraysdhaka-images"
```

---

### Step 4: Configure the Atelier Admin Secret

Store your secret atelier passcode securely in Cloudflare Secrets (do not hardcode in source code):

```bash
npx wrangler secret put ADMIN_API_KEY
```
When prompted, enter your secure passcode (or your house default `Krays@Admin26`).

---

### Step 5: Build and Deploy

Compile the Vite frontend and deploy the Worker with its static assets and bindings:

#### Using Bun:
```bash
bun install
bun run build
npx wrangler deploy
```

#### Using npm:
```bash
npm install
npm run build
npm run deploy
```

Wrangler will upload your frontend assets to `./dist` and bind the `worker/index.ts` script to your D1 database (`DB`) and R2 bucket (`IMAGES`).

---

## 🔐 Atelier Administration & Verification

1. Open your deployed Worker URL:
   `https://kraysdhaka-host.<your-subdomain>.workers.dev/#/admin`
2. Enter your atelier passcode (`Krays@Admin26` or the custom secret configured in Step 4).
3. The **Atelier Health Strip** will show:
   - `Cloudflare D1: Connected & Operational`
   - `Cloudflare R2: Bucket Bound (kraysdhaka-images)`
4. Click **Add Garment**:
   - Choose a photo from your device. Notice the image uploads directly to your Cloudflare R2 bucket.
   - Fill in the garment specifications, collection tier, and pricing.
   - Click **Post & Publish Garment**.
5. Open an Incognito / Private window or visit on your phone:
   - Navigate to `/collections`.
   - Your newly added garment is immediately live and visible to all visitors.

---

## 🛠️ API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/health` | GET | Public | Returns status of D1 and R2 bindings |
| `/api/products` | GET | Public | Returns all published garments with images |
| `/api/products/:id` | GET | Public | Returns details of a single garment |
| `/api/images/:key+` | GET | Public | Streams image from R2 with immutable cache |
| `/api/admin/login` | POST | Public | Validates passcode; returns 24h HMAC session token |
| `/api/admin/products` | GET | Admin | Returns all garments including drafts |
| `/api/admin/products` | POST | Admin | Creates new garment in D1 |
| `/api/admin/products/:id` | PUT | Admin | Updates garment in D1 |
| `/api/admin/products/:id/status` | PATCH | Admin | Toggles published / draft status |
| `/api/admin/products/:id` | DELETE | Admin | Deletes garment from D1 and cleans R2 images |
| `/api/admin/images/upload` | POST | Admin | Uploads image bytes directly to R2 bucket |
| `/api/admin/images/:key+` | DELETE | Admin | Deletes image from R2 bucket |

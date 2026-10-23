/**
 * Product Catalog Handlers (Cloudflare D1)
 */
import { Env, ProductDbRow, ProductImageDbRow } from '../types';
import { verifyAdminRequest } from '../auth';

function jsonResponse(data: any, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
  });
}

/**
 * Format a D1 product row and its images into the clean Product frontend shape
 */
function formatProduct(row: ProductDbRow, images: ProductImageDbRow[] = []) {
  let parsedFeatures: string[] = [];
  try {
    parsedFeatures = JSON.parse(row.features || '[]');
  } catch {
    parsedFeatures = [];
  }

  const galleryImages = images
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => img.url);

  // If no gallery images in product_images table, fallback to primary image
  const resolvedGallery = galleryImages.length > 0 ? galleryImages : [row.image];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    collection: row.collection,
    category: row.category,
    startingPrice: row.starting_price,
    priceNote: row.price_note || undefined,
    shortDescription: row.short_description,
    description: row.description,
    silhouette: row.silhouette || '',
    fabricDetails: row.fabric_details || '',
    lapelStyle: row.lapel_style || '',
    construction: row.construction || '',
    vents: row.vents || '',
    buttons: row.buttons || '',
    image: row.image,
    galleryImages: resolvedGallery,
    features: parsedFeatures,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * GET /api/products
 * Returns all published products (or all products if admin with ?includeDrafts=true)
 */
export async function handleGetProducts(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 503);
  }

  try {
    const url = new URL(request.url);
    const includeDrafts = url.searchParams.get('includeDrafts') === 'true';

    let isAdmin = false;
    if (includeDrafts) {
      isAdmin = await verifyAdminRequest(request, env);
    }

    let productsQuery = 'SELECT * FROM products WHERE status = "published" ORDER BY created_at DESC';
    if (includeDrafts && isAdmin) {
      productsQuery = 'SELECT * FROM products ORDER BY created_at DESC';
    }

    const productsResult = await env.DB.prepare(productsQuery).all<ProductDbRow>();
    const products = productsResult.results || [];

    if (products.length === 0) {
      return jsonResponse({ success: true, count: 0, products: [] });
    }

    // Fetch all related images
    const imagesResult = await env.DB.prepare(
      'SELECT * FROM product_images ORDER BY display_order ASC'
    ).all<ProductImageDbRow>();
    const allImages = imagesResult.results || [];

    const imageMap = new Map<string, ProductImageDbRow[]>();
    for (const img of allImages) {
      const list = imageMap.get(img.product_id) || [];
      list.push(img);
      imageMap.set(img.product_id, list);
    }

    const formatted = products.map((row) => formatProduct(row, imageMap.get(row.id) || []));

    return jsonResponse(
      { success: true, count: formatted.length, products: formatted },
      200,
      { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' }
    );
  } catch (error: any) {
    console.error('Error fetching products from D1:', error);
    return jsonResponse({ error: 'Failed to retrieve products from database.', details: error.message }, 500);
  }
}

/**
 * GET /api/products/:id
 */
export async function handleGetProductById(request: Request, env: Env, idOrSlug: string): Promise<Response> {
  if (!env.DB) {
    return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 503);
  }

  try {
    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1'
    ).bind(idOrSlug, idOrSlug).first<ProductDbRow>();

    if (!product) {
      return jsonResponse({ error: 'Product not found.' }, 404);
    }

    const imagesResult = await env.DB.prepare(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC'
    ).bind(product.id).all<ProductImageDbRow>();

    return jsonResponse({
      success: true,
      product: formatProduct(product, imagesResult.results || []),
    });
  } catch (error: any) {
    return jsonResponse({ error: 'Failed to retrieve product.', details: error.message }, 500);
  }
}

/**
 * POST /api/admin/products
 * Creates a new product and associates images in D1
 */
export async function handleCreateProduct(request: Request, env: Env): Promise<Response> {
  const isAdmin = await verifyAdminRequest(request, env);
  if (!isAdmin) {
    return jsonResponse({ error: 'Unauthorized: atelier administrator credentials required.' }, 401);
  }

  if (!env.DB) {
    return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 503);
  }

  try {
    const body = await request.json() as any;
    const name = String(body.name || '').trim();
    if (!name) {
      return jsonResponse({ error: 'Garment name is required.' }, 400);
    }

    const collection = body.collection || 'Essential';
    if (!['Essential', 'Signature', 'Bespoke'].includes(collection)) {
      return jsonResponse({ error: 'Invalid collection specified.' }, 400);
    }

    const category = body.category || 'Suit';
    if (!['Suit', 'Double-Breasted', 'Formalwear', 'Separates'].includes(category)) {
      return jsonResponse({ error: 'Invalid category specified.' }, 400);
    }

    const image = String(body.image || '').trim();
    if (!image) {
      return jsonResponse({ error: 'Primary garment image is required.' }, 400);
    }

    // Generate safe slug / ID
    let slug = body.slug ? String(body.slug).trim() : '';
    if (!slug) {
      slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (!slug) {
      slug = `garment-${Date.now()}`;
    }

    const id = body.id ? String(body.id).trim() : slug;
    const now = Date.now();
    const status = body.status === 'draft' ? 'draft' : 'published';

    const featuresJson = JSON.stringify(Array.isArray(body.features) ? body.features : []);

    // Insert Product
    await env.DB.prepare(
      `INSERT INTO products (
        id, slug, name, collection, category, starting_price, price_note,
        short_description, description, silhouette, fabric_details,
        lapel_style, construction, vents, buttons, image, features,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      slug,
      name,
      collection,
      category,
      body.startingPrice ?? null,
      body.priceNote || null,
      body.shortDescription || `${collection} Collection tailoring by KRAYS DHAKA atelier.`,
      body.description || `Tailored to bespoke anatomical specifications at the KRAYS DHAKA atelier.`,
      body.silhouette || null,
      body.fabricDetails || null,
      body.lapelStyle || null,
      body.construction || null,
      body.vents || null,
      body.buttons || null,
      image,
      featuresJson,
      status,
      now,
      now
    ).run();

    // Insert gallery images
    const galleryImages: string[] = Array.isArray(body.galleryImages) && body.galleryImages.length > 0
      ? body.galleryImages
      : [image];

    for (let i = 0; i < galleryImages.length; i++) {
      const gUrl = galleryImages[i];
      if (!gUrl) continue;
      const imgId = `img-${id}-${i}-${now}`;
      const r2Key = gUrl.startsWith('/api/images/') ? gUrl.replace('/api/images/', '') : null;
      await env.DB.prepare(
        `INSERT INTO product_images (id, product_id, r2_key, url, alt_text, display_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(imgId, id, r2Key, gUrl, `${name} photo ${i + 1}`, i, now).run();
    }

    return jsonResponse({
      success: true,
      message: `Product "${name}" successfully created and saved to D1.`,
      id,
      slug,
    }, 201);
  } catch (error: any) {
    console.error('Error creating product in D1:', error);
    return jsonResponse({ error: 'Failed to create product.', details: error.message }, 500);
  }
}

/**
 * PUT /api/admin/products/:id
 */
export async function handleUpdateProduct(request: Request, env: Env, id: string): Promise<Response> {
  const isAdmin = await verifyAdminRequest(request, env);
  if (!isAdmin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  if (!env.DB) {
    return jsonResponse({ error: 'Database not bound.' }, 503);
  }

  try {
    const body = await request.json() as any;
    const now = Date.now();

    const existing = await env.DB.prepare(
      'SELECT id FROM products WHERE id = ? LIMIT 1'
    ).bind(id).first();

    if (!existing) {
      return jsonResponse({ error: `Product with ID "${id}" not found.` }, 404);
    }

    const featuresJson = body.features ? JSON.stringify(body.features) : undefined;

    await env.DB.prepare(
      `UPDATE products SET
        name = COALESCE(?, name),
        collection = COALESCE(?, collection),
        category = COALESCE(?, category),
        starting_price = ?,
        price_note = COALESCE(?, price_note),
        short_description = COALESCE(?, short_description),
        description = COALESCE(?, description),
        silhouette = COALESCE(?, silhouette),
        fabric_details = COALESCE(?, fabric_details),
        lapel_style = COALESCE(?, lapel_style),
        construction = COALESCE(?, construction),
        vents = COALESCE(?, vents),
        buttons = COALESCE(?, buttons),
        image = COALESCE(?, image),
        features = COALESCE(?, features),
        status = COALESCE(?, status),
        updated_at = ?
       WHERE id = ?`
    ).bind(
      body.name?.trim() || null,
      body.collection || null,
      body.category || null,
      body.startingPrice === undefined ? null : body.startingPrice,
      body.priceNote?.trim() || null,
      body.shortDescription?.trim() || null,
      body.description?.trim() || null,
      body.silhouette?.trim() || null,
      body.fabricDetails?.trim() || null,
      body.lapelStyle?.trim() || null,
      body.construction?.trim() || null,
      body.vents?.trim() || null,
      body.buttons?.trim() || null,
      body.image?.trim() || null,
      featuresJson || null,
      body.status || null,
      now,
      id
    ).run();

    // If new gallery images provided, refresh product_images
    if (Array.isArray(body.galleryImages)) {
      await env.DB.prepare('DELETE FROM product_images WHERE product_id = ?').bind(id).run();
      for (let i = 0; i < body.galleryImages.length; i++) {
        const gUrl = body.galleryImages[i];
        if (!gUrl) continue;
        const imgId = `img-${id}-${i}-${now}`;
        const r2Key = gUrl.startsWith('/api/images/') ? gUrl.replace('/api/images/', '') : null;
        await env.DB.prepare(
          `INSERT INTO product_images (id, product_id, r2_key, url, alt_text, display_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(imgId, id, r2Key, gUrl, `Angle ${i + 1}`, i, now).run();
      }
    }

    return jsonResponse({ success: true, message: `Product "${id}" updated successfully.` });
  } catch (error: any) {
    return jsonResponse({ error: 'Failed to update product.', details: error.message }, 500);
  }
}

/**
 * PATCH /api/admin/products/:id/status
 */
export async function handleToggleStatus(request: Request, env: Env, id: string): Promise<Response> {
  const isAdmin = await verifyAdminRequest(request, env);
  if (!isAdmin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  try {
    const body = await request.json() as any;
    const nextStatus = body.status === 'draft' ? 'draft' : 'published';

    await env.DB.prepare(
      'UPDATE products SET status = ?, updated_at = ? WHERE id = ?'
    ).bind(nextStatus, Date.now(), id).run();

    return jsonResponse({ success: true, status: nextStatus });
  } catch (error: any) {
    return jsonResponse({ error: 'Failed to update status.', details: error.message }, 500);
  }
}

/**
 * DELETE /api/admin/products/:id
 */
export async function handleDeleteProduct(request: Request, env: Env, id: string): Promise<Response> {
  const isAdmin = await verifyAdminRequest(request, env);
  if (!isAdmin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  if (!env.DB) {
    return jsonResponse({ error: 'Database not bound.' }, 503);
  }

  try {
    // 1. Find images stored in R2 associated with this product
    if (env.IMAGES) {
      const imagesResult = await env.DB.prepare(
        'SELECT r2_key FROM product_images WHERE product_id = ? AND r2_key IS NOT NULL'
      ).bind(id).all<{ r2_key: string }>();

      const keysToDelete = (imagesResult.results || [])
        .map((r) => r.r2_key)
        .filter(Boolean);

      for (const key of keysToDelete) {
        try {
          await env.IMAGES.delete(key);
        } catch (e) {
          console.warn(`Failed to delete R2 image ${key}:`, e);
        }
      }
    }

    // 2. Delete product from D1 (cascade removes product_images)
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

    return jsonResponse({ success: true, message: `Product "${id}" removed from catalog.` });
  } catch (error: any) {
    return jsonResponse({ error: 'Failed to delete product.', details: error.message }, 500);
  }
}

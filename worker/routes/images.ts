/**
 * Cloudflare R2 Object Storage Image Handlers
 */
import { Env } from '../types';
import { verifyAdminRequest } from '../auth';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB max

function getExtensionForMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    default:
      return 'jpg';
  }
}

/**
 * POST /api/admin/images/upload
 * Supports multipart/form-data or binary image upload
 */
export async function handleUploadImage(request: Request, env: Env): Promise<Response> {
  const isAdmin = await verifyAdminRequest(request, env);
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!env.IMAGES) {
    return new Response(
      JSON.stringify({
        error: 'R2 Bucket binding (IMAGES) is not configured in wrangler.toml or Cloudflare dashboard.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const contentTypeHeader = request.headers.get('Content-Type') || '';
    let fileBuffer: ArrayBuffer;
    let mimeType = 'image/jpeg';

    if (contentTypeHeader.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || typeof file === 'string') {
        return new Response(
          JSON.stringify({ error: 'No image file found in form data field "file".' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      mimeType = (file as File).type || 'image/jpeg';
      fileBuffer = await (file as File).arrayBuffer();
    } else {
      // Direct binary upload
      mimeType = contentTypeHeader.split(';')[0].trim();
      fileBuffer = await request.arrayBuffer();
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return new Response(
        JSON.stringify({
          error: `Unsupported image format: "${mimeType}". Allowed: JPG, PNG, WebP, AVIF.`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (fileBuffer.byteLength > MAX_IMAGE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Image exceeds maximum allowed size (10 MB).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (fileBuffer.byteLength === 0) {
      return new Response(
        JSON.stringify({ error: 'Uploaded image file is empty.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate collision-resistant unique key
    const ext = getExtensionForMime(mimeType);
    const uniqueId = crypto.randomUUID().slice(0, 12);
    const key = `products/${Date.now()}-${uniqueId}.${ext}`;

    await env.IMAGES.put(key, fileBuffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
      },
    });

    const publicUrl = `/api/images/${key}`;

    return new Response(
      JSON.stringify({
        success: true,
        key,
        url: publicUrl,
        size: fileBuffer.byteLength,
        contentType: mimeType,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('R2 upload failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to upload image to R2 storage.', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/images/:key+
 * Streams the image from R2 with caching headers and ETag
 */
export async function handleGetImage(request: Request, env: Env, key: string): Promise<Response> {
  if (!env.IMAGES) {
    return new Response('R2 binding not configured', { status: 503 });
  }

  try {
    const object = await env.IMAGES.get(key);
    if (!object) {
      return new Response('Image not found', { status: 404 });
    }

    const headers = new Headers();
    if (object.httpMetadata?.contentType) {
      headers.set('Content-Type', object.httpMetadata.contentType);
    }
    if (object.httpMetadata?.cacheControl) {
      headers.set('Cache-Control', object.httpMetadata.cacheControl);
    } else {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    headers.set('etag', object.httpEtag);
    headers.set('Access-Control-Allow-Origin', '*');

    // Handle conditional If-None-Match for 304 Not Modified
    if (request.headers.get('if-none-match') === object.httpEtag) {
      return new Response(null, { status: 304, headers });
    }

    return new Response(object.body, { headers });
  } catch (error: any) {
    console.error(`Failed to retrieve image ${key}:`, error);
    return new Response('Failed to retrieve image', { status: 500 });
  }
}

/**
 * DELETE /api/admin/images/:key+
 */
export async function handleDeleteImage(request: Request, env: Env, key: string): Promise<Response> {
  const isAdmin = await verifyAdminRequest(request, env);
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!env.IMAGES) {
    return new Response(JSON.stringify({ error: 'R2 binding not configured.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await env.IMAGES.delete(key);

    // Also update any matching product_images record if DB bound
    if (env.DB) {
      await env.DB.prepare('DELETE FROM product_images WHERE r2_key = ?').bind(key).run();
    }

    return new Response(JSON.stringify({ success: true, message: `Image ${key} deleted.` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to delete image.', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

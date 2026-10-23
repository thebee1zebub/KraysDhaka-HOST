/**
 * KRAYS DHAKA - Cloudflare Worker Entry Point
 *
 * Integrates:
 * - Static Assets SPA frontend (env.ASSETS)
 * - Cloudflare D1 persistent relational catalog (env.DB)
 * - Cloudflare R2 object storage for garment photography (env.IMAGES)
 * - Server-authenticated Atelier Admin API (/api/admin/*)
 */
import { Env } from './types';
import { authenticatePasscode } from './auth';
import {
  handleGetProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleToggleStatus,
} from './routes/products';
import {
  handleUploadImage,
  handleGetImage,
  handleDeleteImage,
} from './routes/images';

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Handle CORS preflight for all endpoints
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Health check endpoint
    if (pathname === '/api/health') {
      const dbConfigured = Boolean(env.DB);
      const r2Configured = Boolean(env.IMAGES);
      let dbReady = false;

      if (dbConfigured) {
        try {
          await env.DB.prepare('SELECT 1').first();
          dbReady = true;
        } catch {
          dbReady = false;
        }
      }

      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'kraysdhaka-worker',
          d1: { configured: dbConfigured, operational: dbReady },
          r2: { configured: r2Configured },
          timestamp: Date.now(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Admin Authentication Login
    if (pathname === '/api/admin/login' && method === 'POST') {
      try {
        const body = (await request.json()) as { passcode?: string };
        const candidate = String(body.passcode || '');
        const authResult = await authenticatePasscode(candidate, env);

        if (!authResult.success) {
          return new Response(
            JSON.stringify({ error: authResult.error || 'Authentication failed' }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            token: authResult.token,
            message: 'Authenticated successfully.',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Malformed JSON payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Public Image Serving from R2: /api/images/:key+
    if (pathname.startsWith('/api/images/') && method === 'GET') {
      const key = pathname.replace('/api/images/', '');
      return handleGetImage(request, env, decodeURIComponent(key));
    }

    // Public Products Catalog: /api/products
    if (pathname === '/api/products' && method === 'GET') {
      return handleGetProducts(request, env);
    }

    // Public Single Product: /api/products/:idOrSlug
    if (pathname.startsWith('/api/products/') && method === 'GET') {
      const idOrSlug = pathname.replace('/api/products/', '');
      return handleGetProductById(request, env, decodeURIComponent(idOrSlug));
    }

    // Admin Image Upload to R2: POST /api/admin/images/upload
    if (pathname === '/api/admin/images/upload' && method === 'POST') {
      return handleUploadImage(request, env);
    }

    // Admin Image Deletion from R2: DELETE /api/admin/images/:key+
    if (pathname.startsWith('/api/admin/images/') && method === 'DELETE') {
      const key = pathname.replace('/api/admin/images/', '');
      return handleDeleteImage(request, env, decodeURIComponent(key));
    }

    // Admin Products List (includes drafts): GET /api/admin/products
    if (pathname === '/api/admin/products' && method === 'GET') {
      // Force includeDrafts parameter
      const adminUrl = new URL(request.url);
      adminUrl.searchParams.set('includeDrafts', 'true');
      const modifiedReq = new Request(adminUrl.toString(), request);
      return handleGetProducts(modifiedReq, env);
    }

    // Admin Create Product: POST /api/admin/products
    if (pathname === '/api/admin/products' && method === 'POST') {
      return handleCreateProduct(request, env);
    }

    // Admin Status Toggle: PATCH /api/admin/products/:id/status
    if (pathname.startsWith('/api/admin/products/') && pathname.endsWith('/status') && method === 'PATCH') {
      const parts = pathname.split('/');
      // /api/admin/products/:id/status -> parts[4] is :id
      const id = parts[4];
      return handleToggleStatus(request, env, decodeURIComponent(id));
    }

    // Admin Update Product: PUT /api/admin/products/:id
    if (pathname.startsWith('/api/admin/products/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/products/', '');
      return handleUpdateProduct(request, env, decodeURIComponent(id));
    }

    // Admin Delete Product: DELETE /api/admin/products/:id
    if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/products/', '');
      return handleDeleteProduct(request, env, decodeURIComponent(id));
    }

    // If an unknown /api/* endpoint is requested, return 404 JSON
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delegate all static assets and client-side SPA routes to Cloudflare Static Assets
    if (env.ASSETS) {
      return await env.ASSETS.fetch(request);
    }

    return new Response('KRAYS DHAKA Atelier Edge Service', { status: 200 });
  },
};

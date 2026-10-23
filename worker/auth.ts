/**
 * Atelier Administrator Authentication & Token Validation
 */
import { Env } from './types';

function getAuthSecret(env: Env): string {
  const secret = env.ADMIN_API_KEY || env.ADMIN_PASSCODE;

  if (!secret) {
    throw new Error('Admin secret is not configured');
  }

  return secret;
}

/**
 * Perform constant-time string comparison to mitigate timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generates an HMAC SHA-256 hex digest using Web Crypto API
 */
async function generateHmac(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets configured server secret for signing and authorization
 */
function getAuthSecret(env: Env): string {
  return env.ADMIN_API_KEY || env.ADMIN_PASSCODE || DEFAULT_PASSCODE;
}

/**
 * Verifies admin credentials (passcode or API key) and creates a signed session token
 */
export async function authenticatePasscode(
  candidate: string,
  env: Env
): Promise<{ success: boolean; token?: string; error?: string }> {
  const primarySecret = getAuthSecret(env);
  const fallbackPasscode = env.ADMIN_PASSCODE || DEFAULT_PASSCODE;

  const isValid =
    timingSafeEqual(candidate, primarySecret) ||
    timingSafeEqual(candidate, fallbackPasscode);

  if (!isValid) {
    return { success: false, error: 'Invalid atelier credentials.' };
  }

  // Issue 24-hour signed session token: timestamp.signature
  const timestamp = Date.now().toString();
  const payload = `krays-admin:${timestamp}`;
  const signature = await generateHmac(payload, primarySecret);
  const token = `${timestamp}.${signature}`;

  return { success: true, token };
}

/**
 * Validates request Bearer token or direct Admin API Key
 */
export async function verifyAdminRequest(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return false;
  }

  const primarySecret = getAuthSecret(env);

  // 1. Direct API key comparison
  if (timingSafeEqual(token, primarySecret)) {
    return true;
  }

  // 2. Signed session token format: <timestamp>.<signature>
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) {
    return false;
  }

  const timestampStr = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return false;
  }

  // Enforce 24-hour expiration (86,400,000 ms)
  const now = Date.now();
  if (now < timestamp || now - timestamp > 86400000) {
    return false;
  }

  const expectedPayload = `krays-admin:${timestampStr}`;
  const expectedSignature = await generateHmac(expectedPayload, primarySecret);

  return timingSafeEqual(signature, expectedSignature);
}

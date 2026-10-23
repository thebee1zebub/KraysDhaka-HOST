/**
 * Client-side image compression and sizing utility.
 * Optimizes uploaded user images (from phone cameras, desktop files, or clipboards)
 * into compact, high-quality WebP or JPEG data URLs to prevent localStorage QuotaExceededError.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CompressedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  formattedSize: string;
  mimeType: string;
}

/**
 * Calculates scaled dimensions preserving aspect ratio within bounding limits.
 * Decoupled pure logic for unit testing.
 */
export function calculateTargetDimensions(
  origWidth: number,
  origHeight: number,
  maxWidth = 1000,
  maxHeight = 1333
): ImageDimensions {
  if (origWidth <= 0 || origHeight <= 0) {
    return { width: Math.max(1, maxWidth), height: Math.max(1, maxHeight) };
  }

  let width = origWidth;
  let height = origHeight;

  // Scale down if larger than max width
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  // Scale down if larger than max height
  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return { width: Math.max(1, width), height: Math.max(1, height) };
}

/**
 * Formats byte size into human readable string (e.g. "45.2 KB")
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compresses an image File or Blob into an optimized data URL.
 */
export async function compressImageFile(
  file: File | Blob,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    preferredFormat?: 'image/webp' | 'image/jpeg';
  } = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 960,
    maxHeight = 1280,
    quality = 0.82,
    preferredFormat = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Selected file could not be parsed as a valid image.'));
      };

      img.onload = () => {
        try {
          const { width, height } = calculateTargetDimensions(
            img.naturalWidth || img.width,
            img.naturalHeight || img.height,
            maxWidth,
            maxHeight
          );

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Unable to create canvas 2D rendering context.');
          }

          // Render with smooth bicubic interpolation
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // If JPEG, fill background with white (for transparent PNGs)
          if (preferredFormat === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP or fallback to JPEG
          let outputFormat = preferredFormat;
          let dataUrl = canvas.toDataURL(outputFormat, quality);

          // If browser doesn't support requested format or returned larger png fallback
          if (!dataUrl.startsWith(`data:${outputFormat}`)) {
            outputFormat = 'image/jpeg';
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Calculate approximate byte size of base64
          const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1;
          const sizeBytes = Math.round((base64Length * 3) / 4);

          resolve({
            dataUrl,
            width,
            height,
            sizeBytes,
            formattedSize: formatBytes(sizeBytes),
            mimeType: outputFormat
          });
        } catch (err) {
          reject(err);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Estimates current localStorage usage in bytes and percentage of 5MB typical quota.
 */
export function estimateLocalStorageUsage(): {
  usedBytes: number;
  formattedUsed: string;
  estimatedLimit: number;
  percentageUsed: number;
  isHigh: boolean;
} {
  let totalChars = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key);
        totalChars += (key.length + (val ? val.length : 0)) * 2; // UTF-16
      }
    }
  } catch {
    // If blocked or inaccessible
  }

  const estimatedLimit = 5 * 1024 * 1024; // 5MB standard browser limit
  const percentageUsed = Math.min(100, Math.round((totalChars / estimatedLimit) * 100));

  return {
    usedBytes: totalChars,
    formattedUsed: formatBytes(totalChars),
    estimatedLimit,
    percentageUsed,
    isHigh: percentageUsed > 75
  };
}

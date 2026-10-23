import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, PRODUCTS as DEFAULT_PRODUCTS, IMAGES } from '../data/tailoringData';
import { generateUniqueProductId } from '../utils/catalogSlug';
import {
  fetchPublishedProducts,
  createProductInD1,
  updateProductInD1,
  deleteProductFromD1,
  toggleProductStatusInD1,
  checkBackendHealth,
  BackendHealthResponse,
  getStoredToken,
} from '../services/api';

const FALLBACK_STORAGE_KEY = 'krays_dhaka_catalog_cache_v2';

interface CatalogContextType {
  products: Product[];
  isLoading: boolean;
  isRemote: boolean;
  backendHealth: BackendHealthResponse | null;
  storageError: string | null;
  clearStorageError: () => void;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'> & { id?: string; status?: 'published' | 'draft' }) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string, status: 'published' | 'draft') => Promise<void>;
  resetToDefault: () => void;
  exportCatalogJson: () => string;
  importCatalogJson: (jsonStr: string) => boolean;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

function loadCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached products from localStorage', e);
  }
  return DEFAULT_PRODUCTS;
}

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(loadCachedProducts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [backendHealth, setBackendHealth] = useState<BackendHealthResponse | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Fetch live products from Cloudflare D1
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check Cloudflare Worker bindings health
      const health = await checkBackendHealth();
      setBackendHealth(health);

      const { products: remoteProducts, error } = await fetchPublishedProducts();

      if (!error && Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        setProducts(remoteProducts);
        setIsRemote(true);
        setStorageError(null);
        try {
          localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(remoteProducts));
        } catch {
          // Ignore cache quota errors
        }
      } else {
        // If D1 is empty or not yet provisioned, use default/cached products
        if (remoteProducts && remoteProducts.length === 0 && health?.d1.operational) {
          // D1 is running but empty
          setProducts([]);
          setIsRemote(true);
        } else {
          // Network or binding unconfigured fallback
          setIsRemote(false);
          if (error && !health?.d1.configured) {
            // Not a fatal user error - initial state before D1 setup
          }
        }
      }
    } catch (err: any) {
      console.warn('Could not connect to shared D1 catalog, using local fallback:', err);
      setIsRemote(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = async (
    newProduct: Omit<Product, 'id'> & { id?: string; status?: 'published' | 'draft' }
  ): Promise<Product> => {
    const existingIds = products.map((p) => p.id);
    const generatedId = newProduct.id && !existingIds.includes(newProduct.id)
      ? newProduct.id
      : generateUniqueProductId(newProduct.name, existingIds);

    const safeImage = (newProduct.image && newProduct.image.trim()) || IMAGES.essential;
    const safeGallery = newProduct.galleryImages && newProduct.galleryImages.length > 0
      ? newProduct.galleryImages.filter((img) => img && img.trim().length > 0)
      : [safeImage];

    const productToAdd: Product = {
      ...newProduct,
      id: generatedId,
      image: safeImage,
      galleryImages: safeGallery.length > 0 ? safeGallery : [safeImage],
    };

    const token = getStoredToken();

    // 1. Attempt D1 remote persistence
    if (backendHealth?.d1.configured && token) {
      const result = await createProductInD1(
        {
          ...productToAdd,
          status: newProduct.status || 'published',
        },
        token
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to save product to Cloudflare D1 database.');
      }

      await refreshProducts();
      return productToAdd;
    }

    // 2. Fallback local persistence (if D1 not yet configured)
    const nextProducts = [productToAdd, ...products];
    setProducts(nextProducts);
    try {
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(nextProducts));
    } catch (e) {
      console.warn('Failed to update local cache', e);
    }

    return productToAdd;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    const token = getStoredToken();

    if (backendHealth?.d1.configured && token) {
      const result = await updateProductInD1(id, updates, token);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update garment in Cloudflare D1.');
      }
      await refreshProducts();
      return;
    }

    const nextProducts = products.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setProducts(nextProducts);
    try {
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(nextProducts));
    } catch (e) {
      console.warn('Failed to update local cache', e);
    }
  };

  const toggleProductStatus = async (id: string, status: 'published' | 'draft'): Promise<void> => {
    const token = getStoredToken();
    if (backendHealth?.d1.configured && token) {
      const result = await toggleProductStatusInD1(id, status, token);
      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle status.');
      }
      await refreshProducts();
    }
  };

  const removeProduct = async (id: string): Promise<void> => {
    const token = getStoredToken();

    if (backendHealth?.d1.configured && token) {
      const result = await deleteProductFromD1(id, token);
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove garment from Cloudflare D1.');
      }
      await refreshProducts();
      return;
    }

    const nextProducts = products.filter((item) => item.id !== id);
    setProducts(nextProducts);
    try {
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(nextProducts));
    } catch (e) {
      console.warn('Failed to update local cache on remove', e);
    }
  };

  const resetToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.removeItem(FALLBACK_STORAGE_KEY);
    setStorageError(null);
  };

  const exportCatalogJson = (): string => {
    return JSON.stringify(products, null, 2);
  };

  const importCatalogJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
        setProducts(parsed);
        localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(parsed));
        setStorageError(null);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  };

  const clearStorageError = () => setStorageError(null);

  return (
    <CatalogContext.Provider
      value={{
        products,
        isLoading,
        isRemote,
        backendHealth,
        storageError,
        clearStorageError,
        refreshProducts,
        addProduct,
        updateProduct,
        removeProduct,
        toggleProductStatus,
        resetToDefault,
        exportCatalogJson,
        importCatalogJson,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}

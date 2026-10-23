import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, PRODUCTS as DEFAULT_PRODUCTS, IMAGES } from '../data/tailoringData';
import { generateUniqueProductId } from '../utils/catalogSlug';

const STORAGE_KEY = 'krays_dhaka_catalog_v1';

interface CatalogContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  resetToDefault: () => void;
  exportCatalogJson: () => string;
  importCatalogJson: (jsonStr: string) => boolean;
  storageError: string | null;
  clearStorageError: () => void;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

function loadSavedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse catalog from localStorage', e);
  }
  return DEFAULT_PRODUCTS;
}

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(loadSavedProducts);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      setStorageError(null);
    } catch (e: any) {
      console.error('Failed to save catalog to localStorage', e);
      const isQuota = e?.name === 'QuotaExceededError' || e?.code === 22 || e?.number === -2147024882;
      setStorageError(
        isQuota
          ? 'Browser storage quota exceeded. Consider optimizing uploaded photos or removing older products.'
          : 'Failed to persist changes to local storage.'
      );
    }
  }, [products]);

  const addProduct = (newProduct: Omit<Product, 'id'> & { id?: string }): Product => {
    // Generate safe unique ID even with collisions or special characters
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
      galleryImages: safeGallery.length > 0 ? safeGallery : [safeImage]
    };

    const nextProducts = [productToAdd, ...products];

    // Pre-flight test to catch quota issues immediately before setting state
    try {
      const testJson = JSON.stringify(nextProducts);
      localStorage.setItem(STORAGE_KEY, testJson);
      setStorageError(null);
    } catch (err: any) {
      const isQuota = err?.name === 'QuotaExceededError' || err?.code === 22;
      const msg = isQuota
        ? 'Image file is too large for browser storage. Please upload an optimized image.'
        : 'Failed to save product to storage.';
      setStorageError(msg);
      throw new Error(msg);
    }

    setProducts(nextProducts);
    return productToAdd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const nextProducts = products.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
      setStorageError(null);
    } catch (err: any) {
      const isQuota = err?.name === 'QuotaExceededError' || err?.code === 22;
      const msg = isQuota
        ? 'Changes exceed browser storage quota. Please use compressed images.'
        : 'Failed to save update to storage.';
      setStorageError(msg);
      throw new Error(msg);
    }

    setProducts(nextProducts);
  };

  const removeProduct = (id: string) => {
    const nextProducts = products.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
      setStorageError(null);
    } catch (e) {
      console.error('Failed to update storage on remove', e);
    }
    setProducts(nextProducts);
  };

  const resetToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY);
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
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
        addProduct,
        updateProduct,
        removeProduct,
        resetToDefault,
        exportCatalogJson,
        importCatalogJson,
        storageError,
        clearStorageError
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

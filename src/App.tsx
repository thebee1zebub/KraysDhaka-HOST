/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Router, Routes, Route, useLocation } from './router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BespokePage } from './pages/BespokePage';
import { ProcessPage } from './pages/ProcessPage';
import { StoryPage } from './pages/StoryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { Product } from './data/tailoringData';
import { CatalogProvider } from './context/CatalogContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialCollection, setInitialCollection] = useState<
    'Essential' | 'Signature' | 'Bespoke' | 'Not Sure Yet'
  >('Essential');

  const handleOpenConsultation = (
    product?: Product | null,
    collection?: 'Essential' | 'Signature' | 'Bespoke' | 'Not Sure Yet'
  ) => {
    setSelectedProduct(product || null);
    if (collection) {
      setInitialCollection(collection);
    } else if (product) {
      setInitialCollection(product.collection);
    }
    setConsultationOpen(true);
  };

  const handleCloseConsultation = () => {
    setConsultationOpen(false);
    setSelectedProduct(null);
  };

  return (
    <CatalogProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white text-[#111111] antialiased">
          <Header onOpenConsultation={() => handleOpenConsultation()} />

          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenConsultation={() => handleOpenConsultation()}
                    onSelectProductForConsultation={(p) => handleOpenConsultation(p)}
                  />
                }
              />
              <Route
                path="/collections"
                element={
                  <CollectionsPage
                    onOpenConsultation={() => handleOpenConsultation()}
                    onSelectProductForConsultation={(p) => handleOpenConsultation(p)}
                  />
                }
              />
              <Route
                path="/collections/:id"
                element={
                  <ProductDetailPage
                    onOpenConsultationWithProduct={(p) => handleOpenConsultation(p)}
                  />
                }
              />
              <Route
                path="/bespoke"
                element={<BespokePage onOpenConsultation={() => handleOpenConsultation(null, 'Bespoke')} />}
              />
              <Route
                path="/process"
                element={<ProcessPage onOpenConsultation={() => handleOpenConsultation()} />}
              />
              <Route
                path="/story"
                element={<StoryPage onOpenConsultation={() => handleOpenConsultation()} />}
              />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>

          <Footer onOpenConsultation={() => handleOpenConsultation()} />

          <ConsultationModal
            isOpen={consultationOpen}
            onClose={handleCloseConsultation}
            preselectedProduct={selectedProduct}
            initialCollection={initialCollection}
          />
        </div>
      </Router>
    </CatalogProvider>
  );
}

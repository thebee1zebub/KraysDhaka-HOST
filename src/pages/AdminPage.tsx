import React, { useState, useEffect } from 'react';
import { Link } from '../router';
import {
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Check,
  X,
  Lock,
  ArrowLeft,
  ExternalLink,
  Copy,
  AlertCircle,
  Database,
  Eye,
  RefreshCw,
  Cloud,
  CheckCircle2,
  FileText,
  Loader2
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { Product, IMAGES } from '../data/tailoringData';
import { formatBDT } from '../utils/tailoring';
import { ImageUploadField } from '../components/ImageUploadField';
import { formatPriceInput } from '../utils/catalogSlug';
import {
  loginAdmin,
  getStoredToken,
  clearStoredToken,
  fetchAdminProducts,
  checkBackendHealth
} from '../services/api';

export const AdminPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    toggleProductStatus,
    resetToDefault,
    exportCatalogJson,
    refreshProducts,
    backendHealth,
    isRemote,
    isLoading: isCatalogLoading
  } = useCatalog();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getStoredToken());
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form model
  const [formData, setFormData] = useState<Partial<Product> & { status?: 'published' | 'draft' }>({
    name: '',
    collection: 'Essential',
    category: 'Suit',
    startingPrice: 6000,
    priceNote: '',
    shortDescription: '',
    description: '',
    silhouette: 'Single-breasted 2-button front, regular tapered drape',
    fabricDetails: 'Pure wool worsted, 280g/m',
    lapelStyle: 'Classic notch lapel (8.5 cm width)',
    construction: 'Half-canvas structure with natural horsehair canvas',
    vents: 'Dual side vents',
    buttons: 'Genuine dark horn buttons',
    image: IMAGES.essential,
    galleryImages: [IMAGES.essential],
    features: ['Hand-finished interior lining', 'Side waist adjusters'],
    status: 'published'
  });

  const [copyFeedback, setCopyFeedback] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  // Authenticate against server
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter the atelier passcode.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    try {
      const result = await loginAdmin(passcode.trim());
      if (result.success && result.token) {
        setIsAuthenticated(true);
        setAuthError('');
        await refreshProducts();
      } else {
        setAuthError(result.error || 'Incorrect atelier passcode.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setIsAuthenticated(false);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    setIsRefreshing(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormError(null);
    setFormData({
      name: '',
      collection: 'Essential',
      category: 'Suit',
      startingPrice: 6000,
      priceNote: 'Starting price for Essential tailoring.',
      shortDescription: '',
      description: '',
      silhouette: 'Single-breasted 2-button front',
      fabricDetails: 'Pure wool, 280g/m',
      lapelStyle: 'Classic notch lapel',
      construction: 'Half-canvas structure',
      vents: 'Dual side vents',
      buttons: 'Horn buttons',
      image: IMAGES.essential,
      galleryImages: [IMAGES.essential],
      features: ['Hand-finished interior lining', 'Tailored trousers'],
      status: 'published'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product & { status?: 'published' | 'draft' }) => {
    setEditingId(product.id);
    setFormError(null);
    setFormData({
      ...product,
      galleryImages: product.galleryImages || [product.image],
      status: product.status || 'published'
    });
    setIsFormOpen(true);
  };

  const handleTogglePublication = async (product: Product & { status?: 'published' | 'draft' }) => {
    const nextStatus = (product.status || 'published') === 'published' ? 'draft' : 'published';
    try {
      if (toggleProductStatus) {
        await toggleProductStatus(product.id, nextStatus);
        setActionSuccess(`Updated "${product.name}" status to ${nextStatus}.`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to update publication status.');
    }
  };

  const confirmDeleteAction = async () => {
    if (!itemToDelete) return;
    const { id, name } = itemToDelete;
    try {
      await removeProduct(id);
      setActionSuccess(`Removed "${name}" from catalog and cleaned up R2 imagery.`);
      setItemToDelete(null);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to delete product.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = formData.name?.trim();
    if (!name) {
      setFormError('Please enter a garment name.');
      return;
    }

    if (!formData.image || !formData.image.trim()) {
      setFormError('Please upload an image to Cloudflare R2 or pick a photography preset.');
      return;
    }

    const cleanedPrice = formatPriceInput(formData.startingPrice);

    const preparedProduct = {
      id: editingId || undefined,
      name,
      collection: formData.collection || 'Essential',
      category: formData.category || 'Suit',
      startingPrice: cleanedPrice,
      priceNote: formData.priceNote?.trim() || (cleanedPrice ? `Starting price from ৳${cleanedPrice.toLocaleString()}` : 'By private quotation.'),
      shortDescription: formData.shortDescription?.trim() || `${formData.collection} Collection tailoring by KRAYS DHAKA atelier.`,
      description: formData.description?.trim() || `Tailored to bespoke anatomical specifications at the KRAYS DHAKA atelier. Crafted from ${formData.fabricDetails || 'pure wool'} with ${formData.construction || 'half-canvas structure'}.`,
      silhouette: formData.silhouette?.trim() || 'Single-breasted 2-button front, regular tapered drape',
      fabricDetails: formData.fabricDetails?.trim() || 'Pure worsted wool, 280g/m',
      lapelStyle: formData.lapelStyle?.trim() || 'Classic notch lapel',
      construction: formData.construction?.trim() || 'Half-canvas structure with natural horsehair',
      vents: formData.vents?.trim() || 'Dual side vents',
      buttons: formData.buttons?.trim() || 'Genuine horn buttons',
      image: formData.image.trim(),
      galleryImages: formData.galleryImages && formData.galleryImages.length > 0
        ? formData.galleryImages
        : [formData.image.trim()],
      features: formData.features && formData.features.length > 0
        ? formData.features
        : ['Hand-finished interior lining', 'Bespoke canvas structure', 'Tailored trousers'],
      status: formData.status || 'published'
    };

    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateProduct(editingId, preparedProduct);
        setActionSuccess(`Saved changes to "${name}" in Cloudflare D1.`);
        setNewlyCreatedId(editingId);
      } else {
        const created = await addProduct(preparedProduct);
        setActionSuccess(`Added "${name}" to ${preparedProduct.collection} Collection in Cloudflare D1!`);
        setNewlyCreatedId(created.id);
      }

      setIsFormOpen(false);
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      console.error('Failed to post / save garment:', err);
      setFormError(err.message || 'Failed to save garment to database. Please verify Cloudflare D1 credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyJson = () => {
    const json = exportCatalogJson();
    navigator.clipboard.writeText(json);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-6 py-16">
        <div className="bg-white border border-[#E5E5E5] p-8 sm:p-10 max-w-md w-full shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto bg-[#111111] text-white flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#777777] font-mono">
              Atelier Edge Portal
            </span>
            <h1 className="font-editorial text-3xl text-[#111111] font-medium">
              KRAYS DHAKA Manager
            </h1>
            <p className="text-xs text-[#666666] font-sans-ui leading-relaxed">
              Authenticate with your atelier passcode to manage garments, pricing, and photography on Cloudflare D1 and R2.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter atelier passcode"
                className="w-full px-3.5 py-2.5 text-xs text-[#111111] bg-white border border-[#CCCCCC] focus:border-black outline-none text-center tracking-widest font-mono"
                autoFocus
              />
              {authError && (
                <p className="text-[11px] text-red-600 mt-2 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 text-xs tracking-[0.16em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Atelier Portal</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-[#777777] hover:text-[#111111] inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const essentialCount = products.filter((p) => p.collection === 'Essential').length;
  const signatureCount = products.filter((p) => p.collection === 'Signature').length;
  const bespokeCount = products.filter((p) => p.collection === 'Bespoke').length;

  return (
    <div className="bg-white min-h-screen pb-24 font-sans-ui">
      {/* Top Admin Header */}
      <div className="border-b border-[#E5E5E5] bg-[#FAFAFA] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#777777] font-mono">
                <span>Atelier Manager</span>
                <span>/</span>
                <span className="text-[#111111]">Cloudflare D1 & R2 Catalog</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium mt-1">
                Collection & Product Management
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="px-3 py-2.5 text-xs text-[#555555] bg-white border border-[#CCCCCC] hover:border-black transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Refresh from Cloudflare D1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 text-xs tracking-wider uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Garment</span>
              </button>

              <Link
                to="/collections"
                className="px-4 py-2.5 text-xs tracking-wider uppercase font-medium text-[#111111] border border-[#CCCCCC] hover:border-black transition-colors flex items-center gap-1.5 bg-white"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2.5 text-xs text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
                title="Log out of atelier portal"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Cloudflare Storage & Binding Health Indicator */}
          <div className="p-3 bg-white border border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#C5A880]" />
                <span className="font-semibold text-[#111111]">Cloudflare D1:</span>
                {backendHealth?.d1.operational ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Connected & Operational</span>
                  </span>
                ) : backendHealth?.d1.configured ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Binding Configured (Pending Migrations)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#777777] bg-neutral-100 px-2 py-0.5 border border-[#CCCCCC]">
                    <span>Local/Fallback Mode (Awaiting D1 ID in wrangler.toml)</span>
                  </span>
                )}
              </div>

              <span className="hidden sm:inline text-[#CCCCCC]">|</span>

              <div className="flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-[#111111]">Cloudflare R2:</span>
                {backendHealth?.r2.configured ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-sky-800 bg-sky-50 px-2 py-0.5 border border-sky-200">
                    <CheckCircle2 className="w-3 h-3 text-sky-600" />
                    <span>Bucket Bound (kraysdhaka-images)</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-[#777777] bg-neutral-100 px-2 py-0.5 border border-[#CCCCCC]">
                    <span>Images bound via Worker /api/images route</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-[#666666] font-mono">
              Shared Catalog: {isRemote ? 'Live Cloud D1' : 'Initial Baseline Cache'}
            </div>
          </div>

          {/* Catalog KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-[#EAEAEA] text-xs">
            <div className="p-3 bg-white border border-[#E5E5E5]">
              <span className="text-[#777777] block text-[10px] uppercase tracking-wider">Total Garments</span>
              <span className="text-lg font-semibold text-[#111111] tabular-nums">{products.length}</span>
            </div>
            <div className="p-3 bg-white border border-[#E5E5E5]">
              <span className="text-[#777777] block text-[10px] uppercase tracking-wider">Essential (from ৳6,000)</span>
              <span className="text-lg font-semibold text-[#111111] tabular-nums">{essentialCount}</span>
            </div>
            <div className="p-3 bg-white border border-[#E5E5E5]">
              <span className="text-[#777777] block text-[10px] uppercase tracking-wider">Signature (from ৳8,500)</span>
              <span className="text-lg font-semibold text-[#111111] tabular-nums">{signatureCount}</span>
            </div>
            <div className="p-3 bg-white border border-[#E5E5E5]">
              <span className="text-[#777777] block text-[10px] uppercase tracking-wider">Bespoke Commissions</span>
              <span className="text-lg font-semibold text-[#111111] tabular-nums">{bespokeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        {/* Action success notification with link to newly created garment */}
        {actionSuccess && (
          <div className="p-3.5 bg-neutral-900 text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
              {newlyCreatedId && (
                <Link
                  to={`/product/${newlyCreatedId}`}
                  className="underline text-emerald-300 hover:text-emerald-200 ml-2 inline-flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview Garment Page</span>
                </Link>
              )}
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Toolbar: Export & Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-neutral-50 border border-[#E5E5E5] text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#777777]" />
            <span>Garment changes automatically persist to Cloudflare D1 and publish immediately to all visitors.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyJson}
              className="px-3 py-1.5 bg-white border border-[#CCCCCC] hover:border-black text-[#111111] font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {copyFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>JSON Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3 py-1.5 bg-white border border-[#CCCCCC] hover:border-red-600 text-[#666666] hover:text-red-600 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog</span>
            </button>
          </div>
        </div>

        {/* Garment Management Table */}
        <div className="border border-[#E5E5E5] overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-[11px] uppercase tracking-wider text-[#444444]">
                <th className="p-3.5 font-semibold">Garment</th>
                <th className="p-3.5 font-semibold">Collection</th>
                <th className="p-3.5 font-semibold">Category</th>
                <th className="p-3.5 font-semibold">Starting Price</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Silhouette & Fabric</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {products.map((item: any) => {
                const isPublished = item.status !== 'draft';
                return (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-14 object-cover border border-[#E5E5E5] shrink-0 bg-neutral-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = IMAGES.essential;
                          }}
                        />
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="text-sm text-[#111111] font-editorial font-medium hover:underline block"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[10px] text-[#777777] font-mono">{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-xs font-medium text-[#222222]">
                        {item.collection}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#555555]">
                      {item.category}
                    </td>
                    <td className="p-3.5 font-semibold text-[#111111] tabular-nums">
                      {formatBDT(item.startingPrice)}
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePublication(item)}
                        className={`px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider cursor-pointer border transition-colors ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-3.5 max-w-xs text-[#666666]">
                      <p className="line-clamp-1">{item.silhouette}</p>
                      <p className="text-[10px] text-[#888888] line-clamp-1">{item.fabricDetails}</p>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/product/${item.id}`}
                          className="p-1.5 text-[#666666] hover:text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="View garment page"
                          aria-label={`View ${item.name} page`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-[#444444] hover:text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit garment"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete({ id: item.id, name: item.name })}
                          className="p-1.5 text-neutral-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer focus-visible:outline-red-600"
                          title="Remove garment"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#E5E5E5] w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-editorial text-xl text-[#111111] font-medium">
                Remove Garment
              </h3>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
              Are you sure you want to remove <strong className="text-[#111111]">"{itemToDelete.name}"</strong>? This will permanently delete its record from Cloudflare D1 and clean up its associated photography in Cloudflare R2.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-[#CCCCCC] hover:border-black text-xs text-[#111111] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#E5E5E5] w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-editorial text-xl text-[#111111] font-medium">
                Reset Catalog Cache
              </h3>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#555555] font-sans-ui leading-relaxed">
              This will restore the 9 baseline house garments in your local session. To reset the production Cloudflare D1 database, re-run migration 0002_seed_products.sql via Wrangler CLI.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 border border-[#CCCCCC] hover:border-black text-xs text-[#111111] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefault();
                  setIsResetConfirmOpen(false);
                  setActionSuccess('Catalog cache restored to default house suits.');
                  setTimeout(() => setActionSuccess(null), 3000);
                }}
                className="px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs font-semibold cursor-pointer"
              >
                Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Garment Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#E5E5E5] w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#777777] hover:text-[#111111] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-[#E5E5E5] mb-5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#777777] font-mono block">
                Atelier Cloudflare D1 & R2 Editor
              </span>
              <h2 className="font-editorial text-2xl text-[#111111] font-medium mt-0.5">
                {editingId ? 'Edit Garment Details' : 'Add New Garment to Collection'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans-ui">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                  <button type="button" onClick={() => setFormError(null)} className="text-red-500 hover:text-red-800">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Direct R2 Image Upload Field */}
              <div className="p-4 bg-neutral-50/60 border border-[#E5E5E5]">
                <ImageUploadField
                  currentImage={formData.image || ''}
                  onChange={(imgData) => setFormData({ ...formData, image: imgData })}
                  galleryImages={formData.galleryImages || []}
                  onGalleryChange={(imgs) => setFormData({ ...formData, galleryImages: imgs })}
                />
              </div>

              {/* Name & Starting Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Garment Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Midnight Silk Velvet Tuxedo"
                    className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Starting Price (৳ BDT)
                  </label>
                  <input
                    type="number"
                    value={formData.startingPrice ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startingPrice: e.target.value === '' ? null : Number(e.target.value)
                      })
                    }
                    placeholder="e.g. 8500 (leave blank for consultation)"
                    className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none"
                  />
                  <span className="text-[10px] text-[#777777] mt-0.5 block">
                    Essential: from ৳6,000 · Signature: from ৳8,500
                  </span>
                </div>
              </div>

              {/* Collection, Category & Publication Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Collection Tier
                  </label>
                  <select
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value as any })}
                    className="w-full px-2.5 py-2 border border-[#CCCCCC] focus:border-black outline-none cursor-pointer bg-white"
                  >
                    <option value="Essential">Essential Collection (from ৳6,000)</option>
                    <option value="Signature">Signature Collection (from ৳8,500)</option>
                    <option value="Bespoke">Bespoke Commissions (Custom Pattern)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Category Type
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-2.5 py-2 border border-[#CCCCCC] focus:border-black outline-none cursor-pointer bg-white"
                  >
                    <option value="Suit">Single-Breasted Suit</option>
                    <option value="Double-Breasted">Double-Breasted Suit</option>
                    <option value="Formalwear">Formalwear & Tuxedos</option>
                    <option value="Separates">Shirts, Trousers & Waistcoats</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status || 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-2.5 py-2 border border-[#CCCCCC] focus:border-black outline-none cursor-pointer bg-white font-mono"
                  >
                    <option value="published">Published (Live to Visitors)</option>
                    <option value="draft">Draft (Atelier Only)</option>
                  </select>
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                  Card Summary Line
                </label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Clean architectural silhouette with sculpted shoulders..."
                  className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                  Full Tailoring & Drape Narrative
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed tailoring notes for product page..."
                  className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none"
                />
              </div>

              {/* Specifications: Silhouette & Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Silhouette & Cut
                  </label>
                  <input
                    type="text"
                    value={formData.silhouette || ''}
                    onChange={(e) => setFormData({ ...formData, silhouette: e.target.value })}
                    placeholder="e.g. Single-breasted 2-button, roped shoulder"
                    className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Fabric & Cloth Details
                  </label>
                  <input
                    type="text"
                    value={formData.fabricDetails || ''}
                    onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                    placeholder="e.g. 100% Super 120s virgin wool, 290g/m"
                    className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none"
                  />
                </div>
              </div>

              {/* Lapel & Construction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Lapel Style
                  </label>
                  <input
                    type="text"
                    value={formData.lapelStyle || ''}
                    onChange={(e) => setFormData({ ...formData, lapelStyle: e.target.value })}
                    placeholder="e.g. Peak lapel (9.5 cm width)"
                    className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#222222] mb-1">
                    Internal Construction
                  </label>
                  <input
                    type="text"
                    value={formData.construction || ''}
                    onChange={(e) => setFormData({ ...formData, construction: e.target.value })}
                    placeholder="e.g. Half-canvas with natural horsehair"
                    className="w-full px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-[#CCCCCC] hover:border-black text-[#111111] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#111111] text-white hover:bg-black font-semibold cursor-pointer shadow-xs tracking-wider uppercase text-xs flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Cloudflare D1...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Save Changes' : 'Post & Publish Garment'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

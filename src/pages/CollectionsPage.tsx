import React, { useState, useMemo } from 'react';
import { useSearchParams } from '../router';
import { Search, Filter, RotateCcw, ArrowUpRight } from 'lucide-react';
import { Product } from '../data/tailoringData';
import { ProductCard } from '../components/ProductCard';
import { filterProducts } from '../utils/tailoring';
import { useCatalog } from '../context/CatalogContext';

interface CollectionsPageProps {
  onOpenConsultation: () => void;
  onSelectProductForConsultation: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onOpenConsultation,
  onSelectProductForConsultation
}) => {
  const { products } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';

  const [selectedCollection, setSelectedCollection] = useState<string>(initialFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      collection: selectedCollection,
      category: selectedCategory,
      searchQuery: searchQuery,
      sort: sortOrder
    });
  }, [products, selectedCollection, selectedCategory, searchQuery, sortOrder]);

  const handleCollectionChange = (col: string) => {
    setSelectedCollection(col);
    if (col === 'All') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', col);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCollection('All');
    setSelectedCategory('All');
    setSearchQuery('');
    setSortOrder('featured');
    searchParams.delete('filter');
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <section className="border-b border-[#E5E5E5] py-14 sm:py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-4">
          <span className="text-xs tracking-[0.24em] uppercase text-[#777777] font-sans-ui block">
            Catalogue & Archive
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal tracking-tight">
            The Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans-ui max-w-2xl leading-relaxed">
            Explore our curated tailoring categories: Essential foundations designed for versatility, and Signature silhouettes offering commanding proportions. All garments are made to individual measurements.
          </p>

          <div className="pt-2 flex items-center gap-6 text-xs text-[#666666] font-sans-ui">
            <span>Essential: From ৳6,000</span>
            <span aria-hidden="true">·</span>
            <span>Signature: From ৳8,500</span>
            <span aria-hidden="true">·</span>
            <span>Hand-Cut Bespoke: Custom Quotation</span>
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] py-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Collection Segmented Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0" role="tablist" aria-label="Filter collections">
            {['All', 'Essential', 'Signature', 'Bespoke'].map((col) => {
              const isSelected = selectedCollection === col;
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => handleCollectionChange(col)}
                  role="tab"
                  aria-selected={isSelected}
                  className={`px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'text-[#666666] hover:text-[#111111] hover:bg-neutral-100'
                  }`}
                >
                  {col === 'All' ? 'All Collections' : col}
                </button>
              );
            })}
          </div>

          {/* Search and Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                placeholder="Search cloth, cut, style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs text-[#111111] bg-neutral-50 border border-[#D5D5D5] focus:border-black outline-none rounded-none"
              />
              <Search className="w-3.5 h-3.5 text-[#888888] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort Selector */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="py-1.5 px-2.5 text-xs text-[#333333] bg-white border border-[#D5D5D5] focus:border-black outline-none cursor-pointer rounded-none"
              aria-label="Sort garments"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalogue Grid Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Active Filters Notice */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#EAEAEA] text-xs text-[#666666]">
          <span>
            Showing <strong className="text-[#111111] font-medium">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'garment' : 'garments'}
          </span>

          {(selectedCollection !== 'All' || selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Product Cards */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectForConsultation={onSelectProductForConsultation}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-[#D5D5D5] space-y-4">
            <p className="font-editorial text-2xl text-[#111111]">No garments matched your filter.</p>
            <p className="text-xs text-[#666666] font-sans-ui">
              Try adjusting your search query or selecting a different collection category.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 text-xs tracking-wider uppercase font-medium bg-[#111111] text-white cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pricing & Policy Clarification Footnote */}
        <div className="mt-16 p-6 bg-neutral-50 border border-[#E5E5E5] space-y-2 text-xs text-[#666666]">
          <p className="font-medium text-[#222222]">
            Note Regarding Pricing & Bespoke Commissioning:
          </p>
          <p className="leading-relaxed">
            All prices indicated on product cards represent starting prices for the respective collection category (Essential from ৳6,000; Signature from ৳8,500). Because every garment is created to individual specifications, the final quotation reflects your selected fabric mill, internal canvas structure, and personal design choices.
          </p>
        </div>
      </div>
    </div>
  );
};

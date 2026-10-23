import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '../router';
import { ArrowLeft, ArrowUpRight, MessageCircle, Check, Info } from 'lucide-react';
import { BRAND_CONFIG, Product } from '../data/tailoringData';
import { formatBDT, generateWhatsAppUrl } from '../utils/tailoring';
import { useCatalog } from '../context/CatalogContext';

interface ProductDetailPageProps {
  onOpenConsultationWithProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  onOpenConsultationWithProduct
}) => {
  const { products } = useCatalog();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="font-editorial text-3xl">Garment Not Found</h2>
        <p className="text-xs text-[#666666]">The requested garment could not be found in our current archive.</p>
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-white text-xs uppercase tracking-wider"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const gallery = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  const whatsappInquiryUrl = generateWhatsAppUrl(
    BRAND_CONFIG.whatsappNumber,
    `Hello KRAYS DHAKA Atelier. I am interested in inquiring about the ${product.name} (${product.collection} Collection). Could you advise on fabric swatches and consultation availability?`
  );

  const relatedProducts = products.filter(
    (p) => p.collection === product.collection && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#E5E5E5] py-3.5 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between text-xs text-[#666666]">
          <Link
            to="/collections"
            className="hover:text-black transition-colors flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collections</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>{product.collection}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#111111] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 border border-[#E5E5E5] overflow-hidden">
              <img
                src={gallery[activeImageIndex]}
                alt={`KRAYS DHAKA ${product.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-all duration-300"
              />
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((img, index) => {
                  const isActive = activeImageIndex === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-20 h-24 shrink-0 overflow-hidden border cursor-pointer ${
                        isActive ? 'border-[#111111] ring-1 ring-[#111111]' : 'border-[#E5E5E5] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Purchase & Consultation Module (5 cols) */}
          <div className="lg:col-span-5 space-y-8 sticky top-28">
            <div className="space-y-3 pb-6 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#777777]">
                <span>{product.collection} Collection</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-medium leading-tight">
                {product.name}
              </h1>

              {/* Price Indicator */}
              <div className="pt-2">
                <p className="text-xl font-medium tracking-tight text-[#111111] tabular-nums">
                  {product.startingPrice !== null ? (
                    <>
                      <span className="text-xs font-normal text-[#666666] uppercase tracking-wider mr-2">
                        Starting from
                      </span>
                      {formatBDT(product.startingPrice)}
                    </>
                  ) : (
                    <span className="text-sm font-normal text-[#666666] uppercase tracking-wider">
                      Quotation upon Consultation
                    </span>
                  )}
                </p>
                {product.priceNote && (
                  <p className="text-[11px] text-[#777777] font-sans-ui mt-1 leading-normal">
                    {product.priceNote}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#333333]">
                Garment Description
              </h2>
              <p className="text-xs sm:text-sm text-[#444444] font-sans-ui leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-3 py-4 border-y border-[#EAEAEA]">
              <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#333333]">
                Sartorial Specifications
              </h2>
              <dl className="grid grid-cols-1 gap-2 text-xs font-sans-ui">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <dt className="text-[#777777]">Silhouette & Cut</dt>
                  <dd className="text-[#111111] font-medium text-right">{product.silhouette}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <dt className="text-[#777777]">Fabric & Cloth</dt>
                  <dd className="text-[#111111] font-medium text-right">{product.fabricDetails}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <dt className="text-[#777777]">Lapel Architecture</dt>
                  <dd className="text-[#111111] font-medium text-right">{product.lapelStyle}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <dt className="text-[#777777]">Internal Construction</dt>
                  <dd className="text-[#111111] font-medium text-right">{product.construction}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <dt className="text-[#777777]">Vent Configuration</dt>
                  <dd className="text-[#111111] font-medium text-right">{product.vents}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-[#777777]">Buttons & Finishing</dt>
                  <dd className="text-[#111111] font-medium text-right">{product.buttons}</dd>
                </div>
              </dl>
            </div>

            {/* Confirmed Customisation Features */}
            {product.features && (
              <div className="space-y-2">
                <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#333333]">
                  Included Tailoring Details
                </h2>
                <ul className="space-y-1.5 text-xs text-[#555555]">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action CTAs */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenConsultationWithProduct(product)}
                className="w-full py-4 text-xs tracking-[0.18em] uppercase font-semibold text-white bg-[#111111] hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Consultation for this Suit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 text-xs tracking-[0.16em] uppercase font-medium text-[#111111] border border-[#CCCCCC] hover:border-black transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Atelier Inquiry</span>
              </a>

              <div className="flex items-center gap-2 text-[11px] text-[#777777] pt-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>All garments are individually made-to-measure. Ready-made retail suits are not stocked.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Garments */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#E5E5E5] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs tracking-[0.2em] uppercase text-[#777777] block">
                  More from {product.collection}
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#111111] font-medium">
                  Related Tailored Pieces
                </h2>
              </div>
              <Link
                to="/collections"
                className="text-xs uppercase tracking-wider font-semibold text-[#111111] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <div key={rel.id} className="border border-[#E5E5E5] p-4 flex flex-col justify-between">
                  <Link to={`/collections/${rel.id}`} className="block aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#777777] block">{rel.collection}</span>
                    <h3 className="font-editorial text-lg text-[#111111] font-medium">{rel.name}</h3>
                    <p className="text-xs font-semibold text-[#111111] tabular-nums mt-1">
                      {rel.startingPrice ? `From ${formatBDT(rel.startingPrice)}` : 'Quotation on Consultation'}
                    </p>
                  </div>
                  <Link
                    to={`/collections/${rel.id}`}
                    className="mt-4 pt-3 border-t border-neutral-100 text-xs uppercase tracking-wider font-medium text-[#111111] flex items-center justify-between"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

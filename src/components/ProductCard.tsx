import React from 'react';
import { Link } from '../router';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../data/tailoringData';
import { formatBDT } from '../utils/tailoring';

interface ProductCardProps {
  product: Product;
  onSelectForConsultation?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectForConsultation
}) => {
  return (
    <article className="group flex flex-col bg-white border border-[#E5E5E5] transition-all duration-300 hover:border-black/40">
      {/* Image Container with Editorial Aspect Ratio */}
      <Link
        to={`/collections/${product.id}`}
        className="relative block aspect-[3/4] overflow-hidden bg-neutral-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={product.image}
          alt={`KRAYS DHAKA ${product.name}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </Link>

      {/* Card Content & Metadata */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          {/* Unboxed Metadata Line */}
          <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#777777]">
            <span>{product.collection}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-editorial text-xl text-[#111111] group-hover:text-black font-medium leading-snug">
            <Link to={`/collections/${product.id}`} className="focus-visible:underline">
              {product.name}
            </Link>
          </h3>

          {/* Price Indicator */}
          <div className="pt-1">
            <p className="text-sm font-medium tracking-tight text-[#111111] tabular-nums">
              {product.startingPrice !== null ? (
                <>
                  <span className="text-xs font-normal text-[#666666] uppercase tracking-wider mr-1.5">
                    Starting from
                  </span>
                  {formatBDT(product.startingPrice)}
                </>
              ) : (
                <span className="text-xs font-normal text-[#666666] uppercase tracking-wider">
                  Quotation on Consultation
                </span>
              )}
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs text-[#555555] leading-relaxed line-clamp-2 pt-1 font-sans-ui">
            {product.shortDescription}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-6 mt-4 border-t border-[#EAEAEA] flex items-center justify-between gap-3">
          <Link
            to={`/collections/${product.id}`}
            className="text-xs tracking-[0.14em] uppercase font-semibold text-[#111111] hover:opacity-70 transition-opacity inline-flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {onSelectForConsultation && (
            <button
              type="button"
              onClick={() => onSelectForConsultation(product)}
              className="text-xs tracking-[0.12em] uppercase font-medium text-[#555555] hover:text-[#111111] transition-colors py-1 px-2 border border-transparent hover:border-neutral-300 cursor-pointer"
            >
              Inquire
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

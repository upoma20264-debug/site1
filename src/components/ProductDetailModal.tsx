import { useEffect, useState } from 'react';
import { Heart, Minus, Plus, X } from 'lucide-react';
import type { Product } from '../types/retail';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  isSaved: boolean;
  onClose: () => void;
  onAddToBag: (productId: string, variantId: string, quantity: number) => void;
  onToggleSave: (productId: string) => void;
}

export function ProductDetailModal({
  product,
  isSaved,
  onClose,
  onAddToBag,
  onToggleSave,
}: ProductDetailModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product) {
      const firstAvailable =
        product.variants.find((v) => v.inStock) ?? product.variants[0];
      setSelectedVariantId(firstAvailable?.id ?? '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  const handleConfirmAdd = () => {
    if (!activeVariant || !activeVariant.inStock) return;
    onAddToBag(product.id, activeVariant.id, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111418]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-[#E2E5E9] rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-md bg-white/95 border border-[#E2E5E9] flex items-center justify-center text-[#111418] hover:bg-[#EFF1F3] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Gallery Left */}
          <div className="md:col-span-6 bg-[#EFF1F3] border-b md:border-b-0 md:border-r border-[#E2E5E9] flex flex-col">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <ResilientImage
                src={product.image}
                alt={product.name}
                fallbackTitle={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Specifications Table */}
            <div className="p-6 bg-[#F7F8FA] flex-1 border-t border-[#E2E5E9]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5C6470] mb-3">
                Technical Specifications
              </h3>
              <dl className="divide-y divide-[#E2E5E9]">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="py-2.5 flex items-baseline justify-between gap-4 text-xs"
                  >
                    <dt className="text-[#5C6470]">{spec.label}</dt>
                    <dd className="text-[#111418] font-medium text-right tabular-nums">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Contiguous Purchase Module Right */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#5C6470] mb-2">
                <span className="uppercase tracking-wider">
                  {product.categoryLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{product.sku}</span>
              </div>

              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2
                  id="pdp-title"
                  className="font-display text-2xl font-semibold text-[#111418]"
                >
                  {product.name}
                </h2>
                <span className="text-xl font-semibold text-[#111418] tabular-nums shrink-0">
                  ${product.price.toFixed(0)}
                </span>
              </div>

              <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Finish / Variant Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-medium text-[#111418]">
                    Finish: {activeVariant?.name}
                  </span>
                  <span
                    className={
                      activeVariant?.inStock
                        ? 'text-[#1D4ED8] font-medium'
                        : 'text-[#5C6470]'
                    }
                  >
                    {activeVariant?.inStock
                      ? 'Ready to Ship Today'
                      : 'Backordered (2 Weeks)'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const selected = variant.id === activeVariant?.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`inline-flex items-center gap-2 min-h-10 px-3.5 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#111418] bg-[#EFF1F3] text-[#111418]'
                            : 'border-[#E2E5E9] bg-white text-[#5C6470] hover:border-[#111418]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: variant.hex }}
                        />
                        <span className="whitespace-nowrap">
                          {variant.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Purchase Controls */}
            <div className="pt-5 border-t border-[#E2E5E9] space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="inline-flex items-center border border-[#E2E5E9] rounded-md bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-11 flex items-center justify-center text-[#111418] hover:bg-[#EFF1F3] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-[#111418] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="w-10 h-11 flex items-center justify-center text-[#111418] hover:bg-[#EFF1F3] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!activeVariant?.inStock}
                  onClick={handleConfirmAdd}
                  className="flex-1 min-h-11 px-6 py-2.5 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] disabled:bg-[#9CA3AF] disabled:cursor-not-allowed transition-colors whitespace-nowrap tabular-nums cursor-pointer"
                >
                  {activeVariant?.inStock
                    ? `Add to Bag — $${(product.price * quantity).toFixed(0)}`
                    : 'Currently Unavailable'}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSave(product.id)}
                  aria-label={isSaved ? 'Remove from saved' : 'Save object'}
                  className="w-11 h-11 rounded-md border border-[#E2E5E9] flex items-center justify-center hover:bg-[#EFF1F3] transition-colors cursor-pointer shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isSaved ? 'fill-[#1D4ED8] text-[#1D4ED8]' : 'text-[#5C6470]'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-[#5C6470]">
                Complimentary delivery over $150 · 30-day home trial included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

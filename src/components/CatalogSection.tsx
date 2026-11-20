import { Heart, Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import type { CategoryId, Product, SortOption } from '../types/retail';
import { ResilientImage } from './ResilientImage';

interface CatalogSectionProps {
  products: Product[];
  activeCategory: CategoryId;
  searchQuery: string;
  sortBy: SortOption;
  savedIds: string[];
  recentlyAddedId: string | null;
  onCategoryChange: (category: CategoryId) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleSave: (productId: string) => void;
}

export function CatalogSection({
  products,
  activeCategory,
  searchQuery,
  sortBy,
  savedIds,
  recentlyAddedId,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSelectProduct,
  onQuickAdd,
  onToggleSave,
}: CatalogSectionProps) {
  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-medium tracking-wider uppercase text-[#5C6470] mb-1.5">
            Curated Retail Catalog
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111418]">
            Objects &amp; Studio Essentials
          </h2>
        </div>
        <p className="text-sm text-[#5C6470] tabular-nums">
          Showing {products.length} {products.length === 1 ? 'object' : 'objects'}
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E2E5E9]">
        {/* Category Segmented Filter Buttons */}
        <div
          role="tablist"
          aria-label="Product categories"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#EFF1F3] rounded-md w-fit"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(cat.id)}
                className={`min-h-9 px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1D4ED8] ${
                  isActive
                    ? 'bg-white text-[#111418] shadow-xs'
                    : 'text-[#5C6470] hover:text-[#111418]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'saved'}
            onClick={() => onCategoryChange('saved')}
            className={`min-h-9 px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1D4ED8] ${
              activeCategory === 'saved'
                ? 'bg-white text-[#111418] shadow-xs'
                : 'text-[#5C6470] hover:text-[#111418]'
            }`}
          >
            Saved ({savedIds.length})
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="w-4 h-4 text-[#5C6470] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search objects, materials, SKU..."
              aria-label="Search retail catalog"
              className="w-full min-h-10 pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E5E9] rounded-md text-[#111418] placeholder:text-[#7C8591] focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>

          <div className="relative flex items-center">
            <SlidersHorizontal
              className="w-4 h-4 text-[#5C6470] absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort products"
              className="min-h-10 pl-9 pr-8 py-2 text-sm bg-white border border-[#E2E5E9] rounded-md text-[#111418] focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="bg-white border border-[#E2E5E9] rounded-lg p-12 text-center">
          <h3 className="font-display text-lg font-semibold text-[#111418] mb-2">
            No matching objects found
          </h3>
          <p className="text-sm text-[#5C6470] mb-6">
            {activeCategory === 'saved'
              ? 'Save any item from the catalog using the bookmark button to review it here.'
              : 'Try clearing your search filter or switching back to all objects.'}
          </p>
          <button
            type="button"
            onClick={() => {
              onCategoryChange('all');
              onSearchChange('');
            }}
            className="inline-flex items-center justify-center min-h-10 px-5 py-2 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const isSaved = savedIds.includes(product.id);
            const justAdded = recentlyAddedId === product.id;

            return (
              <article
                key={product.id}
                className="group bg-white border border-[#E2E5E9] rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Product Photography */}
                <div className="relative aspect-[4/3] bg-[#EFF1F3] overflow-hidden border-b border-[#E2E5E9]">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="w-full h-full block text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1D4ED8]"
                    aria-label={`Inspect ${product.name}`}
                  >
                    <ResilientImage
                      src={product.image}
                      alt={product.name}
                      fallbackTitle={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSave(product.id)}
                    aria-label={
                      isSaved
                        ? `Remove ${product.name} from saved items`
                        : `Save ${product.name} to wishlist`
                    }
                    className="absolute top-3 right-3 w-10 h-10 rounded-md bg-white/90 backdrop-blur-xs border border-[#E2E5E9] flex items-center justify-center text-[#111418] hover:bg-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-[#1D4ED8] text-[#1D4ED8]' : 'text-[#5C6470]'
                      }`}
                      strokeWidth={1.75}
                    />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5C6470] mb-1.5">
                      <span className="uppercase tracking-wider truncate">
                        {product.categoryLabel} · {product.materialSummary}
                      </span>
                      <span className="shrink-0 font-medium text-[#111418]">
                        {product.statusNote}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-base font-semibold text-[#111418] leading-snug">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="text-left hover:text-[#1D4ED8] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </button>
                      </h3>
                      <span className="text-[15px] font-semibold text-[#111418] tabular-nums shrink-0">
                        ${product.price.toFixed(0)}
                      </span>
                    </div>

                    {/* Variant Swatches Preview */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1.5">
                        {product.variants.map((variant) => (
                          <span
                            key={variant.id}
                            title={variant.name}
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: variant.hex }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#5C6470]">
                        {product.variants.length}{' '}
                        {product.variants.length === 1 ? 'finish' : 'finishes'}
                      </span>
                    </div>
                  </div>

                  {/* Direct Retail Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#EFF1F3]">
                    <button
                      type="button"
                      onClick={() => onQuickAdd(product)}
                      className={`flex-1 min-h-10 px-4 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                        justAdded
                          ? 'bg-[#1D4ED8] text-white'
                          : 'bg-[#111418] text-white hover:bg-[#1D4ED8]'
                      }`}
                    >
                      {justAdded ? 'Added to Bag' : 'Add to Bag'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="min-h-10 px-4 py-2 text-xs font-medium text-[#111418] bg-[#EFF1F3] rounded-md hover:bg-[#E2E5E9] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

interface HeaderProps {
  bagCount: number;
  savedCount: number;
  onOpenBag: () => void;
  onSelectSaved: () => void;
}

export function Header({
  bagCount,
  savedCount,
  onOpenBag,
  onSelectSaved,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F8FA]/95 backdrop-blur-sm border-b border-[#E2E5E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#111418] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
        >
          Kettler Goods
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C6470]"
        >
          <a
            href="#catalog"
            className="hover:text-[#111418] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Catalog
          </a>
          <a
            href="#service"
            className="hover:text-[#111418] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Service
          </a>
          <a
            href="#track-order"
            className="hover:text-[#111418] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Track Order
          </a>
          <button
            type="button"
            onClick={onSelectSaved}
            className="hover:text-[#111418] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer"
          >
            Saved ({savedCount})
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex items-center justify-center min-h-10 px-5 py-2 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            Bag ({bagCount})
          </button>
        </div>
      </div>
    </header>
  );
}

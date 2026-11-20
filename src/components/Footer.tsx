export function Footer() {
  return (
    <footer className="bg-[#F7F8FA] border-t border-[#E2E5E9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E2E5E9]">
          <div className="md:col-span-5 space-y-2">
            <span className="font-display text-base font-semibold text-[#111418] block">
              Kettler Goods
            </span>
            <p className="text-xs text-[#5C6470] max-w-sm leading-relaxed">
              Architectural homeware, studio lighting, and tactile domestic
              objects. Direct warehouse fulfillment across North America and
              Europe.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <h3 className="font-semibold text-[#111418]">Storefront</h3>
            <ul className="space-y-1.5 text-[#5C6470]">
              <li>
                <a href="#catalog" className="hover:text-[#111418]">
                  Objects Catalog
                </a>
              </li>
              <li>
                <a href="#service" className="hover:text-[#111418]">
                  Warranty &amp; Care
                </a>
              </li>
              <li>
                <a href="#track-order" className="hover:text-[#111418]">
                  Track Shipment
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2 text-xs text-[#5C6470]">
            <h3 className="font-semibold text-[#111418]">Client Concierge</h3>
            <p>Mon–Fri, 09:00–18:00 PST · studio@kettlergoods.com</p>
            <p>Warehouse Dispatch: 840 Brannan St, San Francisco, CA</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5C6470]">
          <span>© {new Date().getFullYear()} Kettler Goods Retail LLC.</span>
          <span>All prices in USD · 30-day return policy</span>
        </div>
      </div>
    </footer>
  );
}

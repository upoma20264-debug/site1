import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onBrowseCatalog: () => void;
  onInspectFeatured: () => void;
}

const SERVICE_STRIP = [
  {
    title: 'Free Carbon-Neutral Delivery',
    detail: 'Complimentary courier shipping on all orders over $150.',
  },
  {
    title: '2-Year Hardware Warranty',
    detail: 'Full parts and electrical replacement coverage included.',
  },
  {
    title: '30-Day Home Trial',
    detail: 'Prepaid return labels for unmounted lighting and textiles.',
  },
  {
    title: 'Same-Day Studio Dispatch',
    detail: 'Orders placed before 2:00 PM ship from our warehouse today.',
  },
];

export function Hero({ onBrowseCatalog, onInspectFeatured }: HeroProps) {
  return (
    <section id="top" className="border-b border-[#E2E5E9] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Balanced 2-column split with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-[#5C6470] mb-4">
                Autumn Studio Release · Edition 04
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#111418] leading-[1.08] mb-5">
                Architectural objects built for daily utility.
              </h1>
              <p className="text-base text-[#4B5563] leading-relaxed max-w-lg mb-8">
                Spun aluminum lighting, kiln-fired stoneware, and heavyweight
                merino textiles. Crafted in small production runs and delivered
                directly from our studio warehouse.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBrowseCatalog}
                className="inline-flex items-center gap-2 min-h-11 px-6 py-2.5 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onInspectFeatured}
                className="inline-flex items-center min-h-11 px-5 py-2.5 text-sm font-medium text-[#111418] bg-[#EFF1F3] rounded-md hover:bg-[#E2E5E9] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                Inspect Dome Lamp
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-lg overflow-hidden border border-[#E2E5E9] bg-[#EFF1F3]">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Sunlit architectural living space showcasing the matte black Monolith Dome Lamp, ceramic vessels, and herringbone merino throw on a limestone credenza."
                fallbackTitle="Kettler Goods Studio Collection"
                className="w-full h-full lg:h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column retail service strip below the hero split */}
        <div className="mt-10 pt-8 border-t border-[#E2E5E9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_STRIP.map((item) => (
            <div key={item.title} className="space-y-1">
              <h2 className="text-sm font-semibold text-[#111418]">
                {item.title}
              </h2>
              <p className="text-xs text-[#5C6470] leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { Check, PackageCheck, Search, ShieldCheck, Truck } from 'lucide-react';
import type { OrderRecord, OrderStep } from '../types/retail';

interface ServiceAndTrackingSectionProps {
  orders: OrderRecord[];
  activeOrderLookup: string;
  onOrderLookupChange: (value: string) => void;
}

const ORDER_STEPS: { id: OrderStep; label: string }[] = [
  { id: 'confirmed', label: 'Order Confirmed' },
  { id: 'inspected', label: 'Quality Checked' },
  { id: 'in-transit', label: 'In Transit' },
  { id: 'delivered', label: 'Delivered' },
];

const SERVICE_STANDARDS = [
  {
    number: '01.',
    title: 'Direct Studio Dispatch & Packaging',
    description:
      'Every ceramic, glass, and lighting piece is double-boxed in molded recycled pulp inserts and inspected by serial number before leaving our fulfillment bay.',
    icon: PackageCheck,
  },
  {
    number: '02.',
    title: 'Transparent Repairs & 2-Year Warranty',
    description:
      'We stock modular replacement rotary dimmers, braided textile cords, and felt feet for every luminaire we sell so objects remain serviceable for decades.',
    icon: ShieldCheck,
  },
  {
    number: '03.',
    title: '30-Day Home Trial & Scheduled Couriers',
    description:
      'Live with any object in your own daylight for 30 days. Need a return or exchange? Generate a prepaid courier pickup label directly from our service desk.',
    icon: Truck,
  },
];

export function ServiceAndTrackingSection({
  orders,
  activeOrderLookup,
  onOrderLookupChange,
}: ServiceAndTrackingSectionProps) {
  const [query, setQuery] = useState(activeOrderLookup);
  const [matchedOrder, setMatchedOrder] = useState<OrderRecord | null>(() => {
    return (
      orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === activeOrderLookup.trim().toLowerCase(),
      ) ?? orders[0] ?? null
    );
  });
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [supportNote, setSupportNote] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  useEffect(() => {
    setQuery(activeOrderLookup);
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === activeOrderLookup.trim().toLowerCase(),
    );
    if (found) {
      setMatchedOrder(found);
      setLookupError(null);
      setSupportSubmitted(false);
    }
  }, [activeOrderLookup, orders]);

  const handleLookup = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) {
      setLookupError('Enter an order reference number (e.g. KG-1042).');
      return;
    }
    const found = orders.find((o) => o.orderNumber.toLowerCase() === cleaned);
    if (found) {
      setMatchedOrder(found);
      setLookupError(null);
      setSupportSubmitted(false);
      onOrderLookupChange(found.orderNumber);
    } else {
      setMatchedOrder(null);
      setLookupError(
        `No shipment found for "${query.trim()}". Try KG-1042 or KG-1038.`,
      );
    }
  };

  const handleSupportRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!supportNote.trim()) return;
    setSupportSubmitted(true);
    setSupportNote('');
  };

  const currentStepIndex = matchedOrder
    ? ORDER_STEPS.findIndex((s) => s.id === matchedOrder.status)
    : -1;

  return (
    <section
      id="service"
      className="bg-white border-t border-[#E2E5E9] py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Craftsmanship & Retail Service Standards */}
        <div>
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium tracking-wider uppercase text-[#5C6470] mb-1.5">
              Retail Service Standards
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111418]">
              Built to stay in service, backed from warehouse to residence.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICE_STANDARDS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 bg-[#F7F8FA] border border-[#E2E5E9] rounded-lg flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-medium text-[#5C6470]">
                        {pillar.number}
                      </span>
                      <Icon
                        className="w-4 h-4 text-[#111418]"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-[#111418] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#4B5563] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Tracking & Customer Service Desk */}
        <div
          id="track-order"
          className="pt-14 border-t border-[#E2E5E9] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-[#5C6470] mb-1.5">
                Fulfillment &amp; Support Desk
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-[#111418] mb-2">
                Track Shipment Status
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Enter your order number to verify courier milestones, payment
                terms, and delivery schedule. Sample references:{' '}
                <button
                  type="button"
                  onClick={() => onOrderLookupChange('KG-1042')}
                  className="font-mono text-xs font-medium text-[#1D4ED8] hover:underline cursor-pointer"
                >
                  KG-1042
                </button>{' '}
                or{' '}
                <button
                  type="button"
                  onClick={() => onOrderLookupChange('KG-1038')}
                  className="font-mono text-xs font-medium text-[#1D4ED8] hover:underline cursor-pointer"
                >
                  KG-1038
                </button>
                .
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-[#5C6470] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Order ID (e.g. KG-1042)"
                  aria-label="Order reference number"
                  className="w-full min-h-11 pl-9 pr-3 py-2 text-sm font-mono bg-white border border-[#E2E5E9] rounded-md text-[#111418] focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>
              <button
                type="submit"
                className="min-h-11 px-5 py-2 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Check Status
              </button>
            </form>

            {lookupError && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                {lookupError}
              </p>
            )}
          </div>

          {/* Live Order Result Card */}
          <div className="lg:col-span-7">
            {matchedOrder ? (
              <div className="bg-[#F7F8FA] border border-[#E2E5E9] rounded-lg p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-[#E2E5E9]">
                  <div>
                    <p className="text-xs text-[#5C6470] mb-1">
                      Order Reference · {matchedOrder.carrier}
                    </p>
                    <h3 className="font-mono text-lg font-semibold text-[#111418]">
                      {matchedOrder.orderNumber}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#5C6470] block">
                      Estimated Delivery
                    </span>
                    <span className="text-sm font-semibold text-[#111418]">
                      {matchedOrder.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* 4-Stage Milestone Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {ORDER_STEPS.map((step, index) => {
                    const isComplete = index <= currentStepIndex;
                    return (
                      <div key={step.id} className="space-y-2">
                        <div
                          className={`h-1.5 rounded-full ${
                            isComplete ? 'bg-[#1D4ED8]' : 'bg-[#E2E5E9]'
                          }`}
                        />
                        <div className="flex items-center gap-1.5">
                          {isComplete && (
                            <Check
                              className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              isComplete ? 'text-[#111418]' : 'text-[#5C6470]'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E2E5E9] text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#5C6470] block mb-1.5">
                      Destination
                    </span>
                    <p className="font-medium text-[#111418]">
                      {matchedOrder.customerName}
                    </p>
                    <p className="text-xs text-[#5C6470] mt-0.5">
                      {matchedOrder.shippingAddress}, {matchedOrder.postalCode}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#5C6470] block mb-1.5">
                      Items ({matchedOrder.items.length})
                    </span>
                    <ul className="space-y-1">
                      {matchedOrder.items.map((item) => (
                        <li
                          key={`${item.sku}-${item.variantName}`}
                          className="flex justify-between gap-2 text-xs text-[#111418]"
                        >
                          <span className="truncate">
                            {item.quantity}x {item.name} ({item.variantName})
                          </span>
                          <span className="tabular-nums font-medium shrink-0">
                            ${item.unitPrice * item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-[#E2E5E9] flex justify-between text-xs font-semibold text-[#111418]">
                      <span>
                        Total (
                        {matchedOrder.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : 'Paid'}
                        )
                      </span>
                      <span className="tabular-nums">${matchedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Service Request for this Order */}
                <div className="pt-4 border-t border-[#E2E5E9]">
                  {supportSubmitted ? (
                    <p className="text-xs font-medium text-[#1D4ED8]">
                      Service ticket logged for {matchedOrder.orderNumber}. Our
                      concierge team will reply to {matchedOrder.customerEmail}{' '}
                      within 4 business hours.
                    </p>
                  ) : (
                    <form
                      onSubmit={handleSupportRequest}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="text"
                        value={supportNote}
                        onChange={(e) => setSupportNote(e.target.value)}
                        placeholder={`Need a return label or delivery note for ${matchedOrder.orderNumber}?`}
                        aria-label="Order service inquiry"
                        className="flex-1 min-h-10 px-3 py-2 text-xs bg-white border border-[#E2E5E9] rounded-md focus:outline-none focus:border-[#1D4ED8]"
                      />
                      <button
                        type="submit"
                        className="min-h-10 px-4 py-2 text-xs font-medium text-[#111418] bg-white border border-[#E2E5E9] rounded-md hover:bg-[#EFF1F3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Request Assistance
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#F7F8FA] border border-[#E2E5E9] rounded-lg p-8 text-center text-sm text-[#5C6470]">
                Enter an order reference number to view shipment progress and
                service options.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

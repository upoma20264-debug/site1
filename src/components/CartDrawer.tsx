import { useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import {
  CATALOG_PRODUCTS,
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  STANDARD_SHIPPING_FEE,
} from '../data/catalog';
import type { CartItem, OrderRecord, PaymentMethod } from '../types/retail';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onPlaceOrder: (order: OrderRecord) => void;
  onTrackOrder: (orderNumber: string) => void;
}

type DrawerView = 'bag' | 'checkout' | 'confirmed';

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onTrackOrder,
}: CartDrawerProps) {
  const [view, setView] = useState<DrawerView>('bag');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const detailedItems = items
    .map((item) => {
      const product = CATALOG_PRODUCTS.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return null;
      return { ...item, product, variant };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = detailedItems.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0,
  );
  const promoRate = appliedPromo ? PROMO_CODES[appliedPromo]?.rate ?? 0 : 0;
  const discount = Math.round(subtotal * promoRate);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const qualifiesFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0;
  const shippingFee = qualifiesFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal,
  );
  const shippingProgress = Math.min(
    100,
    Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  const handleApplyPromo = () => {
    const normalized = promoInput.trim().toUpperCase();
    if (!normalized) {
      setPromoFeedback('Enter a promo code to apply.');
      return;
    }
    if (PROMO_CODES[normalized]) {
      setAppliedPromo(normalized);
      setPromoFeedback(`Applied: ${PROMO_CODES[normalized].label}`);
    } else {
      setPromoFeedback('Code not recognized. Try KETTLER10 for 10% off.');
    }
  };

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerPhone.trim() ||
      !shippingAddress.trim() ||
      !postalCode.trim()
    ) {
      setFormError('Complete all delivery and contact fields before placing your order.');
      return;
    }

    setFormError(null);
    const randomNum = Math.floor(1050 + Math.random() * 8900);
    const newOrder: OrderRecord = {
      orderNumber: `KG-${randomNum}`,
      placedAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      subtotal,
      discount,
      shippingFee,
      total,
      status: 'confirmed',
      estimatedDelivery: '3–4 Business Days',
      carrier: 'DHL Carbon-Neutral Express',
      items: detailedItems.map((entry) => ({
        productId: entry.product.id,
        sku: entry.product.sku,
        name: entry.product.name,
        variantName: entry.variant.name,
        unitPrice: entry.product.price,
        quantity: entry.quantity,
      })),
    };

    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    setView('confirmed');
  };

  const handleResetAndClose = () => {
    setView('bag');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#111418]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col border-l border-[#E2E5E9] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 h-16 border-b border-[#E2E5E9] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {view === 'checkout' && (
              <button
                type="button"
                onClick={() => setView('bag')}
                aria-label="Back to shopping bag"
                className="w-9 h-9 rounded-md border border-[#E2E5E9] flex items-center justify-center hover:bg-[#EFF1F3] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-lg font-semibold text-[#111418]">
              {view === 'bag' && 'Shopping Bag'}
              {view === 'checkout' && 'Checkout & Delivery'}
              {view === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close bag"
            className="w-10 h-10 rounded-md flex items-center justify-center text-[#5C6470] hover:text-[#111418] hover:bg-[#EFF1F3] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View: Confirmed Receipt */}
        {view === 'confirmed' && confirmedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-5 bg-[#F7F8FA] border border-[#E2E5E9] rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-[#1D4ED8] font-medium text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Order {confirmedOrder.orderNumber} Confirmed</span>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Preparing shipment for {confirmedOrder.customerName}. Dispatch
                updates will be sent to {confirmedOrder.customerEmail}.
              </p>
              <div className="pt-3 border-t border-[#E2E5E9] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#5C6470] block">Payment Method</span>
                  <span className="font-medium text-[#111418]">
                    {confirmedOrder.paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : 'Card Payment'}
                  </span>
                </div>
                <div>
                  <span className="text-[#5C6470] block">Estimated Arrival</span>
                  <span className="font-medium text-[#111418]">
                    {confirmedOrder.estimatedDelivery}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5C6470] mb-3">
                Order Receipt
              </h3>
              <ul className="divide-y divide-[#E2E5E9] border-t border-b border-[#E2E5E9]">
                {confirmedOrder.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.variantName}`}
                    className="py-3 flex items-center justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[#111418]">{item.name}</p>
                      <p className="text-xs text-[#5C6470]">
                        {item.variantName} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium text-[#111418] tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(0)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#5C6470]">
                  <span>Shipping</span>
                  <span className="tabular-nums">
                    {confirmedOrder.shippingFee === 0
                      ? 'Free'
                      : `$${confirmedOrder.shippingFee}`}
                  </span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#1D4ED8]">
                    <span>Discount</span>
                    <span className="tabular-nums">
                      -${confirmedOrder.discount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-[#111418] pt-2 border-t border-[#E2E5E9]">
                  <span>Total Paid / Due</span>
                  <span className="tabular-nums">${confirmedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const id = confirmedOrder.orderNumber;
                  handleResetAndClose();
                  onTrackOrder(id);
                }}
                className="w-full min-h-11 px-5 py-2.5 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              >
                Track Order {confirmedOrder.orderNumber}
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full min-h-11 px-5 py-2.5 text-sm font-medium text-[#111418] bg-[#EFF1F3] rounded-md hover:bg-[#E2E5E9] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : detailedItems.length === 0 ? (
          /* Empty Bag State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <h3 className="font-display text-lg font-semibold text-[#111418] mb-2">
              Your shopping bag is empty
            </h3>
            <p className="text-sm text-[#5C6470] max-w-xs mb-6">
              Explore our lighting, stoneware, and merino wool objects to add
              items for studio dispatch.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 px-5 py-2 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        ) : view === 'bag' ? (
          /* View: Bag Items */
          <>
            <div className="px-6 py-3.5 bg-[#F7F8FA] border-b border-[#E2E5E9]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#111418] font-medium">
                  {qualifiesFreeShipping
                    ? 'Complimentary carbon-neutral shipping unlocked'
                    : `Add $${remainingForFreeShipping.toFixed(0)} more for free shipping`}
                </span>
                <span className="text-[#5C6470] tabular-nums">
                  {shippingProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#E2E5E9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1D4ED8] transition-all duration-300"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 divide-y divide-[#E2E5E9]">
              {detailedItems.map((entry) => (
                <div
                  key={`${entry.productId}-${entry.variantId}`}
                  className="py-5 flex gap-4"
                >
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-[#EFF1F3] border border-[#E2E5E9] shrink-0">
                    <ResilientImage
                      src={entry.product.image}
                      alt={entry.product.name}
                      fallbackTitle={entry.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[#111418] truncate">
                          {entry.product.name}
                        </h3>
                        <p className="text-xs text-[#5C6470]">
                          {entry.variant.name}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#111418] tabular-nums shrink-0">
                        ${(entry.product.price * entry.quantity).toFixed(0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-[#E2E5E9] rounded-md">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(entry.productId, entry.variantId, -1)
                          }
                          aria-label={`Decrease ${entry.product.name} quantity`}
                          className="w-8 h-8 flex items-center justify-center text-[#111418] hover:bg-[#EFF1F3] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium tabular-nums">
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(entry.productId, entry.variantId, 1)
                          }
                          aria-label={`Increase ${entry.product.name} quantity`}
                          className="w-8 h-8 flex items-center justify-center text-[#111418] hover:bg-[#EFF1F3] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onRemoveItem(entry.productId, entry.variantId)
                        }
                        aria-label={`Remove ${entry.product.name}`}
                        className="text-xs text-[#5C6470] hover:text-[#111418] inline-flex items-center gap-1 py-1.5 px-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo & Totals Footer */}
            <div className="p-6 border-t border-[#E2E5E9] bg-[#F7F8FA] space-y-4">
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. KETTLER10)"
                    aria-label="Promo code"
                    className="flex-1 min-h-10 px-3 py-2 text-xs bg-white border border-[#E2E5E9] rounded-md text-[#111418] focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="min-h-10 px-4 py-2 text-xs font-medium text-[#111418] bg-white border border-[#E2E5E9] rounded-md hover:bg-[#EFF1F3] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p className="text-xs text-[#1D4ED8] mt-1.5">{promoFeedback}</p>
                )}
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#5C6470]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${subtotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#1D4ED8]">
                    <span>Studio Discount ({appliedPromo})</span>
                    <span className="tabular-nums">-${discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5C6470]">
                  <span>Delivery</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? 'Free' : `$${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-[#111418] pt-2 border-t border-[#E2E5E9]">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">${total.toFixed(0)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setView('checkout')}
                className="w-full min-h-11 px-6 py-2.5 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          /* View: Checkout Form */
          <form
            onSubmit={handleSubmitOrder}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5C6470] mb-3">
                Payment Terms
              </h3>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#EFF1F3] rounded-md">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`min-h-10 py-2 px-3 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-white text-[#111418] shadow-xs'
                      : 'text-[#5C6470] hover:text-[#111418]'
                  }`}
                >
                  Card Payment
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`min-h-10 py-2 px-3 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-white text-[#111418] shadow-xs'
                      : 'text-[#5C6470] hover:text-[#111418]'
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>
              {paymentMethod === 'cod' && (
                <p className="text-xs text-[#5C6470] mt-2 leading-relaxed">
                  Pay ${total.toFixed(0)} via courier card terminal or exact
                  cash upon physical delivery.
                </p>
              )}
            </div>

            <div className="space-y-3.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5C6470]">
                Recipient &amp; Delivery Address
              </h3>

              <div>
                <label className="block text-xs font-medium text-[#111418] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Clara Lindqvist"
                  className="w-full min-h-10 px-3 py-2 text-sm bg-white border border-[#E2E5E9] rounded-md focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111418] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="clara@example.com"
                    className="w-full min-h-10 px-3 py-2 text-sm bg-white border border-[#E2E5E9] rounded-md focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111418] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (415) 555-0142"
                    className="w-full min-h-10 px-3 py-2 text-sm bg-white border border-[#E2E5E9] rounded-md focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111418] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="480 Howard St, Apt 6C, San Francisco, CA"
                  className="w-full min-h-10 px-3 py-2 text-sm bg-white border border-[#E2E5E9] rounded-md focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111418] mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94105"
                  className="w-full min-h-10 px-3 py-2 text-sm bg-white border border-[#E2E5E9] rounded-md focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>
            </div>

            {formError && (
              <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                {formError}
              </p>
            )}

            <div className="pt-4 border-t border-[#E2E5E9] space-y-3">
              <div className="flex justify-between text-sm font-semibold text-[#111418]">
                <span>Order Total</span>
                <span className="tabular-nums">${total.toFixed(0)}</span>
              </div>
              <button
                type="submit"
                className="w-full min-h-11 px-6 py-2.5 text-sm font-medium text-white bg-[#111418] rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              >
                {paymentMethod === 'cod'
                  ? `Confirm COD Order — $${total.toFixed(0)}`
                  : `Place Order — $${total.toFixed(0)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export type CategoryId =
  | 'all'
  | 'lighting'
  | 'tableware'
  | 'textiles'
  | 'desk-studio'
  | 'saved';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export type PaymentMethod = 'card' | 'cod';

export interface ProductVariant {
  id: string;
  name: string;
  hex: string;
  inStock: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Exclude<CategoryId, 'all' | 'saved'>;
  categoryLabel: string;
  materialSummary: string;
  price: number;
  statusNote: string;
  image: string;
  description: string;
  variants: ProductVariant[];
  specs: ProductSpec[];
  featuredRank: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export type OrderStep =
  | 'confirmed'
  | 'inspected'
  | 'in-transit'
  | 'delivered';

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  name: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  orderNumber: string;
  placedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStep;
  estimatedDelivery: string;
  carrier: string;
  items: OrderItemSnapshot[];
}

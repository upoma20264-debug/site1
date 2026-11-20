import type { OrderRecord, Product } from '../types/retail';

export const HERO_IMAGE =
  '/src/assets/images/hero_architectural_homeware_1795216303774.jpg';

export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_FEE = 14;
export const PROMO_CODES: Record<string, { rate: number; label: string }> = {
  KETTLER10: { rate: 0.1, label: '10% Studio Welcome' },
};

export const CATEGORIES: { id: 'all' | 'lighting' | 'tableware' | 'textiles' | 'desk-studio'; label: string }[] = [
  { id: 'all', label: 'All Objects' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'tableware', label: 'Tableware' },
  { id: 'textiles', label: 'Textiles' },
  { id: 'desk-studio', label: 'Desk & Studio' },
];

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'kettler-dome-lamp',
    sku: 'KG-LMP-014',
    name: 'Monolith Spun Dome Lamp',
    category: 'lighting',
    categoryLabel: 'Lighting',
    materialSummary: 'Brushed Aluminum',
    price: 265,
    statusNote: 'In Stock',
    image: '/src/assets/images/product_dome_lamp_1795216303250.jpg',
    description:
      'Turned from 2.4mm aircraft-grade aluminum with a weighted cast-iron base and stepless warm-dimming rotary switch. Casts an even downward pool of glare-free 2700K light across desks and sideboards.',
    featuredRank: 1,
    variants: [
      { id: 'brushed-pewter', name: 'Brushed Pewter', hex: '#5A5E66', inStock: true },
      { id: 'matte-obsidian', name: 'Matte Obsidian', hex: '#1C1E22', inStock: true },
      { id: 'raw-chalk', name: 'Anodized Chalk', hex: '#D4D6DA', inStock: true },
    ],
    specs: [
      { label: 'Dimensions', value: '320mm Dia x 410mm H' },
      { label: 'Light Source', value: 'Integrated 9W LED, 2700K, CRI 95+' },
      { label: 'Cable', value: '2.2m Braided Slate Textile' },
      { label: 'Warranty', value: '2-Year Hardware Coverage' },
    ],
  },
  {
    id: 'kettler-stoneware-carafe',
    sku: 'KG-TBL-029',
    name: 'Kiln-Fired Pour-Over Set',
    category: 'tableware',
    categoryLabel: 'Tableware',
    materialSummary: 'Basalt Stoneware',
    price: 94,
    statusNote: 'In Stock',
    image: '/src/assets/images/product_stoneware_carafe_1795216303431.jpg',
    description:
      'Wheel-thrown high-iron stoneware carafe paired with a handleless tasting cup. Raw satin exterior resists staining while the clear interior glaze preserves thermal stability and clean flavor.',
    featuredRank: 2,
    variants: [
      { id: 'basalt-charcoal', name: 'Basalt Charcoal', hex: '#26292E', inStock: true },
      { id: 'limestone-ash', name: 'Limestone Ash', hex: '#B9B7B0', inStock: true },
    ],
    specs: [
      { label: 'Capacity', value: '600ml Carafe + 180ml Cup' },
      { label: 'Firing Temp', value: '1260°C Reduction Kiln' },
      { label: 'Care', value: 'Dishwasher Safe (Top Rack)' },
      { label: 'Origin', value: 'Small-Batch Ceramic Foundry' },
    ],
  },
  {
    id: 'kettler-merino-throw',
    sku: 'KG-TXT-041',
    name: 'Herringbone Merino Throw',
    category: 'textiles',
    categoryLabel: 'Textiles',
    materialSummary: '100% Virgin Merino',
    price: 185,
    statusNote: 'Limited Run',
    image: '/src/assets/images/product_merino_throw_1795216303863.jpg',
    description:
      'Woven on shuttle looms at 420 gsm using long-staple non-mulesed merino wool. Tightly spun herringbone twill provides substantial drape without pilling.',
    featuredRank: 3,
    variants: [
      { id: 'slate-chalk', name: 'Slate & Chalk', hex: '#636B75', inStock: true },
      { id: 'graphite-oat', name: 'Graphite & Oat', hex: '#383B40', inStock: true },
    ],
    specs: [
      { label: 'Dimensions', value: '140cm x 200cm' },
      { label: 'Fabric Weight', value: '420 gsm Heavyweight Twill' },
      { label: 'Certification', value: 'OEKO-TEX Standard 100' },
      { label: 'Care', value: 'Cold Hand Wash or Dry Clean' },
    ],
  },
  {
    id: 'kettler-desk-tray',
    sku: 'KG-DSK-007',
    name: 'Modular Smoked Oak Desk System',
    category: 'desk-studio',
    categoryLabel: 'Desk & Studio',
    materialSummary: 'Smoked Oak & Alloy',
    price: 148,
    statusNote: 'In Stock',
    image: '/src/assets/images/product_desk_tray_1795216304401.jpg',
    description:
      'CNC-milled European smoked oak tray anchored by bead-blasted aluminum catchalls and a weighted dock channel. Magnetic alignment keeps modules flush on your desk.',
    featuredRank: 4,
    variants: [
      { id: 'smoked-oak-slate', name: 'Smoked Oak / Slate Alloy', hex: '#43362C', inStock: true },
      { id: 'ash-silver', name: 'White Ash / Raw Silver', hex: '#C7BFB5', inStock: false },
    ],
    specs: [
      { label: 'Footprint', value: '360mm W x 220mm D x 24mm H' },
      { label: 'Base Pad', value: 'Micro-Suction Merino Felt' },
      { label: 'Modules', value: '4 Interlocking Magnetic Trays' },
      { label: 'Finish', value: 'Hand-Rubbed Hardwax Oil' },
    ],
  },
  {
    id: 'kettler-fluted-glass',
    sku: 'KG-TBL-052',
    name: 'Fluted Borosilicate Carafe & Tumblers',
    category: 'tableware',
    categoryLabel: 'Tableware',
    materialSummary: 'Smoked Borosilicate',
    price: 78,
    statusNote: 'In Stock',
    image: '/src/assets/images/product_glass_tumblers_1795216304752.jpg',
    description:
      'Mouth-blown thermal borosilicate glass pitcher paired with two vertically fluted 320ml tumblers. Engineered for both chilled water service and hot tea infusions.',
    featuredRank: 5,
    variants: [
      { id: 'smoked-amber-tint', name: 'Smoked Graphite Tint', hex: '#766E5E', inStock: true },
      { id: 'crystal-clear', name: 'Optical Clear', hex: '#D8E0E6', inStock: true },
    ],
    specs: [
      { label: 'Set Contents', value: '1.1L Pitcher + 2 Tumblers (320ml)' },
      { label: 'Thermal Range', value: '-20°C to 150°C Shock Resistant' },
      { label: 'Wall Thickness', value: '2.2mm Precision Drawn' },
      { label: 'Care', value: 'Dishwasher Safe' },
    ],
  },
  {
    id: 'kettler-ribbed-vase',
    sku: 'KG-TBL-064',
    name: 'Architectural Fluted Vessel',
    category: 'tableware',
    categoryLabel: 'Tableware',
    materialSummary: 'Unglazed Porcelain',
    price: 112,
    statusNote: 'Limited Run',
    image: '/src/assets/images/product_ceramic_vase_1795216304947.jpg',
    description:
      'Slip-cast architectural vessel finished in matte unglazed bisque porcelain outside and waterproof satin glaze inside. Designed to stand alone as sculpture or hold dry botanicals.',
    featuredRank: 6,
    variants: [
      { id: 'bone-bisque', name: 'Bone White Bisque', hex: '#EAE7E0', inStock: true },
      { id: 'slate-bisque', name: 'Mineral Slate', hex: '#52575E', inStock: true },
    ],
    specs: [
      { label: 'Dimensions', value: '185mm Dia x 260mm H' },
      { label: 'Weight', value: '1.45 kg Solid Base' },
      { label: 'Interior', value: 'Watertight Vitreous Glaze' },
      { label: 'Base', value: 'Hand-Sanded Foot Ring' },
    ],
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'KG-1042',
    placedAt: '2026-11-18T10:24:00Z',
    customerName: 'Hannah Lindholm',
    customerEmail: 'hannah.l@example.com',
    customerPhone: '+1 (415) 555-0192',
    shippingAddress: '742 Valencia St, Apt 4B, San Francisco, CA',
    postalCode: '94110',
    paymentMethod: 'card',
    subtotal: 265,
    discount: 0,
    shippingFee: 0,
    total: 265,
    status: 'in-transit',
    estimatedDelivery: 'Nov 22, 2026',
    carrier: 'DHL Carbon-Neutral Express',
    items: [
      {
        productId: 'kettler-dome-lamp',
        sku: 'KG-LMP-014',
        name: 'Monolith Spun Dome Lamp',
        variantName: 'Brushed Pewter',
        unitPrice: 265,
        quantity: 1,
      },
    ],
  },
  {
    orderNumber: 'KG-1038',
    placedAt: '2026-11-14T16:10:00Z',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@example.com',
    customerPhone: '+1 (206) 555-0147',
    shippingAddress: '1204 Pike St, Suite 300, Seattle, WA',
    postalCode: '98101',
    paymentMethod: 'cod',
    subtotal: 172,
    discount: 0,
    shippingFee: 0,
    total: 172,
    status: 'delivered',
    estimatedDelivery: 'Delivered Nov 17, 2026',
    carrier: 'Regional Courier Dispatch',
    items: [
      {
        productId: 'kettler-stoneware-carafe',
        sku: 'KG-TBL-029',
        name: 'Kiln-Fired Pour-Over Set',
        variantName: 'Basalt Charcoal',
        unitPrice: 94,
        quantity: 1,
      },
      {
        productId: 'kettler-fluted-glass',
        sku: 'KG-TBL-052',
        name: 'Fluted Borosilicate Carafe & Tumblers',
        variantName: 'Smoked Graphite Tint',
        unitPrice: 78,
        quantity: 1,
      },
    ],
  },
];

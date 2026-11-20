import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ServiceAndTrackingSection } from './components/ServiceAndTrackingSection';
import { CATALOG_PRODUCTS, INITIAL_ORDERS } from './data/catalog';
import type {
  CartItem,
  CategoryId,
  OrderRecord,
  Product,
  SortOption,
} from './types/retail';

const STORAGE_KEYS = {
  CART: 'kettler_cart_v1',
  SAVED: 'kettler_saved_v1',
  ORDERS: 'kettler_orders_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(STORAGE_KEYS.CART, []),
  );
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.SAVED, []),
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStorage<OrderRecord[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
  );

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [activeOrderLookup, setActiveOrderLookup] = useState<string>(
    INITIAL_ORDERS[0].orderNumber,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  const bagCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = CATALOG_PRODUCTS.filter((product) => {
      if (activeCategory === 'saved') {
        if (!savedIds.includes(product.id)) return false;
      } else if (activeCategory !== 'all') {
        if (product.category !== activeCategory) return false;
      }

      if (!query) return true;
      return (
        product.name.toLowerCase().includes(query) ||
        product.categoryLabel.toLowerCase().includes(query) ||
        product.materialSummary.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.featuredRank - b.featuredRank;
    });
  }, [activeCategory, searchQuery, sortBy, savedIds]);

  const handleAddToBag = (
    productId: string,
    variantId: string,
    quantity = 1,
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === productId && item.variantId === variantId,
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
            : item,
        );
      }
      return [...prev, { productId, variantId, quantity }];
    });

    setRecentlyAddedId(productId);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === productId ? null : curr));
    }, 1500);
  };

  const handleQuickAdd = (product: Product) => {
    const defaultVariant =
      product.variants.find((v) => v.inStock) ?? product.variants[0];
    if (!defaultVariant) return;
    handleAddToBag(product.id, defaultVariant.id, 1);
  };

  const handleUpdateQuantity = (
    productId: string,
    variantId: string,
    delta: number,
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId),
      ),
    );
  };

  const handleToggleSave = (productId: string) => {
    setSavedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handlePlaceOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setActiveOrderLookup(order.orderNumber);
  };

  const handleJumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSavedNav = () => {
    setActiveCategory('saved');
    handleJumpToSection('catalog');
  };

  const handleTrackOrderFromReceipt = (orderNumber: string) => {
    setActiveOrderLookup(orderNumber);
    handleJumpToSection('track-order');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#111418]">
      <Header
        bagCount={bagCount}
        savedCount={savedIds.length}
        onOpenBag={() => setIsBagOpen(true)}
        onSelectSaved={handleSelectSavedNav}
      />

      <main className="flex-1">
        <Hero
          onBrowseCatalog={() => handleJumpToSection('catalog')}
          onInspectFeatured={() => setSelectedProduct(CATALOG_PRODUCTS[0])}
        />

        <CatalogSection
          products={filteredProducts}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          savedIds={savedIds}
          recentlyAddedId={recentlyAddedId}
          onCategoryChange={setActiveCategory}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onSelectProduct={setSelectedProduct}
          onQuickAdd={handleQuickAdd}
          onToggleSave={handleToggleSave}
        />

        <ServiceAndTrackingSection
          orders={orders}
          activeOrderLookup={activeOrderLookup}
          onOrderLookupChange={setActiveOrderLookup}
        />
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        isSaved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToBag}
        onToggleSave={handleToggleSave}
      />

      <CartDrawer
        isOpen={isBagOpen}
        items={cartItems}
        onClose={() => setIsBagOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        onTrackOrder={handleTrackOrderFromReceipt}
      />
    </div>
  );
}

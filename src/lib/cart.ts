export interface CartItem {
  productId: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  updatedAt: number;
}

export const CART_KEY = "bolu-cart-v1";
export const MAX_QTY = 20;

export function emptyCart(): CartState {
  return { items: [], updatedAt: 0 };
}

function normalize(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => item.qty > 0)
    .map((item) => ({ productId: item.productId, qty: Math.min(item.qty, MAX_QTY) }));
}

export function addItem(state: CartState, productId: string, qty = 1): CartState {
  const items = state.items.map((item) => ({ ...item }));
  const existing = items.find((item) => item.productId === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, MAX_QTY);
  } else {
    items.push({ productId, qty: Math.min(Math.max(qty, 1), MAX_QTY) });
  }
  return { items, updatedAt: Date.now() };
}

export function setQty(state: CartState, productId: string, qty: number): CartState {
  const items = state.items
    .map((item) => (item.productId === productId ? { ...item, qty } : item))
    .filter((item) => item.qty > 0)
    .map((item) => ({ ...item, qty: Math.min(item.qty, MAX_QTY) }));
  return { items, updatedAt: Date.now() };
}

export function removeItem(state: CartState, productId: string): CartState {
  return {
    items: state.items.filter((item) => item.productId !== productId),
    updatedAt: Date.now(),
  };
}

export function cartCount(state: CartState): number {
  return state.items.reduce((total, item) => total + item.qty, 0);
}

export function cartSubtotal(
  state: CartState,
  products: { id: string; priceFrom?: number }[],
): number | null {
  if (state.items.length === 0) return 0;
  let total = 0;
  for (const item of state.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    if (product.priceFrom === undefined) return null;
    total += product.priceFrom * item.qty;
  }
  return total;
}

export function readCart(storage?: Storage): CartState {
  const store = storage ?? safeStorage();
  if (!store) return emptyCart();
  try {
    const raw = store.getItem(CART_KEY);
    if (!raw) return emptyCart();
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) return emptyCart();
    return {
      items: normalize(
        parsed.items.map((item) => ({
          productId: String(item.productId),
          qty: Number(item.qty),
        })),
      ),
      updatedAt: Number(parsed.updatedAt) || 0,
    };
  } catch {
    return emptyCart();
  }
}

export function writeCart(state: CartState, storage?: Storage): void {
  const store = storage ?? safeStorage();
  if (!store) return;
  try {
    store.setItem(CART_KEY, JSON.stringify(state));
  } catch {
    // storage penuh/diblokir: keranjang tetap hidup di memori selama sesi
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

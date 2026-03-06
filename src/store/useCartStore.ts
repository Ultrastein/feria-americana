import { create } from 'zustand';

export interface CartItem {
    id: string; // ID único para la línea del carrito
    productId: string;
    name: string;
    price: number;
    categoryId: string;
    quantity: number;
    imageUrl?: string;
}

export interface PromoRule {
    id: string;
    description: string;
    targetCategoryId: string | null;
    requiredQuantity: number;
    promoPriceBundle: number;
    isActive: boolean;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    promos: PromoRule[]; // Almacenaje de las promociones activas bajadas en carga inicial
    // Acciones
    toggleCart: () => void;
    addItem: (product: { id: string, name: string, price: number, categoryId: string, imageUrl?: string }) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    setPromos: (promos: PromoRule[]) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,
    promos: [],

    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    addItem: (product) => {
        set((state) => {
            const existingItem = state.items.find((i) => i.productId === product.id);
            if (existingItem) {
                return {
                    items: state.items.map((i) =>
                        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                    isOpen: true, // Auto-abre el carrito
                };
            }
            return {
                items: [...state.items, { ...product, productId: product.id, id: crypto.randomUUID(), quantity: 1 }],
                isOpen: true,
            };
        });
    },

    removeItem: (itemId) => set((state) => ({
        items: state.items.filter((i) => i.id !== itemId)
    })),

    updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map((i) => i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i)
    })),

    setPromos: (promos) => set({ promos }),

    clearCart: () => set({ items: [] })
}));

// Motor Logico de Promociones Puro
export const calculateSmartCart = (items: CartItem[], rules: PromoRule[]) => {
    let subtotal = 0;
    let total = 0;
    let alerts: string[] = [];
    let appliedRules: string[] = [];

    // Clonamos y calculamos base
    const clonedCart = items.map(item => {
        const itemSum = item.price * item.quantity;
        subtotal += itemSum;
        total += itemSum;
        return { ...item };
    });

    const activeRules = rules.filter(r => r.isActive);

    activeRules.forEach(rule => {
        if (!rule.targetCategoryId) return; // Por ahora soportamos reglas por categoría

        const matchingItems = clonedCart.filter(item => item.categoryId === rule.targetCategoryId);
        const totalItemsInCat = matchingItems.reduce((acc, curr) => acc + curr.quantity, 0);

        const bundlesApplied = Math.floor(totalItemsInCat / rule.requiredQuantity);
        const remainder = totalItemsInCat % rule.requiredQuantity;

        // Upselling visual
        if (remainder > 0 && (rule.requiredQuantity - remainder) === 1) {
            alerts.push(`¡Sumá 1 prenda más y aprovechá: ${rule.description}!`);
        }

        if (bundlesApplied > 0) {
            appliedRules.push(`Aplicada: ${rule.description}`);

            let itemsToDiscount = bundlesApplied * rule.requiredQuantity;
            let originalPriceSumOfDiscountedItems = 0;

            for (const item of matchingItems) {
                if (itemsToDiscount <= 0) break;
                const take = Math.min(item.quantity, itemsToDiscount);
                originalPriceSumOfDiscountedItems += take * item.price;
                itemsToDiscount -= take;
            }

            total = total - originalPriceSumOfDiscountedItems + (bundlesApplied * rule.promoPriceBundle);
        }
    });

    const discount = subtotal - total;

    return { subtotal, total, discount, alerts, appliedRules };
};

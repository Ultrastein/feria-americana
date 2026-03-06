"use client";

import { useCartStore, calculateSmartCart } from "@/store/useCartStore";
import CartItemRow from "./CartItemRow";
import { X, Sparkles, ArrowRight } from "lucide-react";

export default function CartDrawer() {
    const { items, isOpen, toggleCart, promos } = useCartStore();

    const { total, subtotal, discount, alerts, appliedRules } = calculateSmartCart(items, promos);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
                onClick={toggleCart}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="px-6 py-5 border-b border-border-color flex items-center justify-between bg-background">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Tu Bolsa</h2>
                    <button onClick={toggleCart} className="text-muted-text hover:text-foreground transition-colors p-2 -mr-2">
                        <X size={24} />
                    </button>
                </div>

                {/* Promos/Alerts Area */}
                {alerts.length > 0 && (
                    <div className="bg-[#E07A5F]/10 border-b border-[#E07A5F]/20 p-4">
                        {alerts.map((alert, i) => (
                            <div key={i} className="flex items-start gap-2 text-[#C05D44] text-sm font-medium">
                                <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
                                <p>{alert}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-text space-y-4">
                            <Sparkles size={48} className="opacity-20" />
                            <p className="font-sans text-center">Tu bolsa está vacía.<br />¡Encontrá tesoros en el catálogo!</p>
                            <button
                                onClick={toggleCart}
                                className="mt-4 px-6 py-2 border border-border-color rounded-full hover:border-black transition-colors"
                            >
                                Seguir explorando
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {items.map((item) => (
                                <CartItemRow key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout Info */}
                {items.length > 0 && (
                    <div className="border-t border-border-color p-6 bg-background space-y-4">

                        {appliedRules.length > 0 && (
                            <div className="space-y-1 mb-4">
                                <p className="text-xs font-bold text-secondary uppercase tracking-wider">Promociones Aplicadas</p>
                                {appliedRules.map((rule, i) => (
                                    <p key={i} className="text-sm text-secondary font-medium">• {rule}</p>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2 font-sans">
                            <div className="flex justify-between text-muted-text">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString("es-AR")}</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-primary font-medium">
                                    <span>Descuento Promocional</span>
                                    <span>-${discount.toLocaleString("es-AR")}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-serif text-2xl font-bold text-foreground pt-2 border-t border-border-color/50">
                                <span>Total</span>
                                <span>${total.toLocaleString("es-AR")}</span>
                            </div>
                        </div>

                        <button className="w-full bg-foreground text-background font-sans font-medium text-lg py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#383838] transition-colors mt-6 shadow-lg">
                            Finalizar Pedido <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

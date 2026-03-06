"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function FloatingNavBar() {
    const { items, toggleCart } = useCartStore();

    const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4 px-4 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-md shadow-lg border border-gray-100 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl pointer-events-auto transition-all">

                {/* Mobile Menu Icon */}
                <button className="md:hidden text-foreground hover:text-primary transition-colors">
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
                    Feria<span className="text-secondary">.</span>
                </Link>

                {/* Desktop Links (Hidden on Mobile) */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-foreground/80">
                    <Link href="/" className="hover:text-primary transition-colors">Catálogo</Link>
                    <Link href="/novedades" className="hover:text-primary transition-colors">Novedades</Link>
                    <Link href="/admin" className="hover:text-primary transition-colors">Panel Admin</Link>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <button className="text-foreground hover:text-primary transition-colors">
                        <Search size={22} />
                    </button>
                    <button
                        onClick={toggleCart}
                        className="relative text-foreground hover:text-primary transition-colors"
                    >
                        <ShoppingBag size={22} />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartItemsCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}

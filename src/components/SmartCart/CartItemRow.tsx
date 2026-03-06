"use client";

import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemRowProps {
    item: {
        id: string;
        productId: string;
        name: string;
        price: number;
        emoji?: string | null;
        categoryId: string;
        quantity: number;
        imageUrl?: string;
    };
}

export default function CartItemRow({ item }: CartItemRowProps) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const placeholderImage = `https://placehold.co/100x120/F9F6F0/222E3C?text=${encodeURIComponent(item.name.substring(0, 3).toUpperCase())}&font=playfair-display`;

    return (
        <div className="flex items-center gap-4 py-4 border-b border-border-color last:border-0 relative group">
            <div className="relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <Image
                    src={placeholderImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <h4 className="font-sans font-medium text-foreground text-sm line-clamp-2 pr-4">
                        {item.emoji && <span className="mr-1">{item.emoji}</span>}{item.name}
                    </h4>
                    <p className="font-bold text-foreground text-sm whitespace-nowrap">${(item.price * item.quantity).toLocaleString("es-AR")}</p>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1 border border-border-color">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-muted-text hover:text-black transition-colors"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-muted-text hover:text-black transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-text hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

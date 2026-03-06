"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        categoryId: string;
        category: { name: string };
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const placeholderImage = `https://placehold.co/400x500/F9F6F0/222E3C?text=${encodeURIComponent(product.name)}&font=playfair-display`;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            categoryId: product.categoryId,
            imageUrl: placeholderImage,
        });
    };

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden premium-shadow interactive-hover flex flex-col h-full">
            <div className="relative aspect-[4/5] w-full bg-gray-100 overflow-hidden">
                <Image
                    src={placeholderImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

                {/* Add to cart quick button */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-[#c8684d] z-10"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                        {product.category.name}
                    </p>
                    <h3 className="font-serif text-lg font-medium text-foreground leading-snug line-clamp-2">
                        {product.name}
                    </h3>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="font-sans font-bold text-lg text-foreground">
                        ${product.price.toLocaleString("es-AR")}
                    </p>
                </div>
            </div>
        </div>
    );
}

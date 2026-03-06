"use client";

import { useState } from "react";
import { Check, Edit2, TrendingUp, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    emoji?: string | null;
    categoryId: string;
    category: Category;
    isAvailable: boolean;
}

export default function InventoryTable({
    initialProducts,
    categories
}: {
    initialProducts: Product[],
    categories: Category[]
}) {
    const [products, setProducts] = useState(initialProducts);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);

    // Estado para actualización masiva
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || "");
    const [percentageAmt, setPercentageAmt] = useState<number>(15);
    const [isUpdating, setIsUpdating] = useState(false);

    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setEditValue(product.price);
    };

    const saveEdit = async (id: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "inline_edit", id, price: editValue })
            });
            if (res.ok) {
                setProducts(products.map(p => p.id === id ? { ...p, price: editValue } : p));
            }
        } finally {
            setEditingId(null);
            setIsUpdating(false);
        }
    };

    const applyMassUpdate = async () => {
        if (!confirm(`¿Estás seguro de aumentar los precios de esta categoría un ${percentageAmt}%?`)) return;

        setIsUpdating(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "mass_update", categoryId: selectedCategoryId, percentage: percentageAmt })
            });
            if (res.ok) {
                // Recargar la pagina para simplificar el refresco total tras SQL Raw
                window.location.reload();
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">

            {/* Header and Mass Update Toolbar */}
            <div className="p-6 border-b border-border-color bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-serif font-bold text-foreground">Inventario de Prendas</h2>
                    <p className="text-sm text-muted-text mt-1">Hacé clic en el lápiz para editar el precio inline.</p>
                </div>

                {/* Mass Update Tool */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                    <TrendingUp className="text-secondary" size={20} />
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="text-sm py-1 px-2 rounded border border-gray-200 focus:outline-none focus:border-secondary"
                    >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="text-sm text-muted-text">Aumentar:</span>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={percentageAmt}
                            onChange={(e) => setPercentageAmt(Number(e.target.value))}
                            className="w-16 text-sm py-1 px-2 border border-gray-200 rounded-l focus:outline-none"
                        />
                        <span className="text-sm bg-gray-100 py-1 px-2 border border-l-0 border-gray-200 rounded-r">%</span>
                    </div>
                    <button
                        onClick={applyMassUpdate}
                        disabled={isUpdating}
                        className="bg-foreground text-white text-sm px-4 py-1.5 rounded hover:bg-[#383838] transition-colors disabled:opacity-50"
                    >
                        Aplicar
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-muted-text">
                    <thead className="bg-white border-b border-border-color text-foreground font-sans">
                        <tr>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Prenda</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Categoría</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Precio (AR$)</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">
                                    {product.emoji && <span className="mr-2">{product.emoji}</span>}
                                    {product.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                        {product.category.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-foreground">
                                    {editingId === product.id ? (
                                        <div className="flex items-center max-w-[120px]">
                                            <span className="text-gray-400 mr-1">$</span>
                                            <input
                                                type="number"
                                                autoFocus
                                                value={editValue}
                                                onChange={(e) => setEditValue(Number(e.target.value))}
                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(product.id)}
                                                className="w-full border-b border-primary outline-none focus:border-secondary transition-colors"
                                            />
                                        </div>
                                    ) : (
                                        `$${product.price.toLocaleString("es-AR")}`
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {editingId === product.id ? (
                                        <button
                                            onClick={() => saveEdit(product.id)}
                                            className="text-secondary hover:bg-secondary/10 p-2 rounded-full transition-colors inline-block"
                                            title="Guardar"
                                        >
                                            {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : <Check size={18} />}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(product)}
                                            className="text-muted-text hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-colors inline-block"
                                            title="Editar Precio (Inline)"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

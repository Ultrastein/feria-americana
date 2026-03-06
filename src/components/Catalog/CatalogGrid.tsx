import ProductCard from "./ProductCard";

interface CatalogGridProps {
    products: any[];
}

export default function CatalogGrid({ products }: CatalogGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 px-4 w-full max-w-7xl mx-auto">
            {products.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}

import FloatingNavBar from "@/components/Layout/FloatingNavBar";
import CatalogGrid from "@/components/Catalog/CatalogGrid";
import PromosInitializer from "@/components/SmartCart/PromosInitializer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const promos = await prisma.promoRule.findMany({
    where: { isActive: true }
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <PromosInitializer promos={promos} />
      <FloatingNavBar />

      <main className="pt-32 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-4">
            Boutique de <span className="text-secondary italic">Hallazgos</span>
          </h1>
          <p className="text-muted-text text-lg md:text-xl max-w-2xl mx-auto font-sans">
            Explorá nuestra selección única de prendas de segunda mano. Calidad, estilo y precios increíbles en un solo lugar.
          </p>
        </section>

        {/* Catalog Section */}
        <section className="w-full">
          <div className="flex justify-between items-end w-full max-w-7xl mx-auto px-4 mb-8">
            <h2 className="text-3xl font-serif text-foreground">
              Recién Llegados
            </h2>
            <p className="text-sm font-medium text-primary cursor-pointer hover:underline">
              Ver todo →
            </p>
          </div>
          <CatalogGrid products={products} />
        </section>
      </main>
    </div>
  );
}

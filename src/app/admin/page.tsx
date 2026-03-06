import FloatingNavBar from "@/components/Layout/FloatingNavBar";
import InventoryTable from "@/components/AdminDashboard/InventoryTable";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PasswordProtect from "@/components/AdminDashboard/PasswordProtect";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default function AdminDashboardPage() {
    return (
        <PasswordProtect>
            <AdminDashboardContent />
        </PasswordProtect>
    );
}

async function AdminDashboardContent() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: [
            { category: { name: 'asc' } },
            { name: 'asc' }
        ]
    });

    const categories = await prisma.category.findMany();
    const promos = await prisma.promoRule.findMany();

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-foreground pb-24">
            <FloatingNavBar />

            <main className="pt-32 w-full max-w-6xl mx-auto px-4">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-text hover:text-foreground mb-2">
                            <ArrowLeft size={16} className="mr-1" /> Volver al portal
                        </Link>
                        <h1 className="text-3xl font-serif text-foreground font-bold">Panel de Administración</h1>
                        <p className="text-muted-text">Gestión rápida de inventario y reglas de promoción.</p>
                    </div>
                </div>

                {/* Sección 1: Inventario y Edición Masiva */}
                <section className="mb-12">
                    <InventoryTable initialProducts={products} categories={categories} />
                </section>

                {/* Sección 2: Gestor Lógico de Promociones */}
                <section>
                    <div className="bg-white rounded-xl shadow-sm border border-border-color p-6">
                        <div className="flex items-center justify-between mb-6 border-b border-border-color pb-4">
                            <div>
                                <h2 className="text-xl font-serif font-bold text-foreground">Reglas de Promociones Activas</h2>
                                <p className="text-sm text-muted-text mt-1">Configuración del Motor Inteligente.</p>
                            </div>
                            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#c8684d] transition-colors">
                                + Nueva Regla
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {promos.map((promo) => (
                                <div key={promo.id} className="border border-border-color rounded-lg p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-foreground text-lg">{promo.description}</h3>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {promo.isActive ? 'ACTIVA' : 'INACTIVA'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-text mb-4">
                                            Requisito: Llevar {promo.requiredQuantity} prendas de esta categoría. <br />
                                            Total a pagar: ${promo.promoPriceBundle.toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 border border-border-color py-1.5 rounded text-sm hover:bg-gray-50 transition-colors">Editar</button>
                                        <button className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-sm hover:bg-red-100 transition-colors">Desactivar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

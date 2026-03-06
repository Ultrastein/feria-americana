import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { action, id, price, categoryId, percentage } = body;

        // 1. Edición Inline (Un solo producto)
        if (action === "inline_edit" && id && price !== undefined) {
            const updatedProduct = await prisma.product.update({
                where: { id },
                data: { price: Number(price) }
            });
            return NextResponse.json({ success: true, product: updatedProduct });
        }

        // 2. Actualización Masiva por Categoría
        if (action === "mass_update" && categoryId && percentage !== undefined) {
            // Prisma no tiene soporte nativo para `price = price * 1.15` de forma directa en updateMany usando floats fácilmente en SQLite
            // Así que lo hacemos con raw query si es SQLite/Postgres. 
            // Para mantenerlo genérico, iteramos o usamos raw. Usamos executeRaw.

            await prisma.$executeRaw`UPDATE Product SET price = price + (price * ${Number(percentage)} / 100) WHERE categoryId = ${categoryId}`;

            return NextResponse.json({ success: true, message: `Precios actualizados masivamente por +${percentage}%` });
        }

        return NextResponse.json({ success: false, error: "Action or required fields missing" }, { status: 400 });

    } catch (error) {
        console.error("Error updating products:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

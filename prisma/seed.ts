import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Categorías
  const catRopaAdultos = await prisma.category.create({
    data: { id: '11111111-1111-1111-1111-111111111111', name: 'Ropa Adultos' }
  });
  const catRopaNinos = await prisma.category.create({
    data: { id: '22222222-2222-2222-2222-222222222222', name: 'Ropa Niños' }
  });
  const catRopaBebes = await prisma.category.create({
    data: { id: '33333333-3333-3333-3333-333333333333', name: 'Ropa Bebés' }
  });
  const catRopaBlanca = await prisma.category.create({
    data: { id: '44444444-4444-4444-4444-444444444444', name: 'Ropa Blanca' }
  });

  // 2. Productos
  const products = [
    // Adultos
    { categoryId: catRopaAdultos.id, name: 'Blazzer', price: 5000.00 },
    { categoryId: catRopaAdultos.id, name: 'Campera Gruesa', price: 8500.00 },
    { categoryId: catRopaAdultos.id, name: 'Jean', price: 4000.00 },
    { categoryId: catRopaAdultos.id, name: 'Remera Manga Corta', price: 3500.00 },
    { categoryId: catRopaAdultos.id, name: 'Camisa', price: 2500.00 },
    { categoryId: catRopaAdultos.id, name: 'Sweater', price: 3500.00 },
    // Niños
    { categoryId: catRopaNinos.id, name: 'Buzo', price: 4500.00 },
    { categoryId: catRopaNinos.id, name: 'Jogging', price: 3500.00 },
    { categoryId: catRopaNinos.id, name: 'Remera Manga Corta', price: 2500.00 },
    // Bebés
    { categoryId: catRopaBebes.id, name: 'Enterito Corto', price: 3500.00 },
    { categoryId: catRopaBebes.id, name: 'Remeritas', price: 1500.00 },
    // Blanca
    { categoryId: catRopaBlanca.id, name: 'Juego 1 Plaza', price: 5000.00 },
    { categoryId: catRopaBlanca.id, name: 'Mantel Grande', price: 4500.00 },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // 3. Reglas de Promoción
  const promos = [
    {
      description: '3x Remeras (Adulto)',
      targetCategoryId: catRopaAdultos.id,
      requiredQuantity: 3,
      promoPriceBundle: 8000.00
    },
    {
      description: '3x Jean (Adulto)',
      targetCategoryId: catRopaAdultos.id,
      requiredQuantity: 3,
      promoPriceBundle: 10000.00
    },
    {
      description: '2x Camisas por $5.000',
      targetCategoryId: catRopaAdultos.id,
      requiredQuantity: 2,
      promoPriceBundle: 5000.00
    },
    {
      description: '2x Sweater o Buzo (Adulto)',
      targetCategoryId: catRopaAdultos.id,
      requiredQuantity: 2,
      promoPriceBundle: 7000.00
    }
  ];

  for (const promo of promos) {
    await prisma.promoRule.create({ data: promo });
  }

  console.log('Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });

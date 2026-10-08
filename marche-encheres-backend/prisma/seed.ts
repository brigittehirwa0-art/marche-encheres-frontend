import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.paymentWindow.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Smartphones', icon: 'smartphone' },
    }),
    prisma.category.create({
      data: { name: 'Mode', icon: 'shirt' },
    }),
    prisma.category.create({
      data: { name: 'Maison', icon: 'lamp' },
    }),
    prisma.category.create({
      data: { name: 'Collections', icon: 'medal' },
    }),
    prisma.category.create({
      data: { name: 'Véhicules', icon: 'car-front' },
    }),
    prisma.category.create({
      data: { name: 'Art', icon: 'palette' },
    }),
    prisma.category.create({
      data: { name: 'Électronique', icon: 'headphones' },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create users
  const hashedPassword = await bcrypt.hash('marche2026', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Camille Morel',
        email: 'camille@exemple.fr',
        password: hashedPassword,
        avatar: 'CM',
        city: 'Bujumbura',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Atelier Lune',
        email: 'atelier@exemple.fr',
        password: hashedPassword,
        avatar: 'AL',
        city: 'Paris',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Nicolas Bernard',
        email: 'nicolas@exemple.fr',
        password: hashedPassword,
        avatar: 'NB',
        city: 'Lyon',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maison Sillage',
        email: 'sillage@exemple.fr',
        password: hashedPassword,
        avatar: 'MS',
        city: 'Bordeaux',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Le Cabinet Curieux',
        email: 'cabinet@exemple.fr',
        password: hashedPassword,
        avatar: 'CC',
        city: 'Nantes',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create products
  const now = Date.now();
  const past = (hours: number) => new Date(now - hours * 3600000).toISOString();
  const future = (hours: number) => new Date(now + hours * 3600000).toISOString();

  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'iPhone 13 Pro · 256 Go',
        description: 'Un iPhone 13 Pro en excellent état, avec sa boîte et son câble d\'origine. Batterie à 91%. Facture disponible.',
        categoryId: categories[0].id,
        condition: 'Tres_bon_etat',
        startPrice: 380,
        currentPrice: 492,
        city: 'Lyon',
        endsAt: future(1.8),
        sellerId: users[2].id,
        status: 'active',
        images: {
          create: [
            { url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=900' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: 'Appareil photo Leica argentique',
        description: 'Leica M6 classique, objectif 35mm Summicron. Révisé en 2023 par un atelier spécialisé.',
        categoryId: categories[6].id,
        condition: 'Bon_etat',
        startPrice: 1200,
        currentPrice: 1675,
        city: 'Paris',
        endsAt: future(5.5),
        sellerId: users[1].id,
        status: 'active',
        images: {
          create: [
            { url: 'https://images.pexels.com/photos/51383/pexels-photo-51383.jpeg?auto=compress&cs=tinysrgb&w=900' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: 'Veste en cuir d\'agneau vintage',
        description: 'Veste souple des années 80, coupe droite et doublure satinée. Quelques marques patinées qui font son caractère.',
        categoryId: categories[1].id,
        condition: 'Bon_etat',
        startPrice: 85,
        currentPrice: 128,
        city: 'Bordeaux',
        endsAt: future(9),
        sellerId: users[3].id,
        status: 'active',
        images: {
          create: [
            { url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=900' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: 'Vase en céramique signé M. Rivière',
        description: 'Pièce tournée à la main, émaillage bleu pétrole. Signature sous la base, pièce unique.',
        categoryId: categories[2].id,
        condition: 'Tres_bon_etat',
        startPrice: 70,
        currentPrice: 96,
        city: 'Nantes',
        endsAt: future(22),
        sellerId: users[4].id,
        status: 'active',
        images: {
          create: [
            { url: 'https://images.pexels.com/photos/1571746/pexels-photo-1571746.jpeg?auto=compress&cs=tinysrgb&w=900' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: 'Affiche originale — Festival de Cannes 1964',
        description: 'Affiche lithographique originale, entoilée et conservatives sous passe-partout. Une pièce rare pour collectionneur.',
        categoryId: categories[5].id,
        condition: 'Bon_etat',
        startPrice: 250,
        currentPrice: 740,
        city: 'Paris',
        endsAt: future(28),
        sellerId: users[1].id,
        status: 'active',
        images: {
          create: [
            { url: 'https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg?auto=compress&cs=tinysrgb&w=900' },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create bids
  const bids = await Promise.all([
    prisma.bid.create({
      data: {
        productId: products[0].id,
        bidderId: users[0].id,
        bidderName: users[0].name,
        amount: 492,
      },
    }),
    prisma.bid.create({
      data: {
        productId: products[0].id,
        bidderId: users[1].id,
        bidderName: users[1].name,
        amount: 446,
      },
    }),
    prisma.bid.create({
      data: {
        productId: products[0].id,
        bidderId: users[2].id,
        bidderName: users[2].name,
        amount: 410,
      },
    }),
    prisma.bid.create({
      data: {
        productId: products[1].id,
        bidderId: users[3].id,
        bidderName: users[3].name,
        amount: 1675,
      },
    }),
    prisma.bid.create({
      data: {
        productId: products[2].id,
        bidderId: users[4].id,
        bidderName: users[4].name,
        amount: 128,
      },
    }),
  ]);

  console.log(`✅ Created ${bids.length} bids`);

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        recipientId: users[0].id,
        title: 'Vous êtes en tête',
        body: 'iPhone 13 Pro · 256 Go',
        type: 'bid',
      },
    }),
    prisma.notification.create({
      data: {
        recipientId: users[0].id,
        title: 'Une enchère vous dépasse',
        body: 'Coffret vinyles Nina Simone',
        type: 'bid',
      },
    }),
    prisma.notification.create({
      data: {
        recipientId: users[0].id,
        title: 'Bienvenue sur Marché',
        body: 'Votre compte est prêt. Bonne chasse.',
        type: 'system',
        read: true,
      },
    }),
  ]);

  console.log('✅ Created notifications');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

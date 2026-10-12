import type { Bid, Category, Notification, PaymentWindow, Product, ProductCondition, SearchFilters, User } from './types';

const wait = (ms = 300): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));
const now = Date.now();
const future = (hours: number): string => new Date(now + hours * 3600000).toISOString();
const past = (hours: number): string => new Date(now - hours * 3600000).toISOString();

export const categories: Category[] = [
  { id: 'smartphones', name: 'Smartphones', icon: 'smartphone' },
  { id: 'mode', name: 'Mode', icon: 'shirt' },
  { id: 'maison', name: 'Maison', icon: 'lamp' },
  { id: 'collectibles', name: 'Collections', icon: 'medal' },
  { id: 'vehicules', name: 'Véhicules', icon: 'car-front' },
  { id: 'art', name: 'Art', icon: 'palette' },
  { id: 'electronique', name: 'Électronique', icon: 'headphones' },
];

export const demoUser: User = { id: 'u-me', name: 'Camille Morel', email: 'camille@exemple.fr', avatar: 'CM', city: 'Bujumbura' };
const sellerA: User = { id: 'u-1', name: 'Atelier Lune', email: 'atelier@exemple.fr', avatar: 'AL', city: 'Paris' };
const sellerB: User = { id: 'u-2', name: 'Nicolas Bernard', email: 'nicolas@exemple.fr', avatar: 'NB', city: 'Lyon' };
const sellerC: User = { id: 'u-3', name: 'Maison Sillage', email: 'sillage@exemple.fr', avatar: 'MS', city: 'Bordeaux' };
const sellerD: User = { id: 'u-4', name: 'Le Cabinet Curieux', email: 'cabinet@exemple.fr', avatar: 'CC', city: 'Nantes' };

const image = (id: number): string => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

export const demoAccounts = [
  { user: demoUser, label: 'Acheteuse · Camille Morel', description: 'Suit ses offres et règle ses acquisitions', password: 'marché2025' },
  { user: sellerB, label: 'Vendeur · Nicolas Bernard', description: 'Gère ses annonces et attribue ses ventes', password: 'marché2025' },
];

const seededProducts: Product[] = [
  { id: 'p-iphone', title: 'iPhone 13 Pro · 256 Go', description: 'Un iPhone 13 Pro en excellent état, avec sa boîte et son câble d’origine. Batterie à 91%. Facture disponible.', category: categories[0], condition: 'Très bon état', startPrice: 380, currentPrice: 492, images: [image(788946), image(404280)], seller: sellerB, city: 'Lyon', publishedAt: past(18), endsAt: future(1.8), status: 'active' },
  { id: 'p-leica', title: 'Appareil photo Leica argentique', description: 'Leica M6 classique, objectif 35mm Summicron. Révisé en 2023 par un atelier spécialisé.', category: categories[6], condition: 'Bon état', startPrice: 1200, currentPrice: 1675, images: [image(51383), image(788946)], seller: sellerA, city: 'Paris', publishedAt: past(29), endsAt: future(5.5), status: 'active' },
  { id: 'p-veste', title: 'Veste en cuir d’agneau vintage', description: 'Veste souple des années 80, coupe droite et doublure satinée. Quelques marques patinées qui font son caractère.', category: categories[1], condition: 'Bon état', startPrice: 85, currentPrice: 128, images: [image(1043474), image(994523)], seller: sellerC, city: 'Bordeaux', publishedAt: past(9), endsAt: future(9), status: 'active' },
  { id: 'p-ceramique', title: 'Vase en céramique signé M. Rivière', description: 'Pièce tournée à la main, émaillage bleu pétrole. Signature sous la base, pièce unique.', category: categories[2], condition: 'Très bon état', startPrice: 70, currentPrice: 96, images: [image(1571746), image(1454806)], seller: sellerD, city: 'Nantes', publishedAt: past(6), endsAt: future(22), status: 'active' },
  { id: 'p-affiche', title: 'Affiche originale — Festival de Cannes 1964', description: 'Affiche lithographique originale, entoilée et conservée sous passe-partout. Une pièce rare pour collectionneur.', category: categories[5], condition: 'Bon état', startPrice: 250, currentPrice: 740, images: [image(1666067), image(2123337)], seller: sellerA, city: 'Paris', publishedAt: past(40), endsAt: future(28), status: 'active' },
  { id: 'p-vespa', title: 'Vespa PX 125 · 1987', description: 'Vespa iconique dans sa teinte crème d’origine. Carte grise française, démarrage au quart de tour.', category: categories[4], condition: 'Bon état', startPrice: 1800, currentPrice: 2380, images: [image(2116475), image(305070)], seller: sellerB, city: 'Lyon', publishedAt: past(54), endsAt: future(44), status: 'active' },
  { id: 'p-console', title: 'Console Super Nintendo complète', description: 'Pack original avec console, deux manettes et Super Mario World. Testée, fonctionne parfaitement.', category: categories[3], condition: 'Très bon état', startPrice: 90, currentPrice: 156, images: [image(687811), image(163036)], seller: sellerD, city: 'Nantes', publishedAt: past(13), endsAt: future(2.3), status: 'active' },
  { id: 'p-lampe', title: 'Lampe à poser Art déco opaline', description: 'Lampe des années 30 en opaline blanche et laiton. Électricité refaite, douille E27.', category: categories[2], condition: 'Très bon état', startPrice: 130, currentPrice: 188, images: [image(1112598), image(90319)], seller: sellerC, city: 'Bordeaux', publishedAt: past(23), endsAt: future(12), status: 'active' },
  { id: 'p-vinyle', title: 'Coffret vinyles Nina Simone', description: 'Édition collector 6 vinyles, pressage européen 1970. Pochette et disques en état remarquable.', category: categories[3], condition: 'Très bon état', startPrice: 110, currentPrice: 210, images: [image(1626481), image(164853)], seller: sellerA, city: 'Paris', publishedAt: past(48), endsAt: future(3.5), status: 'active' },
  { id: 'p-chaise', title: 'Paire de chaises Cesca B32', description: 'Paire de chaises tubulaires inspirées de Marcel Breuer, cannage refait récemment.', category: categories[2], condition: 'Bon état', startPrice: 220, currentPrice: 220, images: [image(1571458), image(276528)], seller: sellerC, city: 'Bordeaux', publishedAt: past(2), endsAt: future(52), status: 'active' },
  { id: 'p-watch', title: 'Montre Seiko 5 automatique', description: 'Seiko 5 automatique au cadran bleu nuit, révisée et livrée avec bracelet cuir neuf.', category: categories[3], condition: 'Très bon état', startPrice: 145, currentPrice: 286, images: [image(190819), image(277390)], seller: sellerB, city: 'Lyon', publishedAt: past(33), endsAt: future(7.2), status: 'active' },
  { id: 'p-tablet', title: 'Tablette graphique Wacom Intuos Pro', description: 'Grande tablette pour création numérique, stylet inclus avec pointes de rechange.', category: categories[6], condition: 'Bon état', startPrice: 100, currentPrice: 142, images: [image(205316), image(270348)], seller: sellerD, city: 'Nantes', publishedAt: past(14), endsAt: past(1), status: 'ended' },
];

let products: Product[] = seededProducts.map((product) => ({ ...product, images: [...product.images] }));
const bidSeed = (productId: string, amounts: number[], names: string[], bidderIds: string[] = []): Bid[] => amounts.map((amount, index) => ({ id: `${productId}-b${index}`, productId, bidderName: names[index] ?? 'Acheteur discret', bidderId: bidderIds[index] ?? `buyer-${index}`, amount, createdAt: new Date(now - (amounts.length - index) * 7200000).toISOString() }));
let bids: Bid[] = [
  ...bidSeed('p-iphone', [410, 446, 492], ['Sophie R.', 'Marc D.', 'Camille Morel'], ['buyer-sophie', 'buyer-marc', demoUser.id]),
  ...bidSeed('p-leica', [1300, 1450, 1675], ['Thomas G.', 'Amina B.', 'Julien M.']),
  ...bidSeed('p-veste', [95, 110, 128], ['Louise C.', 'Nora K.', 'Hugo V.']),
  ...bidSeed('p-affiche', [350, 540, 740], ['Victor L.', 'Clara S.', 'Romain A.']),
  ...bidSeed('p-console', [112, 132, 156], ['Malo T.', 'Zoé J.', 'Sarah W.']),
  ...bidSeed('p-vinyle', [140, 180, 210], ['Élodie P.', 'Paul E.', 'Nina F.']),
  ...bidSeed('p-watch', [180, 220, 286], ['Yanis B.', 'Emma R.', 'Noé H.']),
];
let currentUser: User | null = null;
let notifications: Notification[] = [
  { id: 'n1', recipientId: demoUser.id, title: 'Vous êtes en tête', body: 'iPhone 13 Pro · 256 Go', createdAt: past(0.5), read: false, type: 'bid' },
  { id: 'n2', recipientId: demoUser.id, title: 'Une enchère vous dépasse', body: 'Coffret vinyles Nina Simone', createdAt: past(5), read: false, type: 'bid' },
  { id: 'n3', recipientId: demoUser.id, title: 'Bienvenue sur Marché', body: 'Votre compte est prêt. Bonne chasse.', createdAt: past(28), read: true, type: 'system' },
  { id: 'n4', recipientId: sellerB.id, title: 'Vos annonces attirent', body: '3 offres attendent votre décision.', createdAt: past(2), read: false, type: 'sale' },
];
let payments: PaymentWindow[] = [];

function refreshStatuses(): void {
  const timestamp = Date.now();
  // In production, expiration and payment rollover belong in server-side jobs.
  products = products.map((product) => {
    if (product.status !== 'active' || new Date(product.endsAt).getTime() > timestamp) return product;
    const rankedBids = bids.filter((bid) => bid.productId === product.id).sort((a, b) => b.amount - a.amount);
    if (rankedBids[0] && !payments.some((payment) => payment.productId === product.id)) {
      payments = [{ productId: product.id, sellerId: product.seller.id, winnerId: rankedBids[0].bidderId, amount: rankedBids[0].amount, expiresAt: new Date(timestamp + 86400000).toISOString(), status: 'pending' }, ...payments];
    }
    return { ...product, status: 'ended' };
  });
  const expiredPayments = payments.filter((payment) => payment.status === 'pending' && new Date(payment.expiresAt).getTime() <= timestamp);
  expiredPayments.forEach((payment) => {
    const fallback = bids.filter((bid) => bid.productId === payment.productId && bid.bidderId !== payment.winnerId && bid.amount < payment.amount).sort((a, b) => b.amount - a.amount)[0];
    payments = payments.filter((item) => item.productId !== payment.productId);
    if (fallback) {
      const fallbackProduct = products.find((product) => product.id === payment.productId);
      payments = [{ productId: payment.productId, sellerId: fallbackProduct?.seller.id ?? payment.sellerId, winnerId: fallback.bidderId, amount: fallback.amount, expiresAt: new Date(timestamp + 86400000).toISOString(), status: 'pending' }, ...payments];
    } else {
      products = products.map((product) => product.id === payment.productId ? { ...product, status: 'unsold' } : product);
    }
  });
}

export const mockApi = {
  async listProducts(filters: SearchFilters = {}): Promise<Product[]> {
    await wait(); refreshStatuses();
    const query = filters.query?.toLowerCase().trim();
    let output = products.filter((product) => {
      if (product.status !== 'active') return false;
      if (query && !`${product.title} ${product.description} ${product.city}`.toLowerCase().includes(query)) return false;
      if (filters.category && product.category.id !== filters.category) return false;
      if (filters.condition && product.condition !== filters.condition) return false;
      if (filters.maxPrice && product.currentPrice > filters.maxPrice) return false;
      if (filters.city && product.city !== filters.city) return false;
      if (filters.deadline === '24h' && new Date(product.endsAt).getTime() > Date.now() + 86400000) return false;
      return true;
    });
    const sort = filters.sort ?? 'recent';
    output = [...output].sort((a, b) => sort === 'ending' ? a.endsAt.localeCompare(b.endsAt) : sort === 'price-low' ? a.currentPrice - b.currentPrice : sort === 'price-high' ? b.currentPrice - a.currentPrice : b.publishedAt.localeCompare(a.publishedAt));
    return output;
  },
  async getProduct(id: string): Promise<Product | undefined> { await wait(); refreshStatuses(); return products.find((product) => product.id === id); },
  async getBids(productId: string): Promise<Bid[]> { await wait(); return bids.filter((bid) => bid.productId === productId).sort((a, b) => b.amount - a.amount); },
  async getBidsForUser(userId: string): Promise<Bid[]> { await wait(); return bids.filter((bid) => bid.bidderId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  getAllBids(): Bid[] { return [...bids]; },
  async placeBid(productId: string, amount: number): Promise<Bid> {
    await wait(); refreshStatuses();
    const product = products.find((item) => item.id === productId);
    if (!product) throw new Error('Cette annonce est introuvable.');
    if (product.status !== 'active' || new Date(product.endsAt).getTime() <= Date.now()) throw new Error('Les enchères sont terminées.');
    if (currentUser && product.seller.id === currentUser.id) throw new Error('Vous ne pouvez pas enchérir sur votre propre annonce.');
    if (amount <= product.currentPrice) throw new Error(`Votre offre doit être supérieure à ${product.currentPrice.toLocaleString('fr-FR')} $US.`);
    const bidder = currentUser ?? { id: 'visitor', name: 'Acheteur invité', email: '', avatar: 'AG', city: '' };
    const bid: Bid = { id: `bid-${Date.now()}`, productId, bidderId: bidder.id, bidderName: bidder.name, amount, createdAt: new Date().toISOString() };
    bids = [...bids, bid];
    products = products.map((item) => item.id === productId ? { ...item, currentPrice: amount } : item);
    notifications = [
      { id: `n-${Date.now()}-buyer`, recipientId: bidder.id, title: 'Enchère enregistrée', body: `Votre offre sur ${product.title} est bien prise en compte.`, createdAt: new Date().toISOString(), read: false, type: 'bid' },
      { id: `n-${Date.now()}-seller`, recipientId: product.seller.id, title: 'Nouvelle offre reçue', body: `${bidder.name} propose ${amount.toLocaleString('fr-FR')} $US sur ${product.title}.`, createdAt: new Date().toISOString(), read: false, type: 'sale' },
      ...notifications,
    ];
    return bid;
  },
  async login(email: string, password: string): Promise<User> { await wait(); if (!email.includes('@') || password.length < 6) throw new Error('Identifiants incorrects.'); const account = demoAccounts.find((item) => item.user.email === email); currentUser = account?.user ?? { ...demoUser, email, name: email.split('@')[0] || demoUser.name }; return currentUser; },
  async register(name: string, email: string): Promise<User> { await wait(); currentUser = { ...demoUser, name, email, avatar: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }; return currentUser; },
  async logout(): Promise<void> { await wait(120); currentUser = null; },
  getCurrentUser(): User | null { return currentUser; },
  async getNotifications(userId = currentUser?.id): Promise<Notification[]> { await wait(); return notifications.filter((notification) => !notification.recipientId || notification.recipientId === userId); },
  async markNotificationsRead(userId = currentUser?.id): Promise<void> { await wait(100); notifications = notifications.map((notification) => !notification.recipientId || notification.recipientId === userId ? { ...notification, read: true } : notification); },
  async createListing(input: { title: string; description: string; categoryId: string; condition: ProductCondition; startPrice: number; city: string; endsAt: string; images: string[] }): Promise<Product> {
    await wait();
    const category = categories.find((item) => item.id === input.categoryId) ?? categories[0];
    const seller = currentUser ?? demoUser;
    const product: Product = { id: `p-${Date.now()}`, title: input.title, description: input.description, category, condition: input.condition, startPrice: input.startPrice, currentPrice: input.startPrice, images: input.images.length ? input.images : [image(1070981)], seller, city: input.city, publishedAt: new Date().toISOString(), endsAt: input.endsAt, status: 'active' };
    products = [product, ...products];
    return product;
  },
  async getPayments(): Promise<PaymentWindow[]> { await wait(); return payments; },
  async getPaymentsForUser(userId: string): Promise<PaymentWindow[]> { await wait(); return payments.filter((payment) => payment.winnerId === userId || payment.sellerId === userId); },
  async awardBid(productId: string, bidId: string): Promise<PaymentWindow> {
    await wait();
    refreshStatuses();
    const product = products.find((item) => item.id === productId);
    const bid = bids.find((item) => item.id === bidId && item.productId === productId);
    if (!product || !bid) throw new Error('Cette offre est introuvable.');
    if (!currentUser || product.seller.id !== currentUser.id) throw new Error('Seul le vendeur peut attribuer cette vente.');
    if (product.status !== 'active') throw new Error('Cette annonce n’est plus disponible.');
    const payment: PaymentWindow = { productId, sellerId: product.seller.id, winnerId: bid.bidderId, amount: bid.amount, expiresAt: new Date(Date.now() + 86400000).toISOString(), status: 'pending' };
    payments = [payment, ...payments.filter((item) => item.productId !== productId)];
    products = products.map((item) => item.id === productId ? { ...item, currentPrice: bid.amount, status: 'ended' } : item);
    notifications = [
      { id: `n-${Date.now()}-winner`, recipientId: bid.bidderId, title: 'Votre offre est retenue', body: `${product.title} vous est réservé. Réglez votre acquisition sous 24 heures.`, createdAt: new Date().toISOString(), read: false, type: 'sale' },
      { id: `n-${Date.now()}-seller`, recipientId: product.seller.id, title: 'Vente en attente de paiement', body: `${bid.bidderName} doit régler ${bid.amount.toLocaleString('fr-FR')} $US pour ${product.title}.`, createdAt: new Date().toISOString(), read: false, type: 'sale' },
      ...notifications,
    ];
    return payment;
  },
  async simulatePayment(productId: string): Promise<void> {
    await wait();
    const payment = payments.find((item) => item.productId === productId);
    const product = products.find((item) => item.id === productId);
    if (!payment || !product) throw new Error('Cette acquisition est introuvable.');
    if (!currentUser || payment.winnerId !== currentUser.id) throw new Error('Seul l’acheteur retenu peut régler cette acquisition.');
    payments = payments.map((item) => item.productId === productId ? { ...item, status: 'paid' } : item);
    products = products.map((item) => item.id === productId ? { ...item, status: 'sold' } : item);
    notifications = [
      { id: `n-${Date.now()}-seller-paid`, recipientId: product.seller.id, title: 'Paiement reçu', body: `${currentUser.name} a réglé ${product.title}. Vous pouvez préparer l’expédition.`, createdAt: new Date().toISOString(), read: false, type: 'sale' },
      { id: `n-${Date.now()}-buyer-paid`, recipientId: currentUser.id, title: 'Acquisition confirmée', body: `Le paiement de ${product.title} est confirmé.`, createdAt: new Date().toISOString(), read: false, type: 'sale' },
      ...notifications,
    ];
  },
  getDemoAccounts(): typeof demoAccounts { return demoAccounts; },
  getCategories(): Category[] { return categories; },
  getAllProducts(): Product[] { refreshStatuses(); return products; },
};

export function seedPaymentWindow(productId: string, amount: number): void {
  const product = products.find((item) => item.id === productId);
  payments = [{ productId, sellerId: product?.seller.id ?? sellerB.id, winnerId: demoUser.id, amount, expiresAt: future(24), status: 'pending' }, ...payments.filter((payment) => payment.productId !== productId)];
}
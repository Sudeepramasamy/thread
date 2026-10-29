import { PrismaClient, Role, OrderStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for THREAD & CO. ...');

  // 1. Clean existing records safely
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.newsletterSubscription.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Admin User
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@threadandco.com',
      passwordHash: adminPasswordHash,
      name: 'Alexander Wright',
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Admin created: ${admin.email} (Password: AdminPassword123!)`);

  // Sample Customer
  const customerPasswordHash = await bcrypt.hash('CustomerPass123!', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'clara.vane@example.com',
      passwordHash: customerPasswordHash,
      name: 'Clara Vane',
      role: Role.CUSTOMER,
    },
  });

  // 3. Create Categories
  const categoriesData = [
    {
      name: "Men's Collection",
      slug: 'mens-collection',
      description: 'Sophisticated essentials, modern tailoring, and effortless daily luxury for men.',
      imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: "Women's Collection",
      slug: 'womens-collection',
      description: 'Sculpted silhouettes, fluid silks, and contemporary tailoring for modern women.',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Outerwear & Coats',
      slug: 'outerwear',
      description: 'Architectural trenches, cashmere blend overcoats, and weather-resistant chore jackets.',
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Luxury Knitwear',
      slug: 'knitwear',
      description: 'Ultra-fine merino wool, Mongolian cashmere, and relaxed-gauge cardigans.',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Leather & Accessories',
      slug: 'accessories',
      description: 'Full-grain Italian calfskin totes, brushed steel hardware, and pure silk scarves.',
      imageUrl: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const categoriesMap: { [slug: string]: any } = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = created;
  }
  console.log(`📁 Created ${categoriesData.length} categories.`);

  // 4. Products Data (18 realistic high-fashion products)
  const productsData = [
    {
      name: 'Atelier Double-Breasted Wool Overcoat',
      slug: 'atelier-double-breasted-wool-overcoat',
      description: 'Cut from substantial 100% Virgin Italian Melton wool, the Atelier Double-Breasted Overcoat exemplifies architectural elegance. Featuring peaked lapels, Horn button closures, and a fluid cupro lining for seamless layering.',
      price: 495.00,
      discountPrice: 420.00,
      stock: 45,
      isFeatured: true,
      categorySlug: 'outerwear',
      images: [
        { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop', altText: 'Man wearing charcoal wool overcoat', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop', altText: 'Detail of melton wool fabric and peak lapel', isPrimary: false },
      ],
      variants: [
        { size: 'S', color: 'Charcoal Grey', colorCode: '#2B2C30', sku: 'OVC-CHR-S', stock: 12 },
        { size: 'M', color: 'Charcoal Grey', colorCode: '#2B2C30', sku: 'OVC-CHR-M', stock: 18 },
        { size: 'L', color: 'Charcoal Grey', colorCode: '#2B2C30', sku: 'OVC-CHR-L', stock: 15 },
      ]
    },
    {
      name: 'Raw Silk Pleated Wide-Leg Trouser',
      slug: 'raw-silk-pleated-wide-leg-trouser',
      description: 'Tailored with crisp double front pleats and a relaxed drape. Made from raw textured silk blend that breathes effortlessly from boardroom meetings to gallery receptions.',
      price: 240.00,
      discountPrice: null,
      stock: 35,
      isFeatured: true,
      categorySlug: 'womens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop', altText: 'Woman in cream wide leg trousers', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', altText: 'Minimalist styling of silk trousers', isPrimary: false },
      ],
      variants: [
        { size: 'XS', color: 'Ecru Cream', colorCode: '#F4F2EC', sku: 'TRS-ECR-XS', stock: 10 },
        { size: 'S', color: 'Ecru Cream', colorCode: '#F4F2EC', sku: 'TRS-ECR-S', stock: 15 },
        { size: 'M', color: 'Ecru Cream', colorCode: '#F4F2EC', sku: 'TRS-ECR-M', stock: 10 },
      ]
    },
    {
      name: 'Heavyweight Supima Cotton Mockneck',
      slug: 'heavyweight-supima-cotton-mockneck',
      description: 'Crafted from 280 GSM long-staple Californian Supima cotton. Offers an elevated mockneck collar that holds its structural form wash after wash.',
      price: 95.00,
      discountPrice: 80.00,
      stock: 75,
      isFeatured: true,
      categorySlug: 'mens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop', altText: 'Minimalist black mockneck shirt', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop', altText: 'Texture detail of Supima cotton', isPrimary: false },
      ],
      variants: [
        { size: 'S', color: 'Onyx Black', colorCode: '#101012', sku: 'MCK-BLK-S', stock: 25 },
        { size: 'M', color: 'Onyx Black', colorCode: '#101012', sku: 'MCK-BLK-M', stock: 30 },
        { size: 'L', color: 'Onyx Black', colorCode: '#101012', sku: 'MCK-BLK-L', stock: 20 },
      ]
    },
    {
      name: 'Sculpted Cashmere Blend Cardigan',
      slug: 'sculpted-cashmere-blend-cardigan',
      description: 'A 7-gauge rib knit spun from Grade-A Mongolian cashmere blended with organic wool. Mother of pearl buttons and softly dropped shoulders create a relaxed yet refined silhouette.',
      price: 310.00,
      discountPrice: 265.00,
      stock: 40,
      isFeatured: true,
      categorySlug: 'knitwear',
      images: [
        { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop', altText: 'Soft knit cardigan hanging in neutral studio', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop', altText: 'Close up knit texture', isPrimary: false },
      ],
      variants: [
        { size: 'XS', color: 'Oatmeal', colorCode: '#DFD8CC', sku: 'CRD-OAT-XS', stock: 10 },
        { size: 'S', color: 'Oatmeal', colorCode: '#DFD8CC', sku: 'CRD-OAT-S', stock: 15 },
        { size: 'M', color: 'Oatmeal', colorCode: '#DFD8CC', sku: 'CRD-OAT-M', stock: 15 },
      ]
    },
    {
      name: 'Florentine Nappa Leather Tote',
      slug: 'florentine-nappa-leather-tote',
      description: 'Handmade in Tuscany using vegetable-tanned full grain calf leather. Features an interior laptop pocket, magnetic closure, and raw suede interior.',
      price: 385.00,
      discountPrice: null,
      stock: 22,
      isFeatured: true,
      categorySlug: 'accessories',
      images: [
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop', altText: 'Brown leather tote bag', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop', altText: 'Detail of stitching and leather patina', isPrimary: false },
      ],
      variants: [
        { size: 'One Size', color: 'Cognac Brown', colorCode: '#734128', sku: 'TOT-BRN-OS', stock: 12 },
        { size: 'One Size', color: 'Midnight Noir', colorCode: '#111114', sku: 'TOT-NOIR-OS', stock: 10 },
      ]
    },
    {
      name: 'Minimalist Relaxed Poplin Shirt',
      slug: 'minimalist-relaxed-poplin-shirt',
      description: 'Crisp 120s two-ply organic Egyptian cotton poplin with a curved hem and clean hidden-placket front. An understated staple for any contemporary wardrobe.',
      price: 145.00,
      discountPrice: null,
      stock: 60,
      isFeatured: false,
      categorySlug: 'mens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop', altText: 'Clean tailored cotton button up', isPrimary: true },
      ],
      variants: [
        { size: 'S', color: 'Pure Chalk', colorCode: '#F8F8F8', sku: 'POP-WHT-S', stock: 20 },
        { size: 'M', color: 'Pure Chalk', colorCode: '#F8F8F8', sku: 'POP-WHT-M', stock: 25 },
        { size: 'L', color: 'Pure Chalk', colorCode: '#F8F8F8', sku: 'POP-WHT-L', stock: 15 },
      ]
    },
    {
      name: 'Architectural Trench Coat in Khaki',
      slug: 'architectural-trench-coat-in-khaki',
      description: 'Constructed from weatherproof British cotton gabardine. Designed with storm flaps, a detachable belt with leather-wrapped buckle, and a deep center-back vent.',
      price: 520.00,
      discountPrice: 470.00,
      stock: 28,
      isFeatured: true,
      categorySlug: 'outerwear',
      images: [
        { url: 'https://images.unsplash.com/photo-1548624313-039e227a9223?q=80&w=1000&auto=format&fit=crop', altText: 'Classic khaki trench coat model', isPrimary: true },
      ],
      variants: [
        { size: 'S', color: 'Desert Khaki', colorCode: '#C8B99D', sku: 'TRN-KHK-S', stock: 8 },
        { size: 'M', color: 'Desert Khaki', colorCode: '#C8B99D', sku: 'TRN-KHK-M', stock: 12 },
        { size: 'L', color: 'Desert Khaki', colorCode: '#C8B99D', sku: 'TRN-KHK-L', stock: 8 },
      ]
    },
    {
      name: 'Pure Mulberry Silk Slip Dress',
      slug: 'pure-mulberry-silk-slip-dress',
      description: 'Cut on the bias from luxurious 22-momme Mulberry silk. The fluid drape hugs the body naturally with delicate French seams and adjustable straps.',
      price: 260.00,
      discountPrice: 220.00,
      stock: 30,
      isFeatured: true,
      categorySlug: 'womens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop', altText: 'Silk slip dress model', isPrimary: true },
      ],
      variants: [
        { size: 'XS', color: 'Champagne Sand', colorCode: '#E5DAC6', sku: 'SLP-CMP-XS', stock: 8 },
        { size: 'S', color: 'Champagne Sand', colorCode: '#E5DAC6', sku: 'SLP-CMP-S', stock: 12 },
        { size: 'M', color: 'Champagne Sand', colorCode: '#E5DAC6', sku: 'SLP-CMP-M', stock: 10 },
      ]
    },
    {
      name: 'Brushed Alpaca Crewneck Sweater',
      slug: 'brushed-alpaca-crewneck-sweater',
      description: 'Spun from airy Peruvian baby alpaca and organic wool yarn. Featherlight yet remarkably insulating with a cloud-soft brushed texture.',
      price: 215.00,
      discountPrice: null,
      stock: 40,
      isFeatured: false,
      categorySlug: 'knitwear',
      images: [
        { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop', altText: 'Cosy knit sweater', isPrimary: true },
      ],
      variants: [
        { size: 'S', color: 'Sage Green', colorCode: '#879785', sku: 'ALP-SAG-S', stock: 15 },
        { size: 'M', color: 'Sage Green', colorCode: '#879785', sku: 'ALP-SAG-M', stock: 15 },
        { size: 'L', color: 'Sage Green', colorCode: '#879785', sku: 'ALP-SAG-L', stock: 10 },
      ]
    },
    {
      name: 'Structured Canvas Chore Jacket',
      slug: 'structured-canvas-chore-jacket',
      description: 'Made from heavyweight 12oz duck canvas with a contrast corduroy collar. Equipped with reinforced patch pockets and aged brass hardware.',
      price: 195.00,
      discountPrice: 165.00,
      stock: 35,
      isFeatured: false,
      categorySlug: 'outerwear',
      images: [
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop', altText: 'Canvas work jacket', isPrimary: true },
      ],
      variants: [
        { size: 'S', color: 'Raw Umber', colorCode: '#6A5645', sku: 'CHR-UMB-S', stock: 10 },
        { size: 'M', color: 'Raw Umber', colorCode: '#6A5645', sku: 'CHR-UMB-M', stock: 15 },
        { size: 'L', color: 'Raw Umber', colorCode: '#6A5645', sku: 'CHR-UMB-L', stock: 10 },
      ]
    },
    {
      name: 'Handcrafted Acetate Sunglasses',
      slug: 'handcrafted-acetate-sunglasses',
      description: 'Japanese Mazzucchelli bio-acetate frame with 100% UV400 Carl Zeiss lenses and five-barrel German hinges. Effortlessly cool and enduring.',
      price: 175.00,
      discountPrice: null,
      stock: 50,
      isFeatured: false,
      categorySlug: 'accessories',
      images: [
        { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop', altText: 'Luxury sunglasses on table', isPrimary: true },
      ],
      variants: [
        { size: 'One Size', color: 'Tortoise Shell', colorCode: '#482D1E', sku: 'SNG-TRT-OS', stock: 25 },
        { size: 'One Size', color: 'Pitch Black', colorCode: '#101010', sku: 'SNG-BLK-OS', stock: 25 },
      ]
    },
    {
      name: 'Tailored Single-Breasted Wool Blazer',
      slug: 'tailored-single-breasted-wool-blazer',
      description: 'Engineered for a modern tailored fit with half-canvas construction and roped shoulders. Fabric woven by historical mills in Biella, Italy.',
      price: 390.00,
      discountPrice: 330.00,
      stock: 25,
      isFeatured: true,
      categorySlug: 'mens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', altText: 'Tailored wool blazer', isPrimary: true },
      ],
      variants: [
        { size: '38R', color: 'Deep Navy', colorCode: '#1C273C', sku: 'BLZ-NVY-38', stock: 8 },
        { size: '40R', color: 'Deep Navy', colorCode: '#1C273C', sku: 'BLZ-NVY-40', stock: 10 },
        { size: '42R', color: 'Deep Navy', colorCode: '#1C273C', sku: 'BLZ-NVY-42', stock: 7 },
      ]
    },
    {
      name: 'Heavy Rib Cashmere Beanie',
      slug: 'heavy-rib-cashmere-beanie',
      description: 'Spun from thick 4-ply Mongolian cashmere. Ultra-soft against the forehead with a classic fold-over cuff and seamless crown knitting.',
      price: 85.00,
      discountPrice: null,
      stock: 65,
      isFeatured: false,
      categorySlug: 'accessories',
      images: [
        { url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop', altText: 'Cashmere beanie', isPrimary: true },
      ],
      variants: [
        { size: 'One Size', color: 'Heather Grey', colorCode: '#989898', sku: 'BN-GRY-OS', stock: 35 },
        { size: 'One Size', color: 'Charcoal', colorCode: '#2C2C2E', sku: 'BN-CHR-OS', stock: 30 },
      ]
    },
    {
      name: 'Organic French Terry Hoodie',
      slug: 'organic-french-terry-hoodie',
      description: 'Made from unbrushed 450 GSM French Terry organic cotton. Features double-needle cover-stitching, double-lined hood, and kangaroo pouch pocket.',
      price: 130.00,
      discountPrice: 110.00,
      stock: 50,
      isFeatured: false,
      categorySlug: 'mens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop', altText: 'Organic cotton hoodie', isPrimary: true },
      ],
      variants: [
        { size: 'S', color: 'Vintage Olive', colorCode: '#4B5320', sku: 'HD-OLV-S', stock: 15 },
        { size: 'M', color: 'Vintage Olive', colorCode: '#4B5320', sku: 'HD-OLV-M', stock: 20 },
        { size: 'L', color: 'Vintage Olive', colorCode: '#4B5320', sku: 'HD-OLV-L', stock: 15 },
      ]
    },
    {
      name: 'Belted Linen Utility Jumpsuit',
      slug: 'belted-linen-utility-jumpsuit',
      description: 'Woven from 100% Normandy flax linen. Features utilitarian chest pockets, a tapered leg, and an adjustable matching tie belt.',
      price: 220.00,
      discountPrice: null,
      stock: 20,
      isFeatured: false,
      categorySlug: 'womens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop', altText: 'Fashion model in linen outfit', isPrimary: true },
      ],
      variants: [
        { size: 'XS', color: 'Sand Beige', colorCode: '#D9CBBB', sku: 'JMP-SND-XS', stock: 5 },
        { size: 'S', color: 'Sand Beige', colorCode: '#D9CBBB', sku: 'JMP-SND-S', stock: 10 },
        { size: 'M', color: 'Sand Beige', colorCode: '#D9CBBB', sku: 'JMP-SND-M', stock: 5 },
      ]
    },
    {
      name: 'Seamless Merino Wool Turtleneck',
      slug: 'seamless-merino-wool-turtleneck',
      description: 'Knitted on 3D wholegarment machines for zero waste and maximum ergonomic comfort. Extra-fine 19.5 micron Australian Merino wool.',
      price: 160.00,
      discountPrice: 135.00,
      stock: 45,
      isFeatured: false,
      categorySlug: 'knitwear',
      images: [
        { url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop', altText: 'Merino turtleneck outfit', isPrimary: true },
      ],
      variants: [
        { size: 'S', color: 'Bordeaux Red', colorCode: '#581825', sku: 'TRT-BRD-S', stock: 15 },
        { size: 'M', color: 'Bordeaux Red', colorCode: '#581825', sku: 'TRT-BRD-M', stock: 20 },
        { size: 'L', color: 'Bordeaux Red', colorCode: '#581825', sku: 'TRT-BRD-L', stock: 10 },
      ]
    },
    {
      name: 'Italian Calfskin Chelsea Boots',
      slug: 'italian-calfskin-chelsea-boots',
      description: 'Goodyear welted with stacked leather soles and Dainite rubber heel studs. Hand-burnished calfskin upper with custom woven elastic side gores.',
      price: 360.00,
      discountPrice: 299.00,
      stock: 18,
      isFeatured: true,
      categorySlug: 'accessories',
      images: [
        { url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop', altText: 'Black leather Chelsea boots', isPrimary: true },
      ],
      variants: [
        { size: '41 EU', color: 'Jet Black', colorCode: '#0E0E10', sku: 'BOT-BLK-41', stock: 5 },
        { size: '42 EU', color: 'Jet Black', colorCode: '#0E0E10', sku: 'BOT-BLK-42', stock: 7 },
        { size: '43 EU', color: 'Jet Black', colorCode: '#0E0E10', sku: 'BOT-BLK-43', stock: 6 },
      ]
    },
    {
      name: 'Crisp Cotton Poplin Shirtdress',
      slug: 'crisp-cotton-poplin-shirtdress',
      description: 'An architectural take on the classic shirtdress with voluminous pleated sleeves, mother-of-pearl buttons, and a belted cinched waist.',
      price: 210.00,
      discountPrice: null,
      stock: 32,
      isFeatured: false,
      categorySlug: 'womens-collection',
      images: [
        { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop', altText: 'Woman in stylish white dress', isPrimary: true },
      ],
      variants: [
        { size: 'S', color: 'Optical White', colorCode: '#FFFFFF', sku: 'DRS-WHT-S', stock: 12 },
        { size: 'M', color: 'Optical White', colorCode: '#FFFFFF', sku: 'DRS-WHT-M', stock: 12 },
        { size: 'L', color: 'Optical White', colorCode: '#FFFFFF', sku: 'DRS-WHT-L', stock: 8 },
      ]
    },
  ];

  const createdProducts: any[] = [];
  for (const p of productsData) {
    const category = categoriesMap[p.categorySlug];
    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        isFeatured: p.isFeatured,
        categoryId: category.id,
        images: {
          create: p.images.map((img, idx) => ({
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
            displayOrder: idx,
          })),
        },
        variants: {
          create: p.variants.map((v) => ({
            size: v.size,
            color: v.color,
            colorCode: v.colorCode,
            sku: v.sku,
            stock: v.stock,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });
    createdProducts.push(created);
  }
  console.log(`✨ Created ${createdProducts.length} rich fashion products.`);

  // 5. Create Sample Orders for realistic Admin Dashboard analytics
  const sampleOrders = [
    {
      orderNumber: 'TC-2026-8812',
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor.vance@example.com',
      customerPhone: '+1 (555) 234-8901',
      shippingAddress: '742 Evergreen Terrace, Apt 4B',
      shippingCity: 'New York',
      shippingPostalCode: '10001',
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.DEMO_PAID,
      subtotal: 735.00,
      shippingFee: 0.00,
      tax: 58.80,
      total: 793.80,
      items: [
        {
          product: createdProducts[0], // Overcoat
          variant: createdProducts[0].variants[1],
          price: 420.00,
          quantity: 1,
        },
        {
          product: createdProducts[3], // Cardigan
          variant: createdProducts[3].variants[1],
          price: 315.00,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: 'TC-2026-8820',
      customerName: 'Marcus Sterling',
      customerEmail: 'marcus.sterling@example.com',
      customerPhone: '+1 (555) 432-1098',
      shippingAddress: '480 Howard Street, Suite 9',
      shippingCity: 'San Francisco',
      shippingPostalCode: '94105',
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.DEMO_PAID,
      subtotal: 465.00,
      shippingFee: 15.00,
      tax: 37.20,
      total: 517.20,
      items: [
        {
          product: createdProducts[2], // Supima mockneck
          variant: createdProducts[2].variants[1],
          price: 80.00,
          quantity: 1,
        },
        {
          product: createdProducts[4], // Leather tote
          variant: createdProducts[4].variants[0],
          price: 385.00,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: 'TC-2026-8835',
      customerName: 'Sophia Laurent',
      customerEmail: 'sophia.laurent@example.com',
      customerPhone: '+1 (555) 789-3412',
      shippingAddress: '1240 Lake Shore Drive',
      shippingCity: 'Chicago',
      shippingPostalCode: '60611',
      status: OrderStatus.SHIPPED,
      paymentStatus: PaymentStatus.DEMO_PAID,
      subtotal: 260.00,
      shippingFee: 0.00,
      tax: 20.80,
      total: 280.80,
      items: [
        {
          product: createdProducts[7], // Silk slip dress
          variant: createdProducts[7].variants[1],
          price: 260.00,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: 'TC-2026-8849',
      customerName: 'David Chen',
      customerEmail: 'david.chen@example.com',
      customerPhone: '+1 (555) 901-2345',
      shippingAddress: '312 Beacon Street',
      shippingCity: 'Boston',
      shippingPostalCode: '02116',
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.DEMO_PAID,
      subtotal: 390.00,
      shippingFee: 0.00,
      tax: 31.20,
      total: 421.20,
      items: [
        {
          product: createdProducts[11], // Wool blazer
          variant: createdProducts[11].variants[1],
          price: 390.00,
          quantity: 1,
        },
      ],
    },
  ];

  for (const o of sampleOrders) {
    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        shippingAddress: o.shippingAddress,
        shippingCity: o.shippingCity,
        shippingPostalCode: o.shippingPostalCode,
        shippingCountry: 'United States',
        status: o.status,
        paymentStatus: o.paymentStatus,
        subtotal: o.subtotal,
        shippingFee: o.shippingFee,
        tax: o.tax,
        total: o.total,
        items: {
          create: o.items.map((it) => ({
            productId: it.product.id,
            variantId: it.variant ? it.variant.id : null,
            productName: it.product.name,
            variantDetails: it.variant ? `Size: ${it.variant.size}, Color: ${it.variant.color}` : 'Standard',
            unitPrice: it.price,
            quantity: it.quantity,
            subtotal: it.price * it.quantity,
          })),
        },
      },
    });
  }
  console.log(`📦 Seeded ${sampleOrders.length} sample orders.`);

  // 6. Sample Contact Messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Julian Hayes',
        email: 'julian@luxurygroup.com',
        subject: 'Bespoke corporate tailoring inquiry',
        message: 'Hello, we are interested in outfitting our private concierge team with the Atelier Double-Breasted overcoats. Do you offer corporate bulk orders?',
        isRead: false,
      },
      {
        name: 'Claire Dupont',
        email: 'claire@dupont.fr',
        subject: 'Fabric sourcing and sustainability',
        message: 'Could you share more information about the certification of your Mongolian cashmere yarn? Truly love the editorial direction.',
        isRead: true,
      },
    ],
  });

  // 7. Sample Newsletter Subscriptions
  await prisma.newsletterSubscription.createMany({
    data: [
      { email: 'editorial@vogue-sample.com' },
      { email: 'sarah.k@designstudio.io' },
      { email: 'matthew.b@fashionforward.com' },
    ],
  });

  console.log('✅ THREAD & CO. database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create collections
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { handle: 'hidden-homepage-featured-items' },
      update: {},
      create: {
        handle: 'hidden-homepage-featured-items',
        title: 'Featured Items',
        description: 'Featured products for homepage',
        seoTitle: 'Featured Products',
        seoDescription: 'Discover our featured products'
      }
    }),
    prisma.collection.upsert({
      where: { handle: 'electronics' },
      update: {},
      create: {
        handle: 'electronics',
        title: 'Electronics',
        description: 'Latest electronic devices',
        seoTitle: 'Electronics Store',
        seoDescription: 'Shop the latest electronics'
      }
    }),
    prisma.collection.upsert({
      where: { handle: 'clothing' },
      update: {},
      create: {
        handle: 'clothing',
        title: 'Clothing',
        description: 'Fashion and apparel',
        seoTitle: 'Fashion Store',
        seoDescription: 'Shop the latest fashion trends'
      }
    })
  ]);

  console.log('✅ Collections created');

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { handle: 'wireless-headphones' },
      update: {},
      create: {
        handle: 'wireless-headphones',
        title: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation',
        descriptionHtml: '<p>Premium wireless headphones with noise cancellation</p>',
        availableForSale: true,
        tags: JSON.stringify(['electronics', 'audio', 'wireless']),
        seoTitle: 'Wireless Headphones',
        seoDescription: 'Premium wireless headphones with noise cancellation',
        variants: {
          create: [
            {
              title: 'Default',
              price: 199.99,
              currencyCode: 'USD',
              availableForSale: true,
              selectedOptions: JSON.stringify([
                { name: 'Color', value: 'Black' },
                { name: 'Size', value: 'Standard' }
              ])
            }
          ]
        },
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
              altText: 'Wireless Headphones',
              width: 800,
              height: 600,
              isFeatured: true
            }
          ]
        },
        collections: {
          create: [
            { collectionId: collections[0].id },
            { collectionId: collections[1].id }
          ]
        }
      }
    }),
    prisma.product.upsert({
      where: { handle: 'smartphone' },
      update: {},
      create: {
        handle: 'smartphone',
        title: 'Smartphone Pro',
        description: 'Latest smartphone with advanced features',
        descriptionHtml: '<p>Latest smartphone with advanced features</p>',
        availableForSale: true,
        tags: JSON.stringify(['electronics', 'mobile', 'smartphone']),
        seoTitle: 'Smartphone Pro',
        seoDescription: 'Latest smartphone with advanced features',
        variants: {
          create: [
            {
              title: '128GB Black',
              price: 799.99,
              currencyCode: 'USD',
              availableForSale: true,
              selectedOptions: JSON.stringify([
                { name: 'Storage', value: '128GB' },
                { name: 'Color', value: 'Black' }
              ])
            },
            {
              title: '256GB White',
              price: 899.99,
              currencyCode: 'USD',
              availableForSale: true,
              selectedOptions: JSON.stringify([
                { name: 'Storage', value: '256GB' },
                { name: 'Color', value: 'White' }
              ])
            }
          ]
        },
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
              altText: 'Smartphone Pro',
              width: 800,
              height: 600,
              isFeatured: true
            }
          ]
        },
        collections: {
          create: [
            { collectionId: collections[0].id },
            { collectionId: collections[1].id }
          ]
        }
      }
    }),
    prisma.product.upsert({
      where: { handle: 'cotton-tshirt' },
      update: {},
      create: {
        handle: 'cotton-tshirt',
        title: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt in various colors',
        descriptionHtml: '<p>Comfortable cotton t-shirt in various colors</p>',
        availableForSale: true,
        tags: JSON.stringify(['clothing', 'casual', 'cotton']),
        seoTitle: 'Cotton T-Shirt',
        seoDescription: 'Comfortable cotton t-shirt in various colors',
        variants: {
          create: [
            {
              title: 'Small Blue',
              price: 29.99,
              currencyCode: 'USD',
              availableForSale: true,
              selectedOptions: JSON.stringify([
                { name: 'Size', value: 'Small' },
                { name: 'Color', value: 'Blue' }
              ])
            },
            {
              title: 'Medium Red',
              price: 29.99,
              currencyCode: 'USD',
              availableForSale: true,
              selectedOptions: JSON.stringify([
                { name: 'Size', value: 'Medium' },
                { name: 'Color', value: 'Red' }
              ])
            }
          ]
        },
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
              altText: 'Cotton T-Shirt',
              width: 800,
              height: 600,
              isFeatured: true
            }
          ]
        },
        collections: {
          create: [
            { collectionId: collections[0].id },
            { collectionId: collections[2].id }
          ]
        }
      }
    })
  ]);

  console.log('✅ Products created');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
// src/app/products/[slug]/page.tsx
import Image from 'next/image';
import { getShopifyProduct } from '../../lib/shopify';
import { ProductView } from '../../types'; // Import our new unified type

// This is our new data layer function, as outlined in your plan
async function getProductData(slug: string): Promise<ProductView | null> {
  // 1. Fetch content from Payload
  const payloadRes = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/products?where[slug][equals]=${slug}&depth=1`, { cache: 'no-store' });
  if (!payloadRes.ok) return null;
  const payloadData = await payloadRes.json();
  const payloadProduct = payloadData.docs[0];
  if (!payloadProduct) return null;

  // 2. Fetch commerce data from Shopify
  const shopifyProduct = await getShopifyProduct(payloadProduct.shopifyProductID);
  if (!shopifyProduct) return null;

  // 3. Merge into our unified ProductView object
  const serverUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace('/api', '');
  const imageUrl = `${serverUrl}${payloadProduct.productImages[0].image.url}`;

  const productView: ProductView = {
    id: payloadProduct.id,
    title: payloadProduct.title,
    slug: payloadProduct.slug,
    description: payloadProduct.description,
    imageUrl: imageUrl,
    altText: payloadProduct.productImages[0].image.alt || payloadProduct.title,
    price: shopifyProduct.priceRange.minVariantPrice.amount,
    currencyCode: shopifyProduct.priceRange.minVariantPrice.currencyCode,
  };

  return productView;
}

// Our page component is now much cleaner
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductData(params.slug);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.altText}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-3xl mb-6">{product.price} {product.currencyCode}</p>
          {/* We'll render the rich text description here later */}
          <div className="prose lg:prose-xl">
             <p>A beautiful product description will go here.</p>
          </div>
          {/* Add to Cart button will go here */}
        </div>
      </div>
    </div>
  );
}
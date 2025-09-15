// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link'; // <-- Import the Link component

// --- Update the Product interface to include the slug ---
interface Media {
  id: string;
  url: string;
  alt: string;
}

interface Product {
  id: string;
  title: string;
  slug: string; // <-- Make sure slug is here
  productImages: {
    image: Media;
    id?: string;
  }[];
}

async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL;
    const res = await fetch(`${apiUrl}/products?depth=1`, { cache: 'no-store' });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.statusText);
      return [];
    }
    const data = await res.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const serverUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace('/api', '');

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">DRIP</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const relativeImageUrl = product.productImages?.[0]?.image?.url;
          const imageUrl = relativeImageUrl ? `${serverUrl}${relativeImageUrl}` : '';

          return (
            // --- THE FIX IS HERE: Wrap the div in a Link component ---
            <Link href={`/products/${product.slug}`} key={product.id} className="block">
              <div className="border rounded-lg shadow-sm bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                {imageUrl && (
                  <div className="relative w-full h-80">
                    <Image
                      src={imageUrl}
                      alt={product.productImages?.[0]?.image?.alt || product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-700">{product.title}</h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
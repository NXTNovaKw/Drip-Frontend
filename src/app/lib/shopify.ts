// src/lib/shopify.ts
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-04',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// The GraphQL query to get a single product by its ID
const singleProductQuery = `
  query getProductById($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        title
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

// The function that executes the query
export async function getShopifyProduct(productId: string) {
  const shopifyId = `gid://shopify/Product/${productId}`;

  const { data, errors } = await client.request(singleProductQuery, {
    variables: {
      id: shopifyId,
    },
  });

  if (errors) {
    console.error("Shopify API Errors:", errors);
    return null;
  }

  return data.node;
}
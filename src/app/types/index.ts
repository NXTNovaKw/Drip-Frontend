// src/types/index.ts

// A simplified but type-safe representation of the Payload Rich Text object
export type RichText = {
  root: {
    children: {
      type: string;
      version: number;
      [k: string]: unknown;
    }[];
    direction: string | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
  [k: string]: unknown;
} | null // It can also be null if the field is empty

// The unified Product shape that our UI components will use
export interface ProductView {
  id: string; // from Payload
  title: string; // from Payload
  slug: string; // from Payload
  description: RichText; // Use the new, correct type
  imageUrl: string; // derived from Payload
  altText: string; // derived from Payload
  
  price: string; // from Shopify
  currencyCode: string; // from Shopify
  // Add more fields as needed
}
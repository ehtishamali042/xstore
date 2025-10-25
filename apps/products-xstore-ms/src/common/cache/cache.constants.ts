export const CACHE_KEYS = {
  PRODUCT: (id: string) => `product:${id}`,
  PRODUCTS_ALL: 'products:all',
} as const;

export const CACHE_TTL = {
  PRODUCT: 300, // 5 minutes in seconds
  PRODUCTS_ALL: 120, // 2 minutes in seconds
} as const;

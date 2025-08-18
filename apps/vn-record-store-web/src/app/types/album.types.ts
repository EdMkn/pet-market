// Auto-generated from Prisma schema - DO NOT EDIT MANUALLY
// Run: npm run generate:types to regenerate

export enum OrderStatus {
  PENDING = 'PENDING',
  STARTED_DELIVERY = 'STARTED_DELIVERY',
  DELIVERED = 'DELIVERED',
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  description: string;
  price: number;
  image: string;
  genre: string;
  releaseYear: number;
  trackCount: number;
  duration: string;
  stripePriceId: string;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  status: OrderStatus;
  totalAmount: number;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlbumOrderItem {
  id: string;
  orderId: string;
  albumId: string;
  quantity: number;
  price: number;
}

// Custom frontend types
export interface CartItem extends Album {
  quantity: number;
}

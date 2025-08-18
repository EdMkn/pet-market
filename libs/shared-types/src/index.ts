// Shared types for the vinyl records store application
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
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
}

export interface AlbumOrderItem {
  id: string;
  albumId: string;
  orderId: string;
  quantity: number;
  price: number;
  album?: Album;
}

export interface Order {
  id: string;
  stripeSessionId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items?: AlbumOrderItem[];
}

// Cart item type for frontend
export interface CartItem extends Album {
  quantity: number;
} 
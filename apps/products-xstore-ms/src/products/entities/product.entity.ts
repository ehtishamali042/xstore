export class Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

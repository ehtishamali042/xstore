import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from '../common/cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../common/cache/cache.constants';

@Injectable()
export class ProductsService {
  constructor(private readonly cacheService: CacheService) {}

  private products: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop for developers',
      price: 1299.99,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with long battery life',
      price: 29.99,
      stock: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with cherry MX switches',
      price: 149.99,
      stock: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with multiple ports',
      price: 49.99,
      stock: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'Monitor Stand',
      description: 'Adjustable monitor stand with storage',
      price: 79.99,
      stock: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: uuidv4(),
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.push(newProduct);

    // Invalidate cache after creating a product
    this.cacheService.del(CACHE_KEYS.PRODUCTS_ALL).catch((err) => {
      console.error('Failed to invalidate cache:', err);
    });

    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    // Try to get from cache first
    const cachedProducts = await this.cacheService.get<Product[]>(
      CACHE_KEYS.PRODUCTS_ALL,
    );

    if (cachedProducts) {
      console.log('Cache HIT: products:all');
      return cachedProducts;
    }

    console.log('Cache MISS: products:all');

    // If not in cache, get from "database" (in-memory array)
    const products = this.products;

    // Store in cache for next time
    await this.cacheService.set(
      CACHE_KEYS.PRODUCTS_ALL,
      products,
      CACHE_TTL.PRODUCTS_ALL * 1000,
    );

    return products;
  }

  async findOne(id: string): Promise<Product> {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.PRODUCT(id);
    const cachedProduct = await this.cacheService.get<Product>(cacheKey);

    if (cachedProduct) {
      console.log(`Cache HIT: product:${id}`);
      return cachedProduct;
    }

    console.log(`Cache MISS: product:${id}`);

    // If not in cache, get from "database"
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Store in cache for next time
    await this.cacheService.set(cacheKey, product, CACHE_TTL.PRODUCT * 1000);

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct: Product = {
      ...this.products[productIndex],
      ...updateProductDto,
      updatedAt: new Date(),
    };

    this.products[productIndex] = updatedProduct;

    // Invalidate cache after update
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.PRODUCT(id)),
      this.cacheService.del(CACHE_KEYS.PRODUCTS_ALL),
    ]);

    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string }> {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.products.splice(productIndex, 1);

    // Invalidate cache after delete
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.PRODUCT(id)),
      this.cacheService.del(CACHE_KEYS.PRODUCTS_ALL),
    ]);

    return { message: `Product with ID ${id} has been deleted` };
  }
}

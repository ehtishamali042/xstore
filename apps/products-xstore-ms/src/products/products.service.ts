import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CacheService } from '../common/cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../common/cache/cache.constants';
import { PrismaService } from '../common/prisma/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data: createProductDto,
    });

    // Invalidate cache after creating a new product
    await this.cacheService.del(CACHE_KEYS.PRODUCTS_ALL);

    return ProductsService.toEntity(newProduct);
  }

  async findAll(): Promise<Product[]> {
    try {
      const cachedProducts = await this.cacheService.get(
        CACHE_KEYS.PRODUCTS_ALL,
      );
      if (
        Array.isArray(cachedProducts) &&
        cachedProducts.length > 0 &&
        (cachedProducts[0] as Product).id
      ) {
        return (cachedProducts as Product[]).map((product) =>
          ProductsService.toEntity(product),
        );
      }
      const products = await this.prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      await this.cacheService.set(
        CACHE_KEYS.PRODUCTS_ALL,
        products,
        CACHE_TTL.PRODUCTS_ALL * 1000,
      );
      return products.map((product) => ProductsService.toEntity(product));
    } catch (error) {
      console.error('Error in findAll:', error);
      return [];
    }
  }

  async findOne(id: string): Promise<Product> {
    const cacheKey = CACHE_KEYS.PRODUCT(id);
    const cachedProduct = await this.cacheService.get(cacheKey);
    if (cachedProduct && (cachedProduct as Product).id) {
      return ProductsService.toEntity(cachedProduct as Product);
    }
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.cacheService.set(cacheKey, product, CACHE_TTL.PRODUCT * 1000);
    return ProductsService.toEntity(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        updatedAt: new Date(),
      },
    });
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.PRODUCT(id)),
      this.cacheService.del(CACHE_KEYS.PRODUCTS_ALL),
    ]);
    return ProductsService.toEntity(updatedProduct);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({
      where: { id },
    });

    // Invalidate cache after delete
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.PRODUCT(id)),
      this.cacheService.del(CACHE_KEYS.PRODUCTS_ALL),
    ]);

    return { message: `Product with ID ${id} has been deleted` };
  }

  private static toEntity(dbProduct: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description ?? undefined,
      price: dbProduct.price,
      stock: dbProduct.stock,
      createdAt: dbProduct.createdAt,
      updatedAt: dbProduct.updatedAt,
    };
  }
}

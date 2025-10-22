import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: uuidv4(),
      name: 'Laptop',
      description: 'High-performance laptop for developers',
      price: 1299.99,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with long battery life',
      price: 29.99,
      stock: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with cherry MX switches',
      price: 149.99,
      stock: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with multiple ports',
      price: 49.99,
      stock: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
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
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto): Product {
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
    return updatedProduct;
  }

  remove(id: string): { message: string } {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.products.splice(productIndex, 1);
    return { message: `Product with ID ${id} has been deleted` };
  }
}

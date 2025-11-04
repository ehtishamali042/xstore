import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class OrdersService {
  // In-memory JSON array to store orders
  private orders: Order[] = [];

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleOrders: Order[] = [
      {
        id: uuidv4(),
        userId: "user-123",
        productId: "prod-456",
        quantity: 2,
        totalPrice: 199.98,
        status: "pending",
        shippingAddress: "123 Main St, City, Country",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: "user-124",
        productId: "prod-789",
        quantity: 1,
        totalPrice: 49.99,
        status: "confirmed",
        shippingAddress: "456 Oak Ave, Town, Country",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.orders = sampleOrders;
  }

  create(createOrderDto: CreateOrderDto): Order {
    const newOrder: Order = {
      id: createOrderDto.id || uuidv4(),
      userId: createOrderDto.userId,
      productId: createOrderDto.productId,
      quantity: createOrderDto.quantity,
      totalPrice: createOrderDto.totalPrice,
      status: createOrderDto.status || "pending",
      shippingAddress: createOrderDto.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: string): Order {
    const order = this.orders.find((order) => order.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  findByUserId(userId: string): Order[] {
    return this.orders.filter((order) => order.userId === userId);
  }

  update(id: string, updateOrderDto: UpdateOrderDto): Order {
    const orderIndex = this.orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updatedOrder: Order = {
      ...this.orders[orderIndex],
      ...updateOrderDto,
      updatedAt: new Date(),
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  remove(id: string): { message: string } {
    const orderIndex = this.orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.orders.splice(orderIndex, 1);
    return { message: `Order with ID ${id} has been deleted successfully` };
  }

  // Additional helper methods
  updateStatus(
    id: string,
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  ): Order {
    return this.update(id, { status });
  }

  getOrdersByStatus(
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  ): Order[] {
    return this.orders.filter((order) => order.status === status);
  }
}

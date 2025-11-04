import { Order } from "../entities/order.entity";

export class OrderResponseDto {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = order.id;
    dto.userId = order.userId;
    dto.productId = order.productId;
    dto.quantity = order.quantity;
    dto.totalPrice = order.totalPrice;
    dto.status = order.status;
    dto.shippingAddress = order.shippingAddress;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    return dto;
  }
}

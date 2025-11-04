import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Query,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto): Order {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Req() req: any, @Query("userId") userId?: string): Order[] {
    // Log user from JWT token
    console.log("User from request:", req?.user);

    // If userId query param is provided, filter by user
    if (userId) {
      return this.ordersService.findByUserId(userId);
    }

    return this.ordersService.findAll();
  }

  @Get("status/:status")
  findByStatus(
    @Param("status")
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  ): Order[] {
    return this.ordersService.getOrdersByStatus(status);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Order {
    return this.ordersService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Order {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Put(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status")
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  ): Order {
    return this.ordersService.updateStatus(id, status);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(@Param("id") id: string): { message: string } {
    return this.ordersService.remove(id);
  }
}

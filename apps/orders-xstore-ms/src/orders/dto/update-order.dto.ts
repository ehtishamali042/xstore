import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderDto } from "./create-order.dto";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
  @IsOptional()
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

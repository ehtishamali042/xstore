import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsEnum,
  IsUUID,
} from "class-validator";

export class CreateOrderDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  userId: string;

  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsEnum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
  @IsOptional()
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

  @IsString()
  @IsOptional()
  shippingAddress?: string;
}

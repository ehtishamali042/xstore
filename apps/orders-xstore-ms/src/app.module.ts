import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OrdersModule } from "./orders/orders.module";
import { CommonModule } from "./common/common.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import * as path from "path";

@Module({
  imports: [
    // Configure environment variables
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, "../../../.env"), // Correct path to root .env
      isGlobal: true,
    }),
    OrdersModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CacheModule } from '../common/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

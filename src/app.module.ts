import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './data-access/connection-option';
import { ProductGroupModel, ProductModel } from './data-access';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    TypeOrmModule.forFeature([ProductModel, ProductGroupModel]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

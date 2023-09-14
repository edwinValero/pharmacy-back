import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './data-access/connection-option';
import { ProductModel } from './data-access';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(connectionOptions),
    TypeOrmModule.forFeature([ProductModel]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

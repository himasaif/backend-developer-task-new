import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MembersModule } from './modules/members/members.module';
import { ProductsModule } from './modules/products/products.module';
import { ShopsModule } from './modules/shops/shops.module';

import { JoiPipeModule } from 'nestjs-joi';

@Module({
  imports: [
    // ENV CONFIG
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // CACHE MODULE (GLOBAL BONUS)
    CacheModule.register({
      ttl: 10, // seconds
      max: 100,
      isGlobal: true,
    }),

    // DATABASE
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        uri: config.get<string>('DATABASE_URL'),
        sync: { alter: false },
        autoLoadModels: true,
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    // VALIDATION
    JoiPipeModule.forRoot({
      pipeOpts: {
        defaultValidationOptions: {
          abortEarly: false,
          allowUnknown: false,
        },
      },
    }),

    // MODULES
    MembersModule,
    ProductsModule,
    ShopsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
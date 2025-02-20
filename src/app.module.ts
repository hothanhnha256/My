import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prismaC/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    BookmarkModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

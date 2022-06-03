import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TokensService } from '../services/tokens.service';

import { TokensController } from '../controllers/tokens.controller';

import { UserModule } from './user.module';

@Module({
    imports: [
      UserModule,
      PassportModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async () => ({
          signOptions: {
            expiresIn: 1000 * 60 * 15,
          },
            secret: 'test-app-access-token-secret',
        })
      })
    ],
    providers: [TokensService],
    exports: [TokensService],
    controllers: [TokensController],
})
export class TokensModule {}

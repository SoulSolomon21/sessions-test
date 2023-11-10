import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { SessionModule } from 'nestjs-session';
import * as passport from 'passport';
import * as expressSession from 'express-session'
import { UserSerializer } from './user.serializer';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true
    })
  ],
  providers: [AuthService, LocalStrategy, UserSerializer],
  controllers: [AuthController]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        expressSession({
          secret: 'SOME SESSION SECRET',
          resave: false,
          saveUninitialized: false,
        }),
        passport.session()
      )
      .forRoutes('*')
  }
}

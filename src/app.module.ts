import { Module, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PubSubModule } from './pubsub/pubsub.module';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { FrameworkModule } from './framework/framework.module.';
import {
  verifySubscriptionToken,
  extractTokenFromConnectionParams,
} from './framework/helpers/subscription-auth.helper';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      path: '/graphql',
      subscriptions: {
        'graphql-ws': {
          onConnect: async (ctx: any) => {
            const token = extractTokenFromConnectionParams(
              ctx.connectionParams,
            );
            try {
              const user = token ? verifySubscriptionToken(token) : null;
              return { user };
            } catch (err) {
              console.warn('GraphQL-WS token error:', err.message);
              return {}; // anonymous
            }
          },
        },
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams: any) => {
            const token = extractTokenFromConnectionParams(connectionParams);
            try {
              if (!token) {
                throw new UnauthorizedException('Token is required');
              }
              const user = token ? verifySubscriptionToken(token) : null;
              return { user };
            } catch (err) {
              console.warn('Legacy WS token error:', err.message);
              throw new UnauthorizedException('Invalid token');
            }
          },
        },
      },

      context: (ctx: any) => {
        console.log('ctx ==> ', ctx);
        if (ctx.req) return { req: ctx.req };
        if (ctx.extra?.context) return ctx.extra.context;
        if (ctx.connection?.context) return ctx.connection.context;
        return {};
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT!,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),

    FrameworkModule,
    AuthModule,
    UserModule,
    PubSubModule,
  ],
})
export class AppModule {}

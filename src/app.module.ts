import { Module } from '@nestjs/common';
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
            console.log('🔌 graphql-ws connected', ctx.connectionParams);
            return {}; // allow anonymous
          },
        },

        'subscriptions-transport-ws': {
          onConnect: async (connectionParams: any) => {
            console.log('connectionParams ==> ', connectionParams);
            const token = connectionParams?.Authorization?.split(' ')[1];
            console.log('token ==>', token);

            const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH!;
            const publicKey = fs.readFileSync(
              join(process.cwd(), publicKeyPath ?? ''),
              'utf8',
            );

            if (!publicKey) {
              throw new Error('JWT public key not found or unreadable');
            }

            try {
              const user = jwt.verify(token, publicKey, {
                algorithms: ['RS256'],
              });

              return { user }; // ✅ connection continues
            } catch (error) {
              console.warn('Invalid legacy token', error.message);
              throw new Error('Unauthorized: Invalid token'); // ❌ connection is rejected
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

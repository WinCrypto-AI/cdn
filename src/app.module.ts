import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { configEnv } from './@config/env';
import * as allModules from './x-modules';
import { ContextMiddleware, LoggerMiddleware } from './@systems/middlewares';
import { TechUtils } from './@core/utils';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

const envConfig = configEnv();
const multipleDatabaseModule: DynamicModule[] = TechUtils.dbModules(envConfig.DBS);

const { JWT_EXPIRY, JWT_SECRET } = configEnv();

const globalModules = [
  JwtModule.register({
    global: true,
    secret: JWT_SECRET,
    signOptions: { expiresIn: JWT_EXPIRY, algorithm: 'HS256' },
  }),
  ScheduleModule.forRoot(),
  CacheModule.register({
    isGlobal: true,
    store: 'memory',
  }),
  I18nModule.forRootAsync({
    useFactory: () => ({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: join(__dirname, '/assets/locales/'),
        watch: true,
      },
      typesOutputPath: join(__dirname, '../src/assets/i18n.generated.ts'),
    }),
    resolvers: [
      { use: QueryResolver, options: ['lang'] },
      AcceptLanguageResolver,
      new HeaderResolver(['x-lang']),
    ],
  }),
];
const modules = Object.values(allModules);
@Module({
  imports: [...multipleDatabaseModule, ...globalModules, ...modules],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware, LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

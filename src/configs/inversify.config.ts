import { App } from '@/app';
import { BaseController } from '@/controllers/base.controller';
import { ContainerModule, Container as InversifyContainer, interfaces } from 'inversify';
import controllers from '@/controllers';
import { BaseRepository } from '@/repositories/base.repository';
import { Session } from '@/entities/session.entity';
import { Database } from './database.config';
import { FakeRepository } from '@/repositories/fake.repository';
import { AppConfig } from './app.config';
import { BaseService, ServiceSymbols } from '@/services/base.service';
import { OwnerclanService } from '@/services/ownerclan.service';
import Axios from 'axios';
import { UsePuppeteer } from '@/services/browser.service';
import { UserService } from '@/services/user.service';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

class Container {
  private readonly container: InversifyContainer = new InversifyContainer({ defaultScope: 'Singleton' });

  constructor() {
    this.register();
  }

  public getApp(): App {
    return this.container.get(App);
  }

  public getShopService(shopCode: keyof typeof ServiceSymbols | string): BaseService {
    return this.container.get(shopCode);
  }

  private register(): void {
    this.container.load(this.getGeneralModule());
    this.container.load(this.getRepositoriesModule());
    this.container.load(this.getControllersModule());
    this.container.load(this.getServicesModule());
    this.container.load(this.getMiddlewaresModule());

    this.container.bind<App>(App).toSelf();
  }

  private getGeneralModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AppConfig>(AppConfig).toSelf();
      bind<Database>(Database).toSelf();
    });
  }

  private getRepositoriesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseRepository<Session>>(BaseRepository).toConstantValue(this.container.get(Database).getRepository(Session));
      bind<FakeRepository>(FakeRepository).toSelf();
    });
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => Object.keys(controllers).map((key) => bind<BaseController>(BaseController).to(controllers[key])));
  }

  private getServicesModule(): ContainerModule {
    return new ContainerModule(async (bind: interfaces.Bind) => {
      bind<UserService>(ServiceSymbols.user).to(UserService);
      bind<OwnerclanService>(ServiceSymbols.ownerclan).to(OwnerclanService);

      const browser = await UsePuppeteer.createInstance({
        headless: 'new',
        defaultViewport: null,
        devtools: false,
        args: [
          '--no-sandbox', //
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'
        ]
      });
      bind(ServiceSymbols.browser).toConstantValue(browser);
      bind(ServiceSymbols.http).toConstantValue(Axios);
    });
  }

  private getMiddlewaresModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AuthMiddleware>(AuthMiddleware).toSelf();
    });
  }
}

export const container = new Container();

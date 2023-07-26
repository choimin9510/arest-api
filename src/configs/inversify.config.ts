import { App } from '@/app';
import { BaseController } from '@/controllers/base.controller';
import { OrderController } from '@/controllers/order.controller';
import { ContainerModule, Container as InversifyContainer, interfaces } from 'inversify';

export class Container {
  private readonly container: InversifyContainer = new InversifyContainer();

  constructor() {
    this.register();
  }

  public getApp(): App {
    return this.container.get(App);
  }

  private register(): void {
    this.container.load(this.getControllersModule());

    this.container.bind<App>(App).toSelf();
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseController>(BaseController).to(OrderController);
    });
  }
}

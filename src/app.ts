import express from 'express';
import { injectable, multiInject, inject } from 'inversify';
import helmet from 'helmet';
import cors from 'cors';
import { DevError } from './errors/dev.error';
import { BaseController } from './controllers/base.controller';
import { Database } from './configs/database.config';
import { AppConfig } from './configs/app.config';

@injectable()
export class App {
  private app: express.Application = express();
  private isInitialized: boolean = false;

  @inject(AppConfig) private readonly appConfig: AppConfig;
  @inject(Database) private readonly database: Database;
  @multiInject(BaseController) private readonly controllers: BaseController[];

  public initialize(): void {
    this.appConfig.initialize();
    this.database.connect();

    this.initializePreMiddlewares();
    this.initializeControllers();

    this.isInitialized = true;
  }

  public listen() {
    if (!this.isInitialized) {
      throw new DevError('Call initialize() before.');
    }

    const server = this.app.listen(1041, () => {
      // console.log(server.address());
    });
  }

  private initializePreMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeControllers(): void {
    this.controllers.forEach((controller: BaseController) => {
      this.app.use('/api', controller.router);
    });
  }
}

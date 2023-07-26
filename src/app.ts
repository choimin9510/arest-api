import express from 'express';
import { injectable, multiInject } from 'inversify';
import helmet from 'helmet';
import cors from 'cors';
import { DevError } from './errors/dev.error';
import { BaseController } from './controllers/base.controller';

@injectable()
export class App {
  private app: express.Application = express();
  private isInitialized: boolean = false;
  @multiInject(BaseController) private controllers: BaseController[];

  public initialize(process: NodeJS.Process): void {
    this.initializePreMiddlewares();
    this.initializeControllers();

    this.isInitialized = true;
  }

  public listen() {
    if (!this.isInitialized) {
      throw new DevError('Call initialize() before.');
    }

    const server = this.app.listen(1041, () => {
      console.log(server.address());
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

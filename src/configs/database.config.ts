import { inject, injectable } from 'inversify';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { AppConfig } from './app.config';

@injectable()
export class Database {
  private AppDataSource: DataSource;

  constructor(@inject(AppConfig) private readonly appConfig: AppConfig) {
    this.AppDataSource = new DataSource({
      type: 'mysql',
      host: this.appConfig.mysqlHost,
      port: this.appConfig.mysqlPort,
      username: this.appConfig.mysqlUsername,
      password: this.appConfig.mysqlPassword,
      database: this.appConfig.mysqlDatabase,
      synchronize: true,
      entities: [__dirname + '/../entities/*.entity{.ts,.js}']
    });
  }

  public connect() {
    this.AppDataSource.initialize();
    // .then(() => {
    //   console.log('success');
    // })
    // .catch((error) => console.log(error));
  }

  getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>) {
    return this.AppDataSource.getRepository(entity);
  }
}

import { injectable } from 'inversify';
import { cleanEnv, str, port } from 'envalid';

@injectable()
export class AppConfig {
  private _mysqlHost: string;
  get mysqlHost() {
    return this._mysqlHost;
  }

  private _mysqlPort: number;
  get mysqlPort() {
    return this._mysqlPort;
  }

  private _mysqlUsername: string;
  get mysqlUsername() {
    return this._mysqlUsername;
  }

  private _mysqlPassword: string;
  get mysqlPassword() {
    return this._mysqlPassword;
  }

  private _mysqlDatabase: string;
  get mysqlDatabase() {
    return this._mysqlDatabase;
  }

  private _serverPort: number;
  get serverPort() {
    return this._serverPort;
  }

  constructor() {
    this.initialize();
  }

  public initialize() {
    const env = cleanEnv(process.env, {
      MYSQL_HOST: str({ default: 'localhost' }),
      MYSQL_PORT: port({ default: 3306 }),
      MYSQL_USERNAME: str({ default: 'root' }),
      MYSQL_PASSWORD: str({ default: 'admin' }),
      MYSQL_DATABASE: str({ default: 'arestapi' }),
      SERVER_PORT: port({ default: 1041 })
    });

    this._mysqlHost = env.MYSQL_HOST;
    this._mysqlPort = env.MYSQL_PORT;
    this._mysqlUsername = env.MYSQL_USERNAME;
    this._mysqlPassword = env.MYSQL_PASSWORD;
    this._mysqlDatabase = env.MYSQL_DATABASE;
    this._serverPort = env.SERVER_PORT;
  }
}

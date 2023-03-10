
enum APP_ENVS {
    PRODUCTION= "production",
    DEVELOPMENT= "development"
}

const DEFAULT_PORT = 8081;

const SALT_LEN = 8;

const DEFAULT_PASSWORD = "password"
const DEFAULT_SUPER_PASSWORD = "password"

const DEFAULT_JWT_SECRET = "0gKLsQiNRMrAMaO8mhIaV96GQhRyLSiBTKxHYBqOkSB7pRyHzZ3hBLIPXuS4amm";

const DEFAULT_MONGO_URL = "mongodb://mongo1:27017?directConnection=true";

export class EnvVars {

  get serverPort(): number {
    return parseInt(process.env.PORT as string, 10) || DEFAULT_PORT;
  }

  get env(): APP_ENVS {
    return process.env.NODE_ENV as APP_ENVS || APP_ENVS.DEVELOPMENT;
  }

  get isProduction(): boolean {
    return this.env === APP_ENVS.PRODUCTION;
  }

  get isDevelopement(): boolean {
    return this.env === APP_ENVS.DEVELOPMENT;
  }

  get dbConnectionUrl(): string {
    return process.env.MONGO_URL || DEFAULT_MONGO_URL;
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  }

  get saltLen(): number {
    return parseInt(process.env.SALT_LEN as string, 10) || SALT_LEN;
  }

  get defaultPassword(): string {
    return process.env.DEFAULT_PASSWORD as string || DEFAULT_PASSWORD;
  }

  get defaultSuperPassword(): string {
    return process.env.DEFAULT_SUPER_PASSWORD as string || DEFAULT_SUPER_PASSWORD;
  }
}

const envVars = new EnvVars();

export default envVars;

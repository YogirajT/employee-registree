import "reflect-metadata"
import dotEnv from "dotenv";
dotEnv.config();
import RestServer from "./presentation";
import container from "./common/inversify-containers";
import { EnvVars } from "./Env";
import { IocConainerTypes } from "./common/inversify-containers/types";

const env = container.get<EnvVars>(
    IocConainerTypes.Env
  );

const server = new RestServer(env.serverPort).start();

export default server;
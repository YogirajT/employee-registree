import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import router from "./routes";
import container from "../common/inversify-containers";
import PassportService from "../service/passport.service";
import { IocConainerTypes } from "../common/inversify-containers/types";
import { errorHandler } from "./errors";

const app = new Koa();

const passportService = container.get<PassportService>(
  IocConainerTypes.PassportService
);

app
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
  .use(logger())
  .use(bodyParser())
  .use(errorHandler())
  .use(passportService.initialize())
  .use(router.routes())
  .use(router.allowedMethods());

export default app;

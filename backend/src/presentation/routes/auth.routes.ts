import Router from "koa-router";
import container from "../../common/inversify-containers";
import { IocConainerTypes } from "../../common/inversify-containers/types";
import { HttpStatus, InternalServerError, UnauthorizedError } from "../errors";
import AuthController from "../controllers/auth.controller";

const router = new Router();

const controller = container.get<AuthController>(
  IocConainerTypes.AuthController
);

router.post("/signup", async (ctx, next) => { await controller.signup(ctx, next); });
router.post("/login", async (ctx, next) => { await controller.login(ctx, next); });

export default router.routes();

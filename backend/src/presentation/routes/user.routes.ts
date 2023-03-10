import Router from "koa-router";
import container from "../../common/inversify-containers";
import UserController from "../controllers/users.controller";
import { IocConainerTypes } from "../../common/inversify-containers/types";
import PassportService from "../../service/passport.service";
import {
  adminAuthMiddleware,
  authMiddleware,
} from "../../domain/middlewares/auth.middleware";

const router = new Router();

const controller = container.get<UserController>(
  IocConainerTypes.UserController
);
const passportService = container.get<PassportService>(
  IocConainerTypes.PassportService
);

router.get(
  "/:id/action-logs",
  passportService.getPassportInstance().authenticate("jwt", { session: false }),
  authMiddleware(),
  async (ctx) => {
    await controller.getActionLogs(ctx);
  }
);

router.get(
  "/:id",
  passportService.getPassportInstance().authenticate("jwt", { session: false }),
  authMiddleware(),
  async (ctx) => {
    await controller.getById(ctx);
  }
);

router.put(
  "/:id",
  passportService.getPassportInstance().authenticate("jwt", { session: false }),
  adminAuthMiddleware(),
  async (ctx) => {
    //@ts-ignore
    await controller.updateById(ctx);
  }
);

router.delete(
  "/:id",
  passportService.getPassportInstance().authenticate("jwt", { session: false }),
  adminAuthMiddleware(),
  async (ctx) => {
    await controller.deleteById(ctx);
  }
);

router.get("/", async (ctx) => {
  await controller.get(ctx);
});

router.post(
  "/",
  passportService.getPassportInstance().authenticate("jwt", { session: false }),
  adminAuthMiddleware(),
  async (ctx) => {
    await controller.save(ctx);
  }
);

export default router.routes();

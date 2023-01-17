import Router from "koa-router";
import container from "../../common/inversify-containers";
import DepartmentController from "../controllers/department.controller";
import { IocConainerTypes } from "../../common/inversify-containers/types";
import PassportService from "../../service/passport.service";
import { authMiddleware } from "../../domain/middlewares/auth.middleware";

const router = new Router();

const controller = container.get<DepartmentController>(
  IocConainerTypes.DepartmentController
);

const passportService = container.get<PassportService>(
  IocConainerTypes.PassportService
);

router.get("/:id", async (ctx) => {
  await controller.getById(ctx);
});
router.put(
  "/:id",
  passportService.getPassportInstance().authenticate("jwt", { session: false }),
  authMiddleware(),
  async (ctx) => {
    await controller.updateById(ctx);
  }
);

router.delete(
  "/:id",
  passportService.getPassportInstance().authenticate("jwt", { session: false }),
  authMiddleware(),
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
  authMiddleware(),
  async (ctx) => {
    await controller.save(ctx);
  }
);

export default router.routes();

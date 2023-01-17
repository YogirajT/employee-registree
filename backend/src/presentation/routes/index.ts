import Router from "koa-router";
import userRoutes from "./user.routes";
import departmentRoutes from "./department.routes";
import authRoutes from "./auth.routes";
import { HttpStatus } from "../errors";

const router = new Router();

router.get("/health", (ctx) => {
  ctx.body = "ok";
  ctx.status = HttpStatus.OK;
});
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/departments", departmentRoutes);
router.use("/api/v1/auth", authRoutes);

export default router;

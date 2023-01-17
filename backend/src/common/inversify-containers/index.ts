import { Container } from "inversify";
import envVars from "../../Env";
import MongoDB from "../../database/mongo";
import logger from "../logging";
import UserController from "../../presentation/controllers/users.controller";
import DepartmentRepository from "../../repositories/department.repository";
import ActionLogRepository from "../../repositories/action-log.repository";
import UserRepository from "../../repositories/user.repository";
import UserService from "../../service/user.service";
import DepartmentController from "../../presentation/controllers/department.controller";
import UserDomain from "../../domain/user.domain";
import { IocConainerTypes } from "./types";
import DepartmentService from "../../service/department.service";
import DepartmentDomain from "../../domain/department.domain";
import PassportService from "../../service/passport.service";
import AuthController from "../../presentation/controllers/auth.controller";
import ActionLogDomain from "../../domain/action-log.domain";

const container = new Container();

container.bind(IocConainerTypes.Env).toConstantValue(envVars);

/* database */
const db = new MongoDB(
  {
    url: envVars.dbConnectionUrl,
  },
  logger
);
db.connect();

container.bind(IocConainerTypes.MongoDB).toConstantValue(db);

/* Domain */
container.bind(IocConainerTypes.UserDomain).to(UserDomain);
container.bind(IocConainerTypes.DepartmentDomain).to(DepartmentDomain);
container.bind(IocConainerTypes.ActionLogDomain).to(ActionLogDomain);
container
  .bind(IocConainerTypes.PassportService)
  .to(PassportService)
  .inSingletonScope();

/* Services */
container.bind(IocConainerTypes.UserService).to(UserService);
container.bind(IocConainerTypes.DepartmentService).to(DepartmentService);

/* Repositories */
container.bind(IocConainerTypes.UserRepository).to(UserRepository);
container.bind(IocConainerTypes.DepartmentRepository).to(DepartmentRepository);
container.bind(IocConainerTypes.ActionLogRepository).to(ActionLogRepository);

/* Controllers */
container
  .bind(IocConainerTypes.UserController)
  .to(UserController)
  .inSingletonScope();
container
  .bind(IocConainerTypes.DepartmentController)
  .to(DepartmentController)
  .inSingletonScope();
container
  .bind(IocConainerTypes.AuthController)
  .to(AuthController)
  .inSingletonScope();

export default container;

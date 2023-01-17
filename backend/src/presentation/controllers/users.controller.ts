import { injectable, inject } from "inversify";
import { RouterContext } from "koa-router";
import { BadRequest, HttpStatus } from "../errors";
import UserDomain from "../../domain/user.domain";
import {
  userListRequestValidator,
  userSaveRequestValidator,
  userUpdateRequestValidator,
  validateMongoID,
} from "../../domain/validators/user.validator";
import { ObjectId } from "mongodb";
import { UserRole, UserSaveRequest } from "@employee-registree/config";
import { IocConainerTypes } from "../../common/inversify-containers/types";
import ActionLogDomain from "../../domain/action-log.domain";

@injectable()
export default class UserController {
  constructor(
    @inject(IocConainerTypes.UserDomain)
    private readonly _userDomain: UserDomain,
    @inject(IocConainerTypes.ActionLogDomain)
    private readonly _actiongLogDomain: ActionLogDomain
  ) {}

  async get(context: RouterContext<any, {}>): Promise<void> {
    const { department } = context.request.query;
    const filter = userListRequestValidator().cast({
      department: Array.isArray(department)
        ? department
        : department
        ? [department]
        : [],
    });

    if (!userListRequestValidator().validateSync(filter)) {
      throw new BadRequest();
    }

    context.body = await this._userDomain.getMany({
      department: filter.department || [],
    });

    context.status = HttpStatus.OK;
  }

  async save(context: RouterContext<any, {}>): Promise<void> {
    const { users } = context.request.body as { users: UserSaveRequest[] };

    if (!users?.length || !Array.isArray(users)) throw new BadRequest();

    const userSaveRequest = userSaveRequestValidator().validateSync(
      userSaveRequestValidator().cast(users)
    );

    await this._userDomain.save(userSaveRequest);

    context.body = "";
    context.status = HttpStatus.CREATED;
  }

  async getById(context: RouterContext<any, {}>): Promise<void> {
    const { id } = context.params;
    validateMongoID(id);

    context.body = await this._userDomain.getById(new ObjectId(id));
    context.status = HttpStatus.OK;
  }

  async updateById(context: RouterContext): Promise<void> {
    const { id } = context.params;
    const { user } = context.req as unknown as {
      user: { _id: ObjectId; role: UserRole };
    };
    validateMongoID(id);

    const userUpdate = userUpdateRequestValidator().validateSync(
      userUpdateRequestValidator().cast(context.request.body)
    );

    await this._userDomain.update(id, userUpdate, user._id, user.role);

    context.body = "";
    context.status = HttpStatus.NO_CONTENT;
  }

  async getActionLogs(context: RouterContext<any, {}>): Promise<void> {
    const { id } = context.params;
    validateMongoID(id);

    context.body = await this._actiongLogDomain.getDepartmentChangeLogByUser(new ObjectId(id));
    context.status = HttpStatus.OK;
  }

  async deleteById(context: RouterContext<any, {}>): Promise<void> {
    const { id } = context.params;
    validateMongoID(id);

    context.body = await this._userDomain.delete(id);
    context.status = HttpStatus.NO_CONTENT;
  }
}

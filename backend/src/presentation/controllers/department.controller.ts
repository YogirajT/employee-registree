import { injectable, inject } from "inversify";
import { RouterContext } from "koa-router";
import { BadRequest, HttpStatus } from "../errors";
import DepartmentDomain from "../../domain/department.domain";
import {
  departmentSaveRequestValidator,
  departmentUpdateRequestValidator,
} from "../../domain/validators/department.validator";
import { validateMongoID } from "../../domain/validators/user.validator";
import { ObjectId } from "mongodb";
import { IocConainerTypes } from "../../common/inversify-containers/types";

@injectable()
export default class DepartmentController {
  constructor(
    @inject(IocConainerTypes.DepartmentDomain)
    private readonly _departmentDomain: DepartmentDomain
  ) {}

  async get(context: RouterContext<any, {}>): Promise<void> {
    context.body = await this._departmentDomain.getMany();

    context.status = HttpStatus.OK;
  }

  async save(context: RouterContext<any, {}>): Promise<void> {
    const { name } = context.request.body as { name: string };

    if (!name || typeof name !== "string")
      throw new BadRequest();

    await this._departmentDomain.save([name]);

    context.body = "";
    context.status = HttpStatus.CREATED;
  }

  async getById(context: RouterContext<any, {}>): Promise<void> {
    const { id } = context.params;
    validateMongoID(id);

    context.body = await this._departmentDomain.getById(new ObjectId(id));
    context.status = HttpStatus.OK;
  }

  async updateById(context: RouterContext): Promise<void> {
    const { id } = context.params;
    validateMongoID(id);

    const departmentUpdate = departmentUpdateRequestValidator().validateSync(
      departmentUpdateRequestValidator().cast(context.request.body)
    );

    await this._departmentDomain.update(id, departmentUpdate);

    context.body = "";
    context.status = HttpStatus.NO_CONTENT;
  }

  async deleteById(context: RouterContext<any, {}>): Promise<void> {
    const { id } = context.params;
    validateMongoID(id);

    context.body = await this._departmentDomain.delete(id);
    context.status = HttpStatus.NO_CONTENT;
  }
}

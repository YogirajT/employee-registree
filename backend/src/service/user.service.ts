import UserRepository from "../repositories/user.repository";
import { inject, injectable } from "inversify";
import { ObjectId } from "mongodb";
import { UserQueryFilter } from "../types/fiter";
import DepartmentRepository from "../repositories/department.repository";
import { InternalServerError } from "../presentation/errors";
import mongoose, { ClientSession } from "mongoose";
import ActionLogRepository from "../repositories/action-log.repository";
import { createDepartmentChangeActionLogDto } from "../domain/utils";
import { User } from "../database/models/user.model";
import { UserRole, UserSaveRequest } from "@employee-registree/config";
import { userSaveReuqestToUserDTO } from "../domain/transformers/user.transformers";
import { IocConainerTypes } from "../common/inversify-containers/types";
import { genSaltSync, hashSync } from "bcrypt-nodejs";
import { EnvVars } from "../Env";
import * as crypto from "crypto";

@injectable()
export default class UserService {
  constructor(
    @inject(IocConainerTypes.UserRepository)
    private readonly _userRepository: UserRepository,
    @inject(IocConainerTypes.DepartmentRepository)
    private readonly _departmentRepository: DepartmentRepository,
    @inject(IocConainerTypes.ActionLogRepository)
    private readonly _actionLogRepository: ActionLogRepository,
    @inject(IocConainerTypes.Env)
    private readonly _env: EnvVars
  ) {
    this._userRepository.getCount().then((count) => {
      if (count === 0) {
        this._userRepository
          .create({
            _id: new ObjectId(),
            username: "super",
            password: hashSync("super", genSaltSync(this._env.saltLen)),
            first_name: "Super",
            role: UserRole.SUPER,
            department: null,
          })
          .catch(() => {});
      }
    });
  }

  async save(users: UserSaveRequest[]): Promise<void> {
    const departmentSet = new Set<string>();

    users.forEach((user) => {
      if (user.department) {
        departmentSet.add(user.department);
      }
    });

    const uniqueDepartments = Array.from(departmentSet);

    await this._departmentRepository.save(
      uniqueDepartments.map((department) => ({ name: department }))
    );

    const departments = await this._departmentRepository.getAll();

    const departmentMap = new Map<string, ObjectId>();

    departments.forEach((department) => {
      departmentMap.set(department.name, new ObjectId(department._id));
    });

    await this._userRepository.save(
      users.map((user) => ({
        ...userSaveReuqestToUserDTO(user, departmentMap),
        username: crypto.randomBytes(16).toString("hex"),
        password: this._env.defaultPassword,
      }))
    );
  }

  async update(
    _id: ObjectId,
    user: Partial<User>,
    changedBy: ObjectId,
    oldDepartment?: String | null,
    newDepartment?: String | null
  ): Promise<void> {
    try {
      await this._userRepository.update(_id, { ...user });
      console.log("newDepartment", oldDepartment, newDepartment);
      if (
        oldDepartment !== undefined &&
        newDepartment !== undefined &&
        newDepartment !== oldDepartment
      ) {
        await this._actionLogRepository.save([
          createDepartmentChangeActionLogDto(
            _id,
            oldDepartment,
            newDepartment,
            changedBy
          ),
        ]);
      }
    } catch (e: any) {
      throw new InternalServerError(e);
    }

    return;
  }

  async getMany(filter?: { department?: string[] }): Promise<User[]> {
    const queryFilter: UserQueryFilter = {};

    if (filter?.department?.length) {
      queryFilter.department = {
        $in: filter.department.map((id) => new ObjectId(id)),
      };
    }

    return this._userRepository.getAll(queryFilter);
  }

  async getCount(filter?: { department?: string[] }): Promise<number> {
    const queryFilter: UserQueryFilter = {};

    if (filter?.department?.length) {
      queryFilter.department = {
        $in: filter.department.map((id) => new ObjectId(id)),
      };
    }

    return this._userRepository.getCount(queryFilter);
  }
}

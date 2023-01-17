import { inject, injectable } from "inversify";
import DepartmentRepository from "../repositories/department.repository";
import UserService from "../service/user.service";
import { userToReponseTransformer } from "./transformers/user.transformers";
import {
  UserResponse,
  UserRole,
  UserSaveRequest,
  UserUpdateRequest,
} from "@employee-registree/config";
import UserRepository from "../repositories/user.repository";
import { ObjectId } from "mongodb";
import { BadRequest, NotFoundError } from "../presentation/errors";
import { isValidObjectId } from "mongoose";
import { IocConainerTypes } from "../common/inversify-containers/types";
import { Department } from "../database/models/department.model";

@injectable()
export default class UserDomain {
  constructor(
    @inject(IocConainerTypes.UserService)
    private readonly _userService: UserService,
    @inject(IocConainerTypes.UserRepository)
    private readonly _userRepository: UserRepository,
    @inject(IocConainerTypes.DepartmentRepository)
    private readonly _departmentRepository: DepartmentRepository
  ) {}

  async getMany(filter?: {
    department: string[];
  }): Promise<{ data: UserResponse[]; total: number }> {
    const queryFilter = filter
      ? {
          department: filter.department,
        }
      : {};
    const [data, total] = await Promise.all([
      this._userService.getMany(queryFilter),
      this._userService.getCount(queryFilter),
      this._departmentRepository.getAll(),
    ]);
    return {
      data: data.map(userToReponseTransformer),
      total,
    };
  }

  async save(users: UserSaveRequest[]): Promise<void> {
    await this._userService.save(users);
  }

  async getById(_id: ObjectId): Promise<UserResponse> {
    const user = await this._userRepository.getById(_id);

    if (!user) throw new NotFoundError();

    return userToReponseTransformer(user);
  }

  async update(
    _id: string,
    userUpdate: Partial<UserUpdateRequest>,
    changedBy: ObjectId,
    role?: UserRole
  ): Promise<void> {
    const { department, isAdmin, ...rest } = userUpdate;

    let _newDepartmentName = null;
    let _oldDepartmentName = null;

    const _user = await this._userRepository.getById(new ObjectId(_id));

    if (!_user) {
      throw new NotFoundError("User not found");
    }

    const roleChange: { role: UserRole | null } = { role: null };

    // Only allow SUPER user to change roles
    if (
      role === UserRole.SUPER &&
      isAdmin !== undefined &&
      _user.role !== UserRole.SUPER
    )
      roleChange.role = isAdmin ? UserRole.ADMIN : null;

    let _oldDepartmentId =
      (_user.department as Department)?._id?.toString() || null;
    
    _oldDepartmentName = (_user.department as Department)?.name || null;
    
    let departmentChanged = false;

    if (department !== undefined && _oldDepartmentId !== department) {
      departmentChanged = true;
    }

    if (department) {
      if (!isValidObjectId(department)) {
        throw new BadRequest("Invalid Department");
      }

      const _department = await this._departmentRepository.getById(
        new ObjectId(department)
      );
      if (!_department) {
        throw new NotFoundError("Department not found");
      }
      _newDepartmentName = _department.name;
    }

    if (departmentChanged) {
      let newDepartmentId = null;
      let oldDepartmentId = null;

      if (department) {
        newDepartmentId = new ObjectId(department);
      }

      if (_oldDepartmentId) {
        oldDepartmentId = new ObjectId(_oldDepartmentId);
      }

      // If department was changed call the update method with params needed for creating changelog
      await this._userService.update(
        new ObjectId(_id),
        {
          ...rest,
          ...roleChange,
          ...(departmentChanged ? { department: newDepartmentId } : {}),
        },
        changedBy,
        _oldDepartmentName,
        _newDepartmentName
      );
      return;
    }

    // If department was not changed call the update method with no params
    await this._userService.update(new ObjectId(_id), rest, changedBy);
  }

  async delete(_id: string): Promise<void> {
    await this._userRepository.delete([new ObjectId(_id)]);
  }
}

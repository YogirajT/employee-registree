import { inject, injectable } from "inversify";
import { DepartmentResponse, DepartmentUpdateRequest } from "@employee-registree/config";
import { departmentToReponseTransformer } from "./transformers/department.transformers";
import DepartmentRepository from "../repositories/department.repository";
import { ObjectId } from "mongodb";
import { NotFoundError } from "../presentation/errors";
import { IocConainerTypes } from "../common/inversify-containers/types";

@injectable()
export default class DepartmentDomain {
  constructor(
    @inject(IocConainerTypes.DepartmentRepository)
    private readonly _departmentRepository: DepartmentRepository
  ) {}

  async getMany(
    filter?: { department: string[] }
  ): Promise<{ data: DepartmentResponse[]; total: number }> {
    const queryFilter = filter
      ? {
          department: filter.department,
        }
      : {};
    const [data, total] = await Promise.all([
      this._departmentRepository.getAll(),
      this._departmentRepository.getCount(),
    ]);

    return {
      data: data.map(departmentToReponseTransformer),
      total,
    };
  }

  async save(departments: string[]): Promise<void> {
    await this._departmentRepository.save(departments.map(department => ({ name: department })))
  }

  async getById(_id: ObjectId): Promise<DepartmentResponse> {
    const department = await this._departmentRepository.getById(_id)
    
    if (!department) throw new NotFoundError()

    return departmentToReponseTransformer(department);
  }

  async delete(_id: string): Promise<void> {
    await this._departmentRepository.delete([new ObjectId(_id)]);
  }

  async update(
    _id: string,
    update: DepartmentUpdateRequest,
  ): Promise<void> {
    await this._departmentRepository.update(new ObjectId(_id), update);
  }

}

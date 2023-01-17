import { inject, injectable } from "inversify";
import DepartmentRepository from "../repositories/department.repository";
import { IocConainerTypes } from "../common/inversify-containers/types";

@injectable()
export default class DepartmentService {
  constructor(
    @inject(IocConainerTypes.DepartmentRepository)
    private readonly _departmentRepository: DepartmentRepository
  ) {}
  
}

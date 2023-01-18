import { inject, injectable } from "inversify";
import { ActionLogResponse, ActionLogType, DepartmentResponse } from "@employee-registree/config";
import { IocConainerTypes } from "../common/inversify-containers/types";
import ActionLogRepository from "../repositories/action-log.repository";
import { ObjectId } from "mongodb";
import { actionLogToReponseTransformer } from "./transformers/action-log.transformers";

@injectable()
export default class ActionLogDomain {
  constructor(
    @inject(IocConainerTypes.ActionLogRepository)
    private readonly _actionLogRepository: ActionLogRepository
  ) {}

  async getDepartmentChangeLogByUser(
    _id: ObjectId
  ): Promise<{ data: ActionLogResponse[] }> {
    const data = await this._actionLogRepository.getAll({ "data.user": _id, type: ActionLogType.DEPARTMENT_CHANGE });

    return {
      data: data.map(actionLogToReponseTransformer)
    };
  }

}

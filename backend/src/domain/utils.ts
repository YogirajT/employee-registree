import { ObjectId } from "mongodb"
import { IActionLog } from "../database/models/action-log.model"
import { ActionLogType } from "@employee-registree/config"


export const createDepartmentChangeActionLogDto = (user: ObjectId, oldDepartment: String | null, newDepartment: String | null, changedBy: ObjectId): IActionLog => {

    return {
        _id: new ObjectId(),
        type: ActionLogType.DEPARTMENT_CHANGE,
        data: {
            user,
            changed_from: oldDepartment,
            changed_to: newDepartment,
            changed_by: changedBy
        }
    }
}
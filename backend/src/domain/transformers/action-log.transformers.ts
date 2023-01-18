import { ActionLogResponse } from "@employee-registree/config";
import { IActionLog } from "../../database/models/action-log.model";
import { User } from "../../database/models/user.model";

export const actionLogToReponseTransformer = (actionLog: IActionLog): ActionLogResponse => {
    const _user = (actionLog.data.user as User)
    const _changed_by = (actionLog.data.changed_by as User)
  return {
    _id: actionLog._id.toString(),
    type: actionLog.type,
    data: {
        user: `${_user.username ?? ""}`,
        changed_by: `${_changed_by.username ?? ""}`,
        changed_from: `${actionLog.data?.changed_from || "-"}`,
        changed_to:`${ actionLog.data?.changed_to || "-"}`,
    },
    created_at: actionLog.created_at?.toISOString() || ""
  };
};

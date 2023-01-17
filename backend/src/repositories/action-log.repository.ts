import { injectable, inject } from "inversify";
import { ClientSession, Model } from "mongoose";
import { BulkWriteResult, ObjectId } from "mongodb";
import MongoDB from "../database/mongo";
import getActionLogCollection, {
  IActionLog,
} from "../database/models/action-log.model";
import { IocConainerTypes } from "../common/inversify-containers/types";
import { ActionLogQueryFilter } from "../types/fiter";

@injectable()
export default class ActionLogRepository {
  private readonly _model: Model<IActionLog>;

  constructor(
    @inject(IocConainerTypes.MongoDB) private readonly dbContainer: MongoDB
  ) {
    this._model = getActionLogCollection(this.dbContainer.connection);
  }

  async getAll(query: ActionLogQueryFilter): Promise<IActionLog[]> {
    return this._model
      .find({ ...query })
      .sort({ created_at: 1 })
      .populate("data.user data.changed_by")
      .lean();
  }

  async save(actionLogs: IActionLog[]): Promise<BulkWriteResult> {
    return this._model.bulkWrite(
      actionLogs.map((actionLog) => ({ insertOne: { document: actionLog } }))
    );
  }
}

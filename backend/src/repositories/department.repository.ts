import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import { BulkWriteResult, ObjectId, UpdateResult } from "mongodb";
import MongoDB from "../database/mongo";
import getDepartmentCollection, {
  DepartmentDTO,
} from "../database/models/department.model";
import { DepartmentQueryFilter } from "../types/fiter";
import { Department } from "../database/models/department.model";
import { IocConainerTypes } from "../common/inversify-containers/types";

@injectable()
export default class DepartmentRepository {
  private readonly _model: Model<Department>;

  constructor(
    @inject(IocConainerTypes.MongoDB) private readonly dbContainer: MongoDB
  ) {
    this._model = getDepartmentCollection(this.dbContainer.connection);
  }

  async getById(_id: ObjectId): Promise<Department | null> {
    return this._model.findOne({ _id, deleted_at: { $exists: false } }).lean();
  }

  async findByName(name?: string): Promise<Department | null> {
    const queryFilter: DepartmentQueryFilter = {};

    if (name) {
      queryFilter.name = new RegExp(`^${name}$`, "i");
    }

    return this._model
      .findOne({ ...queryFilter, deleted_at: { $exists: false } })
      .lean();
  }

  async getAll(
  ): Promise<Department[]> {
    return this._model
      .find({ deleted_at: { $exists: false } })
      .lean();
  }

  async save(departments: DepartmentDTO[]): Promise<BulkWriteResult> {
    return this._model.bulkWrite(
      departments.map((department) => ({
        updateOne: {
          filter: { name: department.name },
          update: { $setOnInsert: { name: department.name }, $unset: { deleted_at: 1 } },
          upsert: true,
        },
      }))
    );
  }

  async getCount(): Promise<number> {
    return this._model.countDocuments({ deleted_at: { $exists: false } });
  }

  async update(
    _id: ObjectId,
    departmentUpdate: { name: string }
  ): Promise<UpdateResult> {
    return this._model.updateOne({ _id }, { $set: { ...departmentUpdate } });
  }

  /**
   * @param _ids
   */
  async delete(_ids: ObjectId[]): Promise<void> {
    await this._model.updateMany(
      { _id: { $in: _ids } },
      {
        deleted_at: new Date(),
      }
    );
    return;
  }
}

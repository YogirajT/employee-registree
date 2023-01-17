import { injectable, inject } from "inversify";
import { ClientSession, Model, Mongoose } from "mongoose";
import { ObjectId, UpdateResult } from "mongodb";
import { SignupDTO, User, UserDTO } from "../database/models/user.model";
import MongoDB from "../database/mongo";
import getUserCollection from "../database/models/user.model";
import { UserQueryFilter } from "../types/fiter";
import { IocConainerTypes } from "../common/inversify-containers/types";
import { UserRole } from "@employee-registree/config";

@injectable()
export default class UserRepository {
  private readonly _model: Model<User>;

  constructor(
    @inject(IocConainerTypes.MongoDB) private readonly dbContainer: MongoDB
  ) {
    this._model = getUserCollection(this.dbContainer.connection);
  }

  async getById(_id: ObjectId): Promise<User | null> {
    return this._model
      .findOne({ _id, deleted_at: { $exists: false } })
      .populate("department")
      .lean();
  }

  async getByUsername(username: string): Promise<User | null> {
    return this._model
      .findOne({ username, deleted_at: { $exists: false } })
      .lean();
  }

  async getAll(
    filter?: UserQueryFilter
  ): Promise<User[]> {
    return this._model
      .find({ ...filter, deleted_at: { $exists: false } })
      .populate("department")
      .lean();
  }

  async getCount(filter?: UserQueryFilter): Promise<number> {
    return this._model.countDocuments({
      ...filter,
      deleted_at: { $exists: false },
    });
  }

  async save(users: UserDTO[]): Promise<void> {
    await this._model.bulkWrite(
      //@ts-ignore bulk writes don't allow partial models unlike save
      users.map((user) => ({ insertOne: { document: user } }))
    );
  }

  async create(user: SignupDTO) {
    return this._model.create(user);
  }

  async update(
    _id: ObjectId,
    userUpdate: Partial<User>,
    session?: ClientSession
  ): Promise<UpdateResult> {
    return this._model.updateOne(
      { _id },
      { $set: { ...userUpdate } },
      { upsert: false }
    );
  }

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

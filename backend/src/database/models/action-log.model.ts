import { ActionLogType } from "@employee-registree/config";
import { ObjectId } from "mongodb";
import mongoose, { Connection, Model } from "mongoose";
import { User } from "./user.model";


export interface IDepartmentChangeLog {
  user: ObjectId | User;
  changed_from: String | null;
  changed_to: String | null;
  changed_by: ObjectId | User;
}

export interface IActionLog {
  _id: ObjectId;
  type: ActionLogType;
  data: IDepartmentChangeLog;
  created_at?: Date;
}

export const DepartmentChangeLog = {
  user: { type: ObjectId, required: true, ref: "user" },
  changed_from: { type: String },
  changed_to: { type: String },
  changed_by: { type: ObjectId, required: true, ref: "user" },
};

export const ActionLogSchema = new mongoose.Schema<IActionLog>(
  {
    _id: { type: ObjectId, unique: true },
    type: { type: String, required: true },
    data: {
      type: DepartmentChangeLog,
      required: true,
    },
    created_at: { type: Date}
  },
  { timestamps: { createdAt: "created_at" } }
);

export default (connection: Connection): Model<IActionLog> => {
  return connection.model<IActionLog>("action_log", ActionLogSchema);
};

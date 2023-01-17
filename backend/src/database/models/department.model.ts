import { ObjectId } from "mongodb";
import mongoose, { Connection, Model } from "mongoose";

export interface DepartmentDTO {
  name: string;
}

export interface Department {
  _id: ObjectId;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export const DepartmentSchema = new mongoose.Schema<Department>(
  {
    _id: { type: ObjectId, unique: true },
    name: { type: String, required: true },
    created_at: { type: Date },
    updated_at: { type: Date },
    deleted_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default (connection: Connection): Model<Department> => {
  return connection.model<Department>("department", DepartmentSchema);
};

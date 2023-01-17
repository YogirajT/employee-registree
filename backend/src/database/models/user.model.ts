import { ObjectId } from "mongodb";
import mongoose, { Connection, Model } from "mongoose";
import { UserRole } from "@employee-registree/config";
import { Department } from "./department.model";


export interface UserDTO {
  first_name: string;
  last_name?: string;
  address?: string;
  job_title?: string;
  department: ObjectId | null;
  username?: string,
  password?: string
}

export interface SignupDTO {
  _id: ObjectId;
  username: string;
  password: string;
  first_name: string;
  last_name?: string;
  address?: string;
  job_title?: string;
  department: ObjectId | null;
  role?: UserRole | null;
}

export interface User {
  _id: ObjectId;
  username?: string;
  password?: string;
  first_name: string;
  last_name?: string;
  address?: string;
  job_title?: string;
  department?: Department | ObjectId | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  role?: UserRole | null;
}

export const UserSchema = new mongoose.Schema<User>(
  {
    _id: { type: ObjectId, unique: true },
    username: { type: String, unique: true },
    password: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    address: { type: String },
    job_title: { type: String },
    department: { type: ObjectId, ref: "department", default: null },
    role: { type: String, default: null },
    created_at: { type: Date },
    updated_at: { type: Date },
    deleted_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default (connection: Connection): Model<User> => {
  return connection.model<User>("user", UserSchema);
};

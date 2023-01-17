import { ObjectId } from "mongodb"

export type UserQueryFilter = {
    department?: { $in: ObjectId[] }
}

export type DepartmentQueryFilter = {
    name?: RegExp
}

export type ActionLogQueryFilter = {
    type?: string,
    'data.user': ObjectId
}
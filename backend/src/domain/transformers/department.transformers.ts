import { DepartmentResponse } from "@employee-registree/config";
import { Department } from "../../database/models/department.model";

export const departmentToReponseTransformer = ({
  name,
  _id,
}: Department): DepartmentResponse => {
  return {
    name,
    _id: _id.toString(),
  };
};

import { UserResponse, UserSaveRequest } from "@employee-registree/config";
import { User, UserDTO } from "../../database/models/user.model";
import { ObjectId } from "mongodb";
import { Department } from "../../database/models/department.model";

export const userToReponseTransformer = ({
  first_name,
  last_name,
  role,
  address,
  job_title,
  department,
  _id,
}: User): UserResponse => {
  return {
    first_name,
    last_name,
    role,
    address,
    job_title,
    //@ts-ignore
    department: (department as Department)?._id
      ? {
          name: (department as Department).name,
          _id: (department as Department)._id.toString(),
        }
      : null,
    _id: _id.toString(),
  };
};

export const userSaveReuqestToUserDTO = (
  { first_name, last_name, address, job_title, department }: UserSaveRequest,
  departmentMap: Map<string, ObjectId>
): UserDTO => {
  const userDTO: UserDTO = { first_name, department: null };

  if (last_name) {
    userDTO.last_name = last_name;
  }

  if (last_name) {
    userDTO.last_name = last_name;
  }

  if (job_title) {
    userDTO.job_title = job_title;
  }

  if (address) {
    userDTO.address = address;
  }

  if (department) {
    const _department = departmentMap.get(department);
    if (_department) {
      userDTO.department = _department;
    }
  }

  return userDTO;
};

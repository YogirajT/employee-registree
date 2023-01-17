import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { BadRequest } from "../../presentation/errors";

export const userListRequestValidator = () =>
  yup.object({
    department: yup
      .array()
      .of(yup.string().required())
      .default([])
      .optional()
      .test(
        "Object ID test",
        "Invalis Department id found in array",
        (items: any[]) => {
          return items.every((item) => {
            if (isValidObjectId(item)) {
              throw new yup.ValidationError(`Invalid department Id passed`);
            }
            return true;
          });
        }
      ),
  });

export const userUpdateRequestValidator = () =>
  yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().optional(),
    address: yup.string().optional(),
    job_title: yup.string().optional(),
    departmemt: yup.string().optional().nullable(),
    isAdmin: yup.boolean().optional(),
  });

export const userSaveRequestValidator = () => yup
.array()
.of(
  yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().optional(),
    address: yup.string().optional(),
    job_title: yup.string().optional(),
    departmemt: yup.string().optional().nullable(),
  })).required().min(1);

export const validateMongoID = (id?: string) => {
  if (!id || !isValidObjectId(id)) {
    throw new BadRequest("Invalid Id");
  }
};

export const signupRequestValidator = () =>
  yup.object({
    username: yup.string().required(),
    password: yup.string().required().min(6),
    first_name: yup.string().required(),
  });

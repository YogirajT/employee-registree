import * as yup from "yup";

export const departmentListRequestValidator = () =>
  yup.object({
    page: yup.number().required().default(0),
  });

export const departmentSaveRequestValidator = () =>
  yup.array().of(yup.string().required()).required().min(1);

export const departmentUpdateRequestValidator = () =>
  yup.object({
    name: yup.string().required()
  });

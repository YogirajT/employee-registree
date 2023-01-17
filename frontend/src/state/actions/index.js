import * as ActionTypes from "./action-types";

export const signUp = (payload) => ({
  type: ActionTypes.REGISTRATION_REQUESTED,
  payload
});

export const login = (username, password) => ({
  type: ActionTypes.LOGIN_REQUESTED,
  username,
  password,
});

export const edit = ({
  firstName,
  lastName,
  age,
  address,
  phone,
  profileImage,
}) => ({
  type: ActionTypes.EDIT_REQUESTED,
  firstName,
  lastName,
  age,
  address,
  phone,
  profileImage,
});

export const userList = () => ({
  type: ActionTypes.USER_LIST_REQUESTED,
});

export const getDepartmentList = () => ({
  type: ActionTypes.DEPARTMENT_LIST_REQUESTED,
});

export const logout = () => ({
  type: ActionTypes.LOGOUT_REQUESTED,
});

export const createDepartment = (name) => ({
  type: ActionTypes.CREATE_DEPARTMENT_REQUESTED,
  name,
});

export const deleteDepartment = (id) => ({
  type: ActionTypes.DELETE_DEPARTMENT_REQUESTED,
  id,
});

export const editDepartment = (payload) => ({
  type: ActionTypes.EDIT_DEPARTMENT_REQUESTED,
  payload
});


export const createUsers = (payload) => ({
  type: ActionTypes.CREATE_USER_REQUESTED,
  payload,
});

export const deleteUser = (id) => ({
  type: ActionTypes.DELETE_USER_REQUESTED,
  id,
});

export const editUser = (payload) => ({
  type: ActionTypes.EDIT_USER_REQUESTED,
  payload
});


export const getActionHistory = (id) => ({
  type: ActionTypes.ACTION_LOG_REQUESTED,
  id
});
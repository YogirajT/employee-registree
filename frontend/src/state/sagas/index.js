import {
  all,
  fork,
  put,
  call,
  takeLatest,
  takeLeading,
} from "redux-saga/effects";
import store from "store2";
import * as ActionTypes from "../actions/action-types";
import { deleteOne, get, post, putOne } from "../../utils";
import { push } from "connected-react-router";
import jwt_decode from "jwt-decode";

function* login(action) {
  const { username, password } = action;
  try {
    const response = yield call(post, "/auth/login", { username, password });
    store.set("auth_jwt", response?.jwt);

    const decoded = jwt_decode(response?.jwt);
    yield put({ type: ActionTypes.LOGIN_SUCCEEDED, decoded: decoded.user });
    yield put(push("/list/employees"));
  } catch (error) {
    yield put({ type: ActionTypes.LOGIN_FAILED, error: error?.response?.data });
  }
}

function* watchLogin() {
  yield takeLeading(ActionTypes.LOGIN_REQUESTED, login);
}

function* registration(action) {
  const { payload } = action;
  try {
    const response = yield call(post, "/auth/signup", payload);
    store.set("auth_jwt", response?.jwt);
    const decoded = jwt_decode(response?.jwt);
    yield put({
      type: ActionTypes.REGISTRATION_SUCCEEDED,
      decoded: decoded.user,
    });
    yield put(push("/list/employees"));
  } catch (error) {
    yield put({
      type: ActionTypes.REGISTRATION_FAILED,
      error: error?.response?.data,
    });
  }
}

function* watchRegistration() {
  yield takeLatest(ActionTypes.REGISTRATION_REQUESTED, registration);
}

function* watchEditProfile() {
  yield takeLatest(ActionTypes.EDIT_REQUESTED, editProfile);
}

function* logout() {
  try {
    store.remove("auth_jwt");
    yield put({ type: ActionTypes.LOGOUT_SUCCEEDED });
    yield put(push("/"));
  } catch (error) {
    yield put({ type: ActionTypes.LOGOUT_FAILED, error: error.response.data });
  }
}

function* watchLogout() {
  yield takeLatest(ActionTypes.LOGOUT_REQUESTED, logout);
}

function* userList() {
  const jwt = store.get("auth_jwt");
  try {
    const response = yield call(get, `/users`, {}, jwt);
    yield put({ type: ActionTypes.USER_LIST_SUCCEEDED, users: response.data });
  } catch (error) {
    yield put({
      type: ActionTypes.USER_LIST_FAILED,
      error: "Could not load users. Please try logging in again.",
    });
    store.remove("auth_jwt");
    yield put(push("/"));
  }
}

function* departmentList() {
  const jwt = store.get("auth_jwt");
  try {
    const response = yield call(get, `/departments`, {}, jwt);
    yield put({
      type: ActionTypes.DEPARTMENT_LIST_SUCCEEDED,
      departments: response.data,
    });
  } catch (error) {
    yield put({
      type: ActionTypes.DEPARTMENT_LIST_FAILED,
      error: "Could not load departments. Please try logging in again.",
    });
    store.remove("auth_jwt");
    yield put(push("/"));
  }
}

function* watchDepartmentListRequest() {
  yield takeLatest(ActionTypes.DEPARTMENT_LIST_REQUESTED, departmentList);
}

function* editProfile(action) {
  const jwt = store.get("auth_jwt");
  const { firstName, lastName, age, address, phone, profileImage } = action;
  try {
    const response = yield call(
      post,
      "/user/profile",
      {
        firstName,
        lastName,
        age,
        address,
        phone,
        profileImage,
      },
      {},
      jwt
    );
    yield put({ type: ActionTypes.EDIT_SUCCEEDED, user: response });
    yield put(push("/profile"));
  } catch (error) {
    yield put({
      type: ActionTypes.EDIT_FAILED,
      error: error?.response?.data?.error,
    });
    store.remove("auth_jwt");
    yield put(push("/"));
  }
}

function* watchUserListRequest() {
  yield takeLatest(ActionTypes.USER_LIST_REQUESTED, userList);
}

function* createDepartment(action) {
  const jwt = store.get("auth_jwt");

  const { name } = action;
  try {
    yield call(post, "/departments", { name }, {}, jwt);
    yield put({ type: ActionTypes.DEPARTMENT_LIST_REQUESTED });
  } catch (error) {
    yield put({
      type: ActionTypes.CREATE_DEPARTMENT_FAILED,
      error: error?.response?.data,
    });
  }
}

function* watchCreateDepartmentRequest() {
  yield takeLatest(ActionTypes.CREATE_DEPARTMENT_REQUESTED, createDepartment);
}

function* deleteDepartment(action) {
  const jwt = store.get("auth_jwt");

  const { id } = action;
  try {
    yield call(deleteOne, `/departments/${id}`, jwt);
    yield put({ type: ActionTypes.DEPARTMENT_LIST_REQUESTED });
  } catch (error) {
    yield put({
      type: ActionTypes.DELETE_DEPARTMENT_FAILED,
      error: error?.response?.data,
    });
  }
}

function* watchDeleteDepartmentRequest() {
  yield takeLatest(ActionTypes.DELETE_DEPARTMENT_REQUESTED, deleteDepartment);
}

function* editDepartment(action) {
  const jwt = store.get("auth_jwt");

  const { id, name } = action.payload;
  try {
    yield call(putOne, `/departments/${id}`, { name }, jwt);
    yield put({ type: ActionTypes.DEPARTMENT_LIST_REQUESTED });
  } catch (error) {
    yield put({
      type: ActionTypes.EDIT_DEPARTMENT_FAILED,
      error: error?.response?.data,
    });
  }
}

function* watchEditDepartmentRequest() {
  yield takeLatest(ActionTypes.EDIT_DEPARTMENT_REQUESTED, editDepartment);
}

function* editUser(action) {
  const jwt = store.get("auth_jwt");
  const { id, ...rest } = action.payload;
  try {
    yield call(putOne, `/users/${id}`, rest, jwt);
    yield put({ type: ActionTypes.DEPARTMENT_LIST_REQUESTED });
    yield put({ type: ActionTypes.USER_LIST_REQUESTED });
  } catch (error) {
    yield put({
      type: ActionTypes.EDIT_USER_FAILED,
      error: error?.response?.data,
    });
  }
}

function* watchEditUserRequest() {
  yield takeLatest(ActionTypes.EDIT_USER_REQUESTED, editUser);
}

function* createUsers(action) {
  const { payload } = action;
  const jwt = store.get("auth_jwt");
  try {
    yield call(post, "/users", { users: payload }, {}, jwt);
    yield put({ type: ActionTypes.CREATE_USER_SUCCEEDED });
    yield put({ type: ActionTypes.USER_LIST_REQUESTED });
  } catch (error) {
    yield put({
      type: ActionTypes.REGISTRATION_FAILED,
      error: error?.response?.data
    });
  }
}

function* watchCreateUsers() {
  yield takeLatest(ActionTypes.CREATE_USER_REQUESTED, createUsers);
}

export default function* rootSaga() {
  yield all([
    fork(watchLogin),
    fork(watchUserListRequest),
    fork(watchDepartmentListRequest),
    fork(watchCreateDepartmentRequest),
    fork(watchDeleteDepartmentRequest),
    fork(watchEditDepartmentRequest),
    fork(watchCreateUsers),
    fork(watchEditUserRequest),
    fork(watchRegistration),
    fork(watchEditProfile),
    fork(watchLogout),
  ]);
}

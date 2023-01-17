import * as ActionTypes from './actions/action-types';
import * as store from 'store2'; 
import jwt_decode from 'jwt-decode';

const initialState = {
  user: {
    isAuthenticated: !!store.get('auth_jwt'),
    decoded: store.get('auth_jwt') ? jwt_decode(store.get('auth_jwt')).user : null,
  },
  userList: [],
  departmentList: [],
  error: null,
};

const access = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCEEDED: {
      return {
        ...state,
        user: {
          isAuthenticated: true,
          decoded: action.decoded,
        },
        error: null,
      };
    }
    case ActionTypes.REGISTRATION_SUCCEEDED: {
      return {
        ...state,
        user: {
          isAuthenticated: true,
          decoded: action.decoded,
        },
        error: null,
      };
    }
    case ActionTypes.USER_LIST_SUCCEEDED: {
      return {
        ...state,
        userList: action.users,
        error: null,
      };
    }
    case ActionTypes.DEPARTMENT_LIST_SUCCEEDED: {
      return {
        ...state,
        departmentList: action.departments,
        error: null,
      };
    }
    case ActionTypes.EDIT_SUCCEEDED: {
      return {
        ...state,
        error: null,
      };
    }
    case ActionTypes.LOGIN_FAILED: {
      return {
        ...state,
        error: action.error,
      };
    }
    case ActionTypes.REGISTRATION_FAILED: {
      return {
        ...state,
        error: action.error,
      };
    }
    case ActionTypes.EDIT_FAILED: {
      return {
        ...state,
        error: action.error,
      };
    }
    case ActionTypes.LOGOUT_SUCCEEDED: {
      return {
        ...state,
        user: {
          isAuthenticated: false,
        },
        error: null,
      };
    }
    default:
      return state;
  }
}

const reducer = {
  access
}

export default reducer;
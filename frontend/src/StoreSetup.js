import { createStore, combineReducers, applyMiddleware } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import reducers from "./state";
import sagas from "./state/sagas";
import { LOGOUT_SUCCEEDED } from "./state/actions/action-types";
import { createHashHistory } from "history";

export const history = createHashHistory({
  hashType: "slash",
  getUserConfirmation: (message, callback) => callback(window.confirm(message)),
});

const sagaMiddleware = createSagaMiddleware();

const createMainReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers,
  });

const createRootReducer = (history) => (state, action) => {
  if (action.type === LOGOUT_SUCCEEDED)
    return createMainReducer(history)(undefined, action);
  return createMainReducer(history)(state, action);
};

const setupStore = (preloadedState) => {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    applyMiddleware(routerMiddleware(history), sagaMiddleware)
  );
  sagaMiddleware.run(sagas);
  return store;
};

export default setupStore();

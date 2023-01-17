import React, {  } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Logout from "./components/Logout";
import SignIn from "./components/SignIn";
import ListWrapper from "./components/ListWrapper";
import { useAuth } from "./utils/hooks.jsx";
import MenuAppBar from "./common/MenuAppBar";
import SignUp from "./components/SignUp";

export function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth();
  const history = useHistory();

  if (!isAuthenticated) {
    history.push("/");
  }

  return (
    <Route
      {...rest}
      render={(props) => (
        <React.Fragment>
          <Component {...props} />
        </React.Fragment>
      )}
    />
  );
}

export default function Routes() {

  return (
    <>
      <MenuAppBar />
      <Switch>
        <PrivateRoute path="/list" component={ListWrapper} />
        <Route exact={true} path="/sign-up" component={SignUp} />
        <Route exact={true} path="/logout" component={Logout} />
        <Route path="/" component={SignIn} />
      </Switch>
    </>
  );
}

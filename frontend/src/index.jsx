import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux';
import App from './App';
import setupStore, { history } from "./StoreSetup";

ReactDOM.render(
  <Provider store={setupStore}>
    <ConnectedRouter history={history} noInitialPop>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import DashboardAdmin from '../components/DashboardAdmin';
import DashboardPublic from '../components/DashboardPublic';
import LoginPage from '../components/LoginPage'
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
      <Switch>
        <Route path="/" component={DashboardPublic} exact={true} />
        <PrivateRoute path="/admin" component={DashboardAdmin} />
        <PublicRoute path="/login" component={LoginPage} />
      </Switch>
  </Router>
);

export default AppRouter;
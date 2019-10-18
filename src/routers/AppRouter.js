import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import DashboardAdmin from '../components/DashboardAdmin';
import DashboardPublic from '../components/DashboardPublic';

const AppRouter = () => (
  <HashRouter>
      <Switch>
        <Route path="/" component={DashboardPublic} exact={true} />
        <Route path="/admin" component={DashboardAdmin} />
      </Switch>
  </HashRouter>
);

export default AppRouter;
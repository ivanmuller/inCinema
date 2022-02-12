import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import DashboardAdmin from '../components/DashboardAdmin';
import DashboardPublic from '../components/DashboardPublic';
import LoginPage from '../components/LoginPage'
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const history = createBrowserHistory();

const AppRouter = () => (
  <BrowserRouter history={history}>
    <Routes>
      <Route path="/" element={<DashboardPublic />} exact={true} />
      <Route path="/admin" element={<PrivateRoute component={DashboardAdmin} />} />
      <Route path="/login" element={<PublicRoute component={LoginPage} />} />
      {/*<PrivateRoute path="/admin" component={DashboardAdmin} />*/}
      {/*<PublicRoute path="/login" component={LoginPage} />*/}
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
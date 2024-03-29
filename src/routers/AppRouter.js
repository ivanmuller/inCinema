import React, {useEffect} from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardPublic from '../pages/DashboardPublic';
import LoginPage from '../pages/LoginPage'
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const history = createBrowserHistory();

const AppRouterLinksInside = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPageName = location.pathname.replace('/','') || 'home';
    document.body.classList.add("page-" + currentPageName);
    return () => {
      //cleanup
      document.body.classList.remove("page-" + currentPageName);
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<DashboardPublic />} exact={true} />
      <Route path="/admin" element={<PrivateRoute component={DashboardAdmin} />} />
      <Route path="/login" element={<PublicRoute component={LoginPage} />} />
    </Routes>
  )
};

const AppRouter = () => {
  return (
    <BrowserRouter history={history}>
      <AppRouterLinksInside />
    </BrowserRouter>
  )
};

export default AppRouter;
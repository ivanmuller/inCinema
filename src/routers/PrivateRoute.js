import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({isAuthenticated,component: Component, props}) => {
  return (
    <>
      {isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />}
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(PrivateRoute);
import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({isAuthenticated,component: Component, props}) => {
  return (
    <>
      {!isAuthenticated ? <Component {...props} /> : <Navigate to="/admin" /> }
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(PublicRoute);
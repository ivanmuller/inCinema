import React, { useState } from 'react';
import config from '../config';

import { connect } from 'react-redux';
import { startLogin } from '../actions/auth';

import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoginPage = ({ startLogin }) => {
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [clickStatus, setClickStatus] = useState(0);//0:idle 1:loading

  const handleSubmit = (event) => {
    event.preventDefault();
    setClickStatus(1);
    startLogin({ email, password }).then(()=>{
      setClickStatus(0);
    }).catch((error) => {
      setError(error);
      setClickStatus(0);
    });
  };

  return (
    <div className="login-wrapper">
      <img src="images/icon.svg" className="logo" />
      <Card className="login-box">
        <h1>{config.appTitle}</h1>
        <form>
          <TextField
            id="email"
            label="Email"
            type="text"
            margin="normal"
            autoComplete="username"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button disabled={clickStatus == 1} onClick={handleSubmit} color="primary" variant="contained">Log In {clickStatus == 1 ? <CircularProgress color="primary" className="progress" size={16} /> : ''}</Button>
        </form>
        {error && <span className="error">{error.message}</span>}
      </Card>
      <Link className="link" to="/" exact="true">Go to Public Dashboard</Link>
      </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password) => dispatch(startLogin(email, password))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
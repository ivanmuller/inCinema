import React, { useState } from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth';

const LoginPage = ({ startLogin }) => {
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    startLogin({ email, password }).catch((error) => {
      setError(error);
    });
  }
   return (
     <>
      {error && <span>{error.message}</span>}
       <form onSubmit={handleSubmit}>
         <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
           onChange={(e) => setPassword(e.target.value)}
        />
        <button>Log In</button>
      </form>
      </>
   );
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password) => dispatch(startLogin(email, password))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
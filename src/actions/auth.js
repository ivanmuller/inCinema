import { initializeApp } from "firebase/app";
import dbSettings from '../firebase/firebase';
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
const appDB = initializeApp(dbSettings);
const auth = getAuth(appDB);

export const login = (uid) => ({
  type: 'LOGIN',
  uid
});

export const startLogin = ({email,password}) => {
  return () => {
    return signInWithEmailAndPassword(auth, email, password);
  }
}

export const logout = () => ({
  type: 'LOGOUT'
})

export const startLogout = () => {
  return () => {
    return signOut(auth);
  }
}
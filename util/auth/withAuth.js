import React, { useEffect } from 'react';
import router from 'next/router';
import firebase from 'firebase/app';
import {getAuth} from 'firebase/auth';
import initFirebase from '../firebase';

initFirebase();

const auth = getAuth(firebase)

const withAuth = Component => props => {
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (!authUser) {
        router.push('/login');
      }
    });
  }, []);

  return (
    <div>
      <Component {...props} />
    </div>
  )
};

export default withAuth;
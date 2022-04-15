import React, { useEffect } from 'react';
import router from 'next/router';
import {auth} from '../firebase';

const withAuth = (Component) => (props) => {
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        router.push('/login');
      }
    });
  }, []);

  return (<Component {...props} />)
};

export default withAuth;
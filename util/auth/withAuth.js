import React, { useEffect } from 'react';
import router from 'next/router';
import {auth} from '../firebase';

export async function getServerSideProps(context) {
  const { req, query, res, asPath, pathname } = context;
  console.log(req, pathname)
  
}

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
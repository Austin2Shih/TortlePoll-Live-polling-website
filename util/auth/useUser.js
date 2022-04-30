import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {auth} from '../firebase';

import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie
} from './userCookie';

// Variable to keep track of if authlistener happened
var authListening = false

export const mapUserData = async (email) => {
  const response = await fetch(`/api/get_user`, {
    method: 'POST',
    body: JSON.stringify({
        "email" : email,
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  })
    
  const res = await response.json()

  return JSON.stringify({
    email,
    mongoData: res
  });
};

  

const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();

  function logout(route) {
    return async () => {
      return auth.signOut()
      .then(() => {
        router.push(route);
      })
      .catch(e => {
        console.error(e);
      });
    }
  }

  async function updateUser(email) {
    const userData = await mapUserData(email);
    setUserCookie(userData);
    setUser(JSON.parse(userData));
  }

  useEffect(() => {
    // Works if spammed but causes firebase quota limit to be reached
    if(!authListening) {
      // The first time useUser is called, set a listener to update the user data when there is a change in auth
      const cancelAuthListener = auth
      .onIdTokenChanged(async userToken => {
          if (userToken) {
            await updateUser(userToken.email)
          } else {
            removeUserCookie();
            setUser();
          }
      });
      authListening = true
    }

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);
    return () => cancelAuthListener;
  }, []);

  return { user, logout, updateUser };
};

export { useUser };
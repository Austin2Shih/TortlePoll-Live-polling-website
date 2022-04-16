import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {auth} from '../firebase';

import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie
} from './userCookie';

export const mapUserData = async user => {
  const { uid, email } = user;
  const token = await user.getIdToken(true);
  const response = await fetch(`/api/get_user`, {
    method: 'POST',
    body: JSON.stringify({
        "email" : `${user.email}`,
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  }).then(async (response) => {
    const res = await response.json()
    return res
  })
  return {
    id: uid,
    email,
    token,
    mongoData: response
  };
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

  useEffect(() => {
        const cancelAuthListener = auth
        .onIdTokenChanged(async userToken => {
            if (userToken) {
              const userData = await mapUserData(userToken);
              setUserCookie(userData);
              setUser(userData);
            } else {
              removeUserCookie();
              setUser();
            }
        });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);
    return () => cancelAuthListener;
  }, []);
  return { user, logout };
};

export { useUser };
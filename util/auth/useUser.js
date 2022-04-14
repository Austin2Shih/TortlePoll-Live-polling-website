import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {firebase} from 'firebase/app';
import { getAuth, onIdTokenChanged } from 'firebase/auth';

import initFirebase from '../firebase';

import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie
} from './userCookie';

initFirebase();

export const mapUserData = async user => {
  const { uid, email } = user;
  const token = await user.getIdToken(true);
  return {
    id: uid,
    email,
    token
  };
};

  
const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();

  const logout = async () => {
    return getApps()
      .auth()
      .signOut()
      .then(() => {
        router.push('/');
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
      console.log(firebase)
        const cancelAuthListener = getAuth(firebase)
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
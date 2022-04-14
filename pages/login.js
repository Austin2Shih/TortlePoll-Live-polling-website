import initFirebase from '../util/firebase';
import { setUserCookie } from '../util/auth/userCookie';
import { mapUserData } from '../util/auth/useUser';
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'firebaseui';
import { getAuth } from 'firebase/auth';


initFirebase();
const firebaseAuthConfig = ({ signInSuccessUrl }) => ({
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl,
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      const userData = await mapUserData(user);
      setUserCookie(userData);
    }
  }
});

const FirebaseAuth = () => {
  const signInSuccessUrl = "/dashboard"
  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={firebaseAuthConfig({ signInSuccessUrl })}
        firebaseAuth={getAuth(firebase)}
        signInSuccessUrl={signInSuccessUrl}
      />
    </div>
  );
};

export default FirebaseAuth;
import { useState } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from '../util/AuthUserContext';

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [passwordOne, setPasswordOne] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const router = useRouter();
    const [error, setError] = useState(null);

    const { createUserWithEmailAndPassword } = useAuth();

    const onSubmit = event => {
      setError(null)
      //check if passwords match. If they do, create user in Firebase
      // and redirect to your logged in page.
      if(passwordOne === passwordTwo)
        createUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
          console.log("Success. The user is created in Firebase")
          router.push("/logged_in");
        })
        .catch(error => {
          // An error occurred. Set error message to be displayed to user
          setError(error.message)
        });
      else
        setError("Password do not match")
      event.preventDefault();
    };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input name="email" type="email" />
      <label htmlFor="password">Password</label>
      <input name="password" type="password" />
      <label htmlFor="passwordConfirm">Password</label>
      <input name="passwordConfirm" type="password" />
      <button>Log in</button>
    </form>
  )
}
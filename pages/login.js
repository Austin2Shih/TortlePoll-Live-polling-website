import { setUserCookie } from '../util/auth/userCookie';
import { mapUserData } from '../util/auth/useUser';
import 'firebase/auth';
import React, { useState } from "react";
import {auth} from '../util/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function FirebaseAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  function handleLogin(e) {
    e.preventDefault();
    console.log(auth, email, password)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("logged in!")
      }).catch((error) => {
        console.log("ERROR: ", error)
      })
  }

  return (
    <div>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            type="email" 
            placeholder="Email">
          </input>
          <label>Password</label>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            type="password" 
            placeholder="Password">
          </input>
          <input type="submit"></input>
        </form>
    </div>
  );
}


import React, { useState } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';

export default function FirebaseAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter();

  function handleLogin(e) {
    e.preventDefault();
    console.log(auth, email, password)
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("logged in!")
        console.log(userCredential)
        router.push("/dashboard");
      }).catch((error) => {
        setError(error.message)
        console.log("ERROR: ", error)
      })
  }

  return (
    <div>
        {error}
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
        <p>
          Don't have an account{" "}
          <Link href="/signup">
            <a>sign Up</a>
          </Link>
        </p>
    </div>
  );
}


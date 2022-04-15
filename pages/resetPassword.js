import React, { useState } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';

export default function FirebaseAuth() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter();

  function handleReset(e) {
    e.preventDefault();
    sendPasswordResetEmail(auth, email, password)
      .then(() => {
        setMessage("Check your email to reset your password")
      }).catch((error) => {
        setError(error.message)
        console.log("ERROR: ", error)
      })
  }

  return (
    <div>
        {error}
        <form onSubmit={handleReset}>
          <label>Email</label>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            type="email" 
            placeholder="Email">
          </input>
          <input type="submit"></input>
        </form>
    </div>
  );
}


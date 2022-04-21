import React, { useState } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import styles from '../styles/Form.module.css'


export async function getServerSideProps(context) {
  const {query} = context
  let redirectLink = query.redirect
  if (!redirectLink) {
      redirectLink = '/'
  }

  return {
      props: {
          "url" : redirectLink
      }
  }
}

export default function FirebaseAuth() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter();

  function handleReset(e) {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Email sent! Redirecting you to login...")
        setTimeout(() => {  
          router.push(`/login?redirect=${props.url}`); 
        }, 3000);
      }).catch((error) => {
        setError(error.message)
        console.log("ERROR: ", error)
      })
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Reset Password</h1>
        {error}
        {message}
        <form onSubmit={handleReset} className={styles.flexColumn}>
          <label>Email</label>
          <div className={styles.inputBox}>
            <input 
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              type="email" 
              placeholder="Email">
            </input>
          </div>
          <button className={styles.button}>Reset Password</button>
        </form>
      </div>
    </div>
  );
}


import React, { useState } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

export default function FirebaseAuth(props) {
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
        router.push(props.url);
      }).catch((error) => {
        setError(error.message)
        console.log("ERROR: ", error)
      })
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
          {error}
          <form className={styles.flexColumn} onSubmit={handleLogin}>
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
            <label>Password</label>
            <div className={styles.inputBox}>
              <input 
                className={styles.input} 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                type="password" 
                placeholder="Password">
              </input>
            </div>
            <button className={styles.button}>Log in</button>
          </form>
          <p>
            <Link href={`/signup?redirect=${props.url}`}>
              Sign Up
            </Link>
          </p>
          <p>
            <Link href={`/resetPassword?redirect=${props.url}`}>
              <a>Reset Password</a>
            </Link>
          </p>
      </div>
    </div>

  );
}


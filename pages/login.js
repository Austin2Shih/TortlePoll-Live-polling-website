import React, { useState } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Link from 'next/link';
import styles from '../styles/Auth.module.css'
import Image from 'next/image'
import logo from '../public/cowboy_turtle.png'
import {FcGoogle} from 'react-icons/fc'

const provider = new GoogleAuthProvider();

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
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("logged in!")
        setTimeout(() => {  
          router.push(props.url);
        }, 3000);
        
      }).catch((error) => {
        setError(error.message)
        console.log("ERROR: ", error)
      })
  }

  async function create_user(user) {
    const data = {
      email: user.user.email,
      info : {
        ethnicity: null,
        gender: null,
        birthday: null,
      },
      polls: [],
      votedPolls: []
    }
    return await fetch("/api/create_user", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  }

  function handleGoogleLogin() {
      signInWithPopup(auth, provider)
        .then(async (userCredential) => {
        console.log("logged in!")
        const mongoUser = await fetch('/api/get_user', {
          method: 'POST',
          body: JSON.stringify({
            email: userCredential.user.email
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        const res = await mongoUser.json()
        if (!res.email) {
          await create_user(userCredential).then(()=> {
            setTimeout(() => {  
              router.push(`/demographics?redirect=${props.url}`);
            }, 3000);
          })
        } else {
          setTimeout(() => {  
            router.push(props.url);
          }, 3000);
        }

      }).catch((error) => {
        setError(error.message)
        console.log("ERROR: ", error)
      })
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
          <div className={styles.titleContainer}>
            <div className={styles.logoContainer}>
              <Image src={logo}></Image>
            </div>
            <h1 className={styles.title}>Log in</h1>
          </div>

          {error}
          <form className={styles.flexColumn} onSubmit={handleLogin}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputBox}>
              <input
                className={styles.input} 
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                type="email" 
                placeholder="Email">
              </input>
            </div>
            <label className={styles.label}>Password</label>
            <div className={styles.inputBox}>
              <input 
                className={styles.input} 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                type="password" 
                placeholder="Password">
              </input>
            </div>
            <Link href={`/resetPassword?redirect=${props.url}`}>
              <a className={styles.link}>Forgot password?</a>
            </Link>
            <button className={styles.button}>Log in</button>
          </form>
          <p style={{textAlign: "center", lineHeight: 0}}>or</p>
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <div className={styles.googleContainer}>
              <p>Continue with Google</p>
              <FcGoogle style={{fontSize: "1.6rem", marginLeft: "0.5rem"}}></FcGoogle>
            </div>
          </button>
          <div className={styles.wrongPlace}>
            <p>New to Tortlepoll?</p>
            <Link classname={styles.link} href={`/signup?redirect=${props.url}`}>
              <a className={styles.link}>Sign up</a>
            </Link>
          </div>

      </div>
    </div>

  );
}


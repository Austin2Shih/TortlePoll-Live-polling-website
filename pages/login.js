import React, { useState } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Link from 'next/link';
import styles from '../styles/Auth.module.css'
import Image from 'next/image'
import logo from '../public/cowboy_turtle.png'
import {FcGoogle} from 'react-icons/fc'
import NProgress from "nprogress";
import { useUser } from "../util/auth/useUser";

const provider = new GoogleAuthProvider();

export async function getServerSideProps(context) {
  const {query} = context
  let redirectLink = query.redirect   //getting link that the user is supposed to redirect to, used if user gets a poll link and needs to sign up
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
  const {user, logout, updateUser} = useUser(); //need to ensure that useUser is called for the auth change listener
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter();

  function handleLogin(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("logged in!")
        NProgress.start()
        updateUser(userCredential.user.email) //update user cookies
        setTimeout(() => {  
          router.push(props.url);
        }, 500);
        
      }).catch((error) => {
        setError(error.message)
        console.log("ERROR: ", error)
      })
  }

  function handleGoogleLogin() {
      signInWithPopup(auth, provider)
        .then(async (userCredential) => {
        console.log("logged in!")
        // Search for user in mongodb database
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
          // If mongodb user is not in the database, then create the user
          NProgress.start()
          await fetch("/api/create_user", {
            method: 'POST',
            body: JSON.stringify({
              email: userCredential.user.email
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          .then(()=> {
            // After creating the mongodb user, update user cookie and push to demographics page
            updateUser(userCredential.user.email)   // update user cookies
            setTimeout(() => {  
              router.push(`/demographics?redirect=${props.url}`);
            }, 500); // wait 0.5 seconds before going in because the database needs some time to ensure that it is updated
          })
        } else {
          NProgress.start()
          updateUser(userCredential.user.email)   // update user cookies
          setTimeout(() => {  
            router.push(props.url);
          }, 500);
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
              <div className={styles.imageContainer}>
                <Image src={logo}></Image>
              </div>
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


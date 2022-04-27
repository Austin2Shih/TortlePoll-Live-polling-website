import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from '../util/firebase';
import styles from '../styles/Auth.module.css'
import Image from 'next/image'
import logo from '../public/cowboy_turtle.png'
import Link from 'next/link';
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

export default function SignUp(props) {
    const [email, setEmail] = useState("");
    const [passwordOne, setPasswordOne] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const router = useRouter();
    const [error, setError] = useState(null);

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

    async function handleSignUp(e) {
      e.preventDefault();
      if(passwordOne === passwordTwo)
        await createUserWithEmailAndPassword(auth, email, passwordOne)
        .then(async (userCredential) => {
          await create_user(userCredential).then(() => {
            console.log("Success. The user is created in Firebase")
            setTimeout(() => {  
              router.push(`/demographics?redirect=${props.url}`); 
            }, 3000);
          }) 
        })
        .catch(error => {
          // An error occurred. Set error message to be displayed to user
          setError(error.message)
        });
      else
        setError("Passwords do not match")
    };

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
            <h1 className={styles.title}>Sign up</h1>
          </div>
        {error}
        <form onSubmit={handleSignUp} className={styles.flexColumn}>
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
                onChange={(e) => setPasswordOne(e.target.value)} 
                value={passwordOne}
                type="password" 
                placeholder="Password">
              </input>
            </div>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputBox}>
              <input 
                className={styles.input}
                onChange={(e) => setPasswordTwo(e.target.value)} 
                value={passwordTwo}
                type="password" 
                placeholder="Password">
              </input>
            </div>
            <button className={styles.button}>Sign Up</button>
          </form>
          <p style={{textAlign: "center", lineHeight: 0}}>or</p>
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <div className={styles.googleContainer}>
              <p>Continue with Google</p>
              <FcGoogle style={{fontSize: "1.6rem", marginLeft: "0.5rem"}}></FcGoogle>
            </div>
          </button>
          <div className={styles.wrongPlace}>
            <p>Already have an account?</p>
            <Link classname={styles.link} href={`/login?redirect=${props.url}`}>
              <a className={styles.link}>Login</a>
            </Link>
          </div>
      </div>

    </div>

  )
}
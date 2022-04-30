import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import Dropdown from '../components/Dropdown.js'
import { useUser } from '../util/auth/useUser';
import Navbar from '../components/Navbar'
import styles from '../styles/Demographics.module.css'
import Link from 'next/link'
import { updateUserCookieEthnicity, updateUserCookieGender, getUserFromCookie } from "../util/auth/userCookie";

// Variable to check if bound to authCheck
var authBound = false

export async function getServerSideProps(context) {
  const currLink = context.resolvedUrl

  const {query} = context
  let redirectLink = query.redirect
  if (!redirectLink) {
      redirectLink = '/dashboard'
  }

  return {
      props: {
          "url" : redirectLink,
          "currUrl": currLink
      }
  }
}

const ethnicities = [
  "Prefer not to say",
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Other"
]

const genders = [
  "Prefer not to say",
  "Female",
  "Male",
  "Nonbinary",
  "Other"
]

export default function Demographics(props) {
  const {user, login} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authBound) {
      auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
            router.push(`/login?redirect=${props.currUrl}`);
        }
      })
      authBound = true
    }

  }, [])

  return (
    <div className={styles.bigContainer}>
      <Navbar></Navbar>
        <div className={styles.main}>
            <div className={styles.title}>
              <p>{"Please fill out some demographic info to help provide poll creaters with additional information"}</p>
              <p>{"All fields are optional"}</p>
            </div>
            {
              user?.mongoData &&
              <div className={styles.flexColumn}>
                <Dropdown 
                  user={user}
                  title={'What ethnicity do you identify with?'}
                  options={ethnicities} 
                  initialSelection={(user.mongoData.info.ethnicity)? user.mongoData.info.ethnicity : "Select ethnicity"}
                  apiCall={'update_ethnicity'}
                  cookieUpdate={updateUserCookieEthnicity}>
                </Dropdown>
                <Dropdown 
                  user={user}
                  title={'What gender do you identify as?'}
                  options={genders} 
                  initialSelection={(user.mongoData.info.gender)? user.mongoData.info.gender : "Select gender"}
                  apiCall={'update_gender'}
                  cookieUpdate={updateUserCookieGender}>
                </Dropdown>

              </div>
            }
            <div className={styles.buttonContainer}>
              <button className={styles.button}>
                <Link href={props.url}>
                  <a className={styles.buttonText}>Continue</a></Link>
              </button>
            </div>
        </div>
    </div>
  );
}


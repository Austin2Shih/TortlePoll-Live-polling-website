import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {auth} from '../util/firebase';
import Dropdown from '../components/Dropdown.js'
import { useUser } from '../util/auth/useUser';

export async function getServerSideProps(context) {
  const currLink = context.resolvedUrl

  const {query} = context
  let redirectLink = query.redirect
  if (!redirectLink) {
      redirectLink = '/'
  }

  return {
      props: {
          "url" : redirectLink,
          "currUrl": currLink
      }
  }
}

const ethnicities = [
  "--",
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White"
]

export default function UserInfo(props) {
  const {user, login} = useUser();
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
          router.push(`/login?redirect=${props.currUrl}`);
      }
    })
  }, [])

  return (
    <div>
      {
        user?.mongoData &&
        <Dropdown user={user} options={ethnicities}></Dropdown>
      }
      
    </div>
  );
}


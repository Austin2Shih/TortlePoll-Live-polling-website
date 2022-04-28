import PollForm from '../components/PollForm';
import { useEffect } from 'react';
import { auth } from '../util/firebase';
import { useRouter } from "next/router";
import Navbar from '../components/Navbar';

// Variable to check if bound to authCheck
var authBound = false

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

export default function CreatePoll(props) {  
  const router = useRouter();


  useEffect( ()=> {
    if (!authBound) {
      auth.onAuthStateChanged((authUser) => {
          if (!authUser) {
              router.push(`/login?redirect=${props.url}`);
          }
      })
      authBound = true
    }
  }, [])

  return (
    <div>
      <Navbar></Navbar>
      <div>
        <PollForm></PollForm>
      </div>
    </div>
  )
}

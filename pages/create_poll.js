import PollForm from '../components/PollForm';
import { useUser } from '../util/auth/useUser';
import Link from 'next/link';
import { useEffect } from 'react';
import { auth } from '../util/firebase';
import { useRouter } from "next/router";
import Navbar from '../components/Navbar';

// Variable to check if bound to authCheck
var authBound = false

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

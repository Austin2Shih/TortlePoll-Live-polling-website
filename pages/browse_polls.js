import clientPromise from '../util/mongodb'
import PollForm from '../components/PollForm';
import { useUser } from '../util/auth/useUser';
import Link from 'next/link';
import { useEffect } from 'react';
import { auth } from '../util/firebase';
import { useRouter } from "next/router";
import Navbar from '../components/Navbar';


// Variable to check if bound to authCheck
var authBound = false

// Getting initial database read
export async function getServerSideProps(context) {
  const redirectLink = context.resolvedUrl

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const data = await db.collection('polls').find({}).toArray();

  return {
    props: {
      dummy: 1,
      url: redirectLink
    }
  }
}

export default function CreatePoll(props) {  
  const { user, logout} = useUser();
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

    </div>
  )
}

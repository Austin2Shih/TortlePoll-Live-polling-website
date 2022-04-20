import clientPromise from '../util/mongodb'
import PollForm from '../components/PollForm';
import { useUser } from '../util/auth/useUser';
import Link from 'next/link';
import { useEffect } from 'react';
import { auth } from '../util/firebase';
import { useRouter } from "next/router";


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

export default function Home(props) {  
  const { user, logout} = useUser();
  const router = useRouter();


  useEffect( ()=> {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
          router.push(`/login?redirect=${props.url}`);
      }
    })
  })

  return (
    <div>
      <div>
        <PollForm></PollForm>
      </div>
      {
        user?.mongoData &&
        <div>Public {JSON.stringify(user.mongoData)}</div>
      }
      
      <div><Link href="/dashboard">Go to Dashboard</Link></div>
    </div>
  )
}

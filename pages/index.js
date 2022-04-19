import clientPromise from '../util/mongodb'
import PollForm from '../components/PollForm';
import { useUser } from '../util/auth/useUser';
import Link from 'next/link';
import withAuth from '../util/auth/withAuth';

// Getting initial database read
export async function getServerSideProps(context) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const data = await db.collection('polls').find({}).toArray();

  return {
    props: {
      dummy: 1
    }
  }
}

function Home() {  
  const { user, logout} = useUser();
  
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


export default withAuth(Home);
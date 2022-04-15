import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import clientPromise from '../util/mongodb'
import PollForm from '../components/PollForm';
import { useUser } from '../util/auth/useUser';

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


export default function Home() {  
  const { user, logout } = useUser();
  return (
    <>
      <div>
        <PollForm></PollForm>
      </div>
      {
        user?.email &&
        <div>Public {user.email}</div>
      }
      
      <div><a href="/dashboard">Go to Private</a></div>
    </>
  )
}



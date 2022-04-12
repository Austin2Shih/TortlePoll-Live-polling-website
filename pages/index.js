import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import clientPromise from '../util/mongodb'
import PollForm from '../components/PollForm';

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

  return (
    <div>
      <div>
        <PollForm></PollForm>
      </div>
    </div>
  )
}



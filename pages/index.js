import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Pusher from 'pusher-js'
import { useState, useEffect } from 'react'; 
import clientPromise from '../util/mongodb'
import PollForm from '../components/PollForm';

// Initializing Pusher
var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
})

// Variable to check if binded to Pusher
var bound = false;

// Subscribing to pusher channel
const channel = pusher.subscribe('polling-development')

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



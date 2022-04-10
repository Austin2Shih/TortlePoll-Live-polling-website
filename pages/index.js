import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Pusher from 'pusher-js'
import { useState, useEffect } from 'react'; 
import { connectToDatabase } from '../util/mongodb'

// Initializing Pusher
var pusher = new Pusher('0306e332b12262d7342d', {
  cluster: 'us3',
  useTLS: true,
})

// Variable to check if binded to Pusher
var bound = false;

// Subscribing to pusher channel
const channel = pusher.subscribe('polling-development')

// Getting initial database read
export async function getServerSideProps(context) {
  const {db} = await connectToDatabase();
  const data = await db.collection("button_clicks").find({}).toArray();
  const numClicks = data[0].clicks;

  return {
    props: {
      numClicks: numClicks
    }
  }
}


export default function Home({ numClicks }) {  
  const [clicks, setClicks] = useState(numClicks);

  const handle_click = async () => {
    await fetch(`/api/handle_click`)
      .then(async response => {
        const res = await response.json()
      }).catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (!bound) {
      channel.bind('new-click', async () => {
        console.log('api call')
        const data = await fetch(`/api/get_count`)
        .then(async response => {
          const res = await response.json()
          setClicks(res.count)
        }).catch(error => {
          console.log(error)
        })
      })
      bound = true;
    }
  }, []);
  
  return (
    <div>
      <h1>{ clicks }</h1>
      <button onClick={handle_click}>ClickMe</button>
    </div>
  )
}



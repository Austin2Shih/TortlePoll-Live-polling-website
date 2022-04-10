import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Pusher from 'pusher-js'
import { useState } from 'react'; 
import { connectToDatabase } from '../util/mongodb'

var pusher = new Pusher('0306e332b12262d7342d', {
  cluster: 'us3',
  useTLS: true,
})

const channel = pusher.subscribe('polling-development')

export default function Home({ numClicks }) {
  var bound = false;
  const [clicks, setClicks] = useState(numClicks);
  
  const handle_click = async () => {
    const data = await fetch('http://localhost:3000/api/handle_click').then(async response => {
        const res = await response.json()
        return res
      }).catch(error => {
        console.log(error)
        return null;
      })
  }

  if (!bound) {
    channel.bind('new-click', async () => {
      const data = await fetch('http://localhost:3000/api/get_count').then(async response => {
        const res = await response.json()
        return res
      }).catch(error => {
        console.log(error)
        return null;
      })
      
      if (data) {
        setClicks(data.count)
      }
    })
    bound = true;
    console.log(bound)
  }
  

  return (
    <div>
      <h1>{ clicks }</h1>
      <button onClick={handle_click}>ClickMe</button>
    </div>
  )
}

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

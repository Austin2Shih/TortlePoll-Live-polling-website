import Pusher from 'pusher-js'
import { useState, useEffect } from 'react'; 
import { ObjectID } from 'bson';
import clientPromise from '../util/mongodb'
import PollDisplay from '../components/PollDisplay';

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
    const db = client.db(process.env.MONGODB_POLLS)
    const {query} = context
    const id = query.id
    const data = await db.collection("polls").findOne(
        {
            "_id": ObjectID(id)
        })

    const output = JSON.parse(JSON.stringify(data))
    return {
        props: {
            data: output
        }
    }
}

export default function Poll(props) {  

    const [pollDisp, setPollDisp] = useState(
        <PollDisplay data={props.data}></PollDisplay>
    )
    const handle_vote = async (index) => {
        await fetch(`/api/handle_click`)
        .then(async response => {
            const res = await response.json()
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (!bound) {
        channel.bind('new-vote', async () => {
            const data = await fetch(`/api/get_votes`)
            .then(async response => {
            const res = await response.json()
            }).catch(error => {
            console.log(error)
            })
        })
        bound = true;
        }
    }, []);
    
    return (
        <div>
            {pollDisp}
        </div>
    )
}



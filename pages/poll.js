import { useState, useEffect } from 'react'; 
import { ObjectID } from 'bson';
import clientPromise from '../util/mongodb'
import PollDisplay from '../components/PollDisplay';
import Pusher from 'pusher-js'

// Initializing Pusher
var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  })
  
// Variable to check if binded to Pusher
var bound = false

// Subscribing to messenger channel
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
            "data" : output
        }
    }
}

export default function Poll(props) { 
    const [pollData, setPollData] = useState(
        <PollDisplay data={props.data}></PollDisplay>
    )

    const pollID = props.data._id

    useEffect(() => {
        if (!bound) {
            channel.bind(`new-vote-${pollID}`, async () => {
                await fetch(`/api/get_votes`, {
                    method: 'POST',
                    body: JSON.stringify({
                        "_id" : `${pollID}`,
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                }).then(async (response) => {
                    await response.json().then((res) => {
                        setPollData(<PollDisplay data={res}></PollDisplay>)
                    })
                })
            }) 
                       
            bound = true
        }
    }, [pollID])
    
    return (
        <div>
            {pollData}
        </div>
    )
}



import Pusher from 'pusher-js'
import { useState, useEffect } from 'react'; 
import { ObjectID } from 'bson';
import clientPromise from '../util/mongodb'
import PollDisplay from '../components/PollDisplay';
import io from 'Socket.IO-client'

// Initializing Pusher
var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
})

// Variable to check if binded to Pusher
var bound = false

let socket

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
            "data" : output
        }
    }
}

export default function Poll(props) { 
    const [pollData, setPollData] = useState(
        <PollDisplay data={props.data}></PollDisplay>
    )
    
    const pollID = props.data._id

    useEffect(() => socketInitializer(), [])

    const socketInitializer = () => {
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on(`new-vote`, async () => {
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
            
        
    }


    // useEffect(() => {
    //     if (!bound) {
    //         channel.bind(`new-vote-${pollID}`, async () => {
    //             await fetch(`/api/get_votes`, {
    //                 method: 'POST',
    //                 body: JSON.stringify({
    //                     "_id" : `${pollID}`,
    //                 }),
    //                 headers: {
    //                     "Content-type": "application/json; charset=UTF-8"
    //                 }
    //             }).then(async (response) => {
    //                 await response.json().then((res) => {
    //                     setPollData(<PollDisplay data={res}></PollDisplay>)
    //                 })
    //             })
    //         })          
    //         bound = true
    //     }
    // }, [])
    
    return (
        <div>
            {pollData}
        </div>
    )
}



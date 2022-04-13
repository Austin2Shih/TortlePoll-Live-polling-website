import { useState, useEffect } from 'react'; 
import { ObjectID } from 'bson';
import clientPromise from '../util/mongodb'
import PollDisplay from '../components/PollDisplay';
import * as Ably from "ably";

// Subscribing to messenger channel
var receiver = new Ably.Realtime(`${process.env.NEXT_PUBLIC_ABLY_API_KEY}`)

// Variable to check if binded to Messenger channel
var bound = false

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
            var channel = receiver.channels.get(`poll-${pollID}`)
            channel.subscribe('new-vote', async () => {
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
    }, [])
    
    return (
        <div>
            {pollData}
        </div>
    )
}



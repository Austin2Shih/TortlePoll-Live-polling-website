import { useState, useEffect } from 'react'; 
import { ObjectID } from 'bson';
import clientPromise from '../util/mongodb'
import VoteDisplay from '../components/VoteDisplay';
import Pusher from 'pusher-js'
import { useUser } from '../util/auth/useUser';
import { useRouter } from "next/router";
import { auth } from '../util/firebase';
import Navbar from '../components/Navbar'

// Initializing Pusher
var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  })
  
// Variable to check if binded to Pusher
var bound = false

// Variable to check if bound to authCheck
var authBound = false

// Subscribing to messenger channel
const channel = pusher.subscribe('polling-development')

// Getting initial database read
export async function getServerSideProps(context) {
    const redirectLink = context.resolvedUrl
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
            "data" : output,
            "url" : redirectLink
        }
    }
}

export default function Vote(props) { 
    const {user, logout} = useUser();
    const router = useRouter();

    const [pollData, setPollData] = useState(
        <VoteDisplay data={props.data}></VoteDisplay>
    )

    const pollID = props.data._id

    useEffect(() => {
        if (!authBound) {
            auth.onAuthStateChanged((authUser) => {
                if (!authUser) {
                    router.push(`/login?redirect=${props.url}`);
                }
            })
            authBound = true
        }


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
                        setPollData(<VoteDisplay data={res}></VoteDisplay>)
                    })
                })
            }) 
                       
            bound = true
        }

        if (user?.mongoData && pollID) {
            const votedPolls = user.mongoData.votedPolls
            votedPolls.forEach((poll) => {
                if (poll == pollID) {
                    router.push(`/poll?id=${pollID}`)
                }
            })
        }
    }, [props, user, router])
    
    return (
        <div>
            <Navbar></Navbar>
            {pollData}
        </div>
    )
}
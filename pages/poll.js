import { useState, useEffect } from 'react'; 
import { ObjectID } from 'bson';
import clientPromise from '../util/mongodb'
import Pusher from 'pusher-js'
import { useUser } from '../util/auth/useUser';
import { useRouter } from "next/router";
import DataChart from '../components/DataChart'
import { auth } from '../util/firebase';
import styles from '../styles/Pollpage.module.css'
import Navbar from '../components/Navbar';
import { countVotes } from '../util/pollHandling';


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


export default function Poll(props) { 
    const {user, logout} = useUser();
    const router = useRouter();

    const [data, setData] = useState(props.data)
    const [numVotes, setNumVotes] = useState(countVotes(props.data.options))


    const [chart, setChart] = useState(
        <DataChart data={props.data}></DataChart>
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
                        setData(res)
                        setNumVotes(countVotes(res.options))
                        setChart(<DataChart data={res}></DataChart>)
                    })
                })
            }) 
                       
            bound = true
        }

        if (user?.mongoData && pollID) {
            let voted = false;
            const votedPolls = user.mongoData.votedPolls
            votedPolls.forEach((poll) => {
                if (poll.id == pollID) {
                    voted = true;
                }
            })
            if (!voted) {
                router.push(`/vote?id=${pollID}`)
            }
        }
    }, [props, user, router])
    
    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.main}>
                <h2 className={styles.title}>{data.question}</h2>
                <p className={styles.voteCount}>{`Total votes - ${numVotes}`}</p>
                <div>
                    {chart}
                </div>
            </div>
        </div>

    )
}
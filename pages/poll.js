import { useState, useEffect } from 'react'; 
import { ObjectID } from 'bson';
import clientPromise from '../util/mongodb'
import Pusher from 'pusher-js'
import { useUser } from '../util/auth/useUser';
import { useRouter } from "next/router";
import DataChart from '../components/DataChart'
import { auth } from '../util/firebase';
import styles from '../styles/Pollpage.module.css'
import copyStyles from '../styles/Pollform.module.css'
import Navbar from '../components/Navbar';
import { countVotes } from '../util/pollHandling';
import { AiOutlineCopy} from "react-icons/ai"
import DropdownFilter from '../components/DropdownFilter'

  // Variable to check if binded to Pusher
var bound = false

// Variable to check if bound to authCheck
var authBound = false

const ethnicities = [
    "American Indian or Alaska Native",
    "Asian",
    "Black or African American",
    "Hispanic or Latino",
    "Native Hawaiian or Other Pacific Islander",
    "White",
    "Other"
  ]
  
const genders = [
    "Female",
    "Male",
    "Nonbinary",
    "Other"
    ]

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
    const [ethnicityFilters, setEthnicityFilters] = useState({
        "American Indian or Alaska Native": false,
        "Asian" : false,
        "Black or African American" : false,
        "Hispanic or Latino" : false,
        "Native Hawaiian or Other Pacific Islander" : false,
        "White" : false,
        "Other" : false
    })

    const [genderFilters, setGenderFilters] = useState({
        "Female" : false,
        "Male" : false,
        "Nonbinary" : false,
        "Other" : false
    })

    const [copyText, setCopyText] = useState()

    const [chart, setChart] = useState(
        <DataChart data={props.data}></DataChart>
    )
    const pollID = props.data._id

    function handleEthnicityFilter(ethnicity, state) {
        ethnicityFilters[ethnicity] = state
        setChart(<DataChart data={getFilteredData()}></DataChart>)
    }

    function handleGenderFilter(gender, state) {
        genderFilters[gender] = state
        setChart(<DataChart data={getFilteredData()}></DataChart>)
    }

    // Runs through the list of filters and gets a filtered count for each vote option
    function getFilteredData() {
        const filterList1 = []  // list of ethnicites that are selected
        for (var key in ethnicityFilters) {
            if (ethnicityFilters[key]) {
                filterList1.push(key)
            }
        }

        const filterList2 = []  // list of genders that are selected
        for (var key in genderFilters) {
            if (genderFilters[key]) {
                filterList2.push(key)
            }
        }
        // if no filters, return data as is
        if (filterList1.length + filterList2.length == 0) {
            console.log(data)
            return data;
        }

        let output = JSON.parse(JSON.stringify(data))   // create copy of data to send to charts so we don't alter the real data 
        for (let i = 0; i < output.options.length; i++) {
            let count = 0;
            for (let j = 0; j < output.options[i].voters.length; j++) {
                let voted = false;
                for (let k = 0; k < filterList1.length; k++) {
                    if (filterList1[k] == output.options[i].voters[j].info.ethnicity) {
                        count++;
                        voted = true;
                    }
                }

                for (let k = 0; k < filterList2.length; k++) {
                    if (filterList2[k] == output.options[i].voters[j].info.gender && !voted) {
                        count++;
                    }
                }
            }
            output.options[i].votes = count
        }
        return output
    }


    useEffect(() => {
        if (!authBound) {
            auth.onAuthStateChanged((authUser) => {
                if (!authUser) {
                    router.push(`/login?redirect=${props.url}`);
                }
            })
            authBound = true
        }
            // Initializing Pusher
            var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                useTLS: true,
            })
            console.log("new pusher")

            // Subscribing to messenger channel
            const channel = pusher.subscribe('polling-development')
            // bind to pusher channel for live updates
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
                       
        // check to see if user has not voted on this poll yet
        // if not, send back to voting page
        if (user?.mongoData && pollID) {
            let voted = false;
            const votedPolls = user.mongoData.votedPolls
            votedPolls.forEach((poll) => {
                if (poll == pollID) {
                    voted = true;
                }
            })
            if (!voted) {
                router.push(`/vote?id=${pollID}`)
            }
        }
    }, [user])

    function copyToClipboard() {
        const tempInput = document.createElement('input')
        tempInput.value = `${process.env.NEXT_PUBLIC_VERCEL_URL}/vote${props.url.slice(5)}`
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
        setCopyText('Copied to clipboard')
        setTimeout(() => {  
          setCopyText(null)
        }, 500);
      }
    
    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.main}>
                <DropdownFilter
                    title={'Filters'}
                    ethnicityUpdate={handleEthnicityFilter}
                    genderUpdate={handleGenderFilter}
                    ethnicities={ethnicities}
                    genders={genders}>
                </DropdownFilter>
                <h2 className={styles.title}>{data.question}</h2>
                <p className={styles.voteCount}>{`Total votes - ${numVotes}`}</p>
                <div>
                    {chart}
                </div>
                <h3 style={{marginTop: '3rem'}}>Share this poll</h3>
                <div onClick={()=> {copyToClipboard()}} className={copyStyles.linkDisplayContainer}>
                    <div className={copyStyles.linkHolder}>
                        <p id='voteLink'>{`${process.env.NEXT_PUBLIC_VERCEL_URL}/vote${props.url.slice(5)}`}</p>
                    </div>
                    <AiOutlineCopy className={copyStyles.copySymbol}></AiOutlineCopy>
                </div>
                { copyText &&
                    <p style={{textAlign: 'center', lineHeight: 0}}>{copyText}</p>
                }
            </div>
        </div>

    )
}
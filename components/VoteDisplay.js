import { useEffect } from 'react'; 
import { useRouter } from "next/router";
import { useUser } from '../util/auth/useUser';
import styles from '../styles/VoteDisplay.module.css'
import { updateUserCookieVotes } from '../util/auth/userCookie';

// Variable to check if user voted
// Used to prevent multiple votes from registering if spam voting
var voted = false

export default function VoteDisplay(props) {
    const {user, logout} = useUser();
    useEffect(() => {
      voted = false
    }, [])

    const router = useRouter();

    const data = props.data
    const id = data._id

    const voteHandler = (index) => {
      return (async () => {
        if (!voted) {
          voted = true
          updateUserCookieVotes(id)
          await fetch(`/api/handle_vote`, {
            method: 'POST',
            body: JSON.stringify({
              "_id" : id,
              "index" : index,
              "user" : user.mongoData,
              "question" : data.question
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          .then(() => {
            router.push(`/poll?id=${id}`)
          })
          .catch(error => {
            console.log(error)
          })
        }
      })
    }
        return (
          <div className={styles.main}>
              <div className={styles.flexColumn}>
                <h1 className={styles.title}>{data.question}</h1>
                {
                  data.options.map((option, index) => {
                    return (
                      user?.email &&
                      <div key={index}>
                        <button className={styles.button} onClick={voteHandler(index)}>{option.option}</button>
                      </div>
                    )
                  })
                }
              </div>

          </div>
      )
  }
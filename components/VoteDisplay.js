import { useState, useEffect } from 'react'; 
import { useRouter } from "next/router";
import { useUser } from '../util/auth/useUser';

export default function VoteDisplay(props) {
    const {user, logout} = useUser();
    const [userId, setUserId] = useState()

    const router = useRouter();

    const data = props.data
    const id = data._id
    
    useEffect(() => {
      if (user?.mongoData)
      setUserId(user.mongoData._id)
    }, [user])

    const voteHandler = (index) => {
      return (async () => {
        await fetch(`/api/handle_vote`, {
          method: 'POST',
          body: JSON.stringify({
            "_id" : id,
            "index" : index,
            "userId" : userId,
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
      })
    }
        return (
          <div>
              <h1>{data.question}</h1>
              {
                data.options.map((option, index) => {
                  return (
                    user?.email &&
                    <div key={index}>
                      <button onClick={voteHandler(index)}>{option.option}</button>
                    </div>
                  )
                })
              }
          </div>
      )
  }
import { useState } from 'react'; 

export default function PollDisplay(props) {
    const data = props.data
    const id = data._id
    
    const voteHandler = (index) => {
      return (async () => {
        await fetch(`/api/handle_vote`, {
          method: 'POST',
          body: JSON.stringify({
            "_id" : id,
            "index" : index,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        .then(async (res) => {
          return res
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
                    <div key={index}>
                      <button onClick={voteHandler(index)}>{option.option}</button>
                      <h3>{option.votes}</h3>
                    </div>
                  )
                })
              }
          </div>
      )
  }
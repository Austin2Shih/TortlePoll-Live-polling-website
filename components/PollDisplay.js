import { useState } from 'react'; 

export default function PollDisplay(props) {
    const [data, setData] = useState(props.data)

    function voteHandler(index) {
      return (() => {
        await fetch(`/api/handle_vote`)
          .then(async response => {
            const res = await response.json()
            setData
          }).catch(error => {
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
                    <div>
                      <button onClick={voteHandler(index)}>{option.option}</button>
                      <h3>{option.votes}</h3>
                    </div>
                  )
                })
              }
          </div>
      )
  }
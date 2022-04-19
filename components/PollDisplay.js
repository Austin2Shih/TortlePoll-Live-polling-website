import { useState } from 'react'; 

export default function PollDisplay(props) {
    const data = props.data
    const id = data._id
    
        return (
          <div>
              <h1>{data.question}</h1>
              {
                data.options.map((option, index) => {
                  return (
                    <div key={index}>
                      <h2>{option.option}</h2>
                      <h3>{option.votes}</h3>
                    </div>
                  )
                })
              }
          </div>
      )
  }
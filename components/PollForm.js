import { useState } from 'react'; 
import Link from 'next/link';

function makeOptionsList(count) {
  const optionsList = []
  for (let i = 0; i < count; i++) {
    optionsList.push(i + 1);
  }
  return optionsList.map( (count) => {
    return (<div key={count}>
      <label htmlFor={`option${count}`}>Option {count}</label>
      <input type="text" id={`option${count}`} name={`option${count}`} required />
    </div>)
  })
  
}

var listSize = 2;

export default function PollForm() {

  const [options, setOptions] = useState(makeOptionsList(listSize))
  const [pollLink, setPollLink] = useState(null)
  const [linkText, setLinkText] = useState("")

    function increaseList() {
      listSize++;
      setOptions((makeOptionsList(listSize)))
    }

    function decreaseList() {
      if (listSize > 2) {
        listSize--;
        setOptions((makeOptionsList(listSize)))
      }
    }

    async function onSubmit(form) {
      const target = form.target
      let data = {"question" : target.question.value}
      let options = []
      for (let i = 1; i < target.length-1; i++) {
        options.push({
          id: (i - 1),
          option: target[i].value,
          votes: 0
        })
      }
      data["options"] = options
      const response = await fetch("/api/create_poll", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
  
      const res = await response.json()
  
      setPollLink(`/poll?id=${res.pollID}`)
      setLinkText("Access your poll here!")
    }

    return (
      <div>
          <iframe name="bgframe" id="bgframe" style={{display: "none"}}></iframe>
          <form action="" onSubmit={onSubmit} method="post" target="bgframe">
            <label htmlFor="question">Poll Question</label>
            <input type="text" id="question" name="question" required />
            {options}  
            <button type="submit">Submit</button>
          </form>
          <button type="text" onClick={increaseList}> + </button>
          <button type="text" onClick={decreaseList}> - </button>
          <hr></hr>
          <Link href={pollLink? pollLink: ""} target="_blank" rel="noreferrer noopener">{linkText}</Link>
      </div>
    )
  }
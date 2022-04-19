import { useState } from 'react'; 
import Link from 'next/link';
import { useUser } from '../util/auth/useUser';

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
  const { user } = useUser()
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
      form.preventDefault()
      const target = form.target
      let data = {
        "userId" : user.mongoData._id,
        "question" : target.question.value,
        "private" : target.private.checked,
        "votes" : [],

      }
      let options = []
      for (let i = 1; i < target.length-2; i++) {
        options.push({
          id: (i - 1),
          option: target[i].value,
          votes: 0,
          "voters" : []
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
          <form onSubmit={onSubmit}>
            <label htmlFor="question">Poll Question</label>
            <input type="text" id="question" name="question" required />
            {options}  
            <label></label>
            <label htmlFor="private">Private</label>
            <input type='checkbox' id="private" name="private" value="private"></input>
            <button type="submit">Submit</button>
          </form>
          <button type="text" onClick={increaseList}> Add Option </button>
          <button type="text" onClick={decreaseList}> Remove Option </button>
          <hr></hr>
          { 
            pollLink &&
            <Link href={pollLink} target="_blank" rel="noreferrer noopener">{linkText}</Link>
          }
      </div>
    )
  }
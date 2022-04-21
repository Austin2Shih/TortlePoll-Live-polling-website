import { useState } from 'react'; 
import Link from 'next/link';
import { useUser } from '../util/auth/useUser';
import styles from '../styles/Pollform.module.css'
import {AiOutlinePlus, AiOutlineMinus} from "react-icons/ai"

function makeOptionsList(count) {
  const optionsList = []
  for (let i = 0; i < count; i++) {
    optionsList.push(i + 1);
  }
  return optionsList.map( (count) => {
    return (
    <div key={count} className={styles.inputBox}>
      <input
        className={styles.input} 
        type="text" 
        id={`option${count}`} 
        name={`option${count}`} 
        placeholder={`Option ${count}`}
        required />
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
      for (let i = 4; i < target.length-1; i++) {
        options.push({
          id: (i - 4),
          option: target[i].value,
          votes: 0,
          "voters" : []
        })
      }
      data["options"] = options
      console.log(options)
      const response = await fetch("/api/create_poll", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
  
      const res = await response.json()
 
      setPollLink(`/vote?id=${res.pollID}`)
      setLinkText("Access your poll here!")
    }

    return (
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>Create a Poll</h1>
          </div>
          <form onSubmit={onSubmit}>
            <div className={styles.checkBox}>
                <label htmlFor="private">Make Private</label>
                <input type='checkbox' id="private" name="private" value="private"></input>
            </div>
            <div className={styles.flexColumn}>
              <h3 className={styles.subtitle}>Poll Question</h3>
              <div className={styles.inputBox}>
                <input 
                  className={styles.input} 
                  type="text" 
                  id="question" 
                  name="question"
                  placeholder='Poll Question' 
                  required 
                />
              </div>
            </div>
            <div className={styles.optionsButtons}>
                <button 
                  className={`${styles.button} ${styles.largeText}`} 
                  type="button" 
                  onClick={increaseList}> 
                  <AiOutlinePlus/>
                </button>
                <button 
                  className={`${styles.button} ${styles.largeText}`} 
                  type="button" 
                  onClick={decreaseList}> 
                  <AiOutlineMinus/>
                </button>
            </div>
            <div className={styles.options}>
              {options}
              <button className={styles.button} type="submit">Create Poll</button>
            </div>
          </form>
          { pollLink &&
            <div>
              <Link href={pollLink} target="_blank" rel="noreferrer noopener">{linkText}</Link>
            </div> }
        </div>
      </div>
    )
  }
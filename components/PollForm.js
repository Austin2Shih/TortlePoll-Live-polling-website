import { useState } from 'react'; 
import Link from 'next/link';
import { useUser } from '../util/auth/useUser';
import styles from '../styles/Pollform.module.css'
import {AiOutlinePlus, AiOutlineMinus} from "react-icons/ai"
import Switch from "react-switch";

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
  const [isPrivate, setPrivate] = useState(false);

  function handleSwitch(checked) {
    setPrivate(checked);
  }

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
        "private" : isPrivate,
      }
      let options = []
      for (let i = 1; i < target.length-4; i++) {
        options.push({
          id: (i - 1),
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
            <h1>Create a poll</h1>
          </div>
          <form onSubmit={onSubmit}>
            <div className={styles.flexColumn}>
              <h3 className={styles.subtitle}>Poll question</h3>
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
            <div className={styles.flexColumn}>
              <h3 className={styles.subtitle}>Answer options</h3>
              {options}
            </div>
            <div className={styles.optionsButtons}>
                <button 
                  className={`${styles.button} ${styles.blue}`} 
                  type="button" 
                  onClick={increaseList}> 
                  <div className={styles.flexRow}>
                    <AiOutlinePlus className={styles.icon}/> 
                    <p className={styles.buttonText}>Add option</p>
                  </div>
                </button>
                <button 
                  className={`${styles.button} ${styles.red}`} 
                  type="button" 
                  onClick={decreaseList}> 
                  <div className={styles.flexRow}>
                    <AiOutlineMinus className={styles.icon}/> 
                    <p className={styles.buttonText}>Remove option</p>
                  </div>
                </button>
            </div>
            <h3 style={{marginLeft: 3 + 'rem'}}>Settings</h3>
            <div className={styles.settings}>
                <p 
                    className={styles.switchText} 
                    htmlFor="private">Private (only via shared link)
                </p>
                <Switch 
                    className={styles.switch}
                    onChange={handleSwitch} 
                    checked={isPrivate} 
                    uncheckedIcon={false} 
                    checkedIcon={false}
                    height={22}
                    width={42}
                    handleDiameter={19}
                    onColor='#2BAE28'>
                    
                </Switch>
            </div>
            <button className={styles.submitButton} type="submit">
              <p className={styles.buttonText}>Create Poll</p>
            </button>
          </form>
          { pollLink &&
            <div>
              <Link href={pollLink} target="_blank" rel="noreferrer noopener">{linkText}</Link>
            </div> }
        </div>
      </div>
    )
  }
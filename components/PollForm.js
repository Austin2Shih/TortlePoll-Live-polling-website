import { useState } from 'react'; 
import Link from 'next/link';
import { useUser } from '../util/auth/useUser';
import styles from '../styles/Pollform.module.css'
import {AiOutlinePlus, AiOutlineMinus, AiOutlineCopy} from "react-icons/ai"
import Switch from "react-switch";
import { updateUserCookiePolls } from '../util/auth/userCookie';
import { animateScroll as scroll } from 'react-scroll/modules';

// Generates a div with count(amount) input fields, called when we increase or decrease the size of the form
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

let listSize = 2; // Default is 2 options

export default function PollForm() {
    const { user } = useUser()
    const [options, setOptions] = useState(makeOptionsList(listSize))
    const [pollLink, setPollLink] = useState(null)
    const [linkText, setLinkText] = useState("")
    const [copyText, setCopyText] = useState(null)
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

    function copyToClipboard() {
      const tempInput = document.createElement('input')
      tempInput.value = `${process.env.NEXT_PUBLIC_VERCEL_URL}${pollLink}`
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      setCopyText('Copied to clipboard')
      setTimeout(() => {  
        setCopyText(null)
      }, 500);
    }

    async function onSubmit(form) {
      form.preventDefault()   // don't render another page
      const target = form.target
      let data = {            // create object with info to pass to create_poll api call
        "userId" : user.mongoData._id,
        "question" : target.question.value,
        "private" : isPrivate,
      }
      // Create list of vote options and add this to data
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
      // Create poll in mongodb
      const response = await fetch("/api/create_poll", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
  
      const res = await response.json()
      updateUserCookiePolls(`${res.pollID}`)  // Update information in cookies
      setPollLink(`/vote?id=${res.pollID}`)   
      setLinkText("Access your poll here")
      setTimeout(() => {     // Scroll to bottom so user notices the new poll has been created
        scroll.scrollToBottom();
      }, 300);
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
            <div className={styles.sharePoll}>
              <h3>Share your poll</h3>
              <div onClick={()=> {copyToClipboard()}} className={styles.linkDisplayContainer}>
                <div className={styles.linkHolder}>
                  <p id='voteLink'>{`${process.env.NEXT_PUBLIC_VERCEL_URL}${pollLink}`}</p>
                </div>
                <AiOutlineCopy className={styles.copySymbol}></AiOutlineCopy>
              </div>
              { copyText &&
                <p style={{textAlign: 'center', lineHeight: 0}}>{copyText}</p>
              }
              <Link href={pollLink} target="_blank" rel="noreferrer noopener">
                <a>
                  <button className={styles.acessPollButton}>{linkText}</button>
                </a>
              </Link>
            </div> }
        </div>
      </div>
    )
  }
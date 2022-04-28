import { useState } from 'react'; 
import styles from '../styles/PollList.module.css'
import Link from 'next/link'
import { AiOutlineSearch } from 'react-icons/ai'

export default function PollList(props) {
    const [query, setQuery] = useState("")

    function filterData(data) {
        return data.filter((poll) => {
          return poll.question.includes(query)
        })
    }

    return (
      <div className={styles.main}>
        <div className={styles.inputBox}>
          <AiOutlineSearch style={{
            "fontSize": "1.5rem",
            "marginLeft": "0.6rem"
          }}></AiOutlineSearch>
          <input
            className={styles.input} 
            value={query}
            onInput={(e) => {
              return setQuery(() => e.target.value)
            }} 
            type="text" 
            placeholder="Search for a poll">
          </input>
        </div>
        <div className={styles.labels}>
            <p>Poll question</p>
            <p>Votes</p>
        </div>
        <div className={styles.scrollBox}>
            {
              filterData(props.polls).map((poll, index) => {
                  return (
                  <div key={index} className={styles.button}>
                    <Link href={`/${props.pageType}?id=${poll.id}`}>
                      <a>
                        <div className={styles.pollInfo}>
                          <div>
                            <p>{poll.question}</p>
                          </div>
                          <p>{poll.votes}</p>
                      </div>
                      </a>
                    </Link>
                  </div>
                  )
              })
            }
        </div>
      </div>
    )
  }
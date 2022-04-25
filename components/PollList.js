import { useState } from 'react'; 
import styles from '../styles/PollList.module.css'
import Link from 'next/link'

export default function PollList(props) {
    const [query, setQuery] = useState("")
    const data = props.polls

        return (
          <div className={styles.main}>
            <div className={styles.inputBox}>
              <input
                className={styles.input} 
                onChange={(e) => setQuery(e.target.value)} 
                value={query}
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
                    data.map((poll, index) => {
                        return (
                        <div key={index} className={styles.button}>
                          <Link href={`poll?id=${poll.id}`}>
                            <a>
                              <div className={styles.pollInfo}>
                                <p>{poll.question}</p>
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
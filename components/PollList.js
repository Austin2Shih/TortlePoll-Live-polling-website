import { useState } from 'react'; 
import { useRouter } from "next/router";
import { useUser } from '../util/auth/useUser';
import styles from '../styles/PollList.module.css'

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
                        <div key={index}>
                            
                        </div>
                        )
                    })
                }
            </div>
          </div>
      )
  }
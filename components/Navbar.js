import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/cowboy_turtle.png'
import { useUser } from '../util/auth/useUser'
import { useState, useEffect } from 'react'; 


export default function Navbar() {
    const {user, logout} = useUser();
    const [loginButton, setLoginButton] = useState(<Link href="/login">Log in</Link>);

    useEffect(() => {
      if (user) {
          setLoginButton(<Link href="/" onClick={() => {logout()}}>Log out</Link>)
      } else {
          setLoginButton(<Link href="/login">Log in</Link>)
      }
    }, [user])

    return (
        <div className={styles.container}>
            <ul className={styles.list}>
                <div className={styles.logoContainer}>
                    <Image src={logo}></Image>
                </div>
                <li className={styles.listItem}>
                    <Link href="/create_poll">Create poll</Link>
                </li>
                <li className={styles.listItem}>
                    <Link href="/dashboard">Broswe polls</Link>
                </li>
            </ul>
            <ul className={styles.rightList}>
                <li className={styles.listItem}>
                    {loginButton}
                </li>
                <li className={styles.listItem}>
                    <button className={styles.button}>
                        <Link href="/signup">
                            <a className={styles.buttonText}>Sign up</a>
                        </Link>
                    </button>
                </li>
            </ul>
        </div>
    )
}
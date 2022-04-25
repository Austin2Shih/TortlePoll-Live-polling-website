import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/cowboy_turtle.png'
import { useUser } from '../util/auth/useUser'
import { useState, useEffect } from 'react'
import { auth } from '../util/firebase'

export default function Navbar() {
    const {user, logout} = useUser();
    const [loginButton, setLoginButton] = useState(<Link href="/login">Log in</Link>);
    const [dashboardButton, setDashboardButton] = useState(   
    <button className={styles.button}>
        <Link href="/signup">
            <a className={styles.buttonText}>Sign up</a>
        </Link>
    </button>)

    useEffect(() => {
        if (user?.mongoData) {
            auth.onAuthStateChanged((authUser) => {
                if (authUser) {
                    setLoginButton(<button className={styles.cleanButton} onClick={logout('/')}>Log out</button>)
                    setDashboardButton(                    
                        <button className={styles.buttonBlue}>
                            <Link href={`/dashboard?id=${user.mongoData._id}`}>
                                <a className={styles.buttonText}>Dashboard</a>
                            </Link>
                        </button>)
                } else {
                    setLoginButton(<Link href="/login">Log in</Link>)
                    setDashboardButton(                    
                        <button className={styles.button}>
                            <Link href="/signup">
                                <a className={styles.buttonText}>Sign up</a>
                            </Link>
                        </button>)
                }})
        }

    },[user?.mongoData])
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
                    <Link href="/browse_polls">Broswe polls</Link>
                </li>
            </ul>
            <ul className={styles.rightList}>
                <li className={styles.listItem}>
                    {loginButton}
                </li>
                <li className={styles.listItem}>
                    {dashboardButton}
                </li>
            </ul>
        </div>
    )
}
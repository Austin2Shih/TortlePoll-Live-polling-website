import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/cowboy_turtle.png'
export default function Navbar() {
    return (
        <div className={styles.container}>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <Link href="/create_poll">Create poll</Link>
                </li>
                <li className={styles.listItem}>
                    <Link href="/dashboard">Broswe polls</Link>
                </li>
            </ul>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <Link href="/login">Log in</Link>
                </li>
                <li className={styles.listItem}>
                    <button className={styles.button}>
                        <Link href="/signup">Sign up</Link>
                    </button>
                </li>
            </ul>
        </div>
    )
}
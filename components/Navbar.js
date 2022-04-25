import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/cowboy_turtle.png'
import { useUser } from '../util/auth/useUser'

export default function Navbar() {
    const {user, logout} = useUser();
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
            {
                (user?.mongoData)?   
                <ul className={styles.rightList}>
                    <li className={styles.listItem}>
                        <button className={styles.cleanButton} onClick={logout('/')}>Log out</button>
                    </li>
                    <li className={styles.listItem}>
                        <button className={styles.buttonBlue}>
                            <Link href={`/dashboard?id=${user.mongoData._id}`}>
                                <a className={styles.buttonText}>Dashboard</a>
                            </Link>
                        </button>
                    </li>
                </ul> : 
                <ul className={styles.rightList}>
                    <li className={styles.listItem}>
                        <Link href="/login">Log in</Link>                    </li>
                    <li className={styles.listItem}>
                        <button className={styles.button}>
                            <Link href="/signup">
                                <a className={styles.buttonText}>Sign up</a>
                            </Link>
                        </button>
                    </li>
                </ul>
            }

        </div>
    )
}
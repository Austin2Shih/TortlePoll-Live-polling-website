import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
export default function Navbar() {
    return (
        <div className={styles.container}>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
            </ul>
        </div>
    )
}
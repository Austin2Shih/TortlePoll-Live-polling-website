import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/Tortlepoll logo.png'
import { useUser } from '../util/auth/useUser'
import { useState, useEffect, useCallback } from 'react'
import { auth } from '../util/firebase'
import { getUserFromCookie } from '../util/auth/userCookie'
import { GrMenu, GrClose } from 'react-icons/gr'

const useMediaQuery = (width) => {
    const [targetReached, setTargetReached] = useState(false);
  
    const updateTarget = useCallback((e) => {
      if (e.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    }, []);
  
    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addListener(updateTarget);
  
      // Check on mount (callback is not called until a change occurs)
      if (media.matches) {
        setTargetReached(true);
      }
  
      return () => media.removeListener(updateTarget);
    }, []);
  
    return targetReached;
  };


export default function Navbar() {

    const isBreakpoint = useMediaQuery(740)

    const {user, logout} = useUser();
    const [loginButton, setLoginButton] = useState(<Link href="/login">Log in</Link>);
    const [dashboardButton, setDashboardButton] = useState(   
    <button className={styles.button}>
        <Link href="/signup">
            <a className={styles.buttonText}>Sign up</a>
        </Link>
    </button>)
    const [menu, setMenu] = useState(false)

    useEffect(() => {
        if (user?.mongoData) {
            auth.onAuthStateChanged((authUser) => {
                if (authUser) {
                    const insideUser = getUserFromCookie()
                    setLoginButton(<button className={styles.cleanButton} onClick={logout('/')}>Log out</button>)
                    setDashboardButton(                    
                        <button className={styles.buttonBlue}>
                            <Link href={`/dashboard?id=${insideUser.mongoData._id}`}>
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
            <div className={styles.logoContainer}>
                <Link href="/">
                    <a><Image src={logo}></Image></a>
                </Link>
            </div>
            { (!isBreakpoint)?
                <div className={styles.listContainer}>
                    <ul className={styles.list}>
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
                </div> : 
                <div>
                        {menu &&
                        <div className={styles.mobileListContainer}>
                            <ul className={styles.mobileList}>
                                <li className={styles.mobileListItem}>
                                    <Link href="/create_poll">Create poll</Link>
                                </li>
                                <li className={styles.mobileListItem}>
                                    <Link href="/browse_polls">Broswe polls</Link>
                                </li>
                                <li className={styles.mobileListItem}>
                                    {dashboardButton}
                                </li>
                                <li className={styles.mobileListItem}>
                                    {loginButton}
                                </li>
                            </ul>
                        </div>

                        }
                    {(!menu)? 
                        <GrMenu onClick={()=>{setMenu(!menu)}} className={styles.menuIcon}></GrMenu> :
                        <GrClose onClick={()=>{setMenu(!menu)}} className={styles.closeMenuIcon}></GrClose>}
                </div>


            }
        </div>
    )
}
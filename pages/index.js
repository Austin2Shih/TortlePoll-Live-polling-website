import { useRouter } from "next/router";
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import pollImage from '../public/home-images/Poll-pic.PNG'

export default function Home() {  

  return (
    <div>
      <Navbar></Navbar>
      <div className={styles.subtitleBlock}>
        <div className={styles.imageContainer}>
          <p style={{fontSize: "2rem", lineHeight: "0.5rem"}}>Enjoy live results</p>
        </div>
      </div>
      <div className={styles.imageBlock}>
        <div className={styles.imageContainer}>
          <Image src={pollImage}></Image>
        </div>
      </div>
      <div className={styles.subtitleBlock}>
        <div className={styles.imageContainer}>
          <p style={{fontSize: "2rem", lineHeight: "0.5rem"}}>Filter by demographic groups</p>
        </div>
      </div>
      <div className={styles.imageBlock}>
        <div className={styles.imageContainer}>
          <Image src={pollImage}></Image>
        </div>
      </div>
    </div>
  )
}

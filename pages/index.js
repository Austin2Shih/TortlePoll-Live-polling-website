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
          <p style={{fontSize: "2rem"}}>Enjoy live results</p>
        </div>
      </div>
      <div className={styles.imageBlock}>
        <div className={styles.imageContainer}>
          <Image src={pollImage}></Image>
        </div>
      </div>
      <div className={styles.subtitleBlock}>
        <div className={styles.imageContainer}>
          <p style={{fontSize: "2rem"}}>Filter by demographic groups</p>
        </div>
      </div>
      <div className={styles.imageBlock}>
        <div className={styles.videoContainer}>
        <iframe className={styles.vidFrame} frameBorder="0" width="100%" height="100%" src="https://drive.google.com/file/d/1V-pbJNbonVQ2Rt86bwpyUJG9SUk2QCga/preview"></iframe>
        </div>
      </div>
    </div>
  )
}

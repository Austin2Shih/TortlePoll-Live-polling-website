import { useRouter } from "next/router";
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import pollImage from '../public/home-images/Poll-pic.PNG'

export default function Home() {  

  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <div className={styles.subtitleBlock}>
          <p style={{fontSize: "1.4rem"}}>Enjoy live results</p>
        </div>
      <div className={styles.imageBlock}>
        <div className={styles.videoContainer}>
          <video className={styles.vidFrame} autoPlay muted loop>
            <source src={'https://res.cloudinary.com/dkmgxd9ef/video/upload/v1651213670/TortlePoll/Lasagna-clip_dmfgly.mp4'}></source>
          </video>
        </div>
      </div>
      <div className={styles.subtitleBlock}>
        <div className={styles.imageContainer}>
          <p style={{fontSize: "1.4rem"}}>Filter by demographic groups</p>
        </div>
      </div>
      <div className={styles.imageBlock}>
        <div className={styles.videoContainer}>
          <video className={styles.vidFrame} autoPlay muted loop>
            <source src={'https://res.cloudinary.com/dkmgxd9ef/video/upload/v1651173771/TortlePoll/Filter-polls_nmkd5d.mp4'}></source>
          </video>
        </div>
      </div>
    </div>
  )
}

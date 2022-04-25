import { useUser } from '../util/auth/useUser';
import { useEffect } from 'react';
import { auth } from '../util/firebase';
import { useRouter } from "next/router";
import Navbar from '../components/Navbar';
import styles from '../styles/Dashboard.module.css'
import PollList from '../components/PollList'



// Variable to check if bound to authCheck
var authBound = false

export async function getServerSideProps(context) {
  const redirectLink = context.resolvedUrl

  return {
      props: {
          "url" : redirectLink,
      }
  }
}

export default function Dashboard(props){
  const { user, logout } = useUser();
  const router = useRouter();


  useEffect( ()=> {
    if (!authBound) {
      auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
            router.push(`/login?redirect=${props.url}`);
        }
      })
      authBound = true
    }

  })

  return (
    <div >
      <Navbar></Navbar>
      <div className={styles.main}>
        <PollList></PollList>
      </div>
    </div>
  )
}

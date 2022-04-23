import withAuth from '../util/auth/withAuth';
import { useUser } from '../util/auth/useUser';
import { useEffect } from 'react';
import { auth } from '../util/firebase';
import { useRouter } from "next/router";
import Navbar from '../components/Navbar';

export async function getServerSideProps(context) {
  const redirectLink = context.resolvedUrl

  return {
      props: {
          "url" : redirectLink
      }
  }
}

export default function Dashboard(props){
  const { user, logout } = useUser();
  const router = useRouter();


  useEffect( ()=> {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
          router.push(`/login?redirect=${props.url}`);
      }
    })
  })

  return (
    <div >
      <Navbar></Navbar>
      <div>Private</div>
      {
        user?.email &&
        <div>
          <div>Email: {user.email}</div>
          <button onClick={logout('/login')}>Logout</button>
        </div> 
      }
      
    </div>
  )
}

import withAuth from '../util/auth/withAuth';
import { useUser } from '../util/auth/useUser';
import { useRouter } from "next/router";

const Dashboard = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  return (
    <div >
      <div>Private</div>
      {
        user?.email &&
        <div>
          <div>Email: {user.email}</div>
          <button onClick={logout('/')}>Logout</button>
        </div> 
      }
      
    </div>
  )
}

export default withAuth(Dashboard);
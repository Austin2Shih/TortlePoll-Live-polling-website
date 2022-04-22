import { useRouter } from "next/router";
import Navbar from '../components/Navbar';


export default function Home(props) {  
  const router = useRouter();


  return (
    <div>
      <Navbar></Navbar>
    </div>
  )
}

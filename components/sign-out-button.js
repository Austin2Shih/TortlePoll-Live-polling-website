import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../util/AuthUserContext';

const LoggedIn = () => {
  const { authUser, loading, signOut } = useAuth();
  const router = useRouter();

  // Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (!loading && !authUser)
      router.push('/')
  }, [authUser, loading])

  return (
      <Button onClick={signOut}>Sign out</Button>
  )
}

export default LoggedIn;
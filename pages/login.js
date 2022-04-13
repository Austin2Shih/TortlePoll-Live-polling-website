import { Magic } from 'magic-sdk'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const handleSubmit = async (event) => {
    event.preventDefault()

    const { elements } = event.target

    // Sending user to Magic Login

    const did = await new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
                    .auth
                    .loginWithMagicLink({email: elements.email.value})

    // Once we have the token from magic,
    // update our own database
    
    const authRequest = await fetch('/api/login', {
        method: 'POST',
        header: { Authorization: `Bearer ${did}`}
    })

    if (authRequest.ok) {
        // We successfully logged in, our API
        // set authorization cookies and now we
        // can redirect to the dashboard!
        router.push('/dashboard')
      } else { /* handle errors */ }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input name="email" type="email" />
      <button>Log in</button>
    </form>
  )
}
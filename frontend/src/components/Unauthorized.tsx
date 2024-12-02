import { useState } from 'react'
import { login } from '../utils'

export default function Unauthorized({
  setIsAuthenticated,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [error, setError] = useState(false)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fiels = new FormData(e.currentTarget)

    const email = fiels.get('email') as string
    const password = fiels.get('password') as string

    login(email, password)
      .then(() => {
        setIsAuthenticated(true)
        setError(false)
      })
      .catch(() => setError(true))
    e.currentTarget.reset()
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      <label htmlFor="email" className="flex flex-col gap-1">
        Email
        <input type="email" name="email" className="py-2 px-4 rounded-lg" />
      </label>
      <label htmlFor="password" className="flex flex-col gap-1">
        Password
        <input
          type="password"
          name="password"
          className="py-2 px-4 rounded-lg"
        />
      </label>
      <button>Login</button>
      {error && <p className="text-center text-red-600">Datos incorrectos</p>}
    </form>
  )
}

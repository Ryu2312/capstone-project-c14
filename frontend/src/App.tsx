import { useEffect, useState } from 'react'
import Authenticated from './components/Authenticated'
import Unauthorized from './components/Unauthorized'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const name = 'Alexis Lazo'
  const email = 'paulo@gmail.com'
  const password = '123456'
  const age = 27
  const role = 'admin'

  useEffect(() => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ name, email, age, role, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    fetch('/signup', options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem('user', 'userdefault')
        }
      })

    const savedToken = localStorage.getItem('token')

    console.log('render', savedToken)
    if (savedToken) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <div className="relative w-screen max-w-7xl h-full flex flex-col items-center justify-center gap-10 p-10">
      <header className="w-full max-w-7xl">
        <h1 className="text-center">Sistema de Carga de Datos</h1>
        {isAuthenticated && (
          <button onClick={handleLogout} className="absolute top-5 right-10">
            Logout
          </button>
        )}
      </header>
      <main className="w-full rounded-2xl flex justify-center ">
        {isAuthenticated ? (
          <Authenticated />
        ) : (
          <Unauthorized setIsAuthenticated={setIsAuthenticated} />
        )}
      </main>
    </div>
  )
}

export default App

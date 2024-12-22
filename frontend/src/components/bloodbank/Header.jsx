import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear any stored tokens or session data
    localStorage.removeItem('bloodBankToken')
    navigate('/')
  }

  return (
 
    
    <header className="bg-white/95 backdrop-blur-sm shadow-md">
    <div className="mx-auto max-w-7xl px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-4xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition-colors">
          B-Link
        </Link>
        <button
          onClick={() => {
            // Add logout logic here
            navigate('/')
          }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
        >
          Sign Out
        </button>
      </div>
    </div>
  </header>
  )
}

export default Header

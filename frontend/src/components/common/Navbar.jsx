import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white shadow-md">
      <nav className="w-full">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="text-2xl font-bold text-red-700">B-Link</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/" 
                  className="text-gray-800 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-red-500 hover:text-red-700"
                >
                  Home
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <Link 
                to="/bloodbank/account" 
                className="p-2 text-gray-700 hover:text-red-700 transition-colors duration-200"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden ml-2 p-2 rounded-md text-gray-700 hover:text-red-700 focus:outline-none"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                to="/"
                className="block py-2 text-base font-medium text-gray-800 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200"
              >
                Home
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar

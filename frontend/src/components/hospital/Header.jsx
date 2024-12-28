import { Link } from 'react-router-dom'

export default function Header() {
    return(
      <header className="bg-white/95 backdrop-blur-sm shadow-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/hospital/dashboard" className="text-4xl font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition-colors">
            B-Link
          </Link>
          <button
            onClick={() => {
              navigate('/')
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
    )
}
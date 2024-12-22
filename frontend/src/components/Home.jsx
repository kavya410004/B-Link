import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition-colors">
              B-Link
            </Link>
          </div>
        </div>
      </header>
      
      <div className="relative bg-gray-50 pt-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <div className="text-center max-w-4xl">
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block text-red-700">B-Link</span>
                <span className="block text-gray-800">A Blockchain-Driven Blood Network</span>
              </h1>
              <p className="mt-3 text-xl text-gray-700 sm:mt-5">
                Connecting blood banks, hospitals, and donors through secure blockchain technology.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/bloodbank/login"
                  className="w-full sm:w-40 px-8 py-3 text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-md"
                >
                  Blood Bank
                </Link>
                <Link
                  to="/hospital/login"
                  className="w-full sm:w-40 px-8 py-3 text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-md"
                >
                  Hospital
                </Link>
                <Link
                  to="/donor"
                  className="w-full sm:w-40 px-8 py-3 text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors duration-200 shadow-md"
                >
                  Donor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-64 sm:h-96 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="Blood donation"
        />
      </div>
    </div>
  )
}

export default Home

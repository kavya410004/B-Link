import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'; // Import axios for making HTTP requests
import { useAuth } from '../../AuthContext'; // Import useAuth

const HospitalLogin = () => {
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    hospitalId: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(''); // Clear previous error messages

    try {
      const response = await axios.post('http://localhost:3000/api/hospital/login', formData);
      console.log(response.data);
      login(response.data); // Call login with user data
      // If successful, redirect to dashboard
      navigate('/hospital/dashboard');
    } catch (error) {
      // Handle error response
      if (error.response) {
        console.log(error.response.data.error);
        setErrorMessage(error.response.data.error || 'Login failed');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition-colors">
              B-Link
            </Link>
          </div>
        </div>
      </header>

      <div className="mt-8 max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">LOG IN</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please login to your account
          </p>
        </div>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>} {/* Display error message */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 mb-2">
                Hospital ID
              </label>
              <input
                id="hospitalId"
                name="hospitalId"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 mb-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your hospital ID"
                value={formData.hospitalId}
                onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/hospital/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default HospitalLogin

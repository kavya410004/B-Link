import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // Import useAuth

const BloodBankLogin = () => {
  const { login } = useAuth(); // Get login function from context
  const [formData, setFormData] = useState({
    licenseNumber: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(''); // Clear previous error messages

    try {
      const response = await axios.post('http://localhost:3000/api/bloodbank/login', formData);
      console.log(response.data);
      login(response.data); // Call login with user data
      // If successful, redirect to dashboard
      navigate('/bloodbank/dashboard');
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
            <Link to="/" className="text-4xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition-colors">
              B-Link
            </Link>
          </div>
        </div>
      </header>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">LOG IN</h2>
        </div>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>} {/* Display error message */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="license-number" className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                id="license-number"
                name="licenseNumber"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 mb-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Enter your license number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/bloodbank/register" className="font-medium text-red-600 hover:text-red-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BloodBankLogin

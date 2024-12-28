import { useState } from 'react'
import { Link } from 'react-router-dom'

const DonorStatus = () => {
  const [donorId, setDonorId] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`/api/donor/status/${donorId}`)
      const data = await response.json() || {
        donorId: "D123456",
        bloodType: "O+",
        status: "TESTED_SAFE",
        units: 1,
        hospital: "City General Hospital",
        testResults: {
          hiv: "Negative",
          hepatitisB: "Negative",
          hepatitisC: "Negative",
          syphilis: "Negative",
          malaria: "Negative"
        }
      }      
      
      if (response.ok) {
        setSearchResult(data)
      } else {
        setError(data.message || 'Failed to fetch donor status')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }

    // Dummy variable to simulate API response
    const dummyResult = {
      donorId: donorId,
      status: 'TESTED_SAFE',
      bloodType: 'O+',
      units: 1
    };
    setResult(dummyResult);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition-colors">
              B-Link
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Donation Status</h1>
          <p className="text-gray-600">Enter your Donor ID to check the status of your blood donation</p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearch} className="bg-white shadow-sm rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="donorId" className="block text-sm font-medium text-gray-700 mb-2">
                Donor ID
              </label>
              <input
                type="text"
                id="donorId"
                value={donorId}
                onChange={(e) => setDonorId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your donor ID"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Error Message removed */}
          
          {/* Results */}
          {searchResult && (
            <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Donation Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Donor ID</p>
                  <p className="text-gray-900">{searchResult.donorId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="text-gray-900">{searchResult.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${searchResult.status === 'TESTED_SAFE' ? 'bg-green-100 text-green-800' :
                      searchResult.status === 'NOT_VERIFIED' ? 'bg-yellow-100 text-yellow-800' :
                      searchResult.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}>  
                    {searchResult.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Units</p>
                  <p className="text-gray-900">{searchResult.units}</p>
                </div>
              </div>
            </div>
          )}
          {result && (
            <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Donor ID</p>
                  <p className="text-gray-900">{result.donorId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-gray-900">{result.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="text-gray-900">{result.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Units</p>
                  <p className="text-gray-900">{result.units}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DonorStatus
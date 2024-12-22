import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'

const bloodTypes = ['A', 'B', 'AB', 'O']
const rhTypes = ['+', '-']

const AddRecipient = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    rhType: ''
  })
  const [matchingResults, setMatchingResults] = useState([])

  // Mock matching results - replace with actual API call
  const mockMatchingResults = [
    { id: 1, bloodType: 'A+', hospital: 'City Blood Bank', distance: '2.5km', quantity: 2 },
    { id: 2, bloodType: 'A+', hospital: 'Central Blood Bank', distance: '5km', quantity: 1 },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mock API call - replace with actual API endpoint
    try {
      // Simulating API call
      setMatchingResults(mockMatchingResults)
      setShowModal(true)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSelectOption = (option) => {
    // Handle the selected option
    // Add logic to reserve the blood unit
    navigate('/hospital/requests')
  }

  const handleIncompatibleOptions = () => {
    // Handle when no compatible options are found
    navigate('/hospital/requests')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Add Recipient</h2>
          <p className="mt-2 text-gray-600">Enter recipient details to find matching blood units</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Recipient Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                Blood Type
              </label>
              <select
                id="bloodType"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              >
                <option value="">Select</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rhType" className="block text-sm font-medium text-gray-700">
                Rh Type
              </label>
              <select
                id="rhType"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.rhType}
                onChange={(e) => setFormData({ ...formData, rhType: e.target.value })}
              >
                <option value="">Select</option>
                {rhTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Find Matching Units
          </button>
        </form>
      </div>

      {/* Modal for displaying matching results */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Matching Blood Units
                  </h3>
                  <div className="mt-2 space-y-4">
                    {matchingResults.map((result) => (
                      <div
                        key={result.id}
                        className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                        onClick={() => handleSelectOption(result)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{result.hospital}</p>
                            <p className="text-sm text-gray-500">Blood Type: {result.bloodType}</p>
                            <p className="text-sm text-gray-500">Distance: {result.distance}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{result.quantity} units</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleIncompatibleOptions}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Incompatible Options
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddRecipient

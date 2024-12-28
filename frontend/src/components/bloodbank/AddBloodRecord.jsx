import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Modal = ({ open, onClose, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30" aria-hidden="true">
      <div className="fixed inset-0  p-4">
        <div className="mx-auto max-w-xl rounded bg-white p-6 relative">
          {children}
          <button onClick={onClose} className="absolute bg-gray-100 top-4 right-4 text-gray-700 hover:bg-gray-300 focus:outline-none">
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

const AddBloodRecord = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    donorName: '',
    phoneNumber: '',
    address: '',
    bloodType: '',
    rhType: '',
    quantity: '',
  })
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [matchingResults, setMatchingResults] = useState([])

  // Mock matching results - replace with actual API call
  const mockMatchingResults = [
    { id: 1, bloodType: 'A+', hospital: 'City Blood Bank', distance: '2.5km', quantity: 2 },
    { id: 2, bloodType: 'B-', hospital: 'Central Blood Bank', distance: '5km', quantity: 1 },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulating API call
    setMatchingResults(mockMatchingResults)
    setShowResultsModal(true)
  }

  const handleSelectOption = (option) => {
    // Handle the selected option
    console.log('Selected option:', option)
    onClose() // Close the modal after selection
  }

  const handleIncompatibleOptions = () => {
    console.log('No compatible options found')
    onClose() // Close the modal
  }

  return (
    <div>
      <Modal open={isOpen} onClose={onClose}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Add Blood Record</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Donor Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <select
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.bloodType}
              onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
            >
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rh Type</label>
            <select
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.rhType}
              onChange={(e) => setFormData({ ...formData, rhType: e.target.value })}
            >
              <option value="">Select</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity (in ml)</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Record
          </button>
        </form>
      </Modal>

      {/* Modal for displaying matching results */}
      {showResultsModal && (
        <Modal open={showResultsModal} onClose={() => setShowResultsModal(false)}>
          <h3 className="text-lg font-medium text-gray-900">Matching Blood Units</h3>
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
        </Modal>
      )}
    </div>
  )
}

export default AddBloodRecord

import { useState, useEffect } from 'react'
import Header from './Header'
import { useBloodRecords } from '../../context/BloodRecordContext'

const UnverifiedUnits = () => {
  const { allRecords, isLoading, fetchAllRecords, getFilteredRecords, updateRecord } = useBloodRecords()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBloodId, setSelectedBloodId] = useState(null)
  const [testResults, setTestResults] = useState({
    hivTest: 'negative',
    hepatitisB: 'negative',
    hepatitisC: 'negative',
    syphilis: 'negative',
    malaria: 'negative',
    notes: '',
    isSafe: true
  })

  console.log("Unverified Units")
  console.log(localStorage.getItem('user'))

  useEffect(() => {
    fetchAllRecords()
  }, [fetchAllRecords])

  const unverifiedRecords = getFilteredRecords('NOT_VERIFIED')

  const handleUpdateClick = (bloodId) => {
    setSelectedBloodId(bloodId)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateRecord(selectedBloodId, testResults)
      setIsModalOpen(false)
      setTestResults({
        hivTest: 'negative',
        hepatitisB: 'negative',
        hepatitisC: 'negative',
        syphilis: 'negative',
        malaria: 'negative',
        notes: '',
        isSafe: true
      })
    } catch (error) {
      console.error('Error updating test results:', error)
    }
  }

  const CustomTable = ({ records }) => (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Blood ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Donor ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Units</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.bloodId}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.donorId}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.bloodType}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.units}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                        Not Verified
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleUpdateClick(record.bloodId)}
                        className="inline-flex items-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Update Test Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Unverified Blood Units</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
          </div>
        ) : unverifiedRecords.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <p className="text-lg text-gray-600">No unverified blood units found.</p>
          </div>
        ) : (
          <CustomTable records={unverifiedRecords} />
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Update Test Results</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 inline-flex items-center bg-gray-100 justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                  title="Close modal"
                >
                  <span className="sr-only">Close</span>
                  <svg 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Disease Tests</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['HIV Test', 'Hepatitis B', 'Hepatitis C', 'Syphilis', 'Malaria'].map((test) => (
                      <div key={test}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{test}</label>
                        <select
                          className="form-select block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-red-500 focus:ring-red-500"
                          value={testResults[test.toLowerCase().replace(' ', '')]}
                          onChange={(e) => {
                            const newValue = e.target.value
                            setTestResults(prev => ({
                              ...prev,
                              [test.toLowerCase().replace(' ', '')]: newValue,
                              isSafe: newValue === 'negative' && prev.isSafe
                            }))
                          }}
                          required
                        >
                          <option value="negative">Negative</option>
                          <option value="positive">Positive</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={4}
                    className="form-textarea block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-red-500 focus:ring-red-500"
                    value={testResults.notes}
                    onChange={(e) => setTestResults({ ...testResults, notes: e.target.value })}
                    placeholder="Enter any additional observations or notes..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Submit Results
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnverifiedUnits

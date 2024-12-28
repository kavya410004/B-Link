import { useEffect, useState } from 'react'
import Header from './Header'
import BloodRecordTable from './BloodRecordTable'
import AddBloodRecord from './AddBloodRecord'
import { useBloodRecords } from '../../context/BloodRecordContext'
import { useNavigate } from 'react-router-dom'

const BloodRecords = () => {
  const { allRecords, isLoading, fetchAllRecords } = useBloodRecords()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  console.log("Blood Records")
  console.log(localStorage.getItem('user'))

  useEffect(() => {
    fetchAllRecords()
  }, [fetchAllRecords])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-10">
        {/* <button onClick={() => navigate('/bloodbank/dashboard')} className="cursor-pointer duration-200  inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 outline outline-1 outline-red-700 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors whitespace-nowrap" title="Go Back">
          <svg xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" viewBox="0 0 24 24" class="stroke-red-600">
            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
          </svg>
        </button> */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Blood Records</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-5 right-5 bg-red-600 text-white rounded-full p-3 shadow-lg hover:bg-red-700 transition duration-200"
          >
            + Add Record
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : allRecords.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-600">No blood records found.</p>
          </div>
        ) : (
          <BloodRecordTable records={allRecords} />
        )}
      </div>
      <AddBloodRecord isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default BloodRecords

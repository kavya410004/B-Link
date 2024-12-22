import { useState, useEffect } from 'react'
import Header from './Header'
import BloodRecordTable from './BloodRecordTable'
import { getReservedBloodRecords } from '../../services/bloodRecordService'

const ReservedUnits = () => {
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReservedRecords = async () => {
      try {
        const data = await getReservedBloodRecords()
        setRecords(data)
      } catch (error) {
        console.error('Error fetching reserved records:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReservedRecords()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reserved Blood Units</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-600">No reserved blood units found.</p>
          </div>
        ) : (
          <BloodRecordTable records={records} />
        )}
      </div>
    </div>
  )
}

export default ReservedUnits

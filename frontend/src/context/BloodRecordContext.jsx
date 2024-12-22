import { createContext, useContext, useState, useCallback } from 'react'
import { getBloodRecords, getReservedBloodRecords, getUnverifiedBloodRecords, updateTestResults } from '../services/bloodRecordService'

const BloodRecordContext = createContext()

export const BloodRecordProvider = ({ children }) => {
  const [allRecords, setAllRecords] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAllRecords = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getBloodRecords()
      setAllRecords(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch blood records')
      console.error('Error fetching blood records:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFilteredRecords = useCallback((status) => {
    return allRecords.filter(record => record.status === status)
  }, [allRecords])

  const updateRecord = useCallback(async (bloodId, testResults) => {
    setIsLoading(true)
    try {
      const updatedRecord = await updateTestResults(bloodId, testResults)
      setAllRecords(prev => prev.map(record => 
        record.bloodId === bloodId ? updatedRecord : record
      ))
      setError(null)
      return updatedRecord
    } catch (err) {
      setError('Failed to update blood record')
      console.error('Error updating blood record:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addRecord = useCallback((newRecord) => {
    setAllRecords(prev => [...prev, newRecord])
  }, [])

  const value = {
    allRecords,
    isLoading,
    error,
    fetchAllRecords,
    getFilteredRecords,
    updateRecord,
    addRecord
  }

  return (
    <BloodRecordContext.Provider value={value}>
      {children}
    </BloodRecordContext.Provider>
  )
}

export const useBloodRecords = () => {
  const context = useContext(BloodRecordContext)
  if (!context) {
    throw new Error('useBloodRecords must be used within a BloodRecordProvider')
  }
  return context
}

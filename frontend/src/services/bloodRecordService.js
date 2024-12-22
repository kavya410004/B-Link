// Mock data
const mockBloodRecords = [
  {
    id: 1,
    bloodId: 'B001',
    donorId: 'D001',
    bloodType: 'A+',
    units: 2,
    status: 'TESTED_SAFE'
  },
  {
    id: 2,
    bloodId: 'B002',
    donorId: 'D002',
    bloodType: 'O-',
    units: 1,
    status: 'NOT_VERIFIED'
  },
  {
    id: 3,
    bloodId: 'B003',
    donorId: 'D003',
    bloodType: 'B+',
    units: 3,
    status: 'RESERVED',
    reservedBy: 'Apollo Hospital',
    reservedDate: '2024-12-20'
  },
  {
    id: 4,
    bloodId: 'B004',
    donorId: 'D004',
    bloodType: 'AB+',
    units: 1,
    status: 'NOT_VERIFIED'
  },
  {
    id: 5,
    bloodId: 'B005',
    donorId: 'D005',
    bloodType: 'A-',
    units: 2,
    status: 'RESERVED',
    reservedBy: 'City Hospital',
    reservedDate: '2024-12-21'
  }
]

export const getBloodRecords = () => {
  // Simulate API call
  return Promise.resolve(mockBloodRecords)
}

export const getReservedBloodRecords = () => {
  // Simulate API call to get only reserved blood units
  const reservedRecords = mockBloodRecords.filter(record => record.status === 'RESERVED')
  return Promise.resolve(reservedRecords)
}

export const getUnverifiedBloodRecords = () => {
  // Simulate API call to get only unverified blood units
  const unverifiedRecords = mockBloodRecords.filter(record => record.status === 'NOT_VERIFIED')
  return Promise.resolve(unverifiedRecords)
}

export const updateTestResults = async (bloodId, testResults) => {
  // Simulate API call to update test results
  const recordIndex = mockBloodRecords.findIndex(record => record.bloodId === bloodId)
  if (recordIndex === -1) {
    throw new Error('Blood record not found')
  }

  mockBloodRecords[recordIndex] = {
    ...mockBloodRecords[recordIndex],
    ...testResults,
    status: testResults.isSafe ? 'TESTED_SAFE' : 'EXPIRED'
  }

  return Promise.resolve(mockBloodRecords[recordIndex])
}

export const addBloodRecord = (record) => {
  // Simulate API call
  const newRecord = {
    ...record,
    id: mockBloodRecords.length + 1,
    bloodId: `B${String(mockBloodRecords.length + 1).padStart(3, '0')}`,
    status: 'NOT_VERIFIED'
  }
  mockBloodRecords.push(newRecord)
  return Promise.resolve(newRecord)
}

import React from 'react'

const BloodRecordTable = ({ records }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'TESTED_SAFE':
        return 'bg-green-100 text-green-800'
      case 'NOT_VERIFIED':
        return 'bg-yellow-100 text-yellow-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
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
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(record.status)}`}>
                        {record.status.replace('_', ' ')}
                      </span>
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
}

export default BloodRecordTable

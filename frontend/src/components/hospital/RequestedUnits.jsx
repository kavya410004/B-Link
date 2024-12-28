import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const reservedUnitsData = [
  { id: 1, bloodType: 'A+', hospital: 'City Blood Bank', quantity: 2 },
  { id: 2, bloodType: 'B-', hospital: 'Central Blood Bank', quantity: 1 },
]

const transfusedUnitsData = [
  { id: 3, bloodType: 'O+', hospital: 'East Side Hospital', quantity: 1 },
]

const RequestedUnits = () => {
  const [activeTab, setActiveTab] = useState('reserved')
  const [reservedUnits, setReservedUnits] = useState(reservedUnitsData)
  const [transfusedUnits, setTransfusedUnits] = useState(transfusedUnitsData)

  const handleUpdateTransfused = (id) => {
    const updatedReserved = reservedUnits.filter(unit => unit.id !== id)
    const transfusedUnit = reservedUnits.find(unit => unit.id === id)
    if (transfusedUnit) {
      setTransfusedUnits([...transfusedUnits, transfusedUnit])
    }
    setReservedUnits(updatedReserved)
  }

  const ReservedUnitsTable = ({ units }) => (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hospital</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {units.map(unit => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{unit.bloodType}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{unit.hospital}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{unit.quantity}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleUpdateTransfused(unit.id)}
                        className="inline-flex items-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Update as Transfused
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
  );

  const TransfusedUnitsTable = ({ units }) => (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hospital</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {units.map(unit => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{unit.bloodType}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{unit.hospital}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{unit.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <header className="bg-white/95 backdrop-blur-sm shadow-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-4xl font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition-colors">
            B-Link
          </Link>
          <button
            onClick={() => {
              navigate('/')
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>


    
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto bg-white shadow-md p-8 w-full">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Requested Blood Units</h2>
        <div className="flex justify-center mb-4 space-x-2">
          <button
            onClick={() => setActiveTab('reserved')}
            className={`px-4 py-2 ${activeTab === 'reserved' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Reserved
          </button>
          <button
            onClick={() => setActiveTab('transfused')}
            className={`px-4 py-2 ${activeTab === 'transfused' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Transfused
          </button>
        </div>

        <div>
          {activeTab === 'reserved' ? <ReservedUnitsTable units={reservedUnits} /> : <TransfusedUnitsTable units={transfusedUnits} />}
        </div>
      </div>
    </div>

    </>
  )
}

export default RequestedUnits

import { useState } from 'react'
import { Switch } from '@headlessui/react'

const reservedUnitsData = [
  { id: 1, bloodType: 'A+', hospital: 'City Blood Bank', quantity: 2 },
  { id: 2, bloodType: 'B-', hospital: 'Central Blood Bank', quantity: 1 },
]

const transfusedUnitsData = [
  { id: 3, bloodType: 'O+', hospital: 'East Side Hospital', quantity: 1 },
]

const RequestedUnits = () => {
  const [isReserved, setIsReserved] = useState(true)
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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Requested Blood Units</h2>
        <div className="flex justify-center mb-4">
          <Switch
            checked={isReserved}
            onChange={setIsReserved}
            className={`${isReserved ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-12`}
          >
            <span className="sr-only">Toggle between Reserved and Transfused</span>
            <span className={`${isReserved ? 'translate-x-6' : 'translate-x-0'} inline-block w-6 h-6 transform bg-white rounded-full transition`} />
          </Switch>
          <span className="ml-2 text-sm font-medium text-gray-700">{isReserved ? 'Reserved' : 'Transfused'}</span>
        </div>

        <div>
          {isReserved ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reserved Blood Units</h3>
              {reservedUnits.length > 0 ? (
                reservedUnits.map(unit => (
                  <div key={unit.id} className="flex justify-between items-center border-b py-2">
                    <span>{unit.bloodType} from {unit.hospital} ({unit.quantity} units)</span>
                    <button
                      onClick={() => handleUpdateTransfused(unit.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Update as Transfused
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reserved blood units available.</p>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Transfused Blood Units</h3>
              {transfusedUnits.length > 0 ? (
                transfusedUnits.map(unit => (
                  <div key={unit.id} className="border-b py-2">
                    <span>{unit.bloodType} from {unit.hospital} ({unit.quantity} units)</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No transfused blood units available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestedUnits

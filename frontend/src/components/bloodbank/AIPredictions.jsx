import Header from './Header'

const AIPredictions = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Predictions</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">AI predictions and analytics will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

export default AIPredictions

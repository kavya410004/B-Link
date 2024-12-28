import Header from './Header'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';

const AIPredictions = () => {

  
  console.log("AI Predictions")
  console.log(localStorage.getItem('user'))
  // Sample data - Replace with actual data from your API
  const [transfusionData] = useState([
    { month: 'Aug', units: 180 },
    { month: 'Sep', units: 220 },
    { month: 'Oct', units: 190 },
    { month: 'Nov', units: 240 },
    { month: 'Dec', units: 210 }
  ]);

  const [comparisonData] = useState([
    { month: 'Aug', predicted: 190, actual: 180 },
    { month: 'Sep', predicted: 200, actual: 220 },
    { month: 'Oct', predicted: 210, actual: 190 },
    { month: 'Nov', predicted: 230, actual: 240 }
  ]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} units
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Predictions & Stats</h1>
        </div>
        
        {/* Prediction Container */}
        <div className="bg-white shadow rounded-lg p-8 flex flex-col items-center mb-8">
          <h2 className="text-2xl text-gray-500 mt-2">Predicted demand this month</h2>
          <div className="flex items-baseline justify-center">
            <span className="text-[6rem] font-bold text-blue-600 leading-none">247</span>
            <span className="ml-2 text-[1.2rem] text-gray-600">blood units</span>
          </div>
        </div>

        {/* Graphs Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transfusion History Graph */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Monthly Transfusion History</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transfusionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="units" 
                    fill="#3B82F6" 
                    name="Transfused Units"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prediction vs Actual Graph */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Prediction Accuracy</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="predicted" 
                    fill="#60A5FA" 
                    name="Predicted Units"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="actual" 
                    fill="#34D399" 
                    name="Actual Units"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIPredictions

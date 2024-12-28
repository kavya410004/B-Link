import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import BloodBankLogin from './components/bloodbank/BloodBankLogin'
import BloodBankRegister from './components/bloodbank/BloodBankRegister'
import BloodBankHome from './components/bloodbank/BloodBankHome'
import BloodRecords from './components/bloodbank/BloodRecords'
import UnverifiedUnits from './components/bloodbank/UnverifiedUnits'
import ReservedUnits from './components/bloodbank/ReservedUnits'
import AIPredictions from './components/bloodbank/AIPredictions'
import DonorStatus from './components/donor/DonorStatus'
import HospitalLogin from './components/hospital/HospitalLogin'
import HospitalRegister from './components/hospital/HospitalRegister'
import HospitalDashboard from './components/hospital/HospitalDashboard'
import AddRecipient from './components/hospital/AddRecipient'
import RequestedUnits from './components/hospital/RequestedUnits'
import { BloodRecordProvider } from './context/BloodRecordContext'
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BloodRecordProvider>
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bloodbank/login" element={<BloodBankLogin />} />
              <Route path="/bloodbank/register" element={<BloodBankRegister />} />
              <Route path="/bloodbank/dashboard" element={<BloodBankHome />} />
              <Route path="/bloodbank/records" element={<BloodRecords />} />
              <Route path="/bloodbank/unverified" element={<UnverifiedUnits />} />
              <Route path="/bloodbank/reserved" element={<ReservedUnits />} />
              <Route path="/bloodbank/predictions" element={<AIPredictions />} />
              {/* Donor Routes */}
              <Route path="/donor" element={<DonorStatus />} />
              {/* Hospital Routes */}
              <Route path="/hospital/login" element={<HospitalLogin />} />
              <Route path="/hospital/register" element={<HospitalRegister />} />
              <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
              <Route path="/hospital/recipient" element={<AddRecipient />} />
              {/* <Route path="/hospital/requests" element={<RequestedUnits />} /> */}
            </Routes>
          </div>
        </BloodRecordProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

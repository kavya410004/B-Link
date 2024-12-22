import { Link } from 'react-router-dom'
import {
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import Header from './Header'

const navigationItems = [
  {
    name: 'Blood Records',
    description: 'View and manage all blood donation records',
    href: '/bloodbank/records',
    icon: BeakerIcon,
  },
  {
    name: 'Unverified Units',
    description: 'Check and verify new blood donations',
    href: '/bloodbank/unverified',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'Reserved Units',
    description: 'Track units reserved by hospitals',
    href: '/bloodbank/reserved',
    icon: ClockIcon,
  },
  {
    name: 'AI Predictions',
    description: 'View demand forecasts and insights',
    href: '/bloodbank/predictions',
    icon: ChartBarIcon,
  },
]

const BloodBankHome = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Blood Bank Dashboard
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Manage your blood bank operations efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative flex items-center space-x-6 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-red-400 hover:ring-1 hover:ring-red-400 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-16">
                  <item.icon className="h-12 w-12 text-red-600" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default BloodBankHome

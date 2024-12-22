import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserPlusIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'

const navigationItems = [
  {
    name: 'Add Recipient',
    description: 'Add new recipient details and find matching blood units',
    href: '/hospital/recipient',
    icon: UserPlusIcon,
  },
  {
    name: 'Requested Units',
    description: 'View and track your blood unit requests',
    href: '/hospital/dashboard',
    icon: ClipboardDocumentListIcon,
  },
]

const HospitalDashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-4xl font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition-colors">
              B-Link
            </Link>
            <button
              onClick={() => {
                // Add logout logic here
                navigate('/')
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Hospital Dashboard
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Manage your hospital's blood requests efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative flex items-center space-x-6 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-blue-400 hover:ring-1 hover:ring-blue-400 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-16">
                  <item.icon className="h-12 w-12 text-blue-600" aria-hidden="true" />
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

export default HospitalDashboard

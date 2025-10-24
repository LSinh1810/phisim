// import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
// @ts-ignore: no type declaration for Dashboard.jsx
import Dashboard from './pages/Dashboard';
// @ts-ignore
import CreateCampaign from './pages/CreateCampaign';
// @ts-ignore
import CampaignDetail from './pages/CampaignDetail';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-white">PhishSim</span>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Bảng điều khiển
              </Link>
              <Link 
                to="/create" 
                className="btn btn-primary flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tạo chiến dịch</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateCampaign />} />
            <Route path="/campaign/:id" element={<CampaignDetail />} />
          </Routes>
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  )
}

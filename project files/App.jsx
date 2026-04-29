import React from 'react'
import { useHotel } from './context/HotelContext'
import HotelGrid from './components/HotelGrid'
import BookingPanel from './components/BookingPanel'
import Analytics from './components/Analytics'
import AdminPanel from './components/AdminPanel'
import Toast from './components/Toast'

const TABS = [
  { id: 'grid', label: '🏨 Floor Map' },
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'admin', label: '⚙️ Admin' },
]

export default function App() {
  const { activeTab, setTab, stats } = useHotel()

  return (
    <div className="min-h-screen bg-navy-900">
      <Toast />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-gold leading-tight">Grand Veritas Hotel</h1>
            <p className="text-[10px] text-gray-600 mt-0.5 hidden sm:block">
              Room Reservation System · 10 Floors · 97 Rooms
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1 text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-500">{stats.available} available</span>
            </div>
            <div className="bg-gold/10 border border-gold/20 rounded-lg px-2.5 py-1.5 text-[10px] text-gold font-medium">
              {stats.occupancyRate}% Occupied
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 pb-0 border-t border-white/4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-medium transition-all duration-150 border-b-2 -mb-px
                ${activeTab === tab.id
                  ? 'text-gold border-gold'
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-white/20'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {activeTab === 'grid' && (
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 card p-5 lg:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Floor Map</h2>
                <span className="text-[10px] text-gray-600">Rooms arranged left → right from lift</span>
              </div>
              <HotelGrid />
            </div>
            <div className="lg:w-72 xl:w-80">
              <BookingPanel />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/4 mt-10 py-5 px-6 text-center text-[10px] text-gray-700">
        Grand Veritas Hotel · Room Reservation System · SDE-3 Assessment
      </footer>
    </div>
  )
}

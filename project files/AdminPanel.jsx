import React, { useState } from 'react'
import { useHotel } from '../context/HotelContext'
import { getFloorRooms } from '../utils/hotelLogic'

export default function AdminPanel() {
  const { rooms, bookingHistory, clearHistory, stats } = useHotel()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFloor, setFilterFloor] = useState('all')

  const allRooms = Object.values(rooms).filter(r => {
    const matchSearch = search === '' || String(r.id).includes(search) || (r.guestName || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchFloor = filterFloor === 'all' || r.floor === parseInt(filterFloor)
    return matchSearch && matchStatus && matchFloor
  })

  const statusBadge = (status) => {
    const s = {
      available: 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
      occupied: 'bg-red-900/40 text-red-400 border-red-700/40',
      booked: 'bg-blue-900/40 text-blue-400 border-blue-700/40',
    }
    return `text-[10px] px-2 py-0.5 rounded-full border font-medium ${s[status]}`
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card text-center">
          <div className="text-xl font-semibold text-gold">{stats.occupancyRate}%</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Occupancy</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-semibold text-emerald-400">${stats.revenue.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Revenue/Night</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-semibold text-blue-400">{bookingHistory.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Total Bookings</div>
        </div>
      </div>

      {/* Room table */}
      <div className="card p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search room or guest…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[140px] bg-navy-800/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/50"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-navy-800/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="booked">Booked</option>
          </select>
          <select
            value={filterFloor}
            onChange={e => setFilterFloor(e.target.value)}
            className="bg-navy-800/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">All Floors</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i+1} value={i+1}>Floor {i+1}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                {['Room', 'Floor', 'Type', 'Status', 'Guest', 'Price'].map(h => (
                  <th key={h} className="text-left text-gray-500 font-medium pb-2.5 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRooms.slice(0, 30).map(r => (
                <tr key={r.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-gray-300">{r.id}</td>
                  <td className="py-2.5 pr-4 text-gray-400">F{r.floor}</td>
                  <td className="py-2.5 pr-4 text-gray-400">{r.type}</td>
                  <td className="py-2.5 pr-4">
                    <span className={statusBadge(r.status)}>{r.status}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-400">{r.guestName || '—'}</td>
                  <td className="py-2.5 text-gold">${r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {allRooms.length === 0 && (
            <div className="text-center text-gray-600 py-8 text-xs">No rooms match the filter.</div>
          )}
          {allRooms.length > 30 && (
            <div className="text-center text-gray-600 py-3 text-xs">Showing 30 of {allRooms.length} results</div>
          )}
        </div>
      </div>

      {/* Booking history */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">Booking History</h3>
          {bookingHistory.length > 0 && (
            <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Clear History
            </button>
          )}
        </div>
        {bookingHistory.length === 0 ? (
          <div className="text-center text-gray-600 py-6 text-xs">No bookings yet.</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bookingHistory.map(entry => (
              <div key={entry.id} className="bg-navy-800/40 border border-white/6 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-gray-500">{entry.id}</span>
                  <span className="text-[10px] text-gray-600">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.rooms.map(id => (
                    <span key={id} className="font-mono text-[10px] bg-blue-900/30 text-blue-400 border border-blue-700/30 px-1.5 py-0.5 rounded">
                      {id}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-[10px] text-gray-500">
                  <span>Travel: <span className="text-gold">{entry.travelTime} min</span></span>
                  <span>Total: <span className="text-emerald-400">${entry.totalPrice}/night</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useHotel } from '../context/HotelContext'

export default function BookingPanel() {
  const { bookRooms, randomize, reset, loading, lastBooking, stats } = useHotel()
  const [count, setCount] = useState('')
  const [error, setError] = useState('')

  const handleBook = () => {
    const n = parseInt(count, 10)
    if (!n || n < 1 || n > 5) { setError('Enter a number from 1 to 5.'); return }
    if (stats.available < n) { setError('Not enough available rooms.'); return }
    setError('')
    bookRooms(n)
    setCount('')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Book form */}
      <div className="card p-5">
        <h2 className="font-display text-lg text-gold mb-4">Reserve Rooms</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Number of rooms (max 5)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="5"
                value={count}
                onChange={e => { setCount(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleBook()}
                placeholder="1 – 5"
                className="flex-1 bg-navy-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm
                  text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-colors"
              />
              <button
                onClick={handleBook}
                disabled={loading}
                className="btn-primary px-5"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-navy-900/40 border-t-navy-900 rounded-full animate-spin" />
                ) : 'Book'}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1.5 animate-slide-up">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={randomize} disabled={loading} className="btn-ghost text-xs py-2.5">
              🎲 Random Fill
            </button>
            <button onClick={reset} disabled={loading} className="btn-ghost text-xs py-2.5">
              🔄 Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Availability summary */}
      <div className="card p-5">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Availability</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Available', val: stats.available, color: 'text-emerald-400' },
            { label: 'Occupied', val: stats.occupied, color: 'text-red-400' },
            { label: 'Booked', val: stats.booked, color: 'text-blue-400' },
          ].map(({ label, val, color }) => (
            <div key={label} className="stat-card text-center">
              <div className={`text-xl font-semibold ${color}`}>{val}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">Est. Revenue: </span>
          <span className="text-gold text-sm font-semibold">
            ${stats.revenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Last booking result */}
      {lastBooking && (
        <div className="card p-5 border-blue-500/30 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-soft" />
            <h3 className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Booking Confirmed</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {lastBooking.rooms.map(id => (
              <span key={id} className="font-mono text-xs bg-blue-900/40 border border-blue-700/40 text-blue-300 px-2 py-1 rounded-lg">
                {id}
              </span>
            ))}
          </div>
          <div className="border-t border-white/6 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Travel time</span>
              <span className="text-gold font-semibold">{lastBooking.travelTime} min</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total price</span>
              <span className="text-emerald-400 font-semibold">${lastBooking.totalPrice}/night</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono text-gray-400 text-[10px]">{lastBooking.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="card p-5">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Algorithm Rules</h3>
        <ul className="space-y-2">
          {[
            'Max 5 rooms per booking',
            'Same floor prioritized first',
            'Horizontal: 1 min per room',
            'Vertical: 2 min per floor',
            'Minimizes total travel time',
          ].map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
              <span className="text-gold mt-0.5 shrink-0">→</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

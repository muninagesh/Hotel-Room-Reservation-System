import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { useHotel } from '../context/HotelContext'

const COLORS = { available: '#10b981', occupied: '#ef4444', booked: '#3b82f6' }

export default function Analytics() {
  const { stats, rooms } = useHotel()

  const floorData = Array.from({ length: 10 }, (_, i) => {
    const f = i + 1
    const s = stats.byFloor[f]
    return { name: `F${f}`, available: s.available, occupied: s.occupied, booked: s.booked }
  })

  const pieData = [
    { name: 'Available', value: stats.available, color: '#10b981' },
    { name: 'Occupied', value: stats.occupied, color: '#ef4444' },
    { name: 'Booked', value: stats.booked, color: '#3b82f6' },
  ].filter(d => d.value > 0)

  const typeBreakdown = {}
  Object.values(rooms).forEach(r => {
    if (!typeBreakdown[r.type]) typeBreakdown[r.type] = { total: 0, occupied: 0 }
    typeBreakdown[r.type].total++
    if (r.status !== 'available') typeBreakdown[r.type].occupied++
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-navy-800 border border-white/10 rounded-xl p-3 text-xs shadow-xl">
        <div className="font-semibold text-white mb-1">{label}</div>
        {payload.map(p => (
          <div key={p.name} className="flex justify-between gap-4" style={{ color: p.fill }}>
            <span>{p.name}</span><span className="font-mono">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Occupancy Rate', val: `${stats.occupancyRate}%`, color: 'text-gold', sub: `${stats.occupied + stats.booked}/${stats.total} rooms` },
          { label: 'Available', val: stats.available, color: 'text-emerald-400', sub: 'rooms free' },
          { label: 'Revenue', val: `$${stats.revenue.toLocaleString()}`, color: 'text-blue-400', sub: 'per night' },
          { label: 'Total Rooms', val: stats.total, color: 'text-gray-300', sub: '10 floors' },
        ].map(({ label, val, color, sub }) => (
          <div key={label} className="stat-card">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className={`text-2xl font-semibold ${color}`}>{val}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Floor occupancy bar chart */}
      <div className="card p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Floor Occupancy Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={floorData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="available" stackId="a" fill="#10b981" radius={0} name="Available" />
            <Bar dataKey="occupied" stackId="a" fill="#ef4444" radius={0} name="Occupied" />
            <Bar dataKey="booked" stackId="a" fill="#3b82f6" radius={[4,4,0,0]} name="Booked" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie + Room types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                dataKey="value" paddingAngle={3}>
                {pieData.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Room Type Summary</h3>
          <div className="space-y-3">
            {Object.entries(typeBreakdown).map(([type, data]) => (
              <div key={type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{type}</span>
                  <span className="text-gray-500">{data.occupied}/{data.total}</span>
                </div>
                <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold/70 rounded-full transition-all duration-700"
                    style={{ width: `${Math.round((data.occupied / data.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

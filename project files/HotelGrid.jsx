import React from 'react'
import RoomCell from './RoomCell'
import { getFloorRooms } from '../utils/hotelLogic'
import { useHotel } from '../context/HotelContext'

const FLOOR_NAMES = {
  10: 'Penthouse', 9: 'Executive', 8: 'Executive',
  7: 'Premium', 6: 'Premium', 5: 'Deluxe',
  4: 'Deluxe', 3: 'Standard', 2: 'Standard', 1: 'Standard'
}

export default function HotelGrid() {
  const { rooms, newlyBookedIds, stats } = useHotel()
  const floors = Array.from({ length: 10 }, (_, i) => 10 - i)

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
        {[
          { key: 'available', label: 'Available', cnt: stats.available, color: 'bg-emerald-500' },
          { key: 'occupied', label: 'Occupied', cnt: stats.occupied, color: 'bg-red-500' },
          { key: 'booked', label: 'Just Booked', cnt: stats.booked, color: 'bg-blue-500' },
        ].map(({ key, label, cnt, color }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-gray-400">{label} <span className="text-gray-500">({cnt})</span></span>
          </div>
        ))}
      </div>

      {/* Grid — scrollable on small screens */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[420px]">
          {floors.map(floor => {
            const floorRooms = getFloorRooms(rooms, floor)
            const floorStats = stats.byFloor[floor]
            const allOccupied = floorStats?.available === 0
            return (
              <div key={floor} className="flex items-center gap-2 mb-2">
                {/* Lift shaft */}
                <div className="w-5 h-10 shrink-0 bg-navy-800/80 border border-white/8 rounded flex flex-col items-center justify-center gap-0.5">
                  <div className="w-2 h-2 rounded-sm bg-white/20" />
                  <div className="w-0.5 h-2 bg-white/10" />
                </div>

                {/* Floor label */}
                <div className="w-20 shrink-0 text-right">
                  <div className="text-[10px] font-mono text-gray-500 leading-none">F{floor}</div>
                  <div className="text-[9px] text-gray-600 leading-none mt-0.5 hidden sm:block">{FLOOR_NAMES[floor]}</div>
                </div>

                {/* Rooms */}
                <div className="flex gap-1 flex-wrap">
                  {floorRooms.map(room => (
                    <RoomCell
                      key={room.id}
                      room={room}
                      isNew={newlyBookedIds.has(room.id)}
                    />
                  ))}
                </div>

                {/* Floor fill indicator */}
                {allOccupied && (
                  <span className="text-[9px] text-red-500/70 ml-1 shrink-0">FULL</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 space-y-1">
        <div className="h-2 rounded-full overflow-hidden bg-navy-800 border border-white/5 flex">
          <div
            className="bg-red-600 transition-all duration-700 ease-out"
            style={{ width: `${(stats.occupied / stats.total) * 100}%` }}
          />
          <div
            className="bg-blue-500 transition-all duration-700 ease-out"
            style={{ width: `${(stats.booked / stats.total) * 100}%` }}
          />
          <div className="bg-emerald-700/40 flex-1 transition-all duration-700 ease-out" />
        </div>
        <div className="flex justify-between text-[10px] text-gray-600">
          <span>← Lift &amp; Stairs</span>
          <span>{stats.occupancyRate}% occupied · {stats.total} rooms total</span>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { getRoomType } from '../utils/hotelLogic'

const STATUS_STYLES = {
  available: 'room-available',
  occupied: 'room-occupied',
  booked: 'room-booked',
}

const STATUS_ICONS = {
  available: null,
  occupied: '🔒',
  booked: '🛎',
}

export default function RoomCell({ room, isNew }) {
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
      <div
        className={`
          relative flex flex-col items-center justify-center rounded-lg border
          cursor-default select-none transition-all duration-200
          w-9 h-9 sm:w-10 sm:h-10
          ${STATUS_STYLES[room.status]}
          hover:scale-110 hover:z-10
          ${isNew ? 'animate-pop' : ''}
        `}
      >
        <span className="text-[8px] leading-tight font-mono opacity-70">{room.id}</span>
        {STATUS_ICONS[room.status] && (
          <span className="text-[8px] leading-none">{STATUS_ICONS[room.status]}</span>
        )}
      </div>

      {/* Tooltip */}
      {showTip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none animate-fade-in">
          <div className="bg-navy-900/95 border border-white/20 rounded-lg p-2.5 text-xs whitespace-nowrap shadow-xl">
            <div className="font-semibold text-white">Room {room.id}</div>
            <div className="text-gray-400 mt-0.5">{room.type}</div>
            <div className="text-gold mt-0.5">${room.price}/night</div>
            {room.guestName && <div className="text-gray-300 mt-0.5">👤 {room.guestName}</div>}
            <div className={`mt-1 text-xs font-medium ${
              room.status === 'available' ? 'text-emerald-400'
              : room.status === 'occupied' ? 'text-red-400'
              : 'text-blue-400'
            }`}>
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-900/95" />
          </div>
        </div>
      )}
    </div>
  )
}

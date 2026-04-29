import React from 'react'
import { useHotel } from '../context/HotelContext'

export default function Toast() {
  const { toast } = useHotel()
  if (!toast) return null

  const styles = {
    success: 'bg-emerald-900/95 border-emerald-600/60 text-emerald-200',
    error: 'bg-red-900/95 border-red-600/60 text-red-200',
    info: 'bg-blue-900/95 border-blue-600/60 text-blue-200',
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' }

  return (
    <div
      key={toast.id}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5
        px-5 py-3 rounded-xl border text-sm font-medium shadow-2xl animate-slide-up
        ${styles[toast.type] || styles.info}`}
    >
      <span className="text-base leading-none">{icons[toast.type]}</span>
      {toast.msg}
    </div>
  )
}

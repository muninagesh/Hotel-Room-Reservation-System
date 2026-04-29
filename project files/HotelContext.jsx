import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import {
  initRooms, findOptimalRooms, generateRandomOccupancy,
  getHotelStats, saveBookingHistory, loadBookingHistory
} from '../utils/hotelLogic'

const HotelContext = createContext(null)

const initialState = {
  rooms: initRooms(),
  bookingHistory: loadBookingHistory(),
  lastBooking: null,
  newlyBookedIds: new Set(),
  toast: null,
  activeTab: 'grid',  // 'grid' | 'analytics' | 'admin'
  loading: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'BOOK_ROOMS': {
      const { rooms: bookedRooms, travelTime, bookingId } = action.payload
      const updated = { ...state.rooms }
      const ids = new Set()
      for (const r of bookedRooms) {
        updated[r.id] = { ...updated[r.id], status: 'booked', bookingId }
        ids.add(r.id)
      }
      const entry = {
        id: bookingId,
        rooms: bookedRooms.map(r => r.id),
        travelTime,
        timestamp: new Date().toISOString(),
        totalPrice: bookedRooms.reduce((acc, r) => acc + r.price, 0),
      }
      const history = [entry, ...state.bookingHistory].slice(0, 50)
      saveBookingHistory(history)
      return { ...state, rooms: updated, lastBooking: entry, newlyBookedIds: ids, bookingHistory: history }
    }
    case 'CLEAR_HIGHLIGHTS':
      return { ...state, newlyBookedIds: new Set() }
    case 'RANDOM':
      return { ...state, rooms: action.payload, lastBooking: null, newlyBookedIds: new Set() }
    case 'RESET':
      return { ...state, rooms: initRooms(), lastBooking: null, newlyBookedIds: new Set() }
    case 'SET_TOAST':
      return { ...state, toast: action.payload }
    case 'SET_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'CLEAR_HISTORY':
      saveBookingHistory([])
      return { ...state, bookingHistory: [] }
    default:
      return state
  }
}

export function HotelProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const showToast = useCallback((msg, type = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { msg, type, id: Date.now() } })
  }, [])

  useEffect(() => {
    if (!state.toast) return
    const t = setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3200)
    return () => clearTimeout(t)
  }, [state.toast])

  useEffect(() => {
    if (!state.newlyBookedIds.size) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_HIGHLIGHTS' }), 1800)
    return () => clearTimeout(t)
  }, [state.newlyBookedIds])

  const bookRooms = useCallback((count) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    setTimeout(() => {
      const result = findOptimalRooms(count, state.rooms)
      if (result.error) {
        showToast(result.error, 'error')
      } else {
        const bookingId = `BK-${Date.now()}`
        dispatch({ type: 'BOOK_ROOMS', payload: { ...result, bookingId } })
        showToast(`${count} room${count > 1 ? 's' : ''} booked successfully!`, 'success')
      }
      dispatch({ type: 'SET_LOADING', payload: false })
    }, 250)
  }, [state.rooms, showToast])

  const randomize = useCallback(() => {
    dispatch({ type: 'RANDOM', payload: generateRandomOccupancy(state.rooms) })
    showToast('Random occupancy applied', 'info')
  }, [state.rooms, showToast])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
    showToast('All rooms cleared', 'info')
  }, [showToast])

  const setTab = useCallback((tab) => dispatch({ type: 'SET_TAB', payload: tab }), [])
  const clearHistory = useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), [])

  const stats = getHotelStats(state.rooms)

  return (
    <HotelContext.Provider value={{ ...state, stats, bookRooms, randomize, reset, setTab, clearHistory, showToast }}>
      {children}
    </HotelContext.Provider>
  )
}

export function useHotel() {
  const ctx = useContext(HotelContext)
  if (!ctx) throw new Error('useHotel must be used inside HotelProvider')
  return ctx
}

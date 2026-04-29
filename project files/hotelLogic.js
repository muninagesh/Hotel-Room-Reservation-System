// ─── Hotel Structure ────────────────────────────────────────────────
export const FLOORS = 10
export const ROOMS_PER_FLOOR = 10
export const TOP_FLOOR_ROOMS = 7
export const MAX_BOOKING = 5

export function buildRoomId(floor, position) {
  return floor === 10 ? 1000 + position : floor * 100 + position
}

export function getRoomFloor(id) {
  return id >= 1000 ? 10 : Math.floor(id / 100)
}

export function getRoomPosition(id) {
  return id >= 1000 ? id - 1000 : id % 100
}

export function getFloorRoomCount(floor) {
  return floor === 10 ? TOP_FLOOR_ROOMS : ROOMS_PER_FLOOR
}

// ─── Initialize ─────────────────────────────────────────────────────
export function initRooms() {
  const map = {}
  for (let f = 1; f <= FLOORS; f++) {
    const count = getFloorRoomCount(f)
    for (let i = 1; i <= count; i++) {
      const id = buildRoomId(f, i)
      map[id] = {
        id,
        floor: f,
        position: i,
        status: 'available', // 'available' | 'occupied' | 'booked'
        bookingId: null,
        guestName: null,
        checkIn: null,
        checkOut: null,
        price: getRoomPrice(f, i),
        type: getRoomType(f, i),
      }
    }
  }
  return map
}

// ─── Room Metadata ──────────────────────────────────────────────────
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Premium Suite']
const ROOM_PRICES = { Standard: 99, Deluxe: 149, Suite: 249, 'Premium Suite': 399 }

export function getRoomType(floor, position) {
  if (floor === 10) return 'Premium Suite'
  if (floor >= 8) return 'Suite'
  if (floor >= 5) return 'Deluxe'
  return 'Standard'
}

export function getRoomPrice(floor, position) {
  return ROOM_PRICES[getRoomType(floor, position)]
}

// ─── Travel Time ────────────────────────────────────────────────────
export function calcTravelTime(roomList) {
  if (!roomList || roomList.length <= 1) return 0
  const sorted = [...roomList].sort((a, b) =>
    a.floor !== b.floor ? a.floor - b.floor : a.position - b.position
  )
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const vertical = Math.abs(first.floor - last.floor) * 2
  const horizontal = Math.abs(first.position - last.position)
  return vertical + horizontal
}

// ─── Booking Algorithm ──────────────────────────────────────────────
function combinations(arr, k) {
  if (k === 0) return [[]]
  if (arr.length < k) return []
  const [head, ...tail] = arr
  return [
    ...combinations(tail, k - 1).map(c => [head, ...c]),
    ...combinations(tail, k),
  ]
}

export function findOptimalRooms(n, roomMap) {
  if (n < 1 || n > MAX_BOOKING) return { error: `Book between 1 and ${MAX_BOOKING} rooms.` }

  const available = Object.values(roomMap).filter(r => r.status === 'available')
  if (available.length < n) return { error: 'Not enough available rooms.' }

  // Group by floor, sorted by position
  const byFloor = {}
  for (const r of available) {
    if (!byFloor[r.floor]) byFloor[r.floor] = []
    byFloor[r.floor].push(r)
  }
  for (const f in byFloor) byFloor[f].sort((a, b) => a.position - b.position)

  // Phase 1: Same floor — find best contiguous window
  for (let f = 1; f <= FLOORS; f++) {
    const fr = byFloor[f] || []
    if (fr.length >= n) {
      let best = null, bestTime = Infinity
      for (let i = 0; i <= fr.length - n; i++) {
        const subset = fr.slice(i, i + n)
        const t = calcTravelTime(subset)
        if (t < bestTime) { bestTime = t; best = subset }
      }
      return { rooms: best, travelTime: bestTime, sameFloor: true }
    }
  }

  // Phase 2: Cross-floor — candidate pool, evaluate combinations
  const sorted = available.sort((a, b) =>
    a.floor !== b.floor ? a.floor - b.floor : a.position - b.position
  )
  const pool = sorted.slice(0, Math.min(28, sorted.length))
  const combos = combinations(pool, n)

  let best = null, bestTime = Infinity
  for (const combo of combos) {
    const t = calcTravelTime(combo)
    if (t < bestTime) { bestTime = t; best = combo }
  }

  return best
    ? { rooms: best, travelTime: bestTime, sameFloor: false }
    : { error: 'Could not find optimal arrangement.' }
}

// ─── Random Occupancy ───────────────────────────────────────────────
const GUEST_NAMES = [
  'Arjun Sharma','Priya Nair','Rahul Verma','Deepika Reddy','Vikram Menon',
  'Ananya Iyer','Rohan Gupta','Kavya Pillai','Aditya Kumar','Sanya Kapoor',
  'Nikhil Rao','Riya Bose','Amit Patel','Sneha Joshi','Kiran Singh',
  'Meera Nambiar','Siddharth Das','Pooja Agarwal','Aryan Mehta','Divya Nair',
]

function randomGuestName() {
  return GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)]
}

function randomDate(daysOffset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * 5) + daysOffset)
  return d.toISOString().split('T')[0]
}

export function generateRandomOccupancy(roomMap) {
  const updated = {}
  const all = Object.values(roomMap)
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  const occupyCount = Math.floor(all.length * (0.35 + Math.random() * 0.35))

  for (const r of all) {
    updated[r.id] = { ...r, status: 'available', bookingId: null, guestName: null, checkIn: null, checkOut: null }
  }
  for (let i = 0; i < occupyCount; i++) {
    const r = shuffled[i]
    updated[r.id] = {
      ...updated[r.id],
      status: 'occupied',
      bookingId: `BK${Date.now()}${i}`,
      guestName: randomGuestName(),
      checkIn: randomDate(-3),
      checkOut: randomDate(2),
    }
  }
  return updated
}

// ─── Stats ──────────────────────────────────────────────────────────
export function getHotelStats(roomMap) {
  const rooms = Object.values(roomMap)
  const total = rooms.length
  const occupied = rooms.filter(r => r.status === 'occupied').length
  const booked = rooms.filter(r => r.status === 'booked').length
  const available = rooms.filter(r => r.status === 'available').length
  const revenue = rooms
    .filter(r => r.status !== 'available')
    .reduce((acc, r) => acc + r.price, 0)
  const occupancyRate = Math.round(((occupied + booked) / total) * 100)

  const byFloor = {}
  for (let f = 1; f <= FLOORS; f++) {
    const floorRooms = rooms.filter(r => r.floor === f)
    byFloor[f] = {
      total: floorRooms.length,
      available: floorRooms.filter(r => r.status === 'available').length,
      occupied: floorRooms.filter(r => r.status === 'occupied').length,
      booked: floorRooms.filter(r => r.status === 'booked').length,
    }
  }

  return { total, occupied, booked, available, revenue, occupancyRate, byFloor }
}

export function getFloorRooms(roomMap, floor) {
  return Object.values(roomMap)
    .filter(r => r.floor === floor)
    .sort((a, b) => a.position - b.position)
}

export const BOOKING_HISTORY_KEY = 'hotel_booking_history'

export function saveBookingHistory(history) {
  try { localStorage.setItem(BOOKING_HISTORY_KEY, JSON.stringify(history)) } catch (_) {}
}

export function loadBookingHistory() {
  try {
    const raw = localStorage.getItem(BOOKING_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (_) { return [] }
}

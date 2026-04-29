# Grand Veritas Hotel — Room Reservation System v2

> Advanced Full-Stack Hotel Reservation App · SDE-3 Assessment · Unstop

## 🚀 Live Deploy (Vercel)

```bash
npm install
npm run build
vercel --prod
```

Or connect GitHub repo → Vercel auto-detects Vite and deploys.

---

## 🛠 Tech Stack

| | Tech |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context + useReducer |
| Persistence | localStorage (booking history) |
| Deploy | Vercel |

---

## ✨ Features

### Core
- **Smart Booking Algorithm** — Same-floor priority, then cross-floor with minimum travel time
- **97 Rooms across 10 floors** — Floors 1–9 (10 rooms each), Floor 10 (7 rooms)
- **Visual Floor Map** — Color-coded grid with hover tooltips
- **Random Occupancy** — Realistic random fill with guest names
- **Reset** — Full clear of all bookings

### Advanced
- **3 Tabs** — Floor Map / Analytics / Admin Panel
- **Analytics Dashboard** — KPI cards, stacked bar chart, pie chart, room type breakdown
- **Admin Panel** — Searchable/filterable room table, booking history log
- **Room Tooltips** — Type, price, guest name, status
- **Revenue Tracker** — Live revenue estimate
- **Booking History** — Persisted in localStorage, with travel time + price per booking
- **Animated UI** — Pop animations on booking, slide-in for results
- **Responsive** — Works on mobile, tablet, desktop

---

## 🧠 Algorithm

**Phase 1 — Same Floor:**
Scan floors 1→10. If enough available rooms exist, find the contiguous window of `n` rooms minimizing span = `last.position - first.position`.

**Phase 2 — Cross-Floor:**
Build a candidate pool (up to 28 available rooms sorted by floor, then position). Evaluate all combinations of size `n`, selecting the one with minimum travel time:

```
travelTime = |floor_last - floor_first| × 2 + |position_last - position_first|
```

---

## 📁 Structure

```
src/
  context/
    HotelContext.jsx     # Global state (useReducer)
  components/
    HotelGrid.jsx        # Floor map grid
    RoomCell.jsx         # Individual room cell + tooltip
    BookingPanel.jsx     # Sidebar booking controls
    Analytics.jsx        # Charts dashboard
    AdminPanel.jsx       # Admin room table + history
    Toast.jsx            # Notification system
  utils/
    hotelLogic.js        # All hotel/algorithm logic
  App.jsx
  main.jsx
  index.css
```

---

## 🖥 Local Dev

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

---

## 🌐 API Structure (for backend extension)

| Method | Route | Body | Description |
|---|---|---|---|
| GET | `/api/rooms` | — | All rooms |
| POST | `/api/book` | `{ count: 1-5 }` | Optimal booking |
| POST | `/api/random` | — | Random occupancy |
| POST | `/api/reset` | — | Clear all |
| GET | `/api/history` | — | Booking history |
| GET | `/api/stats` | — | Occupancy stats |

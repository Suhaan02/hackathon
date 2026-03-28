import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const route = [
  [12.9646, 77.5946],
  [12.9651, 77.5946],
  [12.9656, 77.5946],
  [12.9661, 77.5946],
  [12.9666, 77.5946],
  [12.9671, 77.5946],
  [12.9676, 77.5946],
  [12.9681, 77.5946],
  [12.9686, 77.5946],
  [12.9691, 77.5946],
  [12.9696, 77.5946],
  [12.9701, 77.5946],
  [12.9706, 77.5946],
  [12.9711, 77.5946],
  [12.9716, 77.5946],
]

function UserView() {
  const [ambulancePos, setAmbulancePos] = useState(route[0])
  const [distance, setDistance] = useState(0.8)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < route.length - 1) {
        i++
        setAmbulancePos(route[i])
        setDistance(parseFloat((0.8 - i * 0.055).toFixed(2)))
      } else {
        clearInterval(interval)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>

      {/* Map */}
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={14}
        style={{ height: '100vh', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {/* User location - blue dot */}
        <Circle
          center={[12.9716, 77.5946]}
          radius={30}
          pathOptions={{
            color: '#4285F4',
            fillColor: '#4285F4',
            fillOpacity: 1,
          }}
        />

        {/* Ambulance - red dot */}
        <Circle
          center={ambulancePos}
          radius={30}
          pathOptions={{
            color: '#FF0000',
            fillColor: '#FF0000',
            fillOpacity: 1,
          }}
        />
      </MapContainer>

      {/* Google Maps style notification bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>

        {/* ETA bar */}
        <div style={{ backgroundColor: '#b91c1c' }} className="px-4 py-2 flex items-center justify-between border-t border-red-800">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">{Math.ceil(distance * 2)} min</span>
            <span className="text-red-200 text-sm">{distance} km</span>
          </div>
          <span className="text-red-200 text-xs">Simulation Mode</span>
        </div>

        {/* Alert bar */}
        <div style={{ backgroundColor: '#991b1b' }} className="px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🚨</span>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Ambulance Approaching!</p>
            <p className="text-red-100 text-xs">Please move to the left side of the road immediately</p>
          </div>
          <div className="bg-white rounded-full px-3 py-1">
            <p style={{ color: '#991b1b' }} className="text-xs font-bold">ALERT</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserView;
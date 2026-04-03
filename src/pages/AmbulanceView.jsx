import { useEffect, useState } from 'react'

function AmbulanceView() {
  const [data, setData] = useState({
    heartRate: 92,
    bpSys: 120,
    bpDia: 80,
    spo2: 97,
    temp: 98.4,
    pulse: 88,
    gcs: 15,
    // 1. Initial string
    condition: 'Patient under observation'
  })

  // 🔁 Smooth variation function (SAFE)
  const vary = (val, min, max, step = 2) => {
    let newVal = val + (Math.random() * step * 2 - step)
    if (newVal < min) newVal = min
    if (newVal > max) newVal = max
    return Number(newVal.toFixed(1))
  }

  // 2. Handler to update notes
  const handleNoteChange = (e) => {
    const newCondition = e.target.value;
    setData(prev => ({
      ...prev,
      condition: newCondition
    }));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const updated = {
          heartRate: Math.round(vary(prev.heartRate, 60, 140, 3)),
          bpSys: Math.round(vary(prev.bpSys, 100, 150, 3)),
          bpDia: Math.round(vary(prev.bpDia, 60, 100, 2)),
          spo2: Math.round(vary(prev.spo2, 90, 100, 1)),
          temp: vary(prev.temp, 97, 101, 0.2),
          pulse: Math.round(vary(prev.pulse, 60, 130, 3)),
          gcs: Math.round(vary(prev.gcs, 10, 15, 1)),
          // 3. Keep the current condition text
          condition: prev.condition
        }

        // 🚑 SEND DATA TO HOSPITAL
        const payload = {
          ...updated,
          bp: `${updated.bpSys}/${updated.bpDia}`,
          unitId: 'AMB-101',
          eta: 8,
          hospital: 'City Hospital',
          timestamp: new Date().toISOString()
        }
        localStorage.setItem('patientData', JSON.stringify(payload))
        localStorage.setItem('ambulanceDataTS', Date.now().toString())

        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#050a0f] text-[#e0f0ff] p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">🚑 Ambulance Live Console</h1>
        <div className="text-yellow-400 font-bold animate-pulse">
          TRANSMITTING...
        </div>
      </div>

      {/* VITALS GRID */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card label="❤️ Heart Rate" value={data.heartRate} color="text-red-400" />
        <Card label="🩺 BP" value={`${data.bpSys}/${data.bpDia}`} color="text-cyan-400" />
        <Card label="🫁 SpO₂" value={data.spo2} color="text-green-400" />
        <Card label="💓 Pulse" value={data.pulse} color="text-yellow-400" />
        <Card label="🌡 Temp" value={data.temp} color="text-orange-400" />
        <Card label="🧠 GCS" value={data.gcs} color="text-purple-400" />
      </div>

      {/* NOTES - Editable */}
      <div className="bg-[#0a1520] p-4 rounded-lg border border-cyan-500/20">
        <label className="text-xs text-gray-400 mb-2 block">CLINICAL NOTES</label>
        <textarea
          value={data.condition}
          onChange={handleNoteChange}
          className="w-full bg-transparent text-white outline-none resize-none"
          rows={3}
        />
      </div>
    </div>
  )
}

// 🔹 Card Component (SAFE)
function Card({ label, value, color }) {
  return (
    <div className="bg-[#0a1520] p-4 rounded-lg border border-cyan-500/20">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-xl font-bold ${color}`}>
        {value ?? '--'}
      </div>
    </div>
  )
}

export default AmbulanceView

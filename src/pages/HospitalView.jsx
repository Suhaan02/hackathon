import { useState, useEffect } from 'react'

const URGENCY_COLOR = {
  critical: { bg: 'bg-red-900/40', border: 'border-red-500/60', badge: 'bg-red-500 text-black', dot: 'bg-red-500' },
  high:     { bg: 'bg-amber-900/30', border: 'border-amber-500/50', badge: 'bg-amber-400 text-black', dot: 'bg-amber-400' },
  medium:   { bg: 'bg-blue-900/30', border: 'border-blue-400/40', badge: 'bg-blue-400 text-black', dot: 'bg-blue-400' },
}

function VitalBadge({ label, value, unit, warn }) {
  return (
    <div className={`rounded-xl p-4 border ${warn ? 'border-red-500/60 bg-red-900/20' : 'border-cyan-500/20 bg-slate-900/60'}`}>
      <div className="text-xs font-mono text-slate-400 tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-bold font-mono ${warn ? 'text-red-400' : 'text-cyan-300'}`}>{value || '—'}</div>
      <div className="text-xs text-slate-500 mt-1">{unit}</div>
    </div>
  )
}

export default function HospitalView() {
  const [data, setData] = useState(null)
  const [responses, setResponses] = useState({})
  const [lastUpdate, setLastUpdate] = useState(null)
  const [pulse, setPulse] = useState(false)

  // Poll localStorage every 2 seconds for new data
  useEffect(() => {
    function loadData() {
      try {
        const raw = localStorage.getItem('ambulanceData')
        const ts  = localStorage.getItem('ambulanceDataTS')
        if (!raw) return
        const parsed = JSON.parse(raw)
        setData(parsed)
        setLastUpdate(ts ? new Date(parseInt(ts)) : new Date())
        setPulse(true)
        setTimeout(() => setPulse(false), 1000)
      } catch (e) { /* ignore parse errors */ }
    }

    loadData()
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  function respond(id, value) {
    setResponses(prev => ({ ...prev, [id]: value }))
  }

  function allResponded() {
    if (!data?.checklist) return false
    return data.checklist.every(item => responses[item.id] !== undefined)
  }

  const sevColor = {
    red: 'text-red-400 bg-red-900/30 border-red-500/50',
    orange: 'text-orange-400 bg-orange-900/30 border-orange-500/50',
    yellow: 'text-amber-400 bg-amber-900/30 border-amber-500/50',
    green: 'text-green-400 bg-green-900/30 border-green-500/50',
  }

  return (
    <div className="min-h-screen bg-[#050a0f] text-white font-sans" style={{fontFamily:"'Exo 2', sans-serif"}}>
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)'}} />

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-cyan-500/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-2xl"
              style={{boxShadow:'0 0 20px rgba(59,130,246,0.5)'}}>🏥</div>
            <div>
              <div className="text-2xl font-bold tracking-widest" style={{fontFamily:"'Rajdhani',sans-serif"}}>
                HOSPITAL<span className="text-blue-400">IQ</span>
              </div>
              <div className="text-xs font-mono text-slate-500 tracking-widest">RECEIVING DASHBOARD v2.0</div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <div className={`w-2 h-2 rounded-full ${data ? 'bg-green-400' : 'bg-slate-600'}`}
              style={data ? {boxShadow:'0 0 6px #00e676', animation:'pulse 1.5s infinite'} : {}} />
            {data ? 'LIVE DATA' : 'AWAITING TRANSMISSION'}
            {lastUpdate && (
              <span className="ml-3 text-slate-500">
                RECV {lastUpdate.toTimeString().slice(0,8)}
              </span>
            )}
          </div>
        </div>

        {/* No data state */}
        {!data && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-6 opacity-30">📡</div>
            <div className="font-mono text-slate-500 tracking-widest text-sm mb-2">AWAITING AMBULANCE TRANSMISSION</div>
            <div className="font-mono text-slate-600 text-xs">Open ambulance.html, fill vitals, and press TRANSMIT</div>
          </div>
        )}

        {/* Live data */}
        {data && (
          <>
            {/* Alert banner */}
            <div className={`rounded-xl border px-5 py-4 mb-6 flex items-center justify-between ${
              pulse ? 'border-red-500 bg-red-900/40' : 'border-red-500/40 bg-red-900/20'
            }`} style={{transition:'all 0.3s'}}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <div className="font-bold text-red-300 tracking-wider" style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'18px'}}>
                    INCOMING PATIENT — UNIT {data.unitId || 'AMB-???'}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    ETA: <span className="text-amber-400 font-bold">{data.eta} MIN</span>
                    &nbsp;·&nbsp; Age: <span className="text-white">{data.patientAge || '—'}</span>
                    &nbsp;·&nbsp; Crew: <span className="text-white">{data.crewLead || '—'}</span>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg border font-bold font-mono text-sm uppercase ${
                sevColor[data.severity] || 'text-slate-400 bg-slate-800 border-slate-600'
              }`}>
                {data.severity || 'UNKNOWN'}
              </div>
            </div>

            {/* Vitals grid */}
            <div className="mb-6">
              <div className="text-xs font-mono text-slate-500 tracking-widest mb-3 flex items-center gap-3">
                PATIENT VITALS
                <div className="flex-1 h-px bg-cyan-500/15" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <VitalBadge label="HEART RATE" value={data.heartRate} unit="BPM"
                  warn={data.heartRate && (data.heartRate > 120 || data.heartRate < 50)} />
                <VitalBadge label="BLOOD PRESSURE" value={data.bp} unit="mmHg"
                  warn={data.bp && (parseInt(data.bp) > 180 || parseInt(data.bp) < 80)} />
                <VitalBadge label="SpO₂" value={data.spo2 ? data.spo2 + '%' : null} unit="Oxygen sat"
                  warn={data.spo2 && data.spo2 < 94} />
                <VitalBadge label="RESP RATE" value={data.respRate} unit="breaths/min"
                  warn={data.respRate && (data.respRate > 25 || data.respRate < 10)} />
                <VitalBadge label="GCS SCORE" value={data.gcs ? data.gcs + '/15' : null} unit="Consciousness"
                  warn={data.gcs && data.gcs < 12} />
                <VitalBadge label="BLOOD GLUCOSE" value={data.glucose} unit="mg/dL"
                  warn={data.glucose && (data.glucose > 250 || data.glucose < 60)} />
              </div>
            </div>

            {/* Clinical notes */}
            {data.condition && (
              <div className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900/40 p-4">
                <div className="text-xs font-mono text-slate-500 tracking-widest mb-2">CLINICAL NOTES FROM PARAMEDIC</div>
                <div className="text-sm text-slate-300 leading-relaxed">{data.condition}</div>
              </div>
            )}

            {/* AI Checklist */}
            {data.checklist && data.checklist.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-mono text-slate-500 tracking-widest mb-1 flex items-center gap-3">
                  AI INFRASTRUCTURE INQUIRY
                  <div className="flex-1 h-px bg-cyan-500/15" />
                </div>
                <div className="text-xs font-mono text-slate-600 mb-4 tracking-wide">
                  ⚠️ Condition classification withheld — confirm equipment readiness only
                </div>

                <div className="space-y-3">
                  {data.checklist.map((item) => {
                    const colors = URGENCY_COLOR[item.urgency] || URGENCY_COLOR.medium
                    const response = responses[item.id]
                    return (
                      <div key={item.id}
                        className={`rounded-xl border p-4 flex items-start justify-between gap-4 transition-all duration-300 ${
                          response === 'yes' ? 'border-green-500/50 bg-green-900/20' :
                          response === 'no'  ? 'border-red-500/50 bg-red-900/20' :
                          `${colors.border} ${colors.bg}`
                        }`}>
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            response === 'yes' ? 'bg-green-400' :
                            response === 'no'  ? 'bg-red-400' :
                            colors.dot
                          }`} />
                          <div>
                            <span className={`text-xs font-mono px-2 py-0.5 rounded-full mr-2 ${colors.badge}`}>
                              {item.urgency.toUpperCase()}
                            </span>
                            <span className="text-sm text-slate-200">{item.question}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => respond(item.id, 'yes')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm font-mono tracking-wider transition-all ${
                              response === 'yes'
                                ? 'bg-green-500 text-black shadow-lg'
                                : 'bg-slate-800 text-slate-400 border border-slate-600 hover:border-green-500 hover:text-green-400'
                            }`}>
                            YES
                          </button>
                          <button
                            onClick={() => respond(item.id, 'no')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm font-mono tracking-wider transition-all ${
                              response === 'no'
                                ? 'bg-red-500 text-black shadow-lg'
                                : 'bg-slate-800 text-slate-400 border border-slate-600 hover:border-red-500 hover:text-red-400'
                            }`}>
                            NO
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Summary bar */}
                {Object.keys(responses).length > 0 && (
                  <div className="mt-4 rounded-xl border border-cyan-500/20 bg-slate-900/40 p-4">
                    <div className="text-xs font-mono text-slate-500 tracking-widest mb-3">READINESS SUMMARY</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 font-mono">
                          {Object.values(responses).filter(v=>v==='yes').length}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">READY</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400 font-mono">
                          {Object.values(responses).filter(v=>v==='no').length}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">NOT READY</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-400 font-mono">
                          {(data.checklist?.length||0) - Object.keys(responses).length}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">PENDING</div>
                      </div>
                    </div>
                    {allResponded() && (
                      <div className="mt-3 text-xs font-mono text-green-400 tracking-wide">
                        ✅ All items confirmed — readiness report ready to transmit back to ambulance
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
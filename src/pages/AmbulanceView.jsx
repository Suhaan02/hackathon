function HospitalView() {
  const patientData = {
    unitId: 'AMB-047',
    heartRate: '92',
    bp: '140/90',
    spo2: '94',
    pulse: '88',
    temp: '99.2',
    respRate: '22',
    gcs: '12',
    glucose: '160',
    weight: '70',
    severity: 'red',
    condition: 'Patient unconscious, possible cardiac arrest. Given aspirin en route.',
    hospital: 'KIMS Hospital, Hubli',
    eta: '8',
    timestamp: new Date().toISOString()
  }

  return (
    <div style={{ background: '#050a0f', minHeight: '100vh', color: '#e0f0ff', fontFamily: 'sans-serif', padding: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(0,229,255,0.15)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ff2d2d', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🏥</div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '2px' }}>AMBULANCE<span style={{ color: '#ff2d2d' }}>IQ</span></div>
            <div style={{ fontSize: '10px', color: '#6a8fa8', letterSpacing: '2px' }}>HOSPITAL DASHBOARD</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6a8fa8' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676', animation: 'blink 1.5s infinite' }}></div>
          <span>LIVE FEED</span>
        </div>
      </div>

      {/* Incoming Alert */}
      <div style={{ background: '#1a0a0a', border: '1px solid #ff2d2d', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>🚨</span>
        <div>
          <div style={{ color: '#ff2d2d', fontWeight: '700', fontSize: '16px' }}>INCOMING PATIENT — UNIT {patientData.unitId}</div>
          <div style={{ color: '#6a8fa8', fontSize: '13px' }}>ETA: {patientData.eta} minutes · Heading to {patientData.hospital}</div>
        </div>
        <div style={{ marginLeft: 'auto', background: '#ff2d2d', borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '14px', letterSpacing: '2px' }}>
          🔴 CRITICAL
        </div>
      </div>

      {/* Vitals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: '❤️', label: 'Heart Rate', value: patientData.heartRate, unit: 'BPM', color: '#ff2d2d' },
          { icon: '🩺', label: 'Blood Pressure', value: patientData.bp, unit: 'mmHg', color: '#00e5ff' },
          { icon: '🫁', label: 'SpO₂', value: patientData.spo2, unit: '%', color: '#00e676' },
          { icon: '💓', label: 'Pulse Rate', value: patientData.pulse, unit: 'BPM', color: '#ffaa00' },
          { icon: '🌡️', label: 'Body Temp', value: patientData.temp, unit: '°F', color: '#ff9500' },
          { icon: '🧠', label: 'GCS Score', value: patientData.gcs, unit: '/ 15', color: '#cc44ff' },
        ].map((vital, i) => (
          <div key={i} style={{ background: '#0a1520', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '12px', padding: '18px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: vital.color, borderRadius: '12px 12px 0 0', opacity: 0.6 }}></div>
            <span style={{ fontSize: '20px' }}>{vital.icon}</span>
            <div style={{ fontSize: '10px', color: '#6a8fa8', letterSpacing: '2px', margin: '8px 0' }}>{vital.label.toUpperCase()}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: vital.color }}>{vital.value}</div>
            <div style={{ fontSize: '11px', color: '#6a8fa8' }}>{vital.unit}</div>
          </div>
        ))}
      </div>

      {/* Clinical Notes */}
      <div style={{ background: '#0a1520', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#6a8fa8', letterSpacing: '3px', marginBottom: '10px' }}>CLINICAL NOTES</div>
        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#e0f0ff' }}>{patientData.condition}</div>
      </div>

      {/* Fake AI Analysis */}
      <div style={{ background: '#0a1520', border: '1px solid #ffaa00', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#ffaa00', letterSpacing: '3px', marginBottom: '12px' }}>🧠 AI PRELIMINARY ANALYSIS</div>
        <div style={{ fontSize: '14px', color: '#e0f0ff', marginBottom: '8px' }}>Likely Condition: <span style={{ color: '#ff2d2d', fontWeight: '700' }}>Possible Cardiac Arrest</span></div>
        <div style={{ fontSize: '13px', color: '#6a8fa8', marginBottom: '12px' }}>Equipment Required:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {['Defibrillator', 'Oxygen Cylinder', 'IV Line Kit', 'Cardiac Monitor'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#00e676' }}>✅</span> {item}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '13px', color: '#e0f0ff', marginBottom: '12px' }}>Is your hospital equipped and ready?</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ flex: 1, padding: '12px', background: '#00e676', border: 'none', borderRadius: '8px', color: '#000', fontWeight: '700', fontSize: '14px', cursor: 'pointer', letterSpacing: '1px' }}>
            ✅ YES, WE'RE READY
          </button>
          <button style={{ flex: 1, padding: '12px', background: '#ff2d2d', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', letterSpacing: '1px' }}>
            ❌ NO — REROUTE
          </button>
        </div>
      </div>

    </div>
  )
}

export default HospitalView
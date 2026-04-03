import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// 🔁 SWITCH THIS
const USE_SOCKET = false;

function HospitalView() {
  const [data, setData] = useState(null);
  const [responses, setResponses] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  const socketRef = useRef(null);
  const prevDataRef = useRef(null);

  useEffect(() => {
    if (USE_SOCKET) {
      socketRef.current = io("https://your-render-url");

      socketRef.current.on("receiveVitals", (incomingData) => {
        if (JSON.stringify(incomingData) === JSON.stringify(prevDataRef.current)) return;
        prevDataRef.current = incomingData;

        setData(incomingData);
        setLastUpdate(new Date());
      });

      return () => socketRef.current.disconnect();
    } else {
      function loadData() {
        try {
          const raw = localStorage.getItem("patientData");
          const ts = localStorage.getItem("ambulanceDataTS");

          if (!raw) return;

          const parsed = JSON.parse(raw);

          if (JSON.stringify(parsed) === JSON.stringify(prevDataRef.current)) return;
          prevDataRef.current = parsed;

          setData(parsed);
          setLastUpdate(ts ? new Date(parseInt(ts)) : new Date());
        } catch {}
      }

      loadData();
      const interval = setInterval(loadData, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  function respond(val) {
    setResponses({ ready: val });
  }

  const isLive =
    lastUpdate && Date.now() - new Date(lastUpdate).getTime() < 3000;

  const patientData = data;

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh", color: "#03080c", padding: "24px" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ background: "#ff2d2d", borderRadius: "10px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>🏥</div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>
              AMBULANCE<span style={{ color: "#ff2d2d" }}>IQ</span>
            </div>
            <div style={{ fontSize: "10px", color: "#6a8fa8" }}>HOSPITAL DASHBOARD</div>
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#031104" }}>
          {patientData
            ? isLive
              ? "🟢 LIVE"
              : "🔴 STALE"
            : "AWAITING"}
        </div>
      </div>

      {!patientData && <div>Waiting for ambulance data...</div>}

      {patientData && (
        <>
          {/* ALERT */}
          <div style={{ background: '#fff0f0', border: '2px solid #ff2d2d', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(255,45,45,0.15)' }}>
  <span style={{ fontSize: '36px' }}>🚨</span>
  <div style={{ flex: 1 }}>
    <div style={{ color: '#ff2d2d', fontWeight: '800', fontSize: '18px', letterSpacing: '1px' }}>INCOMING PATIENT — UNIT {patientData.unitId}</div>
    <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>ETA: {patientData.eta} minutes · Heading to {patientData.hospital}</div>
  </div>
  <div style={{ background: '#ff2d2d', borderRadius: '8px', padding: '10px 18px', fontWeight: '800', fontSize: '14px', letterSpacing: '2px', color: '#fff' }}>
    🔴 CRITICAL
  </div>
</div>

          {/* VITALS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
  {[
    { icon: '❤️', label: 'Heart Rate', value: patientData.heartRate, unit: 'BPM', color: '#ff2d2d', low: 89, high :95 },
    { icon: '🩺', label: 'Blood Pressure', value: patientData.bp, unit: 'mmHg', color: '#0077cc', low: null, high: null },
    { icon: '🫁', label: 'SpO₂', value: patientData.spo2, unit: '%', color: '#00aa55', low: 95, high: 100 },
    { icon: '💓', label: 'Pulse Rate', value: patientData.pulse, unit: 'BPM', color: '#cc7700', low: 60, high: 100 },
    { icon: '🌡️', label: 'Body Temp', value: patientData.temp, unit: '°F', color: '#ff6600', low: 97, high: 99 },
    { icon: '🧠', label: 'GCS Score', value: patientData.gcs, unit: '/ 15', color: '#7700cc', low: 13, high: 15 },
  ].map((vital, i) => {
    const val = parseFloat(vital.value)
    const isAbnormal = vital.low !== null && (val < vital.low || val > vital.high)
    return (
      <div key={i} style={{
        background: isAbnormal ? '#fff0f0' : '#ffffff',
        border: `2px solid ${isAbnormal ? '#ff2d2d' : vital.color}`,
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        animation: isAbnormal ? 'blink-border 1s infinite' : 'none',
        boxShadow: isAbnormal ? '0 0 12px rgba(255,45,45,0.4)' : '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{vital.icon}</div>
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: '600' }}>{vital.label}</div>
        <div style={{ fontSize: '36px', fontWeight: '800', color: isAbnormal ? '#ff2d2d' : vital.color }}>{vital.value}</div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{vital.unit}</div>
        {isAbnormal && <div style={{ marginTop: '8px', fontSize: '11px', color: '#ff2d2d', fontWeight: '700', letterSpacing: '1px' }}>⚠️ ABNORMAL</div>}
      </div>
    )
  })}
</div>

          {/* NOTES */}
          <div style={{ marginBottom: "24px" }}>
            <b>Notes:</b> {patientData.condition}
          </div>

          {/* AI CHECKLIST */}
          {patientData.checklist && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ marginBottom: "10px" }}>⚠️ Equipment Readiness</div>

              {patientData.checklist.map((item) => (
                <div key={item.id} style={{ marginBottom: "8px" }}>
                  • {item.question}
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                <button onClick={() => respond("yes")} style={{ marginRight: "10px", background: "green", padding: "10px" }}>
                  YES READY
                </button>
                <button onClick={() => respond("no")} style={{ background: "red", padding: "10px" }}>
                  NOT READY
                </button>
              </div>

              {responses.ready && (
                <div style={{ marginTop: "10px" }}>
                  Status: {responses.ready === "yes" ? "✅ READY" : "❌ NOT READY"}
                </div>
              )}
            </div>
          )}
          <div style={{ background: '#fffbf0', border: '2px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(255,170,0,0.15)' }}>
  
  <div style={{ fontSize: '12px', color: '#cc8800', letterSpacing: '3px', marginBottom: '16px', fontWeight: '700' }}>🧠 AI PRELIMINARY ANALYSIS</div>
  
  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
    <div style={{ flex: 1, background: '#fff', border: '1px solid #ffaa00', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>LIKELY CONDITION</div>
      <div style={{ fontSize: '16px', fontWeight: '800', color: '#ff2d2d' }}>Cardiac Arrest</div>
    </div>
    <div style={{ flex: 1, background: '#fff', border: '1px solid #ffaa00', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>CONFIDENCE</div>
      <div style={{ fontSize: '16px', fontWeight: '800', color: '#cc8800' }}>87%</div>
    </div>
    <div style={{ flex: 1, background: '#fff', border: '1px solid #ffaa00', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>PRIORITY</div>
      <div style={{ fontSize: '16px', fontWeight: '800', color: '#ff2d2d' }}>CRITICAL</div>
    </div>
  </div>

  <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px', fontWeight: '600' }}>⚡ EQUIPMENT NEEDED:</div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
    {['Defibrillator', 'Oxygen Cylinder', 'IV Line Kit', 'Cardiac Monitor'].map((item, i) => (
      <div key={i} style={{ background: '#fff', border: '1px solid #00aa55', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1a1a2e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#00aa55' }}>✅</span> {item}
      </div>
    ))}
  </div>

  <div style={{ fontSize: '14px', color: '#1a1a2e', marginBottom: '12px', fontWeight: '600' }}>Is your hospital equipped and ready?</div>
  <div style={{ display: 'flex', gap: '12px' }}>
    <button style={{ flex: 1, padding: '14px', background: '#00aa55', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', letterSpacing: '1px' }}>
      ✅ YES, WE'RE READY
    </button>
    <button style={{ flex: 1, padding: '14px', background: '#ff2d2d', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', letterSpacing: '1px' }}>
      ❌ NO — REROUTE
    </button>
  </div>

</div>
        </>
      )}
    </div>
  );
}

export default HospitalView;
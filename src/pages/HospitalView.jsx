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
    <div style={{ background: "#050a0f", minHeight: "100vh", color: "#e0f0ff", padding: "24px" }}>

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

        <div style={{ fontSize: "12px", color: "#6a8fa8" }}>
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
          <div style={{ background: "#1a0a0a", border: "1px solid #ff2d2d", padding: "16px", marginBottom: "24px" }}>
            🚨 INCOMING PATIENT — {patientData.unitId} | ETA: {patientData.eta} min
          </div>

          {/* VITALS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
            <div>❤️ HR: {patientData.heartRate}</div>
            <div>🩺 BP: {patientData.bp}</div>
            <div>🫁 SpO₂: {patientData.spo2}%</div>
            <div>💓 Pulse: {patientData.pulse}</div>
            <div>🌡 Temp: {patientData.temp}</div>
            <div>🧠 GCS: {patientData.gcs}</div>
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
        </>
      )}
    </div>
  );
}

export default HospitalView;
import { useState } from "react";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  function joinQueue() {
    setToken(Math.floor(Math.random() * 50) + 1);
  }

  return (
    <div className="app">

      <header className="header">
        <h1>🏥 Smart Hospital</h1>
        <p>QR Based Live Queue Management System</p>
      </header>

      <div className="container">

        <div className="card">
          <h2>Book Your Queue</h2>

          <label>Department</label>

          <select>
            <option>General Medicine</option>
            <option>Cardiology</option>
            <option>Orthopedic</option>
            <option>Dental</option>
          </select>

          <label>Doctor</label>

          <select>
            <option>Dr. Sharma</option>
            <option>Dr. Kumar</option>
            <option>Dr. Singh</option>
          </select>

          <button onClick={joinQueue}>
            Join Queue
          </button>

          {token && (
            <div className="queue">
              <h2>Your Token</h2>

              <div className="token">
                A-{token}
              </div>

              <p>
                Patients Ahead: <b>7</b>
              </p>

              <p>
                Estimated Wait: <b>35 Minutes</b>
              </p>

              <p className="live">
                🟢 Queue is Live
              </p>
            </div>
          )}
        </div>

        <div className="card qr-card">
          <h2>📱 Scan QR Code</h2>

          <div className="qr-box">
            QR
          </div>

          <p>
            Scan this QR code to join the hospital queue.
          </p>
        </div>

      </div>

    </div>
  );
}

export default App;
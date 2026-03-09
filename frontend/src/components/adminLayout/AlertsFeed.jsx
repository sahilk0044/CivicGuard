import React from "react";

const AlertsFeed = ({ alerts = [] }) => {

  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "12px",
        color: "white"
      }}
    >
      <h5>🚨 Live Emergency Alerts</h5>

      {alerts.length === 0 ? (
        <p>No alerts available</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert._id}
            style={{
              marginTop: "12px",
              padding: "10px",
              borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <strong>{alert.type}</strong> — {alert.location}

            <div style={{ fontSize: "12px", opacity: "0.7" }}>
              {new Date(alert.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      )}

    </div>
  );
};

export default AlertsFeed;
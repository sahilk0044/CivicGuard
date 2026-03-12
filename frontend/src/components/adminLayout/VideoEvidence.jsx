import React from "react";

const VideoEvidence = ({ alerts = [] }) => {

  const videoAlert = alerts.find(alert => alert.video);

  if (!videoAlert) {
    return (
      <div
        style={{
          width: "100%",
          minWidth: "0",
          padding: "20px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          color: "white",
          boxSizing: "border-box"
        }}
      >
        <h5>Video Evidence</h5>
        <p>No video evidence available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minWidth: "0",
        padding: "20px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "12px",
        color: "white",
        boxSizing: "border-box"
      }}
    >

      <h5 style={{ marginBottom: "10px" }}>Video Evidence</h5>

      <video
        controls
        style={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: "8px"
        }}
      >
        <source src={`http://localhost:2000/${videoAlert.video}`} />
      </video>

    </div>
  );
};

export default VideoEvidence;
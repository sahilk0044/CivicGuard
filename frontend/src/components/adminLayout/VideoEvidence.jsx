import React from "react";

const VideoEvidence = ({ alerts = [] }) => {

  const videoAlert = alerts.find(alert => alert.video);

  if (!videoAlert) {
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
        <h5>Video Evidence</h5>
        <p>No video evidence available</p>
      </div>
    );
  }

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

      <h5>Video Evidence</h5>

      <video width="100%" controls>
        <source src={`http://localhost:2000/${videoAlert.video}`} />
      </video>

    </div>
  );
};

export default VideoEvidence;
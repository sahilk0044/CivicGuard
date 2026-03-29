import React, { useState, useRef } from "react";
import { Container, Alert, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const EmergencyAlert = () => {

  const [status, setStatus] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [recording, setRecording] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [alertType, setAlertType] = useState("");

  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const locationRef = useRef({ latitude: null, longitude: null });
  const emergencyLockRef = useRef(false);

  // 🔥 START EMERGENCY WITH TYPE
  const startEmergency = (type) => {

    if (emergencyLockRef.current) return;

    setAlertType(type);
    emergencyLockRef.current = true;

    setCountdown(3);

    let count = 3;

    const timer = setInterval(() => {

      count -= 1;

      if (count <= 0) {
        clearInterval(timer);
        setCountdown(null);
        activateEmergency(type);
      } else {
        setCountdown(count);
      }

    }, 1000);
  };

  const activateEmergency = async (type) => {

    let stream;

    try {

      setStatus("Starting camera...");
      setRecording(true);

      /* CAMERA */
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStatus("Getting location...");

      /* LOCATION */
      await new Promise((resolve) => {

        navigator.geolocation.getCurrentPosition(

          async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            locationRef.current.latitude = lat;
            locationRef.current.longitude = lon;

            try {
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
              );

              locationRef.current.locationName =
                response.data.display_name || "Unknown Location";

            } catch {
              locationRef.current.locationName = "Unknown Location";
            }

            resolve();

          },

          () => {
            setStatus("Location unavailable. Sending alert without location.");
            resolve();
          },

          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }

        );

      });

      /* MEDIA RECORDER */
      let recorder;

      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
        recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
        recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
      } else {
        recorder = new MediaRecorder(stream);
      }

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {

        try {

          const blob = new Blob(chunksRef.current, {
            type: "video/webm"
          });

          const file = new File(
            [blob],
            `alert-${Date.now()}.webm`,
            { type: "video/webm" }
          );

          const formData = new FormData();

          formData.append("video", file);
          formData.append("type", type);
          formData.append("latitude", locationRef.current.latitude);
          formData.append("longitude", locationRef.current.longitude);
          formData.append("locationName", locationRef.current.locationName);

          const token = localStorage.getItem("token");

          await axios.post(
            "http://localhost:8000/api/alerts/send-alert",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
              }
            }
          );

          stream.getTracks().forEach(track => track.stop());

          chunksRef.current = [];
          setRecording(false);
          setAlertSent(true);
          setStatus("Alert sent successfully");

          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }

        } catch (error) {
          console.error(error);
          setStatus("Error sending alert");
        }

      };

      recorder.start();

      setStatus("Recording emergency video...");

      setTimeout(() => {
        if (recorder && recorder.state === "recording") {
          setStatus("Uploading emergency alert...");
          recorder.stop();
        }
      }, 5000);

    } catch (error) {

      console.error(error);

      setStatus("Camera access denied. Please allow camera permissions.");

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      setRecording(false);
      emergencyLockRef.current = false;
    }

  };

  return (

    <Container className="text-center mt-5">

      <motion.h1 initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        🚨 Emergency Alert
      </motion.h1>

      <p>Select department to send alert</p>

      {status && <Alert variant="warning">{status}</Alert>}

      {/* 🔥 CARDS SECTION */}
      {!recording && !alertSent && (
        <Row className="mt-4">

          {[
            { type: "police", label: "🚓 Police", color: "#007bff" },
            { type: "medical", label: "🏥 Medical", color: "#28a745" },
            { type: "fire", label: "🔥 Fire", color: "#dc3545" }
          ].map((dept, index) => (

            <Col md={4} key={index} className="mb-3">

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>

                <Card
                  onClick={() => startEmergency(dept.type)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
                  }}
                >
                  <Card.Body style={{ padding: "40px" }}>
                    <h2 style={{ color: dept.color }}>{dept.label}</h2>
                    <p>Tap to send alert</p>
                  </Card.Body>
                </Card>

              </motion.div>

            </Col>

          ))}

        </Row>
      )}

      {/* COUNTDOWN */}
      {countdown && (
        <motion.h1
          style={{ fontSize: "80px", color: "red" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {countdown}
        </motion.h1>
      )}

      {/* VIDEO */}
      {!alertSent && (
        <div style={{ marginBottom: "20px" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{
              width: "100%",
              maxWidth: "400px",
              borderRadius: "10px",
              border: "3px solid red"
            }}
          />
          {recording && (
            <p style={{ color: "red", marginTop: "10px" }}>
              🔴 Recording Emergency Video...
            </p>
          )}
        </div>
      )}

      {/* SUCCESS */}
      {alertSent && (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
          <h1 style={{ color: "green", fontSize: "48px" }}>
            🚓 HELP IS ON THE WAY
          </h1>
          <p style={{ fontSize: "22px" }}>
            Your alert has been sent successfully.
          </p>
        </motion.div>
      )}

    </Container>
  );
};

export default EmergencyAlert;
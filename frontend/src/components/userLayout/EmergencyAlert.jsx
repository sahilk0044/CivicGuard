import React, { useState, useRef } from "react";
import { Container, Button, Alert, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const EmergencyAlert = () => {

  const [status, setStatus] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [recording, setRecording] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [alertType, setAlertType] = useState("police");

  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const locationRef = useRef({ latitude: null, longitude: null });
  const emergencyLockRef = useRef(false);

  const startEmergency = () => {

    if (emergencyLockRef.current) return;

    emergencyLockRef.current = true;

    setCountdown(3);

    const timer = setInterval(() => {

      setCountdown((prev) => {

        if (prev === 1) {
          clearInterval(timer);
          activateEmergency();
          return null;
        }

        return prev - 1;

      });

    }, 1000);

  };



  const activateEmergency = async () => {

  try {

    setStatus("Starting camera...");
    setRecording(true);

    let stream;

    try {

      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

    } catch (error) {

      setRecording(false);
      emergencyLockRef.current = false;

      setStatus("Camera & microphone permission required. Click 'SEND EMERGENCY ALERT' again after allowing access.");

      return;

    }

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    /* GET LOCATION */

    await new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          locationRef.current.latitude = lat;
          locationRef.current.longitude = lon;

          try {

            /* REVERSE GEOCODING */

            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );

            locationRef.current.locationName =
              response.data.display_name || "Unknown Location";

          } catch (error) {

            console.error("Reverse geocoding failed");
            locationRef.current.locationName = "Unknown Location";

          }

          resolve();

        },

        (error) => {

          setRecording(false);
          emergencyLockRef.current = false;

          setStatus("Location permission required. Please allow location and press the alert button again.");

          reject();

        }

      );

    });

    /* MEDIA RECORDER SETUP */

    let recorder;

    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
    }
    else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
    }
    else {
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
        formData.append("type", alertType);
        formData.append("latitude", locationRef.current.latitude);
        formData.append("longitude", locationRef.current.longitude);

        formData.append(
          "locationName",
          locationRef.current.locationName
        );

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

    /* AUTO STOP AFTER 15 SECONDS */

    setTimeout(() => {

      if (recorder && recorder.state === "recording") {
        setStatus("Uploading emergency alert...");
        recorder.stop();
      }

    }, 15000);

  } catch (error) {

    console.error(error);
    setStatus("Camera or location permission denied");
    emergencyLockRef.current = false;

  }

};


  return (

    <Container className="text-center mt-5">

      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        🚨 Emergency Alert
      </motion.h1>

      <p>If you are in danger press the alert button.</p>

      {status && <Alert variant="warning">{status}</Alert>}

      {/* ALERT TYPE */}

      {!recording && !alertSent && (

        <Form.Group className="mb-3">

          <Form.Label>Select Emergency Type</Form.Label>

          <Form.Select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
          >
            <option value="police">Police / Crime</option>
            <option value="medical">Medical Emergency</option>
            <option value="fire">Fire Emergency</option>
          </Form.Select>

        </Form.Group>

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

      {/* RECORDING VIDEO */}

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

      {/* SUCCESS MESSAGE */}

      {alertSent && (

        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
        >

          <h1 style={{ color: "green", fontSize: "48px" }}>
            🚓 HELP IS ON THE WAY
          </h1>

          <p style={{ fontSize: "22px" }}>
            Your alert has been sent to the nearest authority.
          </p>

        </motion.div>

      )}

      {!recording && !alertSent && (

        <Button
          variant="danger"
          size="lg"
          onClick={startEmergency}
        >
          SEND EMERGENCY ALERT
        </Button>

      )}

    </Container>

  );

};

export default EmergencyAlert;
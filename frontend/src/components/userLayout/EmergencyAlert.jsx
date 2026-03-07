import React, { useState, useRef } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const EmergencyAlert = () => {

  const [status, setStatus] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [recording, setRecording] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const locationRef = useRef({ latitude: null, longitude: null });

  // 🔒 HARD LOCK to prevent duplicate execution
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

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      /* GET LOCATION */

      await new Promise((resolve, reject) => {

  navigator.geolocation.getCurrentPosition(
    (position) => {

      locationRef.current.latitude = position.coords.latitude;
      locationRef.current.longitude = position.coords.longitude;

      resolve();

    },
    (error) => {
      console.error(error);
      reject();
    }
  );

});

      let options = { mimeType: "video/webm;codecs=vp8,opus" };

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm" };
      }

      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {

        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }

      };

      recorder.onstop = async () => {

        try {

          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType
          });

          const file = new File(
            [blob],
            `alert-${Date.now()}.webm`,
            { type: "video/webm" }
          );

          const formData = new FormData();
          formData.append("video", file);
          formData.append("latitude", locationRef.current.latitude);
          formData.append("longitude", locationRef.current.longitude);

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

      chunksRef.current = [];
      recorder.start();

      setTimeout(() => {

        if (recorder.state !== "inactive") {
          recorder.stop();
        }

      }, 8000);

    } catch (error) {

      console.error(error);
      setStatus("Camera or location permission denied");

      // unlock if error occurs
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

      {countdown && (

        <motion.h1
          style={{ fontSize: "80px", color: "red" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {countdown}
        </motion.h1>

      )}

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

        </div>

      )}

      {alertSent && (

        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
        >

          <h1 style={{ color: "green", fontSize: "48px" }}>
            🚓 HELP IS ON THE WAY
          </h1>

          <p style={{ fontSize: "22px" }}>
            Your alert has been sent to CivicGuard authorities.
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
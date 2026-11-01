import "./App.css";

import { invoke } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import { IoIosCamera } from "react-icons/io";
import CameraComponent from "./components/CameraComponent";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCapture = async () => {
    const videoNode = videoRef.current;
    if (!videoNode || videoNode.videoWidth === 0 || videoNode.videoHeight === 0) {
      setSaveMessage("The camera is not ready yet.");
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoNode.videoWidth;
    canvas.height = videoNode.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setSaveMessage("Could not prepare the captured image.");
      return;
    }
    ctx.drawImage(videoNode, 0, 0, canvas.width, canvas.height);

    try {
      setIsSaving(true);
      setSaveMessage(null);
      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      const filePath = await invoke<string>("save_captured_image", {
        imageData,
        timestamp: Date.now(),
      });
      setSaveMessage(`Image saved to ${filePath}`);
    } catch (err) {
      setSaveMessage(`Failed to save image: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });
        setStream(mediaStream);
      } catch (err: Error | any) {
        setError("Camera access denied: " + err.message);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <main className="container">

      <CameraComponent stream={stream} videoRef={videoRef} error={error} />

      <div className="camera-controls">
        <div id="shutter-button" onClick={handleCapture}>
          <IoIosCamera size={40} fill="white" />
        </div>
      </div>
    </main>
  );
}

export default App;

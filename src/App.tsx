import "./App.css";

import { useEffect, useRef, useState } from "react";
import { IoIosCamera } from "react-icons/io";
import CameraComponent from "./components/CameraComponent";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    // Create a dynamic, off-screen canvas to process the snapshot
    const canvas = document.createElement('canvas');
    canvas.width = videoNode.videoWidth;
    canvas.height = videoNode.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoNode, 0, 0, canvas.width, canvas.height);

    // Get image as base64 string
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
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

      <CameraComponent stream={stream} videoRef={videoRef} error={error} setError={setError} />

      <div className="camera-controls">
        <div id="shutter-button" onClick={handleCapture}>
          <IoIosCamera size={40} fill="white" />
        </div>
      </div>

      {/* {capturedImage && (
        <div className="preview">
          <img src={capturedImage} alt="Captured" style={{ width: '300px' }} />
        </div>
      )} */}
    </main>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";

const CameraComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1200, height: 720 }
                })

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera");
                setError("Could not access Camera");
            }
        }

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach((track: MediaStreamTrack) => track.stop());
            }
        }
    }, [])

    return (
        <>
            {error ?
                (<div className="camera-component">CameraComponent</div>) :
                (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="camera-component"
                        style={{
                            margin: 0,
                            padding: 0,
                            width: "100%",
                            height: "100%",
                        }}
                    />
                )}
        </>
    )
}

export default CameraComponent
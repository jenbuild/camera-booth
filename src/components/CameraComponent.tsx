import { useEffect } from "react";

const CameraComponent = ({ stream, videoRef, error, setError }: { stream: MediaStream | null; videoRef: React.RefObject<HTMLVideoElement | null>; error: string | null; setError: React.Dispatch<React.SetStateAction<string | null>> }) => {

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef])

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
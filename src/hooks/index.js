import { useState } from "react";

const useAudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  return { permission, stream, getMicrophonePermission };
};

export { useAudioRecorder };

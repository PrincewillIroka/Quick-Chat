import { useEffect, useState } from "react";

export function useSetupAudioRecorder(setRecordingStatus) {
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
        setRecordingStatus("startRecording");
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  return { getMicrophonePermission, permission, stream };
}

export function useRecording({
  setRecordingStatus,
  mediaRecorder,
  stream,
  mimeType,
  recordingStatus,
  isFileContainerOpen,
}) {
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!stream) return;
    if (recordingStatus === "startRecording") {
      setRecordingStatus("recording");

      const media = new MediaRecorder(stream, { type: mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current?.start(1000);
      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        audioChunks.push(event.data);
        setAudioChunks(audioChunks);
      };
    } else if (recordingStatus === "stopRecording") {
      mediaRecorder.current?.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        // const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioBlob);
        setAudioChunks([]);
      };
    }
  }, [
    setRecordingStatus,
    stream,
    recordingStatus,
    mimeType,
    mediaRecorder,
    audioChunks,
  ]);

  useEffect(() => {
    let interval;
    if (recordingStatus === "recording") {
      interval = setInterval(() => {
        setCounter(counter + 1);
      }, 1000);
    } else if (recordingStatus === "stopRecording") {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [setCounter, recordingStatus, counter]);

  useEffect(() => {
    if (!isFileContainerOpen && recordingStatus === "inactive") {
      setAudio(null);
      setAudioChunks([]);
      setCounter(0);
    }
  }, [isFileContainerOpen, recordingStatus]);

  return { audio, counter };
}

import { useState } from "react";

const useAudioRecorder = ({ setPermission, setStream }) => {
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

  return { getMicrophonePermission };
};

const startRecording = async ({
  setRecordingStatus,
  setAudioChunks,
  mediaRecorder,
  stream,
  mimeType,
}) => {
  setRecordingStatus("recording");
  //create new Media recorder instance using the stream
  const media = new MediaRecorder(stream, { type: mimeType });
  //set the MediaRecorder instance to the mediaRecorder ref
  mediaRecorder.current = media;
  //invokes the start method to start the recording process
  mediaRecorder.current.start();
  let localAudioChunks = [];
  mediaRecorder.current.ondataavailable = (event) => {
    if (typeof event.data === "undefined") return;
    if (event.data.size === 0) return;
    localAudioChunks.push(event.data);
  };
  setAudioChunks(localAudioChunks);
};

const stopRecording = ({
  setRecordingStatus,
  setAudioChunks,
  setAudio,
  mediaRecorder,
  audioChunks,
  mimeType
}) => {
  setRecordingStatus("inactive");
  //stops the recording instance
  mediaRecorder.current.stop();
  mediaRecorder.current.onstop = () => {
    //creates a blob file from the audiochunks data
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    //creates a playable URL from the blob file.
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudio(audioUrl);
    setAudioChunks([]);
  };
};

export { useAudioRecorder, startRecording, stopRecording };

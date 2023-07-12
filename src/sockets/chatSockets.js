import NotificationTone from "constants/mixkit-correct-answer-tone-2870.wav";

const chatSockets = (socket, state, dispatch) => {
  socket.on("new-message-received", (payload) => {
    if (payload) {
      const audio = new Audio(NotificationTone);
      audio.play();
      dispatch({ type: "UPDATE_CHAT", payload });
    }
  });

  socket.on("uploaded-file-success", (data) => {
    dispatch({ type: "UPDATE_FILE_UPLOADING_STATUS", payload: data });
  });

  socket.on("participant-has-joined-chat", (data) => {
    console.log({ data });
    // dispatch({ type: "ADD_PARTICIPANT_TO_CHAT", payload: data });
  });
};

export default chatSockets;

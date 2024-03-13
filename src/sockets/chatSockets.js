import NotificationTone from "static/media/mixkit-bubble-pop-up-alert-notification-2357.wav";

const audio = new Audio(NotificationTone);

const chatSockets = (socket, state, dispatch) => {
  socket.on("new-message-received", (payload) => {
    if (payload) {
      dispatch({ type: "ADD_NEW_MESSAGE_TO_CHAT", payload });
      if (audio.paused) {
        audio.play().catch(console.warn);
      }
    }
  });

  socket.on("uploaded-file-success", (data) => {
    dispatch({ type: "UPDATE_FILE_UPLOADING_STATUS", payload: data });
  });

  socket.on("update-participant-typing", (message) => {
    dispatch({ type: "UPDATE_PARTICIPANT_IS_TYPING", payload: message });
  });

  socket.on("participant-has-joined-chat", (data) => {
    dispatch({ type: "ADD_PARTICIPANT_TO_CHAT", payload: data });
  });

  socket.on("new-message-notification", (data) => {
    dispatch({ type: "NEW_MESSAGE_NOTIFICATION", payload: data });
  });
};

export default chatSockets;

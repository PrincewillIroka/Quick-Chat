import NotificationTone from "static/media/mixkit-bubble-pop-up-alert-notification-2357.wav";

const audio = new Audio(NotificationTone);

const chatSockets = (socket, state, dispatch) => {
  socket.on("new-message-received", (payload) => {
    if (payload) {
      dispatch({ type: "ADD_NEW_MESSAGE_TO_CHAT", payload });
      if (payload?.newMessage?.content) {
        dispatch({ type: "INCREASE_CHAT_NOTIFICATION_COUNT", payload });
      }
      if (audio.paused) {
        audio.play().catch(console.warn);
      }
    }
  });

  socket.on("uploaded-file-success", (payload) => {
    dispatch({ type: "UPDATE_FILE_UPLOADING_STATUS", payload });
    if (payload?.attachment?.isUploading === "Completed") {
      dispatch({ type: "INCREASE_CHAT_NOTIFICATION_COUNT", payload });
    }
  });

  socket.on("update-participant-typing", (payload) => {
    dispatch({ type: "UPDATE_PARTICIPANT_IS_TYPING", payload });
  });

  socket.on("participant-has-joined-chat", (payload) => {
    dispatch({
      type: "ADD_PARTICIPANT_TO_CHAT",
      payload,
    });
    dispatch({ type: "INCREASE_CHAT_NOTIFICATION_COUNT", payload });
    if (audio.paused) {
      audio.play().catch(console.warn);
    }
  });

  socket.on("new-message-notification", (payload) => {
    dispatch({ type: "NEW_MESSAGE_NOTIFICATION", payload });
  });
};

export default chatSockets;

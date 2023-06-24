const chatSockets = (socket, state, dispatch) => {
  socket.on("newMessageReceived", ({ updatedChat }) => {
    if (updatedChat) dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
  });

  socket.on(
    "uploadedFileSuccess",
    ({ chat_id, sender_id, messageId, attachmentKey: key, file_url }) => {
      console.log({
        chat_id,
        sender_id,
        messageId,
        attachmentKey: key,
        file_url,
      });
    }
  );
};

export default chatSockets;

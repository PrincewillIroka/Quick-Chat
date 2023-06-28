const chatSockets = (socket, state, dispatch) => {
  socket.on("newMessageReceived", ({ updatedChat }) => {
    if (updatedChat) dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
  });

  socket.on("uploadedFileSuccess", (data) => {
    dispatch({ type: "UPDATE_FILE_UPLOADING_STATUS", payload: data });
  });
};

export default chatSockets;

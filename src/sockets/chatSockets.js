const chatSockets = (socket, state, dispatch) => {
  socket.on("newMessageReceived", (payload) => {
    if (payload) dispatch({ type: "UPDATE_CHAT", payload });
  });

  socket.on("uploadedFileSuccess", (data) => {
    dispatch({ type: "UPDATE_FILE_UPLOADING_STATUS", payload: data });
  });
};

export default chatSockets;

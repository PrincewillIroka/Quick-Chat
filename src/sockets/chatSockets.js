const chatSockets = (socket, state, dispatch) => {
  socket.on("newMessageReceived", ({ updatedChat }) => {
    if (updatedChat) dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
  });
};

export default chatSockets;

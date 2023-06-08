const chatSockets = (socket, state, dispatch) => {
  socket.on("newMessageReceived", (arg) => {
    let updatedChat = arg.updatedChat;
    dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
  });
};

export default chatSockets;

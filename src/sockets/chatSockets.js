const chatSockets = (socket, state, dispatch) => {
  socket.on("newMessageReceived", ({ updatedChat }) => {
    if (updatedChat) dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
  });

  socket.on("uploadedFileSuccess", ({}) => {
    console.log("qwerty");
  });
};

export default chatSockets;

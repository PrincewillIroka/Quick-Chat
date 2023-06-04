const chatSockets = (socket) => {
  socket.on("newMessageReceived", (arg) => {
    console.log({ newMessageReceived: arg });
  });
};

export default chatSockets;

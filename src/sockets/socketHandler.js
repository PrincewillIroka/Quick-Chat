import { io } from "socket.io-client";
import chatSockets from "./chatSockets";

const appHost = process.env.REACT_APP_HOST;

export const socket = io(appHost, {
  transports: ["websocket"],
  jsonp: false,
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  forceNew: true,
});

export const socketHandler = (state, dispatch) => {
  socket.on("connect", () => {
    console.log("socket connection to server successful.");
    chatSockets(socket, state, dispatch);
  });

  // socket.io.on("open", () => {
  //   socket.io.engine.transport.on("pollComplete", () => {
  //     const request = socket.io.engine.transport.pollXhr.xhr;
  //     const cookieHeader = request.getResponseHeader("set-cookie");
  //   });
  //   const request = socket.io.engine.transport.pollXhr.xhr;
  //   const cookieHeader = request.getResponseHeader("set-cookie");
  //   if (!cookieHeader) {
  //     return;
  //   }
  // });
};

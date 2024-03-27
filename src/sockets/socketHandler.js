import { io } from "socket.io-client";
import chatSockets from "./chatSockets";

const appHost = process.env.REACT_APP_HOST;

export const socket = io(appHost, {
  transports: ["websocket"],
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 3000,
  reconnectionAttempts: 20,
  forceNew: true,
});

export const socketHandler = (state, dispatch) => {
  socket.connect();

  socket.on("connect", () => {
    console.log("socket connection to server successful.");

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

    chatSockets(socket, state, dispatch);
  });
};

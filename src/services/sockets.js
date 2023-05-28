import socketIOClient from "socket.io-client";
import Cookies from "js-cookie";

const appHost = process.env.REACT_APP_HOST;

export const socket = socketIOClient(appHost, {
  transports: ["websocket"],
  jsonp: false,
});

const sockets = () => {
  socket.connect();

  socket.on("connect", (ack) => {
    console.log("connected to server.", socket);
    });
  });
};

export { sockets };

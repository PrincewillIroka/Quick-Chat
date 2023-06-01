import socketIOClient from "socket.io-client";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import chatSockets from "./chatSockets";

const appHost = process.env.REACT_APP_HOST;

export const socket = socketIOClient(appHost, {
  transports: ["websocket"],
  jsonp: false,
});

export const socketHandler = () => {
  socket.connect();

  socket.on("connect", () => {
    let bs_token = Cookies.get("bs_token");

    if (!bs_token) {
      const uidv4 = uuidv4();
      bs_token = `${uidv4}_${Date.now()}`;
      Cookies.set("bs_token", bs_token, { expires: 2147483647 });
    }

    // console.log({ bs_token });

    console.log("connected to server.", socket);

    // socket.io.engine.transport.on("pollComplete", () => {
    //   const request = socket.io.engine.transport.pollXhr.xhr;
    //   console.log("request", request);
    //     const cookieHeader = request.getResponseHeader("set-cookie");
    //     if (!cookieHeader) {
    //       return;
    //     }
    //     cookieHeader.forEach((cookieString) => {
    //       if (cookieString.includes(`${COOKIE_NAME}=`)) {
    //         const cookie = parse(cookieString);
    //         socket.io.opts.extraHeaders = {
    //           cookie: `${COOKIE_NAME}=${cookie[COOKIE_NAME]}`,
    //         };
    //       }
    //     });
    // });

    chatSockets(socket);
  });
};

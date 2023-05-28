import React from "react";
import { createRoot } from "react-dom/client";
import { sockets } from "./services";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

sockets();

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

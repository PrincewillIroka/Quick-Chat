import React from "react";
import { createRoot } from "react-dom/client";
import { socketHandler } from "./sockets";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

socketHandler();

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App tab="home" />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

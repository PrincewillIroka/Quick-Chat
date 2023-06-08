import React from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";
import BeginChatSvg from "../../assets/Begin-chat.svg";

export default function Home({ user }) {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="container">
      <div className="col col-1">
        <img src={BeginChatSvg} className="svg-bg" alt="" />
        <h1 className="quick-chat-heading">Quick Chat</h1>
      </div>
      <div className="col col-2">
        <h4 className="welcome-heading">Hi, Welcome</h4>
        <span className="quick-chat-info">
          <b className="quick-chat-emphasis">Quick Chat</b> let's you start an
          instant chat with other users.
        </span>
        <ul className="quick-chat-features">
          <li>No need to create an account.</li>
          <li>
            Just start a chat, and share the link to those you want to chat
            with.
          </li>
        </ul>
        <button
          className="btn-start-now"
          onClick={() => handleNavigation("chat")}
        >
          Start Now &nbsp; &#8594;
        </button>
      </div>
    </div>
  );
}

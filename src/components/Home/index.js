import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import BeginChatSvg from "assets/Begin-chat.svg";
import { getAppHealth } from "services/userServices";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    getAppHealth();
  }, []);

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
        <div className="welcome-heading-container">
          <h4 className="welcome-heading">Quick Chat</h4>
        </div>
        <div className="quick-chat-info-container">
          <span className="quick-chat-text">
            let's you start an instant chat with other users.
          </span>
        </div>
        <ul className="quick-chat-features">
          <li>&#10003; No need to create an account.</li>
          <li>
            &#10003; Just create a conversation, and share the link to anyone
            you want to chat with.
          </li>
        </ul>
        <button
          className="btn-start-now"
          onClick={() => handleNavigation("chat")}
        >
          Start Now &#8594;
        </button>
      </div>
    </div>
  );
}

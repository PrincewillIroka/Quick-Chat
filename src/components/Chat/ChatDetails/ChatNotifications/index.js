import React from "react";
import { useStateValue } from "store/stateProvider";
import "./ChatNotifications.css";

function ChatNotifications() {
  const { state = {} } = useStateValue();
  const { notifications = [] } = state;

  return (
    <div className="notification-container">
      <div className="notification-wrapper">
        {notifications.map(({ value }, index) => (
          <div className="notification-single-wrapper" key={index}>
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatNotifications;

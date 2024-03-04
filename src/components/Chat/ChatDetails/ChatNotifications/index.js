import React from "react";
import { useStateValue } from "store/stateProvider";
import { publish } from "custom-events";
import { socket } from "sockets/socketHandler";
import "./ChatNotifications.css";

function ChatNotifications() {
  const { state = {}, dispatch } = useStateValue();
  const { notifications = [], user = {} } = state;

  const handleNotification = ({ message_id, value, chat_url, chat_id }) => {
    publish("toggledSelectedChat");
    dispatch({ type: "VIEW_CHAT_FROM_NOTIFICATIONS", payload: chat_id });
    socket.emit("participant-join-selected-chat", {
      chat_url,
      user_id: user._id,
    });
  };

  return (
    <div className="notification-container">
      <div className="notification-wrapper">
        {notifications.map((notification, index) => (
          <div
            className="notification-single-wrapper"
            key={index}
            onClick={() => handleNotification(notification)}
          >
            {notification.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatNotifications;

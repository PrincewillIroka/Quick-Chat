import React from "react";
import { useStateValue } from "store/stateProvider";
import { publish } from "custom-events";
import { socket } from "sockets/socketHandler";
import PushNotifications from "assets/PushNotifications.svg";
import "./ChatNotifications.css";

function ChatNotifications() {
  const { state = {}, dispatch } = useStateValue();
  const { notifications = [], user = {} } = state;

  const handleNotification = ({ chat_url, chat_id }) => {
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
        {notifications.length ? (
          notifications.map((notification, index) => (
            <div
              className="notification-single-wrapper"
              key={index}
              onClick={() => handleNotification(notification)}
            >
              {notification.value}
            </div>
          ))
        ) : (
          <div className="notification-bg-container">
            <img src={PushNotifications} className="notification-bg" alt="" />
            <span>No Notification found</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatNotifications;

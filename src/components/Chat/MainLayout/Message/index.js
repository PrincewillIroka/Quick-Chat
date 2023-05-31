import React from "react";
import "./Message.css";

export default function Message({ message }) {
  const isSameSender = (message) => {
    return message.sender._id === "631535b15cd9aab7ef9a37a3"; //Todo: remove this
  };

  return (
    <div
      className={`message-container ${
        isSameSender(message) && "message-container-align-right"
      }`}
    >
      <img
        className="message-sender-photo"
        src="https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0="
      />
      <div className="message-details">
        <div className="message-info">
          <span className="message-owner">{message.sender.name}</span>
          <span className="message-time">10:05 AM</span>
        </div>
        <span className="message-original">{message.message}</span>
      </div>
    </div>
  );
}

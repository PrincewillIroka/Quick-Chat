import React from "react";
import "./Message.css";
import { generateInitials } from "../../../../utils";

export default function Message({ message }) {
  const { sender = {}, content = "" } = message;

  const isSameSender = (sender) => {
    return sender?._id === "631535b15cd9aab7ef9a37a3"; //Todo: remove this
  };

  return (
    <div
      className={`message-container ${
        isSameSender(sender) && "message-container-align-right"
      }`}
    >
      {sender?.photo ? (
        <img className="message-sender-photo" src={sender?.photo} alt="Sender"/>
      ) : (
        <span className="message-sender-photo message-sender-initial">
          {generateInitials(sender?.name)}
        </span>
      )}
      <div className="message-details">
        <div className="message-info">
          <span className="message-owner">{sender?.name}</span>
          <span className="message-time">10:05 AM</span>
        </div>
        <span className="message-original">{content}</span>
      </div>
    </div>
  );
}

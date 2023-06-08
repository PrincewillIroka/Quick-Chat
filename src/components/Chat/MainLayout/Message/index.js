import React from "react";
import "./Message.css";
import { generateInitials } from "../../../../utils";
import { useStateValue } from "../../../../store/stateProvider";

export default function Message({ message }) {
  const { state } = useStateValue();
  const { user = {} } = state;
  const { sender = {}, content = "" } = message;

  const isSameSender = (sender) => {
    return sender._id === user._id;
  };

  return (
    <div
      className={`message-container ${
        isSameSender(sender) && "message-container-align-right"
      }`}
    >
      {sender.photo ? (
        <img
          className="message-sender-photo"
          src={sender.photo}
          alt="Sender"
        />
      ) : (
        <span className="message-sender-photo message-sender-initial">
          {generateInitials(sender.name)}
        </span>
      )}
      <div className="message-details">
        <div className="message-info">
          <span className="message-owner">{sender.name}</span>
          <span className="message-time">10:05 AM</span>
        </div>
        <span className="message-original">{content}</span>
      </div>
    </div>
  );
}

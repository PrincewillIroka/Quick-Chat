import React from "react";
import "./ChatInfo.css";
import { generateInitials, isSelectedChat } from "../../../../utils";

export default function ChatInfo({ chat, selectedChat, selectChat }) {
  const { participants = [] } = chat;

  return (
    <div
      className={`chat-info-wrapper ${
        isSelectedChat(chat, selectedChat) && "chat-info-wrapper-selected"
      }`}
      onClick={() => selectChat(chat)}
    >
      <div className="chat-info-photo-or-initial-wrapper">
        {participants.slice(0, 3).map((participant, index) => (
          <span
            className={`chat-info-initial ${
              isSelectedChat(chat, selectedChat) && "chat-info-initial-selected"
            }`}
            key={index}
          >
            {generateInitials(participant.name)}
          </span>
        ))}
      </div>
      <div className="chat-info-col">
        {participants.slice(0, 3).map((participant, index) => (
          <span className="chat-info-name" key={index}>
            {participant.name}
            {index < participants.length - 1 && ", "}
          </span>
        ))}
      </div>
    </div>
  );
}

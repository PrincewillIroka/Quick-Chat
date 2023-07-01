import React from "react";
import "./ChatInfo.css";
import { generateInitials, isSelectedChat, isSameSender } from "utils";
import { useStateValue } from "store/stateProvider";

export default function ChatInfo({
  chat,
  selectedChat = {},
  selectChat = () => {},
}) {
  const { state } = useStateValue();
  const { participants = [], chat_name = "" } = chat || {};
  const { user = {} } = state;

  return (
    <div
      className={`chat-info-wrapper ${
        isSelectedChat(chat, selectedChat) && "chat-info-wrapper-selected"
      }`}
      onClick={() => selectChat(chat)}
    >
      <div className="chat-info-photo-or-initial-wrapper">
        {participants.slice(0, 3).map((participant, index) =>
          participant.photo ? (
            <img
              src={participant.photo}
              className="user-info-initial user-info-img"
              alt=""
              key={index}
            />
          ) : (
            <span
              className={`chat-info-initial ${
                isSelectedChat(chat, selectedChat) &&
                "chat-info-initial-selected"
              }`}
              key={index}
            >
              {generateInitials(participant.name)}
            </span>
          )
        )}
      </div>
      <div className="chat-info-col">
        {chat_name ? (
          <span className="chat-info-name">{chat_name}</span>
        ) : (
          participants.slice(0, 3).map((participant, index) => (
            <div className="chat-info-name-wrapper" key={index}>
              <span className="chat-info-name" key={index}>
                {participant.name}
                {index < participants.length - 1 && ","}&nbsp;
              </span>
              {isSameSender(participant, user) && participants.length === 1 && (
                <span className="chat-info-name-you">(You)</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
  const { isDarkMode = false } = user;

  return (
    <div
      className={`chat-info-wrapper ${
        isDarkMode ? "chat-info-wrapper-dark" : ""
      } ${
        isSelectedChat(chat, selectedChat) &&
        `${
          isDarkMode
            ? "chat-info-wrapper-selected-dark"
            : "chat-info-wrapper-selected"
        }`
      } `}
      onClick={() => selectChat(chat)}
    >
      <div className="chat-info-photo-or-initial-wrapper">
        {participants.slice(0, 3).map((participant, index) => {
          const checkSameSender = isSameSender(participant, user);
          participant = checkSameSender ? user : participant;
          const { name = "", photo = "" } = participant || {};

          return photo ? (
            <img
              src={photo}
              className="chat-info-initial chat-info-photo"
              alt=""
              key={index}
              title={name}
            />
          ) : (
            <span
              className={`chat-info-initial ${
                isDarkMode && "chat-info-initial-dark"
              } ${
                isSelectedChat(chat, selectedChat) &&
                "chat-info-initial-selected"
              }`}
              key={index}
              title={name}
            >
              {generateInitials(name)}
            </span>
          );
        })}
      </div>
      <div className="chat-info-col">
        {chat_name ? (
          <span className="chat-info-name">{chat_name}</span>
        ) : (
          participants.slice(0, 3).map((participant, index) => {
            const checkSameSender = isSameSender(participant, user);
            participant = checkSameSender ? user : participant;
            const { name = "" } = participant;

            return (
              <div className="chat-info-name-wrapper" key={index}>
                <span className="chat-info-name" key={index}>
                  {name}
                  {index < participants.length - 1 && ","}&nbsp;
                </span>
                {checkSameSender && participants.length <= 2 && (
                  <span className="chat-info-name-you">(You)</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

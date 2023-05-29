import React from "react";
import "./UserInfo.css";
import { generateInitials, isSelectedChat } from "../../../../utils";

export default function UserInfo({ user, selectedChat, selectChat }) {
  return (
    <div
      className={`user-info-wrapper ${
        isSelectedChat(user, selectedChat) && "user-info-wrapper-selected"
      }`}
      onClick={() => selectChat(user)}
    >
      {user?.photo ? (
        <img src={user.photo} className="user-info-photo" alt="" />
      ) : (
        <span
          className={`user-info-initial ${
            isSelectedChat(user, selectedChat) && "user-info-initial-selected"
          }`}
        >
          {generateInitials(user.name)}
        </span>
      )}
      <div className="user-info-col">
        <div className="user-info-row-1">
          <span className="user-info-name">{user.name}</span>
          <span className="user-info-chat-time">{user.last_chat_time}</span>
        </div>
        <div></div>
      </div>
    </div>
  );
}

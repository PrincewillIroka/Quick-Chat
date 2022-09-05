import React from "react";
import "./UserInfo.css";
import { generateInitials, isSelectedUser } from "../../../../utils";

export default function UserInfo({ user, selectedUser, selectUser }) {
  return (
    <div
      className={`user-info-wrapper ${
        isSelectedUser(user, selectedUser) && "user-info-wrapper-selected"
      }`}
      onClick={() => selectUser(user)}
    >
      {user?.photo ? (
        <img src={user.photo} className="user-info-photo" />
      ) : (
        <span
          className={`user-info-initial ${
            isSelectedUser(user, selectedUser) && "user-info-initial-selected"
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

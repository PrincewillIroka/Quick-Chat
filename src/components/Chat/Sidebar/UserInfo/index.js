import React from "react";
import "./UserInfo.css";

export default function UserInfo({ user, selectUser }) {
  const generateInitials = () => {};

  return (
    <div className="user-info-wrapper" onClick={() => selectUser(user)}>
      {user?.photo ? (
        <img src={user.photo} className="user-info-photo" />
      ) : (
        <span>{generateInitials()}</span>
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

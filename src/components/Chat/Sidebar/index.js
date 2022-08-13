import React, { useState } from "react";
import { BsPlusCircle, BsStar } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import UserInfo from "./UserInfo";
import "./Sidebar.css";

export default function Sidebar() {
  const [selectedUser, setSelectedUser] = useState({});
  const users = [
    {
      name: "Percy Jackson",
      photo:
        "https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0=",
      last_chat_time: "10:02 AM",
      unread: 0,
      is_online: true,
      is_typing: false,
    },
    {
      name: "UI/UX Designer",
      photo:
        "https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0=",
      last_chat_time: "11:56 AM",
      unread: 5,
      is_online: false,
      is_typing: true,
    },
  ];

  return (
    <section className="sidebar-container">
      <div className="row-1">
        <img
          className="profile-photo"
          src="https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0="
        />
        <button className="btn-start-convo">
          <span>Start new conversation</span>
          <BsPlusCircle className="plus-circle-icon" />
        </button>
      </div>
      <div className="row-2">
        <div className="message-container">
          <h4 className="messages-title">Messages</h4>
          <GoChevronDown />
        </div>
        <BsStar className="bookmark-icon" />
      </div>
      <div className="search-row">
        <FiSearch className="search-icon" />
        <input placeholder="Search here..." className="search-input" />
      </div>
      <div className="user-info-container">
        {users.map((user) => (
          <UserInfo user={user} selectUser={(user) => setSelectedUser(user)} />
        ))}
      </div>
    </section>
  );
}

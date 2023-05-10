import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MainLayout from "./MainLayout";
import "./Chat.css";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState({});
  const users =  [
    {
      _id: "1",
      name: "Percy Jackson",
      photo:
        "https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0=",
      last_chat_time: "10:02 AM",
      unread: 0,
      is_online: true,
      is_typing: false,
    },
    {
      _id: "2",
      name: "UI/UX Designer",
      photo:
        "https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0=",
      last_chat_time: "11:56 AM",
      unread: 5,
      is_online: false,
      is_typing: true,
    },
    {
      _id: "3",
      name: "Anabel Jamie",
      photo: "",
      last_chat_time: "11:56 AM",
      unread: 5,
      is_online: false,
      is_typing: true,
    },
  ];

  useEffect(() => {
    setSelectedUser(users[0]);
  }, [users]);

  return (
    <div className="chat-container">
      <Sidebar
        selectUser={(user) => setSelectedUser(user)}
        users={users}
        selectedUser={selectedUser}
      />
      <MainLayout selectedUser={selectedUser} />
    </div>
  );
}

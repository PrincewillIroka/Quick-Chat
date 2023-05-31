import React, { useEffect } from "react";
import { BsPlusCircle, BsStar } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import ChatInfo from "./ChatInfo";
import "./Sidebar.css";
import { useStateValue } from "../../../store/stateProvider";
import { createChat } from "../../../services/chatServices";
import { getChats } from "../../../services/userServices";

export default function Sidebar() {
  const [state, dispatch] = useStateValue();
  const { chats, selectedChat } = state;

  useEffect(() => {
    handleGetChats();
  }, []);

  const handleGetChats = async () => {
    await getChats()
      .then(async (response) => {
        const chatResponse = response?.chats || [];
        if (chatResponse) {
          dispatch({ type: "GET_CHATS_SUCCESS", payload: chatResponse });
          dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: chatResponse[0] });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCreateChat = async () => {
    await createChat()
      .then(async (response) => {
        console.log("createChat", response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSselectChat = (chat) => {
    dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: chat });
  };

  return (
    <section className="sidebar-container">
      <div className="row-1">
        <img
          className="profile-photo"
          src="https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0="
          alt=""
        />
        <button className="btn-start-convo" onClick={handleCreateChat}>
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
        {chats.map((chat, index) => (
          <ChatInfo
            chat={chat}
            selectChat={(chat) => handleSselectChat(chat)}
            selectedChat={selectedChat}
            key={index}
          />
        ))}
      </div>
    </section>
  );
}

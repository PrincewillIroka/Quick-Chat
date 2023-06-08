import React, { useEffect, useCallback } from "react";
import { BsPlusCircle, BsStar } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";
import { FiSearch } from "react-icons/fi";

import ChatInfo from "./ChatInfo";
import "./ChatList.css";
import { useStateValue } from "../../../store/stateProvider";
import { createChat } from "../../../services/chatServices";
import { getChats } from "../../../services/userServices";
import { socket } from "../../../sockets/socketHandler";
import { generateInitials } from "../../../utils";

export default function ChatList() {
  const [state, dispatch] = useStateValue();
  const { chats = [], selectedChat = {}, user = {} } = state;

  const handleGetChats = useCallback(async () => {
    await getChats()
      .then(async (response) => {
        const chatResponse = response?.chats || [];
        if (chatResponse) {
          const firstChat = chatResponse[0];
          dispatch({ type: "GET_CHATS_SUCCESS", payload: chatResponse });
          dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: firstChat });
          socket.emit("join", { chat_url: firstChat?.chat_url });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch]);

  useEffect(() => {
    handleGetChats();
  }, [handleGetChats]);

  const handleCreateChat = async () => {
    await createChat()
      .then(async (response) => {
        console.log("createChat", response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectChat = (chat) => {
    dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: chat });
    socket.emit("join", { chat_url: chat?.chat_url });
  };

  return (
    <section className="sidebar-container">
      <div className="row-1">
        {user.photo ? (
          <img className="profile-photo" src={user.photo} alt="" />
        ) : (
          <span className="profile-photo profile-initial">
            {generateInitials(user.name)}
          </span>
        )}
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
            selectChat={(chat) => handleSelectChat(chat)}
            selectedChat={selectedChat}
            key={index}
          />
        ))}
      </div>
    </section>
  );
}

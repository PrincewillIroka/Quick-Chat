import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { BsPlusCircle, BsStar } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { BiMessageEdit } from "react-icons/bi";

import ChatInfo from "./ChatInfo";
import "./ChatList.css";
import { useStateValue } from "../../../store/stateProvider";
import { getChats } from "../../../services/userServices";
import { socket } from "../../../sockets/socketHandler";
import { generateInitials } from "../../../utils";

export default function ChatList() {
  const { state, dispatch } = useStateValue();
  const [searchText, setSearchText] = useState("");
  const { chatUrlParam } = useParams();
  const { chats = [], selectedChat = {}, user = {} } = state;

  const handleGetChats = useCallback(async () => {
    const bs_token = localStorage.getItem("bs_token");
    await getChats({ bs_token, chatUrlParam })
      .then(async (response) => {
        const chatResponse = response?.chats || [];
        if (chatResponse) {
          let firstChat;

          if (chatUrlParam) {
            firstChat = chatResponse.find(
              (chat) => chat.chat_url === chatUrlParam
            );
          } else {
            firstChat = chatResponse[0];
          }

          dispatch({ type: "GET_CHATS_SUCCESS", payload: chatResponse });
          dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: firstChat });
          socket.emit("join", { chat_url: firstChat?.chat_url });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch, chatUrlParam]);

  useEffect(() => {
    handleGetChats();
  }, [handleGetChats, user]);

  const handleSelectChat = (chat) => {
    dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: chat });
    socket.emit("join", { chat_url: chat?.chat_url });
  };

  const handleSearchChats = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchText(value);
    dispatch({ type: "SEARCH_CHATS", payload: value });
  };

  const handleToggleModal = (value) => {
    dispatch({ type: "TOGGLE_MODAL", payload: value });
  };

  return (
    <section className="sidebar-container">
      <div className="row-1">
        {user.photo ? (
          <img
            className="profile-photo"
            src={user.photo}
            alt={user.name}
            title={user.name}
            onClick={() => handleToggleModal("UpdateUsernameModal")}
          />
        ) : (
          <span
            className="profile-photo profile-initial"
            title={user.name}
            onClick={() => handleToggleModal("UpdateUsernameModal")}
          >
            {generateInitials(user.name)}
          </span>
        )}
        <button
          className="btn-start-convo"
          onClick={() => handleToggleModal("CreateConversation")}
        >
          <span>Start new conversation</span>
          <BsPlusCircle className="plus-circle-icon" />
        </button>
      </div>
      <div className="row-2">
        <div className="centered-container">
          <h4 className="messages-title">Messages</h4>
          <GoChevronDown />
        </div>
        <div className="centered-container">
          <BiMessageEdit className="bookmark-icon" title="All chats" />
          <BsStar className="bookmark-icon" title="Bookmarked chats" />
        </div>
      </div>
      <div className="search-row">
        {!searchText && <FiSearch className="search-icon" />}
        <input
          placeholder="Search here..."
          className="search-input"
          onChange={handleSearchChats}
        />
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

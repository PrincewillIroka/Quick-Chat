import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { BsPlusCircle, BsStar } from "react-icons/bs";
// import { GoChevronDown } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { BiMessageEdit } from "react-icons/bi";

import ChatInfo from "./ChatInfo";
import "./ChatList.css";
import { useStateValue } from "store/stateProvider";
import { getChats } from "services/userServices";
import { getBookmarks } from "services/bookmarkServices";
import { socket } from "sockets/socketHandler";
import { generateInitials } from "utils";
import { publish, unsubscribe, subscribe } from "custom-events";

export default function ChatList() {
  const { state, dispatch } = useStateValue();
  const [searchText, setSearchText] = useState("");
  const { chatUrlParam } = useParams();
  const {
    chats = [],
    selectedChat = {},
    user = {},
    isViewingBookmarks = false,
    isUserLoading,
    isChatLoading,
  } = state;

  const handleGetBookmarks = useCallback(
    async ({ _id }) => {
      const creator_id = _id;
      await getBookmarks({ creator_id }).then((response) => {
        const { bookmarks } = response;
        if (bookmarks) {
          dispatch({ type: "GET_BOOKMARKS", payload: bookmarks });
        }
      });
    },
    [dispatch]
  );

  const handleGetChats = useCallback(
    async ({ detail }) => {
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

            handleGetBookmarks(detail);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [dispatch, chatUrlParam, handleGetBookmarks]
  );

  useEffect(() => {
    subscribe("userDetailsFetched", handleGetChats);

    return () => unsubscribe("userDetailsFetched", handleGetChats);
  }, [handleGetChats]);

  const handleSelectChat = (chat) => {
    publish("toggledSelectedChat");
    dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: chat });
    const { chat_url = "" } = chat;
    socket.emit("toggledSelectedChat", { chat_url, user_id: user._id });
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

  const handleToggleBookmarks = (value) => {
    dispatch({ type: "TOOGLED_BOOKMARKS", payload: value });
  };

  const getShimmerLayout = (num) => new Array(num).fill("");

  return (
    <section className="sidebar-container">
      {isUserLoading ? (
        <div className="shimmer-row-1-container">
          <div className="shimmer-row-1-wrapper shimmerBG">
            <span className="shimmer-profile-photo"></span>
            <div className="shimmer-start-convo"></div>
          </div>
        </div>
      ) : (
        <div className="sidebar-row-1">
          {user.photo ? (
            <img
              className="profile-photo"
              src={user.photo}
              alt=""
              title={user.name}
              onClick={() => handleToggleModal("UpdateUserModal")}
            />
          ) : (
            <span
              className="profile-photo profile-initial"
              title={user.name}
              onClick={() => handleToggleModal("UpdateUserModal")}
            >
              {generateInitials(user.name)}
            </span>
          )}
          <button
            className="btn-start-convo"
            onClick={() => handleToggleModal("CreateConversation")}
          >
            <span className="btn-start-convo-text">Start new conversation</span>
            <BsPlusCircle className="plus-circle-icon" />
          </button>
        </div>
      )}
      <div className="row-2">
        <div className="centered-container">
          <h4 className="messages-title">Messages</h4>
          {/* <GoChevronDown /> */}
        </div>
        <div className="centered-container">
          <BiMessageEdit
            className={`bookmark-icon ${
              !isViewingBookmarks && "bookmark-icon-active"
            }`}
            title="All chats"
            onClick={() => handleToggleBookmarks("all")}
          />
          <BsStar
            className={`bookmark-icon ${
              isViewingBookmarks && "bookmark-icon-active"
            }`}
            title="Bookmarked chats"
            onClick={() => handleToggleBookmarks("bookmarks")}
          />
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
        {isChatLoading
          ? getShimmerLayout(5).map((sh, index) => (
              <div key={index} className="shimmer-chat-info-container">
                <div className="shimmer-chat-info-wrapper shimmerBG">
                  <div className="chat-info-photo-or-initial-wrapper">
                    {getShimmerLayout(3).map((pt, index) => {
                      return (
                        <span
                          className="chat-info-initial shimmer-info-initial"
                          key={index}
                        ></span>
                      );
                    })}
                  </div>
                  <div className="shimmer-chat-info-name-wrapper">
                    <span className="shimmer-chat-info-name"></span>
                    <span className="shimmer-chat-info-name-2"></span>
                  </div>
                </div>
              </div>
            ))
          : chats.map((chat, index) => (
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

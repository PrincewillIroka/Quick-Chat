import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { BsPlusCircle, BsStar } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { BiMessageEdit } from "react-icons/bi";
import { FaCaretDown } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import ChatInfo from "./ChatInfo";
import "./ChatList.css";
import { useStateValue } from "store/stateProvider";
import { getChats, getNotifications } from "services/userServices";
import { getBookmarks } from "services/bookmarkServices";
import { socket } from "sockets/socketHandler";
import { generateInitials, createArrayItems } from "utils";
import { publish, unsubscribe, subscribe } from "custom-events";
import NoBookmarks from "assets/Bookmarks.svg";
import { getCookie } from "utils";

export default function ChatList() {
  const { state = {}, dispatch } = useStateValue();
  const [searchText, setSearchText] = useState("");
  const { chatUrlParam } = useParams();
  const {
    chats = [],
    selectedChat = {},
    user = {},
    isViewingBookmarks = false,
    isUserLoading,
    isChatLoading,
    isLeftSidebarVisible = false,
  } = state;
  const { isDarkMode = false } = user;

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
    async ({ detail: userDetail }) => {
      const bs_token = getCookie();

      if (!bs_token) {
        return;
      }

      await getChats({ bs_token, chatUrlParam })
        .then(async (response) => {
          if (response.success) {
            const { chats = [] } = response;

            const firstChat =
              chats.find((chat) => chat.chat_url === chatUrlParam) || chats[0];

            dispatch({
              type: "GET_CHATS_SUCCESS",
              payload: { chats },
            });
            dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: firstChat });

            const { chat_url = "" } = firstChat;
            const { _id: user_id } = userDetail;

            socket.emit("participant-join-selected-chat", {
              chat_url,
              user_id,
            });

            handleGetBookmarks(userDetail);
          }
        })
        .catch((err) => {
          console.error(err);
        });

      await getNotifications({ bs_token })
        .then(async (response) => {
          if (response.success) {
            const { notifications = [] } = response;

            dispatch({
              type: "GET_NOTIFICATIONS_SUCCESS",
              payload: { notifications },
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [handleGetBookmarks, dispatch, chatUrlParam]
  );

  useEffect(() => {
    subscribe("userDetailsFetched", handleGetChats);

    return () => unsubscribe("userDetailsFetched", handleGetChats);
  }, [handleGetChats]);

  const handleSelectChat = (chat) => {
    const { chat_url = "", _id: chat_id } = chat;
    publish("toggledSelectedChat");
    dispatch({ type: "TOGGLE_SELECTED_CHAT", payload: chat });
    dispatch({ type: "CLEAR_CHAT_NOTIFICATION_COUNT", payload: { chat_id } });
    dispatch({ type: "TOGGLE_LEFT_SIDEBAR", payload: "closeSidebar" });
    socket.emit("participant-join-selected-chat", {
      chat_url,
      user_id: user._id,
    });
  };

  const handleSearchChats = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchText(value);
    dispatch({ type: "SEARCH_CHATS", payload: value });
  };

  const handleToggleModal = (value) => {
    dispatch({ type: "TOGGLE_MODAL", payload: { type: value } });
  };

  const handleToggleBookmarks = (value) => {
    dispatch({ type: "TOGGLED_BOOKMARKS", payload: value });
  };

  const handleDisplaySidebar = () => {
    dispatch({
      type: "TOGGLE_LEFT_SIDEBAR",
    });
  };

  return (
    <section
      className={`sidebar-container ${isDarkMode && "sidebar-container-dark"} ${
        isLeftSidebarVisible && "sidebar-menu"
      } ${isDarkMode && "sidebar-menu-dark"}`}
    >
      {isUserLoading ? (
        <div className="shimmer-row-1-container">
          <div className="shimmer-row-1-wrapper shimmer-bg">
            <span className="shimmer-profile-photo"></span>
            <div className="shimmer-start-convo"></div>
            <IoMdClose
              className="profile-row-close-btn"
              onClick={() => handleDisplaySidebar()}
            />
          </div>
        </div>
      ) : (
        <div
          className={`sidebar-row-1 ${isDarkMode ? "sidebar-row-1-dark" : ""} ${
            isLeftSidebarVisible ? "sidebar-row-1-justify" : ""
          }`}
        >
          <div
            className="profile-photo-wrapper"
            onClick={() => handleToggleModal("UpdateUserModal")}
          >
            {user.photo ? (
              <img
                className="profile-photo"
                src={user.photo}
                alt=""
                title={user.name}
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
            <FaCaretDown
              className={`profile-claret-down ${
                isDarkMode ? "profile-claret-down-dark" : ""
              }`}
            />
          </div>
          <button
            className="btn-start-convo"
            onClick={() => handleToggleModal("CreateConversation")}
          >
            <span className="btn-start-convo-text">Create new chat</span>
            <BsPlusCircle className="plus-circle-icon" />
          </button>
          <IoMdClose
            className="profile-row-close-btn"
            onClick={() => handleDisplaySidebar()}
          />
        </div>
      )}
      <div className="sidebar-row-2">
        <div className="centered-container">
          <h4 className="messages-title">Messages</h4>
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
      <div className="search-row-container">
        <div className="search-row">
          {!searchText && <FiSearch className="search-icon" />}
          <input
            placeholder="Search here..."
            className="search-input"
            onChange={(e) => handleSearchChats(e)}
          />
        </div>
      </div>
      <div className="chat-list-container">
        <div>
          {isChatLoading ? (
            createArrayItems(7).map((ca, index) => (
              <div key={index} className="shimmer-chat-info-container">
                <div
                  className={`shimmer-chat-info-wrapper shimmer-bg ${
                    isDarkMode ? "shimmer-bg-dark" : ""
                  }`}
                >
                  <div className="chat-info-photo-or-initial-wrapper">
                    {createArrayItems(3).map((ca, index) => {
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
          ) : isViewingBookmarks && !chats.length ? (
            <div className="no-bookmark-container">
              <img src={NoBookmarks} className="no-bookmark-svg" alt="" />
              <span>You haven't bookmarked any chat.</span>
            </div>
          ) : (
            chats.map((chat, index) => (
              <ChatInfo
                chat={chat}
                selectChat={(chat) => handleSelectChat(chat)}
                selectedChat={selectedChat}
                key={index}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsPeople, BsInfoCircle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import "./ChatDetails.css";
import ChatMedia from "./ChatMedia";
import ChatParticipants from "./ChatParticipants";
import ChatNotifications from "./ChatNotifications";
import { useStateValue } from "store/stateProvider";

export default function ChatDetails({ isDarkMode, chat_name }) {
  const [activeDetail, setActiveDetail] = useState("ChatMedia");
  const { state = {}, dispatch } = useStateValue();
  const { isRightSidebarVisible = false } = state;

  const getActiveDetail = (value) => {
    return activeDetail === value;
  };

  const handleDisplayChatDetails = () => {
    dispatch({
      type: "TOGGLE_RIGHT_SIDEBAR",
    });
  };

  return (
    <div
      className={`chat-details-container ${
        isRightSidebarVisible ? "chat-details-sidebar" : ""
      }`}
    >
      <div
        className={`chat-details-header ${
          isDarkMode ? "chat-details-header-dark" : ""
        }`}
      >
        <span className={`${isRightSidebarVisible ? "chat-details-name" : ""}`}>
          {isRightSidebarVisible && chat_name ? chat_name : "Chat Details"}
        </span>
        <IoMdClose
          className="chat-details-close-btn"
          onClick={() => handleDisplayChatDetails()}
        />
      </div>
      <div
        className={`chat-details-body ${
          isRightSidebarVisible && isDarkMode ? "chat-details-body-dark" : ""
        }`}
      >
        <div className="chat-details-body-top-row">
          <div
            className={`chat-details-icon-container ${
              getActiveDetail("ChatMedia") &&
              "chat-details-icon-active-container"
            }`}
            onClick={() => setActiveDetail("ChatMedia")}
          >
            <BsInfoCircle
              className={`chat-detail-icon ${
                getActiveDetail("ChatMedia") && "chat-detail-active-icon"
              }`}
            />
          </div>
          <div
            className={`chat-details-icon-container ${
              getActiveDetail("ChatParticipants") &&
              "chat-details-icon-active-container"
            }`}
            onClick={() => setActiveDetail("ChatParticipants")}
          >
            <BsPeople
              className={`chat-detail-icon ${
                getActiveDetail("ChatParticipants") && "chat-detail-active-icon"
              }`}
            />
          </div>
          <div
            className={`chat-details-icon-container ${
              getActiveDetail("ChatNotifications") &&
              "chat-details-icon-active-container"
            }`}
            onClick={() => setActiveDetail("ChatNotifications")}
          >
            <IoNotificationsOutline
              className={`chat-detail-icon ${
                getActiveDetail("ChatNotifications") &&
                "chat-detail-active-icon"
              }`}
            />
          </div>
        </div>
        {getActiveDetail("ChatMedia") && (
          <div className="chat-detail-single-wrapper">
            <ChatMedia />
          </div>
        )}
        {getActiveDetail("ChatParticipants") && (
          <div className="chat-detail-single-wrapper">
            <ChatParticipants />
          </div>
        )}
        {getActiveDetail("ChatNotifications") && (
          <div className="chat-detail-single-wrapper">
            <ChatNotifications />
          </div>
        )}
      </div>
    </div>
  );
}

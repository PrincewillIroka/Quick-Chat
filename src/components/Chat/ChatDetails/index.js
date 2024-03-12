import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsPeople, BsInfoCircle } from "react-icons/bs";
import "./ChatDetails.css";
import ChatMedia from "./ChatMedia";
import ChatParticipants from "./ChatParticipants";
import ChatNotifications from "./ChatNotifications";

export default function ChatDetails({ isDarkMode }) {
  const [activeDetail, setActiveDetail] = useState("ChatMedia");

  const getActiveDetail = (value) => {
    return activeDetail === value;
  };

  return (
    <div className="chat-details-container">
      <div
        className={`chat-details-header ${
          isDarkMode ? "chat-details-header-dark" : ""
        }`}
      >
        Chat Details
      </div>
      <div className="chat-details-body">
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
        {getActiveDetail("ChatParticipants") && (
          <div className="chat-detai-single-wrapper">
            <ChatParticipants />
          </div>
        )}
        {getActiveDetail("ChatMedia") && (
          <div className="chat-detai-single-wrapper">
            <ChatMedia />
          </div>
        )}
        {getActiveDetail("ChatNotifications") && (
          <div className="chat-detai-single-wrapper">
            <ChatNotifications />
          </div>
        )}
      </div>
    </div>
  );
}

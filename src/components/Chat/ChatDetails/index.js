import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsPeople, BsInfoCircle } from "react-icons/bs";
import "./ChatDetails.css";
import ChatMedia from "./ChatMedia";
import ChatParticipants from "./ChatParticipants";

export default function ChatDetails() {
  const [activeDetail, setActiveDetail] = useState("ChatMedia");

  const getActiveDetail = (value) => {
    return activeDetail === value;
  };

  return (
    <div className="chat-details-container">
      <div className="chat-details-header">Chat Details</div>
      <div className="chat-details-body">
        <div className="chat-details-body-top-row">
          <div
            className={`chat-details-icon-container ${
              getActiveDetail("notification") &&
              "chat-details-icon-active-container"
            }`}
            onClick={() => setActiveDetail("notification")}
          >
            <IoNotificationsOutline
              className={`chat-detail-icon ${
                getActiveDetail("notification") && "chat-detail-active-icon"
              }`}
            />
          </div>
          <div
            className={`chat-details-icon-container ${
              getActiveDetail("ChatParticipants") && "chat-details-icon-active-container"
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
        </div>
        {getActiveDetail("ChatParticipants") && (
          <div className="chat-media-wrapper">
            <ChatParticipants />
          </div>
        )}
        {getActiveDetail("ChatMedia") && (
          <div className="chat-media-wrapper">
            <ChatMedia />
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsPeople, BsInfoCircle } from "react-icons/bs";
import "./ChatDetails.css";
import Photos from "assets/Photos.svg";
import Video from "assets/Video.svg";
import Links from "assets/Links.svg";

export default function ChatDetails() {
  const [activeDetail, setActiveDetail] = useState("info");

  const getActiveDetail = (value) => {
    return activeDetail === value;
  };

  return (
    <div className="chat-details-container">
      <div className="chat-details-header">Chat Details</div>
      <div className="chat-details-body">
        <div className="chat-details-top-row">
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
              getActiveDetail("people") && "chat-details-icon-active-container"
            }`}
            onClick={() => setActiveDetail("people")}
          >
            <BsPeople
              className={`chat-detail-icon ${
                getActiveDetail("people") && "chat-detail-active-icon"
              }`}
            />
          </div>
          <div
            className={`chat-details-icon-container ${
              getActiveDetail("info") && "chat-details-icon-active-container"
            }`}
            onClick={() => setActiveDetail("info")}
          >
            <BsInfoCircle
              className={`chat-detail-icon ${
                getActiveDetail("info") && "chat-detail-active-icon"
              }`}
            />
          </div>
        </div>
        {getActiveDetail("info") && (
          <div className="chat-details-info-container">
            <h4 className="chat-media-title">Media</h4>
            <div className="chat-details-photos-row">
              <h5>Photos</h5>
              <div className="photos-svg-container">
                <img src={Photos} className="photos-svg" alt="" />
                <span>Photos here</span>
              </div>
            </div>
            <div className="chat-details-videos-row">
              <h5>Videos</h5>
              <div className="photos-svg-container">
                <img src={Video} className="videos-svg" alt="" />
                <span>Videos here</span>
              </div>
            </div>
            <div className="chat-details-links-row">
              <h5>Links</h5>
              <div className="photos-svg-container">
                <img src={Links} className="links-svg" alt="" />
                <span>Links here</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { TbPhoneCall } from "react-icons/tb";
import { CgSearch, CgMore } from "react-icons/cg";
import { MdOutlineContentCopy } from "react-icons/md";
import { generateInitials } from "../../../../utils";
import "./TopSection.css";

export default function TopSection({ selectedChat }) {
  const [isMoreItemsDropdownVisible, setIsMoreItemsDropdownVisible] =
    useState(false);

  const handleGetChatLink = () => {
    const chatLink = `${window.location.href}/${selectedChat.chat_url}`;
    navigator.clipboard.writeText(chatLink);
  };

  return (
    <div className="top-section">
      <div className="row">
        {selectedChat.photo ? (
          <img src={selectedChat.photo} className="user-info-photo" alt="" />
        ) : (
          <span className="user-info-initial">
            {generateInitials(selectedChat.name)}
          </span>
        )}
        <div className="user-info-col-1">
          <span className="user-info-name">{selectedChat.name}</span>
          <span className="user-info-chat-participants">
            Abel, Genea, Vanessa, Monalisa ...+5
          </span>
        </div>
      </div>

      <div className="icons-container">
        <AiOutlineVideoCamera className="media-icon" />
        <TbPhoneCall className="media-icon" />
      </div>

      <div className="icons-container">
        <CgSearch className="control-icon" />
        <CgMore
          className="control-icon"
          onClick={() =>
            setIsMoreItemsDropdownVisible(!isMoreItemsDropdownVisible)
          }
        />
        {isMoreItemsDropdownVisible && (
          <div className="more-items-dropdown">
            <div className="more-items-row" onClick={handleGetChatLink}>
              <span>Get chat link</span>
              <MdOutlineContentCopy />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

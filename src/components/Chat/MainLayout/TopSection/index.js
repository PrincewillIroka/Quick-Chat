import React, { useState, memo } from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { TbPhoneCall } from "react-icons/tb";
import { CgSearch, CgMore } from "react-icons/cg";
import { MdOutlineContentCopy } from "react-icons/md";
import { BsStar } from "react-icons/bs";
import { generateInitials } from "../../../../utils";
import "./TopSection.css";

function TopSection({ selectedChat }) {
  const [isMoreItemsDropdownVisible, setIsMoreItemsDropdownVisible] =
    useState(false);
  const { participants = [], chat_came } = selectedChat || {};

  const handleGetChatLink = () => {
    const chatLink = `${window.location.href}/${selectedChat.chat_url}`;
    navigator.clipboard.writeText(chatLink);
  };

  return (
    <div className="top-section">
      <div className="row">
        <div className="user-info-col-1">
          <span className="user-info-name">{chat_came}</span>
          <div className="user-info-photo-or-initial-wrapper">
            {participants.slice(0, 3).map((participant, index) => (
              <span
                className={`user-info-initial`}
                key={index}
                title={participant.name}
              >
                {generateInitials(participant.name)}
              </span>
            ))}
            {participants.length > 3 && (
              <span className="user-info-others">
                ...+{participants.length - 3} others
              </span>
            )}
          </div>
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
            <div className="more-items-row" onClick={handleGetChatLink}>
              <span>Bookmark chat</span>
              <BsStar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TopSection);

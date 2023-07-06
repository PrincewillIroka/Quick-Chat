import React, { useState, memo, useEffect, useCallback } from "react";
// import { AiOutlineVideoCamera } from "react-icons/ai";
// import { TbPhoneCall } from "react-icons/tb";
import { CgSearch, CgMore } from "react-icons/cg";
import { MdOutlineContentCopy } from "react-icons/md";
import { BsStar } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { subscribe, unsubscribe } from "custom-events";
import { generateInitials, isSameSender } from "utils";
import "./TopSection.css";
import { useStateValue } from "store/stateProvider";

function TopSection({ selectedChat }) {
  const { state, dispatch } = useStateValue();
  const [isMoreItemsDropdownVisible, setIsMoreItemsDropdownVisible] =
    useState(false);
  const { participants = [], _id: selectChatId } = selectedChat || {};
  const { user = {} } = state;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleGetChatLink = () => {
    const chatLink = `${window.location.href}/${selectedChat.chat_url}`;
    navigator.clipboard.writeText(chatLink);
    dispatch({
      type: "TOGGLE_ALERT",
      payload: {
        isAlertVisible: true,
        content: "Link Copied!",
        type: "success",
      },
    });
  };

  const handleSearchMessages = useCallback(
    (value) => {
      setSearchText(value);
      dispatch({
        type: "SEARCH_MESSAGES",
        payload: { searchText: value, selectChatId },
      });
    },
    [dispatch, selectChatId]
  );

  const handleClearSearchField = useCallback(() => {
    if (searchText) {
      setSearchText("");
      setIsSearchVisible(false);
      handleSearchMessages("");
    }
  }, [handleSearchMessages, searchText]);

  useEffect(() => {
    subscribe("toggledSelectedChat", handleClearSearchField);

    return () => {
      unsubscribe("toggledSelectedChat", handleClearSearchField);
    };
  }, [handleClearSearchField]);

  return (
    <div className="top-section">
      <div className="row">
        <div className="user-info-col-1">
          {/* <span className="user-info-name">{chat_name}</span> */}
          <div className="user-info-photo-or-initial-wrapper">
            {participants.slice(0, 3).map((participant, index) => {
              const checkSameSender = isSameSender(participant, user);
              participant = checkSameSender ? user : participant;
              const { name = "", photo = "" } = participant;

              return photo ? (
                <img
                  src={photo}
                  className="user-info-initial user-info-img"
                  alt=""
                  key={index}
                />
              ) : (
                <span className="user-info-initial" key={index} title={name}>
                  {generateInitials(name)}
                </span>
              );
            })}
            {participants.length > 3 && (
              <span className="user-info-others">
                ...+{participants.length - 3} others
              </span>
            )}
          </div>
        </div>
      </div>

      {/* <div className="icons-container">
        <AiOutlineVideoCamera className="media-icon" />
        <TbPhoneCall className="media-icon" />
      </div> */}
      {isSearchVisible && (
        <div className="top-section-search-container">
          <input
            placeholder="Search here..."
            className="top-section-search-input"
            value={searchText}
            onChange={(e) => {
              e.preventDefault();
              const value = e.target.value;
              handleSearchMessages(value);
            }}
          />
        </div>
      )}

      <div className="icons-container">
        {isSearchVisible ? (
          <IoMdClose
            className="control-icon"
            onClick={handleClearSearchField}
          />
        ) : (
          <CgSearch
            className="control-icon"
            onClick={() => setIsSearchVisible(true)}
          />
        )}
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

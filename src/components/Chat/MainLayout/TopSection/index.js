import React, { useState, memo, useEffect, useCallback, useMemo } from "react";
// import { AiOutlineVideoCamera } from "react-icons/ai";
// import { TbPhoneCall } from "react-icons/tb";
import { CgSearch, CgMore } from "react-icons/cg";
import {
  MdOutlineContentCopy,
  MdOutlineDarkMode,
  MdOutlineLightMode,
} from "react-icons/md";
import { BsStar } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { subscribe, unsubscribe } from "custom-events";
import { generateInitials, isSameSender } from "utils";
import "./TopSection.css";
import { useStateValue } from "store/stateProvider";
import { addBookmark, deleteBookmark } from "services";

function TopSection({ selectedChat }) {
  const { state, dispatch } = useStateValue();
  const [isMoreItemsDropdownVisible, setIsMoreItemsDropdownVisible] =
    useState(false);
  const { participants = [], _id: selectChatId } = selectedChat || {};
  const { user = {}, bookmarks = [], colorSchema = "lightMode" } = state;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const bookmarkFound = useMemo(() => {
    return bookmarks.find((bookmark) => bookmark.chat_id === selectChatId);
  }, [selectChatId, bookmarks]);

  const isBookmarkFound = bookmarkFound && Object.entries(bookmarkFound);

  const handleGetChatLink = () => {
    const chatLink = `${window.location.origin}/chat/${selectedChat.chat_url}`;
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
    if (isSearchVisible) {
      setSearchText("");
      setIsSearchVisible(false);
      handleSearchMessages("");
    }
  }, [handleSearchMessages, isSearchVisible]);

  useEffect(() => {
    subscribe("toggledSelectedChat", handleClearSearchField);

    return () => {
      unsubscribe("toggledSelectedChat", handleClearSearchField);
    };
  }, [handleClearSearchField]);

  const handleAddBookmark = async () => {
    const { _id: creator_id } = user;
    const chat_id = selectChatId;

    if (isBookmarkFound) {
      const { _id: bookmark_id } = bookmarkFound;

      await deleteBookmark({ creator_id, bookmark_id })
        .then((response) => {
          const success = response.success;
          if (success) {
            dispatch({
              type: "REMOVE_BOOKMARK",
              payload: bookmark_id,
            });

            handleToggleAlert({
              isAlertVisible: true,
              content: "Bookmark Removed!",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      await addBookmark({ creator_id, chat_id })
        .then(async (response) => {
          const { newBookmark } = response;
          if (newBookmark) {
            dispatch({
              type: "ADD_BOOKMARK",
              payload: newBookmark,
            });

            handleToggleAlert({
              isAlertVisible: true,
              content: "Bookmark Added!",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleToggleAlert = (payload) => {
    dispatch({
      type: "TOGGLE_ALERT",
      payload,
    });
  };

  const handleChangeColorSchema = () => {
    dispatch({
      type: "TOGGLE_COLOR_SCHEMA",
    });
  };

  return (
    <div
      className={`top-section ${
        colorSchema === "darkMode" ? "top-section-dark" : ""
      }`}
    >
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
                  className="top-section-user-info-initial top-section-user-info-img"
                  alt=""
                  key={index}
                />
              ) : (
                <span
                  className={`top-section-user-info-initial ${
                    colorSchema === "darkMode"
                      ? "top-section-user-info-initial-dark"
                      : ""
                  }`}
                  key={index}
                  title={name}
                >
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

      <div className="icons-container">
        {/* <AiOutlineVideoCamera className="media-icon" />
        <TbPhoneCall className="media-icon" /> */}
        {colorSchema === "lightMode" ? (
          <MdOutlineDarkMode
            className="color-schema-icon"
            onClick={handleChangeColorSchema}
          />
        ) : (
          <MdOutlineLightMode
            className="color-schema-icon"
            onClick={handleChangeColorSchema}
          />
        )}
      </div>
      {isSearchVisible && (
        <div className="top-section-search-container">
          <input
            placeholder="Search chat content here..."
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
          <div
            className={`more-items-dropdown ${
              colorSchema === "darkMode" ? "more-items-dropdown-dark" : ""
            }`}
          >
            <div className="more-items-row" onClick={handleGetChatLink}>
              <span>Get chat link</span>
              <MdOutlineContentCopy />
            </div>
            <div className="more-items-row" onClick={handleAddBookmark}>
              <span>
                {isBookmarkFound ? "Remove Bookmark" : "Bookmark chat"}
              </span>
              <BsStar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TopSection);

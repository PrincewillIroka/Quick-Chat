import React, { useState, memo, useEffect, useCallback, useMemo } from "react";
// import { AiOutlineVideoCamera } from "react-icons/ai";
// import { TbPhoneCall } from "react-icons/tb";
import { CgSearch, CgMore } from "react-icons/cg";
import {
  MdOutlineContentCopy,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdDeleteOutline,
} from "react-icons/md";
import { BsStar, BsInfoCircle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { AiTwotoneEdit, AiOutlineClear } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { TbListDetails } from "react-icons/tb";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEnvelope } from "react-icons/fa6";
import { subscribe, unsubscribe } from "custom-events";
import { generateInitials, isSameSender, decryptData } from "utils";
import "./TopSection.css";
import { useStateValue } from "store/stateProvider";
import { addBookmark, deleteBookmark, updateDarkMode } from "services";

function TopSection({ selectedChat }) {
  const { state = {}, dispatch } = useStateValue();
  const [isMoreItemsDropdownVisible, setIsMoreItemsDropdownVisible] =
    useState(false);
  const {
    participants = [],
    _id: selectChatId,
    creator_id = "",
    chat_name = "",
    passcode = "",
    messages = [],
  } = selectedChat || {};
  const {
    user = {},
    bookmarks = [],
    isRightSidebarVisible = false,
    inviteOthersFeatureEnabled = false,
  } = state;
  let { _id: user_id, isDarkMode = false } = user;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isTopSectionInfoVisible, setIsTopSectionInfoVisible] = useState(true);
  const isChatCreator = creator_id === user_id;

  const bookmarkFound = useMemo(() => {
    return bookmarks.find((bookmark) => bookmark.chat_id === selectChatId);
  }, [selectChatId, bookmarks]);

  const isBookmarkFound = bookmarkFound && Object.keys(bookmarkFound).length;

  useEffect(() => {
    setIsMoreItemsDropdownVisible(false);
  }, [selectChatId]);

  function checkClipboardPermission() {
    navigator.permissions
      .query({
        name: "clipboard-write",
      })
      .then((result) => {
        if (result.state === "granted") {
          handleGetChatLink();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleGetChatLink = async (param) => {
    let value, content;

    if (!navigator?.clipboard) {
      checkClipboardPermission();
    } else {
      if (param === "chatLink") {
        value = `${window.location.origin}/chat/${selectedChat.chat_url}`;
        content = "Link copied!";
      } else if (param === "passcode") {
        value = decryptData(passcode);
        content = "Passcode copied!";
      }

      await navigator.clipboard.writeText(value);

      dispatch({
        type: "TOGGLE_ALERT",
        payload: {
          isAlertVisible: true,
          content,
          type: "success",
        },
      });
    }
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
    subscribe("toggledSelectedChat", () => handleClearSearchField());

    return () => unsubscribe("toggledSelectedChat");
  }, [handleClearSearchField]);

  const handleAddBookmark = async () => {
    const chat_id = selectChatId;

    if (isBookmarkFound) {
      const { _id: bookmark_id } = bookmarkFound;

      await deleteBookmark({ creator_id: user_id, bookmark_id })
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
      await addBookmark({ creator_id: user_id, chat_id })
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

  const handleChangeColorSchema = async () => {
    isDarkMode = isDarkMode ? false : true;
    updateDarkMode({ user_id, isDarkMode })
      .then(async (response) => {
        const { success, updatedDarkMode } = response;
        if (success) {
          dispatch({
            type: "TOGGLE_COLOR_SCHEMA",
            payload: updatedDarkMode,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeleteChat = () => {
    dispatch({
      type: "TOGGLE_MODAL",
      payload: {
        type: "ConfirmationModal",
        title: "Delete Chat",
        subtitle: "Are you sure you want to delete this chat ?",
      },
    });
  };

  const handleRenameChat = () => {
    dispatch({
      type: "TOGGLE_MODAL",
      payload: {
        type: "ConfirmationModal",
        title: "Rename Chat",
        subtitle: "Are you sure you want to rename this chat ?",
      },
    });
  };

  const handleClearChat = () => {
    dispatch({
      type: "TOGGLE_MODAL",
      payload: {
        type: "ConfirmationModal",
        title: "Clear Chat",
        subtitle: "Are you sure you want to clear this chat ?",
      },
    });
  };

  const handleDisplaySidebar = () => {
    dispatch({
      type: "TOGGLE_LEFT_SIDEBAR",
    });
  };

  const checkIfParticipantIsSystemBot = () => {
    const result = participants.find((participant) => {
      return participant?.isChatBot && !participant?.chatBotDetails?.isUserBot;
    });
    return result;
  };

  const handleDisplayChatDetails = useCallback(() => {
    dispatch({
      type: "TOGGLE_RIGHT_SIDEBAR",
    });
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth && isRightSidebarVisible) {
        handleDisplayChatDetails();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleDisplayChatDetails, isRightSidebarVisible]);

  const handleDisplayInvite = useCallback(() => {
    dispatch({
      type: "TOGGLE_MODAL",
      payload: {
        type: "ConfirmationModal",
        title: "Invite User",
        subtitle: "Send invitation to user",
      },
    });
  }, [dispatch]);

  return (
    <div className={`top-section ${isDarkMode ? "top-section-dark" : ""}`}>
      <RxHamburgerMenu
        className="hamburger-menu"
        onClick={() => handleDisplaySidebar()}
      />
      <span className="user-info-name">{chat_name}</span>
      <div className="user-info-row">
        <div className="user-info-col-1">
          <div className="user-info-photo-or-initial-wrapper">
            {participants.slice(0, 3).map((participant = {}, index) => {
              const checkSameSender = isSameSender(participant, user);
              participant = checkSameSender ? user : participant;
              const { name = "", photo = "" } = participant;

              return photo ? (
                <img
                  src={photo}
                  className="top-section-user-info-initial top-section-user-info-img"
                  alt=""
                  key={index}
                  title={name}
                />
              ) : (
                <span
                  className={`top-section-user-info-initial ${
                    isDarkMode ? "top-section-user-info-initial-dark" : ""
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
        {isDarkMode ? (
          <MdOutlineLightMode
            className="color-schema-icon"
            onClick={handleChangeColorSchema}
          />
        ) : (
          <MdOutlineDarkMode
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

      {selectChatId && (
        <div className="icons-container">
          {isSearchVisible ? (
            <IoMdClose
              className="control-icon"
              onClick={() => handleClearSearchField()}
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
                isDarkMode ? "more-items-dropdown-dark" : ""
              }`}
            >
              {isChatCreator && inviteOthersFeatureEnabled && (
                <div
                  className={`more-items-row ${
                    isDarkMode ? "more-items-row-dark" : ""
                  }`}
                  onClick={() => handleDisplayInvite()}
                >
                  <span>Invite others to chat</span>
                  <FaRegEnvelope />
                </div>
              )}
              <div
                className={`more-items-row ${
                  isDarkMode ? "more-items-row-dark" : ""
                }`}
                onClick={() => handleGetChatLink("chatLink")}
              >
                <span>Get chat link</span>
                <MdOutlineContentCopy />
              </div>
              {isChatCreator && passcode && (
                <div
                  className={`more-items-row ${
                    isDarkMode ? "more-items-row-dark" : ""
                  }`}
                  onClick={() => handleGetChatLink("passcode")}
                >
                  <span>Copy passcode</span>
                  <RiLockPasswordLine />
                </div>
              )}
              <div
                className={`more-items-row ${
                  isDarkMode ? "more-items-row-dark" : ""
                }`}
                onClick={() => handleAddBookmark()}
              >
                <span>
                  {isBookmarkFound ? "Remove Bookmark" : "Bookmark chat"}
                </span>
                <BsStar />
              </div>
              {isChatCreator && (
                <>
                  <div
                    className={`more-items-row ${
                      isDarkMode ? "more-items-row-dark" : ""
                    }`}
                    onClick={() => handleRenameChat()}
                  >
                    <span>Rename chat</span>
                    <AiTwotoneEdit />
                  </div>
                  {!checkIfParticipantIsSystemBot() && (
                    <div
                      className={`more-items-row ${
                        isDarkMode ? "more-items-row-dark" : ""
                      }`}
                      onClick={() => handleDeleteChat()}
                    >
                      <span>Delete chat</span>
                      <MdDeleteOutline />
                    </div>
                  )}
                  {messages.length ? (
                    <div
                      className={`more-items-row ${
                        isDarkMode ? "more-items-row-dark" : ""
                      }`}
                      onClick={() => handleClearChat()}
                    >
                      <span>Clear chat</span>
                      <AiOutlineClear />
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
              <div
                className={`more-items-row chat-details-mobile-view ${
                  isDarkMode ? "more-items-row-dark" : ""
                }`}
                onClick={() => handleDisplayChatDetails()}
              >
                <span>Chat Details</span>
                <TbListDetails />
              </div>
            </div>
          )}
        </div>
      )}
      {isTopSectionInfoVisible && (
        <div className="top-section-alert">
          <BsInfoCircle className="top-section-alert-info-icon" />
          <span>Chats are secured with end-to-end encryption.</span>
          <IoMdClose
            className="top-section-alert-close-icon"
            onClick={() => setIsTopSectionInfoVisible(false)}
          />
        </div>
      )}
    </div>
  );
}

export default memo(TopSection);

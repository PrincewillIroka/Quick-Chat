import React, { useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { createChat } from "services";
import "./CreateConversationModal.css";
import { useStateValue } from "store/stateProvider";
import { generatePasscode } from "utils";

export default function CreateConversationModal() {
  const { state, dispatch } = useStateValue();
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatCreated, setIsChatCreated] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatLink, setChatLink] = useState("");
  const { user = {} } = state;
  const { isDarkMode = false } = user;

  const handleCreateChat = async () => {
    setIsLoading(true);
    await createChat({ creator_id: user._id, passcode, chat_name: chatName })
      .then(async (response) => {
        const { success, newChat } = response || {};
        if (success && newChat) {
          dispatch({ type: "ADD_NEW_CHAT", payload: newChat });

          const chatLink = `${window.location.origin}/chat/${newChat.chat_url}`;
          setChatLink(chatLink);
          setIsLoading(false);
          setIsChatCreated(true);

          handleToggleAlert({
            isAlertVisible: true,
            content: "Chat created!",
            type: "success",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleSetPasscode = () => {
    let num;
    if (passcode) {
      num = "";
    } else {
      num = generatePasscode();
    }
    setPasscode(num);
  };

  const handleCopy = (param) => {
    const value = param === "chatLink" ? chatLink : passcode;
    navigator.clipboard.writeText(value);

    handleToggleAlert({
      isAlertVisible: true,
      content: "Chat link copied!",
      type: "success",
    });
  };

  const handleToggleAlert = (payload) => {
    dispatch({
      type: "TOGGLE_ALERT",
      payload,
    });
  };

  const handleToggleModal = () => {
    dispatch({ type: "TOGGLE_MODAL", payload: {} });
  };

  return (
    <div className="modal">
      <div
        className={`modal-content ${isDarkMode ? "modal-content-dark" : ""}`}
      >
        <div className="modal-top-row">
          <span className="modal-title">Create New Conversation</span>
          <span
            className={`close ${isDarkMode ? "close-dark" : ""}`}
            onClick={handleToggleModal}
          >
            &times;
          </span>
        </div>
        {isLoading ? (
          <div className="loader-container">
            <div>Please wait....</div>
            <div className="loader"></div>
          </div>
        ) : isChatCreated ? (
          <div>
            <div className="chat-link-container">
              <b className="chat-link-title">Chat link:</b>
              <div className="chat-link-row">
                <span className="chat-link-text">
                  <i>{chatLink}</i>
                </span>
                <MdOutlineContentCopy
                  title="Copy link"
                  className="copy-link"
                  onClick={() => handleCopy("chatLink")}
                />
              </div>
            </div>
            {passcode && (
              <div className="chat-link-container">
                <b className="chat-link-title">Passcode:</b>
                <div className="chat-link-row">
                  <span className="chat-link-text">
                    <i>{passcode}</i>
                  </span>
                  <MdOutlineContentCopy
                    title="Copy passcode"
                    className="copy-link"
                    onClick={() => handleCopy("passcode")}
                  />
                </div>
              </div>
            )}
            <div className="chat-copy-info-wrapper">
              Copy this link, send it to anyone you want to chat with. Once they
              join, you'll be able to chat with them.
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="conversation-title-container">
              <div>
                Conversation title:
                <span className="optional-tag">(Optional)</span>
              </div>
              <input
                type="text"
                placeholder="E.g Close friends, Team members e.t.c"
                className="conversation-title-input"
                onChange={(e) => setChatName(e.target.value)}
              />
            </div>
            <div className="modal-passcode-row">
              <div className="modal-passcode-row-1">
                <div>
                  Set a passcode:
                  <span className="optional-tag">(Optional)</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={passcode}
                    onChange={() => handleSetPasscode()}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              {passcode ? (
                <span className="modal-passcode-info">
                  A passcode will be generated for this chat. Only users that
                  you share the passcode with, can join the chat.
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="action-buttons">
              <button
                className="cancel-button conversation-button"
                onClick={handleToggleModal}
              >
                Cancel
              </button>
              <button
                className="create-button conversation-button"
                onClick={handleCreateChat}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

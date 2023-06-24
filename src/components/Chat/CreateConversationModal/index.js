import React, { useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { createChat } from "../../../services";
import "./CreateConversationModal.css";
import { useStateValue } from "../../../store/stateProvider";

export default function CreateConversationModal({ handleToggleModal }) {
  const { state, dispatch } = useStateValue();
  const [isPasscode, setIsPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatCreated, setIsChatCreated] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatLink, setChatLink] = useState("");
  const { user = {} } = state;

  const handleCreateChat = async () => {
    setIsLoading(true);
    let passcode;
    if (isPasscode) {
      passcode = "";
    }
    await createChat({ creator_id: user._id, passcode, chat_name: chatName })
      .then(async (response) => {
        const { newChat } = response;
        if (newChat) {
          dispatch({ type: "ADD_NEW_CHAT", payload: newChat });
          const str = `${window.location.href}/${newChat.chat_url}`;
          setChatLink(str);
        }
        setIsLoading(false);
        setIsChatCreated(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-top-row">
          <span className="modal-title">Create new conversation</span>
          <span className="close" onClick={handleToggleModal}>
            &times;
          </span>
        </div>
        {isLoading ? (
          <div className="loader-container">
            <div>Please wait....</div>
            <div className="loader"></div>
          </div>
        ) : isChatCreated ? (
          <div className="success-container">
            <b className="chat-link-title">Chat link:</b>
            <div className="chat-link-row">
              <span className="chat-link-text">
                <i>{chatLink}</i>
              </span>
              <MdOutlineContentCopy title="Copy Link" className="copy-link" />
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="conversation-title-container">
              <span>Conversation title (Optional):</span>
              <input
                type="text"
                placeholder="E.g Close friends, Team members e.t.c"
                className="conversation-title-input"
                onChange={(e) => setChatName(e.target.value)}
              />
            </div>
            <div className="modal-passcode-row">
              <span>Set a passcode (Optional):</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isPasscode}
                  onChange={() => setIsPasscode(!isPasscode)}
                />
                <span className="slider round"></span>
              </label>
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
import React, { useState } from "react";
import { renameChat } from "services";
import "./ConfirmationModal.css";
import { useStateValue } from "store/stateProvider";

export default function ConfirmationModal() {
  const { state, dispatch } = useStateValue();
  const [newChatName, setChatName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user = {}, visibleModal = {}, selectedChat = {} } = state;
  const { isDarkMode = false } = user;
  const { title = "", subtitle = "" } = visibleModal;
  const { chat_name, _id: chat_id } = selectedChat;

  const handleSubmit = async () => {
    setIsLoading(true);
    await renameChat({ chat_id, chat_name: newChatName })
      .then((response) => {
        setIsLoading(false);
        if (response.success) {
          dispatch({
            type: "RENAME_CHAT",
            payload: { chat_id, chat_name: response.chat_name },
          });
          handleToggleAlert({
            isAlertVisible: true,
            content: "Chat renamed successfully!",
            type: "success",
          });
          handleToggleModal();
        }
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
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
          <span className="modal-title">{title}</span>
          <span
            className={`close ${isDarkMode ? "close-dark" : ""}`}
            onClick={() => handleToggleModal()}
          >
            &times;
          </span>
        </div>
        {isLoading ? (
          <div className="loader-container">
            <div>Please wait....</div>
            <div className="loader"></div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="modal-col-container">
              <div className="modal-subtitle">{subtitle}</div>
              <input
                type="text"
                placeholder={chat_name}
                className="update-username-input"
                onChange={(e) => setChatName(e.target.value.trim())}
                value={newChatName}
                disabled={title.includes("Delete")}
              />
            </div>
            <div className="action-buttons">
              <button
                className="cancel-button update-user-button"
                onClick={() => handleToggleModal()}
              >
                Cancel
              </button>
              <button
                className="create-button update-user-button"
                onClick={() => handleSubmit()}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

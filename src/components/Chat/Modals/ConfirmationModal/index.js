import React, { useState } from "react";
// import { updateUser } from "services";
import "./ConfirmationModal.css";
import { useStateValue } from "store/stateProvider";

export default function ConfirmationModal() {
  const { state, dispatch } = useStateValue();
  const [newChatName, setChatName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user = {}, visibleModal = {}, selectedChat = {} } = state;
  const { isDarkMode = false } = user;
  const { title = "", subtitle = "" } = visibleModal;

  const handleUpdateUser = async () => {
    setIsLoading(true);
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
            <div>{subtitle}</div>
            <div className="update-username-col-container">
              {/* <div className="update-username-row">
                <span>Chat:</span>
                <span className="update-username-text">
                  {selectedChat?.title}
                </span>
              </div> */}
              <input
                type="text"
                placeholder={selectedChat?.chat_name}
                className="update-username-input"
                onChange={(e) => setChatName(e.target.value.trim())}
                value={newChatName}
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
                onClick={handleUpdateUser}
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

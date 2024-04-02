import React, { useState } from "react";
import { socket } from "sockets/socketHandler";
import "./ConfirmationModal.css";
import { useStateValue } from "store/stateProvider";

export default function ConfirmationModal() {
  const { state = {}, dispatch } = useStateValue();
  const [newChatName, setChatName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user = {}, visibleModal = {}, selectedChat = {} } = state;
  const { isDarkMode = false, _id: sender_id } = user;
  const { title = "", subtitle = "", participant = {} } = visibleModal;
  const { chat_name, _id: chat_id } = selectedChat;
  const { name: participant_name, _id: participant_id } = participant;

  const handleSubmit = async () => {
    setIsLoading(true);
    if (title.includes("Rename Chat")) {
      socket.emit(
        "rename-chat",
        {
          chat_id,
          chat_name: newChatName,
        },
        (ack) => {
          setIsLoading(false);
          if (ack.success) {
            dispatch({
              type: "RENAME_CHAT",
              payload: { chat_id, chat_name: ack.chat_name },
            });
            handleToggleAlert({
              isAlertVisible: true,
              content: "Chat renamed successfully!",
              type: "success",
            });
            handleToggleModal();
          }
        }
      );
    } else if (title.includes("Delete Chat")) {
      socket.emit(
        "delete-chat",
        {
          chat_id,
        },
        (ack) => {
          setIsLoading(false);
          if (ack.success) {
            dispatch({
              type: "DELETE_CHAT",
              payload: { chat_id: ack.chat_id },
            });
            handleToggleAlert({
              isAlertVisible: true,
              content: "Chat deleted successfully!",
              type: "success",
            });
            handleToggleModal();
          }
        }
      );
    } else if (title.includes("Remove Participant")) {
      socket.emit(
        "remove-participant",
        { sender_id, chat_id, participant_id },
        (ack) => {
          setIsLoading(false);
          if (ack.success) {
            const { success, ...rest } = ack;
            dispatch({
              type: "REMOVE_CHAT_PARTICIPANT",
              payload: rest,
            });
            handleToggleAlert({
              isAlertVisible: true,
              content: "Participant removed successfully!",
              type: "success",
            });
            handleToggleModal();
          }
        }
      );
    }
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
              {title.includes("Chat") && (
                <input
                  type="text"
                  placeholder={chat_name}
                  className={`confirmation-input ${
                    isDarkMode ? "confirmation-input-dark" : ""
                  }`}
                  onChange={(e) => setChatName(e.target.value.trim())}
                  value={newChatName}
                  disabled={title.includes("Delete")}
                />
              )}
              {title.includes("Participant") && (
                <input
                  type="text"
                  placeholder={participant_name}
                  className={`confirmation-input ${
                    isDarkMode ? "confirmation-input-dark" : ""
                  }`}
                  value={participant_name}
                  disabled={true}
                  onClick={() => handleSubmit()}
                />
              )}
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

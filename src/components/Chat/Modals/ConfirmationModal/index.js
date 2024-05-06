import React, { useState } from "react";
import { socket } from "sockets/socketHandler";
import { useStateValue } from "store/stateProvider";
import { encryptData } from "utils";
import "./ConfirmationModal.css";
import "../Modals.css";

export default function ConfirmationModal() {
  const { state = {}, dispatch } = useStateValue();
  const [newChatName, setChatName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [passcodeToggle, setPasscodeToggle] = useState(false);
  const { user = {}, visibleModal = {}, selectedChat = {} } = state;
  const { isDarkMode = false, _id: sender_id, name: senderName } = user;
  const { title = "", subtitle = "", participant = {} } = visibleModal;
  const { chat_name, _id: chat_id, chat_url } = selectedChat;
  const { name: participant_name, _id: participant_id } = participant;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (title.includes("Edit Chat")) {
      const encryptedPasscode = encryptData(passcode);
      socket.emit(
        "edit-chat",
        {
          chat_id,
          chat_name: newChatName,
          encryptedPasscode,
        },
        (ack) => {
          setIsLoading(false);
          if (ack.success) {
            dispatch({
              type: "EDIT_CHAT",
              payload: { chat_id, chat_name: ack.chat_name },
            });
            handleToggleAlert({
              isAlertVisible: true,
              content: "Chat edited successfully!",
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
    } else if (title.includes("Invite User")) {
      socket.emit(
        "invite-user",
        { senderName, chat_id, chat_url, email },
        (ack) => {
          setIsLoading(false);
        }
      );
    } else if (title.includes("Clear Chat")) {
      socket.emit(
        "clear-chat",
        {
          chat_id,
        },
        ({ success, chat_id, messages }) => {
          setIsLoading(false);
          if (success) {
            dispatch({
              type: "CLEAR_CHAT",
              payload: { chat_id: chat_id, messages },
            });
            handleToggleAlert({
              isAlertVisible: true,
              content: "Chat cleared successfully!",
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
                <>
                  <input
                    type="text"
                    placeholder={chat_name || "Enter chat name here"}
                    className={`confirmation-input ${
                      isDarkMode ? "confirmation-input-dark" : ""
                    }`}
                    onChange={(e) => setChatName(e.target.value.trim())}
                    value={title.includes("Delete") ? chat_name : newChatName}
                    disabled={title.includes("Delete")}
                  />
                  {title.includes("Edit") && (
                    <>
                      <div className="modal-passcode-section">
                        <div>
                          Set a passcode:
                          <span className="optional-tag">(Optional)</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={passcodeToggle}
                            onChange={() => setPasscodeToggle(!passcodeToggle)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      {passcodeToggle && (
                        <input
                          type="password"
                          placeholder="Enter new passcode here"
                          className={`confirmation-input confirmation-pwd ${
                            isDarkMode ? "confirmation-input-dark" : ""
                          }`}
                          onChange={(e) => setPasscode(e.target.value.trim())}
                        />
                      )}
                    </>
                  )}
                </>
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
                  onClick={(e) => handleSubmit(e)}
                />
              )}
              {title.includes("Invite") && (
                <input
                  type="text"
                  placeholder="Type email here"
                  className={`confirmation-input ${
                    isDarkMode ? "confirmation-input-dark" : ""
                  }`}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  value={email}
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
                onClick={(e) => handleSubmit(e)}
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

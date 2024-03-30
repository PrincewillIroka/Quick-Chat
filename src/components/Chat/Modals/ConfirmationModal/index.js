import React, { useState, useRef } from "react";
import { updateUser } from "services";
import "./ConfirmationModal.css";
import { useStateValue } from "store/stateProvider";
import { generateInitials } from "utils";
import { AiOutlineVideoCamera } from "react-icons/ai";

export default function ConfirmationModal() {
  const selectDisplayPicRef = useRef();
  const displayPhotoRef = useRef();

  const { state, dispatch } = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const { user = {}, visibleModal = {} } = state;
  const { _id: user_id, name = "", photo = "", isDarkMode = false } = user;
  const { title = "", subtitle = "" } = visibleModal;

  const handleUpdateUser = async () => {};

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
        ) : (
          <div className="modal-body">
            <div className="action-buttons">
              <button
                className="cancel-button update-user-button"
                onClick={handleToggleModal}
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

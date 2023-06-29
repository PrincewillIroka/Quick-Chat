import React, { useState } from "react";
import { createChat } from "../../../../services";
import "./UpdateUsernameModal.css";
import { useStateValue } from "../../../../store/stateProvider";

export default function UpdateUsernameModal() {
  const { state, dispatch } = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUserName] = useState("");
  const { user = {} } = state;

  const handleUpdateUsername = async () => {
    setIsLoading(true);
    await createChat({ creator_id: user._id, username })
      .then(async (response) => {
        const { newChat } = response;
        setIsLoading(false);
        handleToggleAlert({
          isAlertVisible: true,
          content: "Username updated!",
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        handleToggleAlert({
          isAlertVisible: true,
          content: "Username not updated!",
          type: "error",
        });
      });
  };

  const handleToggleAlert = (payload) => {
    dispatch({
      type: "TOGGLE_ALERT",
      payload,
    });
  };

  const handleToggleModal = () => {
    dispatch({ type: "TOGGLE_MODAL", payload: "" });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-top-row">
          <span className="modal-title">Update Username</span>
          <span className="close" onClick={handleToggleModal}>
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
            <div className="conversation-title-container">
              <span>Username:</span>
              <input
                type="text"
                placeholder="Default name is New User"
                className="conversation-title-input"
                onChange={(e) => setUserName(e.target.value)}
              />
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
                onClick={handleUpdateUsername}
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

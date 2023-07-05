import React, { useState, useRef } from "react";
import { updateUser } from "services";
import "./UpdateUserModal.css";
import { useStateValue } from "store/stateProvider";
import { generateInitials } from "utils";
import { AiOutlineVideoCamera } from "react-icons/ai";

export default function UpdateUserModal() {
  const selectDisplayPicRef = useRef();
  const displayPhotoRef = useRef();

  const { state, dispatch } = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUserName] = useState("");
  const [userPhoto, setPhoto] = useState("");
  const [userPhotoURL, setPhotoURL] = useState("");
  const { user = {} } = state;
  const { _id: user_id, name = "", photo = "" } = user;

  const handleUpdateUsername = async () => {
    if (!userPhoto && !username) {
      return;
    }
    setIsLoading(true);

    const formData = new FormData();

    if (userPhoto) {
      formData.append("photo", userPhoto);
    }
    if (username) {
      formData.append("username", username);
    }
    formData.append("user_id", user_id);

    await updateUser(formData)
      .then(async (response) => {
        const { user } = response;
        if (user) {
          dispatch({ type: "GET_USER_SUCCESS", payload: user });
          handleToggleModal();
          handleToggleAlert({
            isAlertVisible: true,
            content: "Username updated!",
            type: "success",
          });
        }
        setIsLoading(false);
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

  const handleClickPhoto = () => {
    selectDisplayPicRef.current.click();
  };

  const handleSelectPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        dispatch({
          type: "TOGGLE_ALERT",
          payload: {
            isAlertVisible: true,
            content: `Maximum size for files is 5MB.`,
            type: "error",
          },
        });
        return;
      }
      setPhotoURL(URL.createObjectURL(file));
      setPhoto(file);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-top-row">
          <span className="modal-title">Update User</span>
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
            <div className="update-username-col-container">
              <div className="update-username-row">
                <span>Name:</span>
                <span className="update-username-text">{name}</span>
              </div>
              <input
                type="text"
                placeholder="Enter new username here"
                className="update-username-input"
                onChange={(e) => setUserName(e.target.value.trim())}
              />
            </div>
            <div className="update-profile-pic-col-container">
              <span>Display Picture:</span>
              <div
                className="update-profile-pic-container"
                onClick={() => handleClickPhoto()}
              >
                {userPhotoURL ? (
                  <img
                    src={userPhotoURL}
                    alt=""
                    className="update-profile-pic"
                    ref={displayPhotoRef}
                  />
                ) : photo ? (
                  <img src={photo} alt="" className="update-profile-pic" />
                ) : (
                  <span className="update-profile-pic-initial">
                    {generateInitials(name)}
                  </span>
                )}
                <div className="update-profile-pic-wrapper">
                  <span className="update-profile-pic-selector">
                    <AiOutlineVideoCamera className="update-profile-pic-icon" />
                  </span>
                </div>
              </div>
              <input
                type="file"
                hidden
                ref={selectDisplayPicRef}
                onInput={handleSelectPhoto}
                accept="image/*"
              />
            </div>
            <div className="action-buttons">
              <button
                className="cancel-button update-user-button"
                onClick={handleToggleModal}
              >
                Cancel
              </button>
              <button
                className="create-button update-user-button"
                onClick={handleUpdateUsername}
              >
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

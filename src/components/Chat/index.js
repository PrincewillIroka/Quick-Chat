import React, { useEffect, useCallback, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ChatList from "components/Chat/ChatList";
import MainLayout from "components/Chat/MainLayout";
import ChatDetails from "components/Chat/ChatDetails";
import CreateConversationModal from "components/Chat/Modals/CreateConversationModal";
import UpdateUserModal from "components/Chat/Modals/UpdateUserModal";
import ConfirmationModal from "components/Chat/Modals/ConfirmationModal";
import "./Chat.css";
import { useStateValue } from "store/stateProvider";
import { authenticateUser, updateAccessRight } from "services";
import { publish } from "custom-events";
import { socket } from "sockets/socketHandler";
import { getCookie } from "utils";

export default function Chat() {
  const { state = {}, dispatch } = useStateValue();
  const { alert = {}, visibleModal = {}, user = {}, selectedChat = {} } = state;
  const {
    isAlertVisible = false,
    content: alertContent,
    type: alertType,
  } = alert;
  const { _id: user_id, isDarkMode = false } = user;
  const {
    _id: chat_id,
    passcode = "",
    creator_id = "",
    access_rights = [],
  } = selectedChat;
  const [passcodeInput, setPasscodeInput] = useState("");
  const [isLoadingPasscode, setIsLoadingPasscode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setCookie = (bs_token) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 400 * 24 * 60 * 60 * 1000);
    document.cookie = `bs_token=${bs_token};expires=${expires};path=/`;
  };

  const handleCookie = useCallback(() => {
    const bs_token = getCookie();
    if (bs_token) {
      setCookie(bs_token);
    }
  }, []);

  useEffect(() => {
    handleCookie();
  }, [handleCookie]);

  useEffect(() => {
    authenticateUser()
      .then((response) => {
        const user = response?.user;
        if (user) {
          const {
            bs_token = "",
            hasUpdatedUsername = false,
            name = "",
            _id = "",
          } = user;
          socket.emit("join", { user_id: _id });
          setCookie(bs_token);
          dispatch({ type: "GET_USER_SUCCESS", payload: user });
          publish("userDetailsFetched", user);
          if (!hasUpdatedUsername) {
            dispatch({
              type: "TOGGLE_ALERT",
              payload: {
                isAlertVisible: true,
                content: `<div class="alert-nested-wrapper"><span>Your default name is ${name}.</span>
              <span class="alert-click-here-btn" id="alert-click-here-btn">Click here to update it.</span></div>`,
                type: "info",
              },
            });
          }
        }
      })
      .catch((err) => {
        console.error({ err });
      });
  }, [dispatch]);

  const closeAlert = useCallback(() => {
    dispatch({
      type: "TOGGLE_ALERT",
      payload: { isAlertVisible: false, content: "" },
    });
  }, [dispatch]);

  useEffect(() => {
    let alertTimeout;
    if (isAlertVisible && alertType !== "info") {
      alertTimeout = setTimeout(() => {
        closeAlert();
      }, 3000);
    }
    return () => clearTimeout(alertTimeout);
  }, [closeAlert, isAlertVisible, alertType]);

  const handleClick = (event) => {
    event.preventDefault();
    if (event.target.id === "alert-click-here-btn") {
      closeAlert();
      dispatch({ type: "TOGGLE_MODAL", payload: { type: "UpdateUserModal" } });
    }
  };

  const checkPasscode = () => {
    let value;
    if (!passcode) {
      value = true;
    } else {
      const isChatCreator = user_id === creator_id;
      value = isChatCreator || hasAccessRight(user_id);
    }
    return value;
  };

  const hasAccessRight = (user_id) => {
    return access_rights.find((aId) => aId === user_id);
  };

  const handleUpdateAccessRight = () => {
    setIsLoadingPasscode(true);
    updateAccessRight({ user_id, chat_id, passcode: passcodeInput })
      .then((response) => {
        const { success, updatedChat } = response;
        setIsLoadingPasscode(false);
        if (!success) {
          setErrorMessage("Incorrect passcode!");
        } else {
          dispatch({
            type: "UPDATE_CHAT",
            payload: { chat_id, updatedChat },
          });
        }
      })
      .catch((err) => {
        setErrorMessage("Incorrect passcode!");
        console.error({ err });
      });
  };

  return (
    <div
      className={`chat-container ${isDarkMode ? "chat-container-dark" : ""}`}
    >
      <ChatList />
      {checkPasscode() ? (
        <>
          <MainLayout /> <ChatDetails isDarkMode={isDarkMode} />
        </>
      ) : isLoadingPasscode ? (
        <div className="check-passcode-container">Please wait....</div>
      ) : (
        <div className="check-passcode-container">
          <span className="error-message">{errorMessage}</span>
          <input
            placeholder="Enter passcode to join this chat..."
            className="enter-passcode-input"
            onChange={(e) => {
              setPasscodeInput(e.target.value.trim());
            }}
            onFocus={() => setErrorMessage("")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdateAccessRight();
              }
            }}
          />
          <button
            className="submit-passcode-btn"
            onClick={() => handleUpdateAccessRight()}
          >
            Submit
          </button>
        </div>
      )}

      {visibleModal?.type === "CreateConversation" ? (
        <CreateConversationModal />
      ) : visibleModal?.type === "UpdateUserModal" ? (
        <UpdateUserModal />
      ) : (
        visibleModal?.type === "ConfirmationModal" && <ConfirmationModal />
      )}
      {isAlertVisible && (
        <div className={`alert alert-${alertType}`}>
          <div className="alert-container">
            <div
              className="alert-content"
              dangerouslySetInnerHTML={{ __html: alertContent }}
              onClick={handleClick}
            ></div>
            <IoMdClose className="alert-close" onClick={() => closeAlert()} />
          </div>
        </div>
      )}
    </div>
  );
}

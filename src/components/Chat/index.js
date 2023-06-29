import React, { useEffect, useCallback, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import ChatList from "./ChatList";
import MainLayout from "./MainLayout";
import ChatDetails from "./ChatDetails";
import CreateConversationModal from "./Modals/CreateConversationModal";
import UpdateUserModal from "./Modals/UpdateUserModal";
import "./Chat.css";
import { useStateValue } from "../../store/stateProvider";
import { authenticateUser } from "../../services";

export default function Chat() {
  const { state, dispatch } = useStateValue();
  const { alert = {}, visibleModal = "" } = state;
  const {
    isAlertVisible = false,
    content: alertContent,
    type: alertType,
  } = alert;

  useEffect(() => {
    authenticateUser().then((response) => {
      const user = response?.user;
      if (user) {
        const { bs_token = "", hasUpdatedUsername = false, name = "" } = user;
        localStorage.setItem("bs_token", bs_token);
        dispatch({ type: "GET_USER_SUCCESS", payload: user });
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
    });
  }, [dispatch]);

  const handleToggleAlert = useCallback(
    (value) => {
      if (value === "close") {
        closeAlert();
      }
    },
    [dispatch]
  );

  useEffect(() => {
    let alertTimeout;
    if (isAlertVisible && alertType !== "info") {
      alertTimeout = setTimeout(() => {
        handleToggleAlert("close");
      }, 3000);
    }
    return () => clearTimeout(alertTimeout);
  }, [dispatch, handleToggleAlert, isAlertVisible, alertType]);

  const closeAlert = () => {
    dispatch({
      type: "TOGGLE_ALERT",
      payload: { isAlertVisible: false, content: "" },
    });
  };

  const handleClick = (event) => {
    event.preventDefault();
    if (event.target.id === "alert-click-here-btn") {
      closeAlert();
      dispatch({ type: "TOGGLE_MODAL", payload: "UpdateUserModal" });
    }
  };

  return (
    <div className="chat-container">
      <ChatList />
      <MainLayout />
      <ChatDetails />
      {visibleModal === "CreateConversation" ? (
        <CreateConversationModal />
      ) : (
        visibleModal === "UpdateUserModal" && <UpdateUserModal />
      )}
      {isAlertVisible && (
        <div className={`alert alert-${alertType}`}>
          <div className="alert-container">
            <div
              className="alert-content"
              dangerouslySetInnerHTML={{ __html: alertContent }}
              onClick={handleClick}
            ></div>
            <IoMdClose
              className="alert-close"
              onClick={() => handleToggleAlert("close")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

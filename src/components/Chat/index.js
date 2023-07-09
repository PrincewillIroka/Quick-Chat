import React, { useEffect, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import ChatList from "components/Chat/ChatList";
import MainLayout from "components/Chat/MainLayout";
import ChatDetails from "components/Chat/ChatDetails";
import CreateConversationModal from "components/Chat/Modals/CreateConversationModal";
import UpdateUserModal from "components/Chat/Modals/UpdateUserModal";
import "./Chat.css";
import { useStateValue } from "store/stateProvider";
import { authenticateUser } from "services";
import { publish } from "custom-events";
import { socket } from "sockets/socketHandler";

export default function Chat() {
  const { state, dispatch } = useStateValue();
  const { alert = {}, visibleModal = "" } = state;
  const {
    isAlertVisible = false,
    content: alertContent,
    type: alertType,
  } = alert;

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
          localStorage.setItem("bs_token", bs_token);
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
            <IoMdClose className="alert-close" onClick={() => closeAlert()} />
          </div>
        </div>
      )}
    </div>
  );
}

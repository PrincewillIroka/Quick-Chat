import React, { useEffect, useState, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import ChatList from "./ChatList";
import MainLayout from "./MainLayout";
import ChatDetails from "./ChatDetails";
import CreateConversationModal from "../Chat/CreateConversationModal";
import "./Chat.css";
import { useStateValue } from "../../store/stateProvider";
import { authenticateUser } from "../../services";

export default function Chat() {
  const { state, dispatch } = useStateValue();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { alert = {} } = state;
  const { isVisible = false, content: alertContent, type: alertType } = alert;

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
              isVisible: true,
              content: `Your default name is ${name}. Click here to update it.`,
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
        dispatch({
          type: "TOGGLE_ALERT",
          payload: { isVisible: false, content: "" },
        });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    let alertTimeout;
    if (isVisible && alertType !== "info") {
      alertTimeout = setTimeout(() => {
        handleToggleAlert("close");
      }, 3000);
    }
    return () => clearTimeout(alertTimeout);
  }, [dispatch, handleToggleAlert, isVisible, alertType]);

  return (
    <div className="chat-container">
      <ChatList handleToggleModal={() => setIsModalVisible(!isModalVisible)} />
      <MainLayout />
      <ChatDetails />
      {isModalVisible && (
        <CreateConversationModal
          handleToggleModal={() => setIsModalVisible(!isModalVisible)}
        />
      )}
      {isVisible && (
        <div className={`alert alert-${alertType}`}>
          <div className="alert-container">
            <div className="alert-content">
              <span>{alertContent}</span>
            </div>
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

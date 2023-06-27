import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    authenticateUser().then((response) => {
      const user = response?.user;
      if (user) {
        const { bs_token = "" } = user;
        localStorage.setItem("bs_token", bs_token);
        dispatch({ type: "GET_USER_SUCCESS", payload: user });
      }
    });
  }, [dispatch]);

  useEffect(() => {
    let alertTimeout;
    if (alert.isVisible) {
      alertTimeout = setTimeout(() => {
        handleToggleAlert("close");
      }, 3000);
    }
    return () => clearTimeout(alertTimeout);
  }, [dispatch, alert]);

  const handleToggleAlert = (value) => {
    if (value === "close") {
      dispatch({
        type: "TOGGLE_ALERT",
        payload: { isVisible: false, content: "" },
      });
    }
  };

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
      {alert.isVisible && (
        <div className="alert alert-success">
          <div className="alert-container">
            <IoMdClose
              className="alert-close"
              onClick={() => handleToggleAlert("close")}
            />
            <span className="alert-content">{alert.content}</span>
          </div>
        </div>
      )}
    </div>
  );
}

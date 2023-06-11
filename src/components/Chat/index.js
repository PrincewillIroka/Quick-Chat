import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import MainLayout from "./MainLayout";
import ChatDetails from "./ChatDetails";
import CreateConversationModal from "../Chat/CreateConversationModal";
import "./Chat.css";
import { useStateValue } from "../../store/stateProvider";
import { authenticateUser } from "../../services";

export default function Chat() {
  const { dispatch } = useStateValue();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    </div>
  );
}

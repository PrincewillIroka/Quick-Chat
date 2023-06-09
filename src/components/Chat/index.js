import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import MainLayout from "./MainLayout";
import ChatDetails from "./ChatDetails";
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
        dispatch({ type: "GET_USER_SUCCESS", payload: user });
      }
    });
  }, [dispatch]);

  const CreateConversationModal = () => {
    return (
      <div class="modal">
        <div class="modal-content">
          <div>
            <span>Create new conversation</span>
            <span
              class="close"
              onClick={() => setIsModalVisible(!isModalVisible)}
            >
              &times;
            </span>
          </div>
          <div>
            <div>
              <span>Set a passcode (Optional):</span>
              <label class="switch">
                <input type="checkbox" checked />
                <span class="slider round"></span>
              </label>
            </div>
            <div>
              <b>Passcode</b>
              <span>
                <i>qwertybinman</i>
              </span>
            </div>
            <div class="loader"></div>
            <div>
              <button>Cancel</button>
              <button>Create</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <ChatList handleToggleModal={() => setIsModalVisible(!isModalVisible)} />
      <MainLayout />
      <ChatDetails />
      {isModalVisible && <CreateConversationModal />}
    </div>
  );
}

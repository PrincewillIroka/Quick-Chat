import React, { useEffect } from "react";
import ChatList from "./ChatList";
import MainLayout from "./MainLayout";
import ChatDetails from "./ChatDetails";
import "./Chat.css";

import { useStateValue } from "../../store/stateProvider";
import { authenticateUser } from "../../services";

export default function Chat() {
  const { state, dispatch } = useStateValue();

  useEffect(() => {
    authenticateUser().then((response) => {
      const user = response?.user;
      if (user) {
        dispatch({ type: "GET_USER_SUCCESS", payload: user });
      }
    });
  }, [dispatch]);

  return (
    <div className="chat-container">
      <ChatList />
      <MainLayout />
      <ChatDetails />
    </div>
  );
}

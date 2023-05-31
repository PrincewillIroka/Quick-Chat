import React from "react";
import ChatList from "./ChatList";
import MainLayout from "./MainLayout";
import ChatDetails from "./ChatDetails";
import "./Chat.css";

import { StateProvider } from "../../store/stateProvider";
import { chatStore } from "../../store/chatStore";

export default function Chat() {
  return (
    <StateProvider {...chatStore}>
      <div className="chat-container">
        <ChatList />
        <MainLayout />
        <ChatDetails />
      </div>
    </StateProvider>
  );
}

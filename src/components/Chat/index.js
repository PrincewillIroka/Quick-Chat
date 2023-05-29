import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainLayout from "./MainLayout";
import "./Chat.css";

import { StateProvider } from "../../store/stateProvider";
import { chatStore } from "../../store/chatStore";

export default function Chat() {
  return (
    <StateProvider {...chatStore}>
      <div className="chat-container">
        <Sidebar />
        <MainLayout />
      </div>
    </StateProvider>
  );
}

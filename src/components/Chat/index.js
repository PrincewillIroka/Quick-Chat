import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainLayout from "./MainLayout";
import "./Chat.css";

import { StateProvider } from "../../store/stateProvider";
import { chatStore } from "../../store/chatStore";
import { getChats } from "../../services/userServices";

export default function Chat() {
  const getResponse = async () => {
    await getChats()
      .then(async (response) => {
        console.log("getChats", response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  getResponse();

  return (
    <StateProvider {...chatStore}>
      <div className="chat-container">
        <Sidebar />
        <MainLayout />
      </div>
    </StateProvider>
  );
}

import React from "react";
import Sidebar from "./Sidebar";
import MainLayout from "./MainLayout";
import "./Chat.css";

export default function Chat() {
  return (
    <div className="chat-container">
      <Sidebar />
      <MainLayout />
    </div>
  );
}

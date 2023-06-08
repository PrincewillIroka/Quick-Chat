import React, { useState } from "react";
import { RiSendPlaneFill, RiAttachment2 } from "react-icons/ri";
import { BiMicrophone } from "react-icons/bi";
import Message from "./Message";
import "./MainLayout.css";
import { useStateValue } from "../../../store/stateProvider";
import { socket } from "../../../sockets/socketHandler";
import TopSection from "./TopSection";

export default function MainLayout() {
  const [state, dispatch] = useStateValue();
  const [content, setContent] = useState("");
  const { selectedChat = {}, user = {} } = state;
  const { messages = [] } = selectedChat;

  const handleTyping = (e) => {
    e.preventDefault();
    setContent(e.target.value);
  };

  const handleSendMessage = () => {
    if (!content) return;
    const { _id, chat_url } = selectedChat;
    const sender_id = user._id;
    socket.emit(
      "newMessageSent",
      { content, chat_url, chat_id: _id, sender_id },
      (ack) => {
        const { messageSent, updatedChat } = ack;
        if (messageSent && updatedChat) {
          setContent("");
          dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
        }
      }
    );
  };

  return (
    <section className="main-layout-container">
      <TopSection selectedChat={selectedChat} />
      <div className="body-section">
        {messages.map((message, index) => (
          <Message message={message} key={index} />
        ))}
      </div>
      <div className="type-message-section">
        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message"
            className="input-field"
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            value={content}
          />
          <span className="right-divider"></span>
          <div className="emoji-container">
            <BiMicrophone className="microphone-icon" />
            <RiAttachment2 className="attachment-icon" />
          </div>
        </div>
        <div className="send-button-container" onClick={handleSendMessage}>
          <RiSendPlaneFill className="send-icon" />
        </div>
      </div>
    </section>
  );
}

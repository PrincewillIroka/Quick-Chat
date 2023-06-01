import React from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { TbPhoneCall } from "react-icons/tb";
import { CgSearch, CgMore } from "react-icons/cg";
import { RiSendPlaneFill } from "react-icons/ri";
import Message from "./Message";
import "./MainLayout.css";
import { generateInitials } from "../../../utils";
import { useStateValue } from "../../../store/stateProvider";

export default function MainLayout() {
  const [state, dispatch] = useStateValue();
  const { selectedChat } = state;
  const { messages = [] } = selectedChat || {};

  return (
    <section className="mainlayout-container">
      <div className="top-section">
        <div className="row">
          {selectedChat?.photo ? (
            <img src={selectedChat?.photo} className="user-info-photo" alt="" />
          ) : (
            <span className="user-info-initial">
              {generateInitials(selectedChat?.name)}
            </span>
          )}
          <div className="user-info-col-1">
            <span className="user-info-name">{selectedChat?.name}</span>
            <span className="user-info-chat-participants">
              Abel, Genea, Vanessa, Monalisa ...+5
            </span>
          </div>
        </div>

        <div className="icons-container">
          <AiOutlineVideoCamera className="media-icon" />
          <TbPhoneCall className="media-icon" />
        </div>

        <div className="icons-container">
          <CgSearch className="control-icon" />
          <CgMore className="control-icon" />
        </div>
      </div>
      <div className="body-section">
        {messages.map((message, index) => (
          <Message message={message} key={index} />
        ))}
        <div className="type-message-section">
          <div className="message-input-container">
            <input placeholder="Type a message" className="input-field" />
            <span className="right-divider"></span>
          </div>
          <div className="send-button-container">
            <RiSendPlaneFill className="send-icon" />
          </div>
        </div>
      </div>
    </section>
  );
}

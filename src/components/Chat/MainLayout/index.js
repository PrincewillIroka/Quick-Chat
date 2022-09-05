import React from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { TbPhoneCall } from "react-icons/tb";
import { CgSearch, CgMore } from "react-icons/cg";
import "./MainLayout.css";
import { generateInitials } from "../../../utils";

export default function MainLayout({ selectedUser }) {
  return (
    <section className="container">
      <div className="top-section">
        <div className="row">
          {selectedUser?.photo ? (
            <img src={selectedUser.photo} className="user-info-photo" />
          ) : (
            <span className="user-info-initial">
              {generateInitials(selectedUser.name)}
            </span>
          )}
          <div className="user-info-col-1">
            <span className="user-info-name">{selectedUser.name}</span>
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
      <div className="body-section"></div>
    </section>
  );
}

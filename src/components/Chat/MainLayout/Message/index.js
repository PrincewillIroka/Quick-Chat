import React, { memo } from "react";
import "./Message.css";
import { generateInitials, isSameSender } from "utils";
import { useStateValue } from "store/stateProvider";
import { getAttachmentIcon } from "constants/index";

function Message({ message }) {
  const { state = {} } = useStateValue();
  const { user = {} } = state;
  const { isDarkMode = false } = user;
  let {
    sender = {},
    content = "",
    attachments = [],
    createdAt = "",
    messageType = "",
  } = message;
  const checkSameSender = isSameSender(sender, user);
  sender = checkSameSender ? user : sender;
  const { name = "", photo = "" } = sender;

  const handleViewFile = (file_url) => {
    window.open(file_url);
  };

  const formatDate = (dt) => {
    return new Date(dt).toLocaleString("en-UK", {
      hour: "numeric",
      hour12: true,
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return messageType !== "info" ? (
    <div
      className={`message-container ${
        checkSameSender && "message-container-align-right"
      }`}
    >
      {photo ? (
        <img className="message-sender-photo" src={photo} alt="Sender" />
      ) : (
        <span
          className={`message-sender-photo message-sender-initial ${
            isDarkMode ? "message-sender-initial-dark" : ""
          }`}
        >
          {generateInitials(name)}
        </span>
      )}
      <div className="message-details">
        <div className="message-info">
          <span className="message-owner">{name}</span>
          <span className="message-time">{formatDate(createdAt)}</span>
        </div>
        <div className="message-original">
          <div className="message-original-wrapper">
            {attachments.length ? (
              <div className="attachments-container">
                {attachments.map(({ attachment = {} }, index) => {
                  let {
                    name,
                    file_url,
                    isUploading,
                    mimetype = "",
                  } = attachment;

                  return (
                    <div className="attachment-details-wrapper" key={index}>
                      <div
                        className="attachment-details-single"
                        title={name}
                        onClick={() => handleViewFile(file_url)}
                      >
                        {mimetype.includes("image") ? (
                          <img
                            src={file_url}
                            className="message-attachment-img"
                            alt=""
                          />
                        ) : (
                          <span className="message-attachment-icon-wrapper">
                            {getAttachmentIcon(
                              mimetype,
                              "message-attachment-icon"
                            )}
                          </span>
                        )}
                        <div className="attachment-name-wrapper">
                          <span className="attachment-name">{name}</span>
                        </div>
                      </div>
                      {isUploading === "In Progress" && (
                        <div className="attachment-progress-container">
                          <span className="attachment-progress-loader"></span>
                          <span className="attachment-progress-text">
                            Uploading file...
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
            {content && <span className="message-content">{content}</span>}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`message-info-container ${
        isDarkMode ? "message-info-container-dark" : ""
      }`}
    >
      <span className="message-info-content">
        {checkSameSender ? "You joined this chat." : content}
      </span>
      <span className="message-info-createdAt">{formatDate(createdAt)}</span>
    </div>
  );
}

export default memo(Message);

import React, { memo } from "react";
import "./Message.css";
import { generateInitials, isSameSender } from "utils";
import { useStateValue } from "store/stateProvider";
import { getAttachmentIcon } from "constants/index";

function Message({ message }) {
  const { state } = useStateValue();
  const { user = {} } = state;
  const { isDarkMode = false } = user;
  let { sender = {}, content = "", attachments = [] } = message;
  const checkSameSender = isSameSender(sender, user);
  sender = checkSameSender ? user : sender;
  const { name = "", photo = "" } = sender;

  const handleViewFile = (file_url) => {
    window.open(file_url);
  };

  return (
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
          <span className="message-time">10:05 AM</span>
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
  );
}

export default memo(Message);

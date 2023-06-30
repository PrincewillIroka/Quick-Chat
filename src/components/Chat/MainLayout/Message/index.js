import React, { memo } from "react";
import "./Message.css";
import { generateInitials } from "utils";
import { useStateValue } from "store/stateProvider";

function Message({ message }) {
  const { state } = useStateValue();
  const { user = {} } = state;
  const { sender = {}, content = "", attachments = [] } = message;

  const isSameSender = (sender) => {
    return sender._id === user._id;
  };

  const handleViewFile = (file_url) => {
    window.open(file_url);
  };

  return (
    <div
      className={`message-container ${
        isSameSender(sender) && "message-container-align-right"
      }`}
    >
      {sender.photo ? (
        <img className="message-sender-photo" src={sender.photo} alt="Sender" />
      ) : (
        <span className="message-sender-photo message-sender-initial">
          {generateInitials(sender.name)}
        </span>
      )}
      <div className="message-details">
        <div className="message-info">
          <span className="message-owner">{sender.name}</span>
          <span className="message-time">10:05 AM</span>
        </div>
        <div className="message-original">
          <div className="message-original-wrapper">
            {attachments.length ? (
              <div className="attachments-container">
                {attachments.map(({ attachment = {} }, index) => {
                  const { name, file_url, isUploading } = attachment;
                  return (
                    <div className="attachment-name-wrapper" key={index}>
                      <div
                        className="attachment-name"
                        title={name}
                        onClick={() => handleViewFile(file_url)}
                      >
                        {name}
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

import React, { memo } from "react";
import "./Message.css";
import { generateInitials } from "../../../../utils";
import { useStateValue } from "../../../../store/stateProvider";

function Message({ message }) {
  const { state } = useStateValue();
  const { user = {} } = state;
  const { sender = {}, content = "", attachments = [] } = message;

  const isSameSender = (sender) => {
    return sender._id === user._id;
  };

  const handleViewFile = (file_url) => {};

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
        {content || attachments.length ? (
          <div className="message-original">
            {attachments.length ? (
              <div className="attachments-container">
                {attachments.map(({ file_details }, index) => {
                  const { file_name, file_url } = file_details;
                  return (
                    <div
                      key={index}
                      className="attachement-name"
                      title={file_name}
                      onClick={() => handleViewFile(file_url)}
                    >
                      {file_name}
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
            {content && <span>{content}</span>}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default memo(Message);

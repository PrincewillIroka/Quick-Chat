import React, { useState, useRef } from "react";
import { RiSendPlaneFill, RiAttachment2 } from "react-icons/ri";
import { BiMicrophone } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Message from "./Message";
import "./MainLayout.css";
import TopSection from "./TopSection";
import NoChat from "../../../assets/NoChat.svg";
import { useStateValue } from "../../../store/stateProvider";
import { socket } from "../../../sockets/socketHandler";
import { uploadFile } from "../../../services";
import { formatBytes } from "../../../utils";

export default function MainLayout() {
  const { state, dispatch } = useStateValue();
  const [content, setContent] = useState("");
  const [isFileContainerOpen, setIsFileContainerOpen] = useState(false);
  const { selectedChat = {}, user = {} } = state;
  const { messages = [], passcode = "", _id: chat_id, chat_url } = selectedChat;
  const { _id: sender_id } = user;
  const selectFile = useRef();
  const [filesUploading, setFilesUploading] = useState([]);
  const [formData] = useState(new FormData());

  const handleTyping = (e) => {
    e.preventDefault();
    setContent(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!content) return;

    setContent("");
    setIsFileContainerOpen(false);
    setFilesUploading([]);

    socket.emit(
      "newMessageSent",
      { content, chat_url, chat_id, sender_id },
      (ack) => {
        const { messageSent, updatedChat } = ack;
        if (messageSent && updatedChat) {
          dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
        }
      }
    );

    await uploadFile(formData)
      .then((response) => {
        console.log({ response });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCheckPasscode = () => {
    const value = !passcode ? true : false;
    return value;
  };

  const handleClickAttachmentIcon = () => {
    selectFile.current.click();
  };

  const handleSelectAttachment = async (e) => {
    let attachments = [...e.target.files];

    attachments = attachments.map((attachment) => {
      return { attachment, isUploading: true };
    });

    setIsFileContainerOpen(true);
    setFilesUploading(attachments);

    for (var [key, value] of Object.entries(attachments)) {
      const { attachment } = value;
      formData.append(key, attachment);
    }

    formData.append("chat_id", chat_id);
    formData.append("sender_id", sender_id);
  };

  const handleRemoveAllFiles = () => {
    setIsFileContainerOpen(false);
    setFilesUploading([]);
  };

  const handleRemoveFile = (fileName) => {
    const result = filesUploading.filter(
      ({ attachment }) => attachment.name !== fileName
    );
    setFilesUploading(result);
  };

  const handleRecordAudioMessage = () => {};

  return (
    <section className="main-layout-container">
      <TopSection selectedChat={selectedChat} />
      {!messages.length ? (
        <div className="no-chat-section">
          <img src={NoChat} className="no-chat-svg" alt="" />
          <span>Messages here</span>
        </div>
      ) : (
        <div className="body-section">
          {messages.map((message, index) => (
            <Message message={message} key={index} />
          ))}
          {isFileContainerOpen && (
            <div className="files-list-container">
              <IoMdClose
                className="files-list-close-button"
                onClick={() => handleRemoveAllFiles(false)}
              />
              <div className="files-list-content">
                {filesUploading.map(({ attachment }, index) => {
                  const { name = "", size = 0 } = attachment;
                  return (
                    <div className="file-list-item" key={index}>
                      <IoMdClose
                        className="file-item-close-button"
                        title={name}
                        onClick={() => handleRemoveFile(name)}
                      />
                      <span className="file-item-name">{name}</span>
                      <span className="file-item-size">
                        {formatBytes(size)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      {handleCheckPasscode() ? (
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
              <BiMicrophone
                className="microphone-icon"
                onClick={handleRecordAudioMessage}
              />
              <RiAttachment2
                className="attachment-icon"
                onClick={handleClickAttachmentIcon}
              />
              <input
                type="file"
                hidden
                ref={selectFile}
                onInput={handleSelectAttachment}
                multiple
              />
            </div>
          </div>
          <div className="send-button-container" onClick={handleSendMessage}>
            <RiSendPlaneFill className="send-icon" />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </section>
  );
}

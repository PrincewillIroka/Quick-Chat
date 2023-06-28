import React, { useState, useRef, useEffect, memo } from "react";
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
import { useAudioRecorder } from "../../../hooks";

function MainLayout() {
  const { state, dispatch } = useStateValue();
  const [content, setContent] = useState("");
  const [isFileContainerOpen, setIsFileContainerOpen] = useState(false);
  const { selectedChat = {}, user = {}, filesUploading = {} } = state;
  const { messages = [], passcode = "", _id: chat_id, chat_url } = selectedChat;
  const { _id: sender_id } = user;
  const selectFile = useRef();
  const [formData, setFormData] = useState(new FormData());
  const { permission, stream, getMicrophonePermission } = useAudioRecorder();

  useEffect(() => {
    handleResetValues();
  }, [chat_id]);

  const handleTyping = (e) => {
    e.preventDefault();
    setContent(e.target.value);
  };

  const handleSendMessage = () => {
    setContent("");
    setIsFileContainerOpen(false);
    dispatch({ type: "SET_FILES_UPLOADING", payload: [] });

    //Check if there is any file to be uploaded
    const hasFiles = formData.has("0");

    if (content || hasFiles) {
      socket.emit(
        "newMessageSent",
        { content, chat_url, chat_id, sender_id },
        async (ack) => {
          let { messageSent, updatedChat, message_id } = ack;
          if (messageSent && updatedChat) {
            if (hasFiles) {
              const attachments = filesUploading[chat_id];
              let { messages = [] } = updatedChat;

              messages = messages.map((message) => {
                const { _id } = message;
                if (_id === message_id) {
                  message["attachments"] = attachments;
                }
                return message;
              });

              updatedChat["messages"] = messages;
            }
            dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
          }

          if (hasFiles) {
            formData.append("chat_id", chat_id);
            formData.append("sender_id", sender_id);
            formData.append("message_id", message_id);

            await uploadFile(formData)
              .then(() => {})
              .catch((err) => {
                console.error(err);
              });

            //Reset form data
            setFormData(new FormData());
          }
        }
      );
    }
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
    let arr = [];

    for (var [key, value] of Object.entries(attachments)) {
      const { name = "", size = 0 } = value;
      const attachment = { key, name, size, isUploading: "In Progress" };
      formData.append(key, value);
      arr = arr.concat({ attachment });
    }

    filesUploading[chat_id] = arr;

    setIsFileContainerOpen(true);
    dispatch({
      type: "SET_FILES_UPLOADING",
      payload: filesUploading,
    });
  };

  const handleRemoveFile = (fileName) => {
    const attachments = filesUploading[chat_id]?.filter(
      ({ attachment }) => attachment.name !== fileName
    );
    for (var [key] of Object.entries(attachments)) {
      formData.delete(key);
    }
    filesUploading[chat_id] = attachments;

    if (!attachments.length) {
      setIsFileContainerOpen(false);
      setFormData(new FormData());
    }
    dispatch({
      type: "SET_FILES_UPLOADING",
      payload: filesUploading,
    });
  };

  const handleRecordAudioMessage = () => {
    if (!permission) {
      getMicrophonePermission();
    } else {
      console.log({ stream });
    }
  };

  const handleRemoveAllFiles = () => {
    handleResetValues();
    filesUploading[chat_id] = [];
    dispatch({
      type: "SET_FILES_UPLOADING",
      payload: filesUploading,
    });
  };

  const handleResetValues = () => {
    setContent("");
    setIsFileContainerOpen(false);
    setFormData(new FormData());
  };

  return (
    <section className="main-layout-container">
      <TopSection selectedChat={selectedChat} />
      {!messages.length ? (
        <div className="no-chat-section">
          <img src={NoChat} className="no-chat-svg" alt="" />
          <span>Messages here</span>
        </div>
      ) : (
        <>
          <div className="body-section">
            {messages.map((message, index) => (
              <Message message={message} key={index} />
            ))}
          </div>

          {filesUploading[chat_id] && isFileContainerOpen && (
            <div className="files-list-container">
              <IoMdClose
                className="files-list-close-button"
                onClick={() => handleRemoveAllFiles(false)}
              />
              <div className="files-list-content">
                {filesUploading[chat_id].map(({ attachment }, index) => {
                  const { name = "", size = 0 } = attachment;
                  return (
                    <div className="file-list-item" key={index} title={name}>
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
        </>
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

export default memo(MainLayout);

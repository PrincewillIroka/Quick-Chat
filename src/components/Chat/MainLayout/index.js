import React, { useState, useRef, useEffect, memo } from "react";
import { RiSendPlaneFill, RiAttachment2 } from "react-icons/ri";
import { BiMicrophone } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

import Message from "components/Chat/MainLayout/Message";
import "./MainLayout.css";
import TopSection from "components/Chat/MainLayout/TopSection";
import NoChat from "assets/NoChat.svg";
import { useStateValue } from "store/stateProvider";
import { socket } from "sockets/socketHandler";
import { uploadFile } from "services";
import {
  formatBytes,
  formatTime,
  encryptData,
  debounce,
  createArrayItems,
} from "utils";
import { useSetupAudioRecorder, useRecording } from "hooks";

const SQUARES = ["1", "2", "3"];

function MainLayout() {
  const { state = {}, dispatch } = useStateValue();
  const [content, setContent] = useState("");
  const [isFileContainerOpen, setIsFileContainerOpen] = useState(false);
  const {
    selectedChat = {},
    user = {},
    filesUploading = {},
    isChatLoading,
    participantsTypingInChat = {},
  } = state;
  const { messages = [], _id: chat_id, chat_url } = selectedChat;
  const { _id: sender_id, name: user_name, isDarkMode = false } = user;
  const chatTyping = participantsTypingInChat[chat_url] || {};
  const { isTyping = false, message: typingMessage = "" } = chatTyping;
  const selectFileRef = useRef();
  const messageSectionRef = useRef();
  const [formData, setFormData] = useState(new FormData());
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState("");

  const mimeType = "audio/webm";
  const spinnerSquares = new Array(4).fill(SQUARES).flat();
  const isRecording = recordingStatus === "recording";
  const hasStoppedRecording = recordingStatus === "stopRecording";

  const { getMicrophonePermission, stream } =
    useSetupAudioRecorder(setRecordingStatus);

  const { audio, counter } = useRecording({
    setRecordingStatus,
    mediaRecorder,
    stream,
    mimeType,
    recordingStatus,
    isFileContainerOpen,
  });

  const handleScrollToBottom = () => {
    if (messageSectionRef.current) {
      messageSectionRef.current.scrollIntoView({
        block: "start",
      });
    }
  };

  useEffect(() => {
    handleResetValues();
    handleScrollToBottom();
  }, [chat_id]);

  function debounceHandler(value) {
    const message = value ? `${user_name} is typing...` : "";
    socket.emit("participant-is-typing", { chat_url, message });
  }

  const handleTyping = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setContent(value);
    debounce(debounceHandler(value), 5000);
  };

  const handleSendMessage = () => {
    setContent("");
    setIsFileContainerOpen(false);
    dispatch({ type: "SET_FILES_UPLOADING", payload: [] });
    setIsEmojiPickerVisible(false);
    socket.emit("participant-is-typing", { chat_url, message: "" });

    //Check if there is any file to be uploaded
    const hasFiles = formData.entries().next().value;

    if (content || hasFiles) {
      const encryptedContent = encryptData(content);
      socket.emit(
        "new-message-sent",
        { content: encryptedContent, chat_url, chat_id, sender_id },
        async (payload) => {
          let { messageSent, chat_id, message_id, newMessage } = payload;
          if (messageSent) {
            if (hasFiles) {
              const attachments = filesUploading[chat_id];
              newMessage.attachments = attachments;
              payload.newMessage = newMessage;
            }
            dispatch({ type: "ADD_NEW_MESSAGE_TO_CHAT", payload });
          }

          if (hasFiles) {
            formData.append("chat_id", chat_id);
            formData.append("chat_url", chat_url);
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

          handleScrollToBottom();
        }
      );
    }
  };

  const handleClickAttachmentIcon = () => {
    selectFileRef.current.click();
  };

  const handleSelectAttachment = async (attachments, param) => {
    if (!attachments.length) return;
    let arr = [];

    for (let [key, value] of Object.entries(attachments)) {
      const { name = "", size = 0 } = value;
      const attachment = { key, name, size, isUploading: "In Progress" };
      formData.append(key, value);
      arr = arr.concat({ attachment });
    }

    const totalFileSize = arr.reduce(
      (acc, { attachment }) => acc + attachment.size,
      0
    );

    if (totalFileSize > 2000000) {
      dispatch({
        type: "TOGGLE_ALERT",
        payload: {
          isAlertVisible: true,
          content: `Maximum size for files is 2MB.`,
          type: "error",
        },
      });
      handleRemoveAllFiles();
      return;
    }

    filesUploading[chat_id] = arr;

    dispatch({
      type: "SET_FILES_UPLOADING",
      payload: filesUploading,
    });

    if (param === "openFileContainer") {
      setIsFileContainerOpen(true);
    } else if (param === "sendAudio") {
      handleSendMessage();
    }
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

  const handleRecordAudioMessage = () => {
    getMicrophonePermission();
  };

  const handleStopOrRestartRecording = () => {
    if (isRecording) {
      setRecordingStatus("stopRecording");
    } else if (hasStoppedRecording) {
      setRecordingStatus("recording");
    }
  };

  const handleDeleteRecording = () => {
    setRecordingStatus("inactive");
    setIsFileContainerOpen(false);
    mediaRecorder.current = null;
  };

  const handleSendRecording = () => {
    const audioName = `Recording_${new Date().valueOf()}.webm`;
    const audioFile = new File([audio], audioName);
    handleSelectAttachment([audioFile], "sendAudio");
    handleDeleteRecording();
  };

  const handleEmojiClick = (value) => {
    const { emoji = "" } = value;
    if (emoji) {
      const newContent = `${content}${emoji}`;
      setContent(newContent);
    }
  };

  return (
    <section
      className={`main-layout-container ${
        isDarkMode ? "main-layout-container-dark" : ""
      }`}
    >
      <>
        <TopSection selectedChat={selectedChat} />
        {isChatLoading ? (
          <div
            className={`body-section ${isDarkMode ? "body-section-dark" : ""}`}
          >
            {createArrayItems(6).map((sh, index) => (
              <div
                key={index}
                className={`message-container ${
                  index % 2
                    ? "message-container-align-right"
                    : "message-container-align-left"
                }`}
              >
                <span
                  className={`message-sender-photo message-sender-initial ${
                    isDarkMode ? "message-sender-initial-dark" : ""
                  } `}
                ></span>
                <div
                  className={`message-details message-shimmer-details shimmer-bg ${
                    isDarkMode ? "shimmer-bg-dark" : ""
                  }`}
                ></div>
              </div>
            ))}
          </div>
        ) : !messages.length ? (
          <div className="no-chat-section">
            <img src={NoChat} className="no-chat-svg" alt="" />
            <span>No message here</span>
          </div>
        ) : (
          <div
            className={`body-section ${isDarkMode ? "body-section-dark" : ""}`}
          >
            {messages.map((message, index) => {
              const { content = "", attachments = [], sender = {} } = message;
              const { isChatBot = false } = sender;
              return content || (attachments.length && !isChatBot) ? (
                <Message message={message} key={index} />
              ) : (
                ""
              );
            })}
            <div ref={messageSectionRef}></div>
          </div>
        )}
        {recordingStatus !== "inactive" && !isFileContainerOpen && (
          <div
            className={`recording-container ${
              isDarkMode ? "recording-container-dark" : ""
            }`}
          >
            <span className="recording-counter">
              Recording: {formatTime(counter)}
            </span>
            {isRecording && (
              <div className="spinner-square">
                {spinnerSquares.map((sq, index) => (
                  <div className={`square-${sq} square`} key={index}></div>
                ))}
              </div>
            )}
            <div className="recording-controls">
              <span
                className={`recording-btn ${
                  isRecording ? "recording-stop" : "recording-pause"
                }`}
                onClick={handleStopOrRestartRecording}
              >
                {isRecording ? "Stop" : hasStoppedRecording ? "Restart" : ""}
              </span>
              {hasStoppedRecording && (
                <span
                  className="recording-btn recording-stop"
                  onClick={handleDeleteRecording}
                >
                  Delete
                </span>
              )}
              <span
                className="recording-btn recording-start"
                onClick={handleSendRecording}
              >
                Send
              </span>
            </div>
          </div>
        )}
        {filesUploading[chat_id] && isFileContainerOpen && (
          <div
            className={`files-list-container ${
              isDarkMode ? "files-list-container-dark" : ""
            }`}
          >
            <IoMdClose
              className="files-list-close-button"
              onClick={() => handleRemoveAllFiles(false)}
            />
            <div className="files-list-content">
              {filesUploading[chat_id].map(({ attachment }, index) => {
                const { name = "", size = 0 } = attachment;
                return (
                  <div
                    className={`file-list-item ${
                      isDarkMode ? "file-list-item-dark" : ""
                    }`}
                    key={index}
                    title={name}
                  >
                    <IoMdClose
                      className="file-item-close-button"
                      title={name}
                      onClick={() => handleRemoveFile(name)}
                    />
                    <span className="file-item-name">{name}</span>
                    <span className="file-item-size">{formatBytes(size)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {!isChatLoading && (
          <div
            className={`type-message-section ${
              isDarkMode ? "type-message-section-dark" : ""
            }`}
          >
            <div
              className={`message-input-container ${
                isDarkMode ? "message-input-container-dark" : ""
              }`}
            >
              <input
                type="text"
                placeholder={
                  isTyping && !content ? typingMessage : "Type a message"
                }
                className={`input-field ${
                  isDarkMode ? "input-field-dark" : ""
                }`}
                onChange={(e) => handleTyping(e)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                value={content}
              />
              <span className="right-divider"></span>
              <div className="control-btns-container">
                <div className="emoji-container">
                  {isEmojiPickerVisible && (
                    <div className="emoji-picker-wrapper">
                      <EmojiPicker
                        onEmojiClick={(e) => handleEmojiClick(e)}
                        className="emoji-picker"
                      />
                    </div>
                  )}
                  <BsEmojiSmile
                    onClick={() =>
                      setIsEmojiPickerVisible(!isEmojiPickerVisible)
                    }
                    className="emoji-icon"
                  />
                </div>
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
                  ref={selectFileRef}
                  onInput={(e) =>
                    handleSelectAttachment(
                      [...e.target.files],
                      "openFileContainer"
                    )
                  }
                  multiple
                />
              </div>
            </div>
            <div
              className="send-button-container"
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <RiSendPlaneFill className="send-icon" />
            </div>
          </div>
        )}
      </>
    </section>
  );
}

export default memo(MainLayout);

import React from "react";
import { useStateValue } from "store/stateProvider";
import "./ChatParticipants.css";
import { generateInitials, isSameSender } from "utils";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

function ChatParticipants() {
  const { state = {} } = useStateValue();
  const {
    selectedChat = {},
    user = {},
    isMuteAndRemoveFeatureEnabled = false,
  } = state;
  const { participants = [], _id: chat_id = "" } = selectedChat;
  const { isDarkMode = false } = user;

  const handleMuteParticipant = (participant) => {
    console.log(chat_id);
  };

  const handleRemoveParticipant = (participant) => {};

  return (
    <div className="chat-participant-container">
      <div className="chat-participant-wrapper">
        {participants.map((participant, index) => {
          const checkSameSender = isSameSender(participant, user);
          participant = checkSameSender ? user : participant;
          const { name = "", photo = "" } = participant;

          return (
            <div className="chat-participant-single-wrapper" key={index}>
              {photo ? (
                <img
                  src={photo}
                  className="chat-participant-initial chat-participant-img"
                  alt=""
                />
              ) : (
                <span
                  className={`chat-participant-initial ${
                    isDarkMode && "chat-participant-initial-dark"
                  }`}
                  title={name}
                >
                  {generateInitials(name)}
                </span>
              )}
              <div className="chat-participant-col">
                <span>{name}</span>
                {checkSameSender && (
                  <span className="chat-participant-you">(You)</span>
                )}
              </div>
              {isMuteAndRemoveFeatureEnabled ? (
                <div className="chat-participant-access-wrapper">
                  <IoVolumeMuteOutline
                    title={`Mute this user - They can only see messages sent to this chat`}
                    className="chat-participant-icon"
                    onClick={() => handleMuteParticipant(participant)}
                  />
                  <MdDeleteOutline
                    title={`Remove - They would be removed entirely from this chat`}
                    className="chat-participant-icon"
                    onClick={() => handleRemoveParticipant(participant)}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatParticipants;

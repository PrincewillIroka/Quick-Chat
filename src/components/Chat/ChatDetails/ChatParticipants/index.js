import React from "react";
import { useStateValue } from "store/stateProvider";
import "./ChatParticipants.css";
import { generateInitials, isSameSender } from "utils";
// import { IoVolumeMuteOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

function ChatParticipants() {
  const { state = {}, dispatch } = useStateValue();
  const { selectedChat = {}, user = {} } = state;
  const { participants = [], creator_id = "" } = selectedChat;
  const { _id: user_id, isDarkMode = false } = user;
  const isChatCreator = creator_id === user_id;

  // const handleMuteParticipant = (participant) => {};

  const handleRemoveParticipant = (participant) => {
    dispatch({
      type: "TOGGLE_MODAL",
      payload: {
        type: "ConfirmationModal",
        title: "Remove Participant",
        subtitle: "Are you sure you want to remove this participant ?",
        participant,
      },
    });
  };

  return (
    <div className="chat-participant-container">
      <div className="chat-participant-wrapper">
        {participants.map((participant, index) => {
          const checkSameSender = isSameSender(participant, user);
          participant = checkSameSender ? user : participant;
          const { name = "", photo = "", isChatBot = false } = participant;

          return (
            <div
              className={`chat-participant-single-wrapper ${
                isDarkMode && "chat-participant-single-wrapper-dark"
              }`}
              key={index}
            >
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
              {isChatCreator && !isChatBot && !checkSameSender ? (
                <div className="chat-participant-access-wrapper">
                  {/* <IoVolumeMuteOutline
                    title={`Mute this user - They can only see messages sent to this chat`}
                    className="chat-participant-icon"
                    onClick={() => handleMuteParticipant(participant)}
                  /> */}
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

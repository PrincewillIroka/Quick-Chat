import React from "react";
import { useStateValue } from "store/stateProvider";
import "./ChatParticipants.css";
import { generateInitials, isSameSender } from "utils";

function ChatParticipants() {
  const { state = {} } = useStateValue();
  const { selectedChat = {}, user = {} } = state;
  const { participants = [] } = selectedChat;

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
                  className="chat-participant-initial"
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatParticipants;

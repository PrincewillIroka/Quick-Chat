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
        {participants.map((participant, index) => (
          <div className="chat-participant-single-wrapper" key={index}>
            {participant.photo ? (
              <img
                src={participant.photo}
                className="chat-participant-initial chat-participant-img"
                alt={participant.name}
              />
            ) : (
              <span
                className="chat-participant-initial"
                title={participant.name}
              >
                {generateInitials(participant.name)}
              </span>
            )}
            <div className="chat-participant-col">
              <span>{participant.name}</span>
              {isSameSender(participant, user) && (
                <span className="chat-participant-you">(You)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatParticipants;

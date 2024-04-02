const chatReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_NEW_CHAT": {
      let newChat = action.payload;
      let { chats = [], chatsClone = [] } = state;

      chats = [].concat([newChat], chats);
      chatsClone = [].concat([newChat], chatsClone);

      updateBrowserUrl(newChat);

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat: newChat,
      };
    }
    case "TOGGLE_SELECTED_CHAT": {
      const selectedChat = action.payload || {};

      updateBrowserUrl(selectedChat);

      return {
        ...state,
        selectedChat,
        filesUploading: [],
      };
    }
    case "GET_CHATS_SUCCESS": {
      const { chats = [] } = action.payload;

      return {
        ...state,
        chats,
        chatsClone: chats,
        isChatLoading: false,
      };
    }
    case "GET_NOTIFICATIONS_SUCCESS": {
      const { notifications = [] } = action.payload;

      return {
        ...state,
        notifications,
      };
    }
    case "ADD_NEW_MESSAGE_TO_CHAT": {
      let { chat_id, newMessage, chat_url } = action.payload;
      let {
        chats = [],
        chatsClone = [],
        selectedChat = {},
        participantsTypingInChat = {},
      } = state;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) {
        return { ...state };
      }

      const messages = chatToBeUpdated.messages || [];
      chatToBeUpdated.messages = [].concat(messages, [newMessage]);

      chats = updateChat(chats, chat_id, chatToBeUpdated);
      chatsClone = updateChat(chatsClone, chat_id, chatToBeUpdated);

      selectedChat =
        selectedChat._id === chat_id ? chatToBeUpdated : selectedChat;

      participantsTypingInChat[chat_url] = { isTyping: false, message: "" };

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat,
        participantsTypingInChat,
      };
    }
    case "SEARCH_CHATS": {
      const chatsClone = state.chatsClone;
      let searchText = action.payload;
      searchText = searchText.trim();

      let chats = chatsClone.filter((chat) => {
        const { participants = [], chat_name = "" } = chat;
        const participantsFound = participants.filter(
          (participant) =>
            participant.name.toLowerCase().includes(searchText) ||
            chat_name.toLowerCase().includes(searchText.toLowerCase())
        );
        return participantsFound.length;
      });
      const selectedChat = chats[0];

      return {
        ...state,
        selectedChat,
        chats,
        isViewingBookmarks: false,
      };
    }
    case "SEARCH_MESSAGES": {
      let { searchText, selectChatId } = action.payload;
      searchText = searchText.trim();
      let { chatsClone } = state;
      let selectedChat = {};

      const chatFound = Object.assign(
        {},
        chatsClone.find((chat) => chat._id === selectChatId)
      );

      if (!chatFound) {
        return { ...state };
      }

      if (searchText) {
        let messages = chatFound.messages;
        messages = messages.filter((msg) => {
          return msg.content.toLowerCase().includes(searchText.toLowerCase());
        });
        chatFound.messages = messages;
      }

      selectedChat = chatFound;

      return {
        ...state,
        selectedChat,
      };
    }
    case "ADD_PARTICIPANT_TO_CHAT": {
      let { chat_id, participant, newMessage = {} } = action.payload;
      let { chats = [], chatsClone = [], selectedChat = {} } = state;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) {
        return { ...state };
      }

      const { participants = [], messages = [] } = chatToBeUpdated;

      chatToBeUpdated.participants = [].concat(participants, [participant]);

      if (Object.entries(newMessage)) {
        chatToBeUpdated.messages = [].concat(messages, [newMessage]);
      }

      chats = updateChat(chats, chat_id, chatToBeUpdated);
      chatsClone = updateChat(chatsClone, chat_id, chatToBeUpdated);

      selectedChat =
        selectedChat._id === chat_id ? chatToBeUpdated : selectedChat;

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat,
      };
    }
    case "NEW_MESSAGE_NOTIFICATION": {
      const notification = action.payload;
      let { notifications } = state;
      notifications = notifications.concat([notification], notifications);

      return {
        ...state,
        notifications,
      };
    }
    case "VIEW_CHAT_FROM_NOTIFICATIONS": {
      const chat_id = action.payload;
      const { chats } = state;

      const selectedChat = chats.find((chat) => chat._id === chat_id);
      const { chat_url = "" } = selectedChat || {};

      if (chat_url) {
        const newUrl = window.location.origin + `/chat/${chat_url}`;
        window.history.replaceState(null, null, newUrl);
      }

      return {
        ...state,
        ...(Object.entries(selectedChat) && { selectedChat }),
      };
    }
    case "UPDATE_CHAT": {
      let { chat_id, updatedChat } = action.payload;
      let { chats = [], chatsClone = [], selectedChat = {} } = state;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) {
        return { ...state };
      }

      chats = chats.map((chat) => {
        if (chat._id === chat_id) {
          chat = updatedChat;
        }
        return chat;
      });

      chatsClone = chatsClone.map((chat) => {
        if (chat._id === chat_id) {
          chat = updatedChat;
        }
        return chat;
      });

      selectedChat = selectedChat._id === chat_id ? updatedChat : selectedChat;

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat,
      };
    }
    case "INCREASE_CHAT_NOTIFICATION_COUNT": {
      let { notifications_count = {}, selectedChat = {}, user = {} } = state;
      const { chat_id, participant = {} } = action.payload;

      const { _id: participantId = "" } = participant;
      const { _id: userId = "" } = user;

      if (participantId === userId) {
        return { ...state };
      }

      const selectedChatId = selectedChat._id;
      if (chat_id !== selectedChatId) {
        let chat_notification_count = notifications_count[chat_id] || 0;
        chat_notification_count = chat_notification_count + 1;
        notifications_count[chat_id] = chat_notification_count;
      }

      return {
        ...state,
        notifications_count,
      };
    }
    case "CLEAR_CHAT_NOTIFICATION_COUNT": {
      let { notifications_count } = state;
      let { chat_id } = action.payload;

      if (notifications_count[chat_id]) {
        delete notifications_count[chat_id];
      }

      return {
        ...state,
        notifications_count,
      };
    }
    case "RENAME_CHAT": {
      let { chats = [], chatsClone = [], selectedChat = {} } = state;
      const { chat_id, chat_name } = action.payload;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) {
        return { ...state };
      }

      if (chat_id === selectedChat._id) {
        selectedChat.chat_name = chat_name;
      }

      chats = renameChat(chats, chat_id, chat_name);

      chatsClone = renameChat(chatsClone, chat_id, chat_name);

      return {
        ...state,
        selectedChat,
        chats,
        chatsClone,
      };
    }
    case "DELETE_CHAT": {
      let { chats = [], chatsClone = [], selectedChat = {} } = state;
      const { chat_id } = action.payload;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) {
        return { ...state };
      }

      chats = deleteChat(chats, chat_id);
      chatsClone = deleteChat(chatsClone, chat_id);

      if (chat_id === selectedChat._id) {
        selectedChat = chats[0];
      }

      return {
        ...state,
        selectedChat,
        chats,
        chatsClone,
      };
    }
    case "REMOVE_CHAT_PARTICIPANT": {
      let { chats = [], chatsClone = [], selectedChat = {} } = state;
      const { chat_id, participant_id, newMessage } = action.payload;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) {
        return { ...state };
      }

      chats = removeChatParticipant(chats, {
        chat_id,
        participant_id,
        newMessage,
      });

      chatsClone = removeChatParticipant(chatsClone, {
        chat_id,
        participant_id,
        newMessage,
      });

      if (chat_id === selectedChat._id) {
        selectedChat = removeChatParticipantFromSelectedChat({
          selectedChat,
          participant_id,
          newMessage,
        });
      }

      return {
        ...state,
        selectedChat,
        chats,
        chatsClone,
      };
    }
    case "CHAT_PARTICIPANT_REMOVED": {
      let { chats = [], chatsClone = [], selectedChat = {}, user = {} } = state;
      const { chat_id, participant_id, newMessage } = action.payload;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) {
        return { ...state };
      }

      const { _id: userId = "" } = user;

      if (participant_id === userId) {
        chats = deleteChat(chats, chat_id);
        chatsClone = deleteChat(chatsClone, chat_id);

        if (chat_id === selectedChat._id) {
          selectedChat = chats[0];
        }
      } else {
        chats = removeChatParticipant(chats, {
          chat_id,
          participant_id,
          newMessage,
        });
        chatsClone = removeChatParticipant(chatsClone, {
          chat_id,
          participant_id,
          newMessage,
        });

        if (chat_id === selectedChat._id) {
          selectedChat = removeChatParticipantFromSelectedChat({
            selectedChat,
            participant_id,
            newMessage,
          });
        }
      }

      return {
        ...state,
        selectedChat,
        chats,
        chatsClone,
      };
    }
    default:
      return state;
  }
};

const updateBrowserUrl = (selectedChat) => {
  const { chat_url = "" } = selectedChat;
  if (chat_url) {
    const newUrl = window.location.origin + `/chat/${chat_url}`;
    window.history.replaceState(null, null, newUrl);
  }
};

const updateChat = (chats, chat_id, chatToBeUpdated) => {
  const updatedChats = chats.map((chat) => {
    if (chat._id === chat_id) {
      chat = chatToBeUpdated;
    }
    return chat;
  });
  return updatedChats;
};

const renameChat = (chats, chat_id, chat_name) => {
  const updatedChats = chats.map((chat) => {
    if (chat_id === chat._id) {
      chat.chat_name = chat_name;
    }
    return chat;
  });
  return updatedChats;
};

const deleteChat = (chats, chat_id) => {
  const updatedChats = chats.filter((chat) => chat_id !== chat._id);
  return updatedChats;
};

const removeChatParticipant = (
  chats,
  { chat_id, participant_id, newMessage }
) => {
  const updatedChats = chats.map((chat) => {
    if (chat_id === chat._id) {
      let { participants = [], access_rights = [], messages = [] } = chat;

      participants = participants.filter(
        (participant) => participant._id !== participant_id
      );
      access_rights = access_rights.filter(
        (access_right) => access_right !== participant_id
      );

      chat.participants = participants;
      chat.access_rights = access_rights;
      chat.messages = [].concat(messages, [newMessage]);
    }

    return chat;
  });
  return updatedChats;
};

const removeChatParticipantFromSelectedChat = ({
  selectedChat,
  participant_id,
  newMessage,
}) => {
  let { participants = [], access_rights = [], messages = [] } = selectedChat;

  participants = participants.filter(
    (participant) => participant._id !== participant_id
  );
  access_rights = access_rights.filter(
    (access_right) => access_right !== participant_id
  );

  selectedChat.participants = participants;
  selectedChat.access_rights = access_rights;
  selectedChat.messages = [].concat(messages, [newMessage]);

  return selectedChat;
};

export default chatReducer;

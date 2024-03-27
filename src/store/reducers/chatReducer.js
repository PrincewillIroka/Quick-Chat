const chatReducer = (state, action) => {
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
      let { chat_id, newMessage } = action.payload;
      let { chats = [], chatsClone = [], selectedChat = {} } = state;

      const chatToBeUpdated = chatsClone.find((chat) => chat._id === chat_id);

      if (!chatToBeUpdated) return;

      const messages = chatToBeUpdated.messages || [];
      chatToBeUpdated.messages = [].concat(messages, [newMessage]);

      chats = chats.map((chat) => {
        if (chat._id === chat_id) {
          chat = chatToBeUpdated;
        }
        return chat;
      });

      chatsClone = chatsClone.map((chat) => {
        if (chat._id === chat_id) {
          chat = chatToBeUpdated;
        }
        return chat;
      });

      selectedChat =
        selectedChat._id === chat_id ? chatToBeUpdated : selectedChat;

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat,
        participantTyping: { isTyping: false, message: "" },
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

      if (!chatFound) return;

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

      if (!chatToBeUpdated) return;

      const { participants = [], messages = [] } = chatToBeUpdated;

      chatToBeUpdated.participants = [].concat(participants, [participant]);

      if (Object.entries(newMessage)) {
        chatToBeUpdated.messages = [].concat(messages, [newMessage]);
      }

      chats = chats.map((chat) => {
        if (chat._id === chat_id) {
          chat = chatToBeUpdated;
        }
        return chat;
      });

      chatsClone = chatsClone.map((chat) => {
        if (chat._id === chat_id) {
          chat = chatToBeUpdated;
        }
        return chat;
      });

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

      if (!chatToBeUpdated) return;

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

export default chatReducer;

const chatReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NEW_CHAT": {
      let newChat = action.payload;
      let { chats = [], chatsClone = [], selectedChat = {} } = state;
      chats = [].concat([newChat], chats);
      chatsClone = [].concat([newChat], chatsClone);
      selectedChat = newChat;

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat,
      };
    }
    case "TOGGLE_SELECTED_CHAT": {
      return {
        ...state,
        selectedChat: action.payload,
        filesUploading: [],
      };
    }
    case "GET_CHATS_SUCCESS": {
      const chats = action.payload;
      return {
        ...state,
        chats,
        chatsClone: chats,
      };
    }
    case "UPDATE_CHAT": {
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
    default:
      return state;
  }
};

export default chatReducer;

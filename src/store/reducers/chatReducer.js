const chatReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_CHAT_SUCCESS": {
      const chats = [...state.chats, action.payload];
      return {
        ...state,
        chats,
        chatsClone: chats,
      };
    }
    case "TOGGLE_SELECTED_CHAT": {
      return {
        ...state,
        selectedChat: action.payload,
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
      let updatedChat = action.payload;
      let { chats = [], selectedChat = {} } = state;
      chats = chats.map((chat) =>
        chat._id === updatedChat._id ? updatedChat : chat
      );
      selectedChat =
        selectedChat._id === updatedChat._id ? updatedChat : selectedChat;

      return {
        ...state,
        chats,
        chatsClone: chats,
        selectedChat,
      };
    }
    case "SEARCH_CHATS": {
      const chatsClone = state.chatsClone;
      let searchText = action.payload;
      searchText = searchText.trim();

      let chats = chatsClone.filter((chat) => {
        const { participants = [] } = chat;
        const participantsFound = participants.filter((participant) =>
          participant.name.toLowerCase().includes(searchText)
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
    default:
      return state;
  }
};

export default chatReducer;

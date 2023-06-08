const chatReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_CHAT_SUCCESS": {
      return {
        ...state,
        chats: [...state, action.payload],
      };
    }
    case "TOGGLE_SELECTED_CHAT": {
      return {
        ...state,
        selectedChat: action.payload,
      };
    }
    case "GET_CHATS_SUCCESS": {
      return {
        ...state,
        chats: action.payload,
      };
    }
    case "UPDATE_CHAT": {
      let updatedChat = action.payload;
      let { chats, selectedChat } = state;
      chats = chats.map((chat) =>
        chat._id === updatedChat._id ? updatedChat : chat
      );
      selectedChat =
        selectedChat._id === updatedChat._id ? updatedChat : selectedChat;

      return {
        ...state,
        chats,
        selectedChat,
      };
    }
    default:
      return state;
  }
};

export default chatReducer;

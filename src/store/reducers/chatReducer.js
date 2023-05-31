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
    default:
      return state;
  }
};

export { chatReducer };

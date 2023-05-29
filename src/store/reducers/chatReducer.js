const chatReducer = (state, action) => {
  switch (action.type) {
    case "createNew": {
      return {
        ...state,
        chats: action.payload,
      };
    }
    case "toggleSelectedChat": {
      return {
        ...state,
        selectedChat: action.payload,
      };
    }
    default:
      return state;
  }
};

export { chatReducer };

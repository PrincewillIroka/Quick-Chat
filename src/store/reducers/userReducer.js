const userReducer = (state, action) => {
  switch (action.type) {
    case "GET_USER_SUCCESS": {
      return {
        ...state,
        user: action.payload,
      };
    }
    case "TOGGLE_ALERT": {
      return {
        ...state,
        alert: action.payload,
      };
    }
    case "SET_FILES_UPLOADING": {
      return {
        ...state,
        filesUploading: action.payload,
      };
    }
    case "UPDATE_FILE_UPLOADING_STATUS": {
      let { filesUploading, chats, chatsClone, selectedChat } = state;
      const { chat_id, message_id, attachment } = action.payload;
      const { key: attachmentKey } = attachment;

      let currentFileUploading = filesUploading[chat_id] || [];
      const updatedChat = chatsClone.find((ch) => ch._id === chat_id);
      let { messages = [] } = updatedChat;

      messages = messages.map((message) => {
        let { _id, attachments } = message;
        if (_id === message_id) {
          attachments = attachments.map(({ attachment: attch }) => {
            const { key: attchKey } = attch || {};
            if (attchKey === attachmentKey) {
              attch = attachment;
            }
            return { attachment: attch };
          });
          message["attachments"] = attachments;
        }
        return message;
      });

      updatedChat["messages"] = messages;

      chats = chats.map((chat) =>
        chat._id === updatedChat._id ? updatedChat : chat
      );
      chatsClone = chatsClone.map((chat) =>
        chat._id === updatedChat._id ? updatedChat : chat
      );
      selectedChat =
        selectedChat._id === updatedChat._id ? updatedChat : selectedChat;

      currentFileUploading = currentFileUploading.map(({ attachment: attch }) => {
        const { key: attchKey } = attch || {};
        if (attchKey === attachmentKey) {
          attch = attachment;
        }
        return { attachment: attch };
      });
      filesUploading[chat_id] = currentFileUploading;

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat,
        filesUploading,
      };
    }
    default:
      return state;
  }
};

export default userReducer;

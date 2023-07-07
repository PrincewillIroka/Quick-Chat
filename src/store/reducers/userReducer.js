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
        let { _id = "", attachments = [] } = message;
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

      currentFileUploading = currentFileUploading.map(
        ({ attachment: attch }) => {
          const { key: attchKey } = attch || {};
          if (attchKey === attachmentKey) {
            attch = attachment;
          }
          return { attachment: attch };
        }
      );
      filesUploading[chat_id] = currentFileUploading;

      return {
        ...state,
        chats,
        chatsClone,
        selectedChat,
        filesUploading,
      };
    }
    case "TOGGLE_MODAL": {
      return {
        ...state,
        visibleModal: action.payload,
      };
    }
    case "GET_BOOKMARKS": {
      return {
        ...state,
        bookmarks: action.payload,
      };
    }
    case "ADD_BOOKMARK": {
      let { bookmarks } = state;
      bookmarks = [].concat(bookmarks, action.payload);
      return {
        ...state,
        bookmarks,
      };
    }
    case "TOOGLED_BOOKMARKS": {
      const value = action.payload;
      let {
        chats,
        chatsClone,
        selectedChat,
        bookmarks = [],
        isViewingBookmarks = false,
      } = state;

      if (value === "all") {
        chats = chatsClone;
        selectedChat = chatsClone[0];
        isViewingBookmarks = false;
      } else {
        chats = chatsClone.filter((chat) => {
          const isBookmark = bookmarks.find(
            (bookmark) => bookmark.chat_id === chat._id
          );
          return isBookmark;
        });
        isViewingBookmarks = true;
      }

      return {
        ...state,
        chats,
        selectedChat,
        isViewingBookmarks,
      };
    }
    case "REMOVE_BOOKMARK": {
      const bookmark_id = action.payload;
      let { bookmarks } = state;

      bookmarks = bookmarks.filter((bookmark) => bookmark._id !== bookmark_id);

      return {
        ...state,
        bookmarks,
      };
    }
    default:
      return state;
  }
};

export default userReducer;

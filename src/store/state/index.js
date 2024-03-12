const initialState = {
  chats: [],
  chatsClone: [],
  selectedChat: {},
  user: {},
  alert: {
    isAlertVisible: false,
    content: "",
  },
  filesUploading: {},
  visibleModal: "",
  bookmarks: [],
  isViewingBookmarks: false,
  isChatLoading: true,
  isUserLoading: true,
  participantTyping: {
    isTyping: false,
    message: "",
  },
  notifications: [],
};

export default initialState;

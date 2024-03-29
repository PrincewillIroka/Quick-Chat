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
  participantsTypingInChat: {},
  notifications: [],
  notifications_count: {},
};

export default initialState;

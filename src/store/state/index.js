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
};

export default initialState;

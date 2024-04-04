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
  visibleModal: { type: "", title: "", subtitle: "" },
  bookmarks: [],
  isViewingBookmarks: false,
  isChatLoading: true,
  isUserLoading: true,
  participantsTypingInChat: {},
  notifications: [],
  notifications_count: {},
  isLeftSidebarVisible: false,
  isRightSidebarVisible: false,
};

export default initialState;

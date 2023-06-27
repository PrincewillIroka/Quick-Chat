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
    default:
      return state;
  }
};

export default userReducer;

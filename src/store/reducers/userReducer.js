const userReducer = (state, action) => {
  switch (action.type) {
    case "GET_USER_SUCCESS": {
      return {
        user: action.payload,
      };
    }
    default:
      return state;
  }
};

export { userReducer };

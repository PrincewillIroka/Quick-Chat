import chatReducer from "./chatReducer";
import userReducer from "./userReducer";

const reduceReducers =
  (...reducers) =>
  (prevState, value, ...args) =>
    reducers.reduce(
      (newState, reducer) => reducer(newState, value, ...args),
      prevState
    );

export default reduceReducers(userReducer, chatReducer);

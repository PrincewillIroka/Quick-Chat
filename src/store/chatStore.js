import { chatReducer } from "./reducers";
import { chatState } from "./state";

const chatStore = {
  reducer: chatReducer,
  initialState: chatState,
};

export { chatStore };

import { userReducer } from "./reducers";
import { userState } from "./state";

const userStore = {
  reducer: userReducer,
  initialState: userState,
};

export { userStore };

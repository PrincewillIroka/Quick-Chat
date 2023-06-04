import React, { useReducer, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";

import { authenticateUser } from "./services";
import { socketHandler } from "./sockets";

import { userStore } from "./store/userStore";
import { StateProvider } from "./store/stateProvider";
import { userReducer } from "./store/reducers";
import { userState } from "./store/state";

function App() {
  const [state, dispatch] = useReducer(userReducer, userState);

  const componentObj = {
    home: <Home />,
    chat: <Chat />,
  };

  useEffect(() => {
    authenticateUser().then((response) => {
      const user = response?.user;
      if (user) {
        dispatch({ type: "GET_USER_SUCCESS", payload: user });
      }
    });
    socketHandler(state, dispatch);
  }, [dispatch]);

  const renderWithProvider = (componentName) => {
    return (
      <StateProvider {...userStore}>
        {componentObj[componentName]}
      </StateProvider>
    );
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={renderWithProvider("home")}></Route>
        <Route path="/chat" element={renderWithProvider("chat")}></Route>
      </Routes>
    </Router>
  );
}

export default App;

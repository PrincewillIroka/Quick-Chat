import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import { StateProvider } from "./store/stateProvider";
import initialState from "./store/state";
import reducers from "./store/reducers";

function App() {
  const ChatComponent = () => (
    <StateProvider reducers={reducers} initialState={initialState}>
      <Chat />
    </StateProvider>
  );

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/chat" element={<ChatComponent />} />
        <Route path="/chat/:chatUrlParam" element={<ChatComponent />} />
      </Routes>
    </Router>
  );
}

export default App;

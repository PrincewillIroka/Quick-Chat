import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "components/Home";
import Chat from "components/Chat";
import { StateProvider } from "store/stateProvider";
import initialState from "store/state";
import reducers from "store/reducers";
import "./App.css";

function App() {
  return (
    <Router>
      <StateProvider reducers={reducers} initialState={initialState}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatUrlParam" element={<Chat />} />
        </Routes>
      </StateProvider>
    </Router>
  );
}

export default App;

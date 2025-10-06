import React from "react";
import { ChatProvider } from "./context/ChatProvider.jsx";
import { useChat } from "./context/useChat.jsx";
import Login from "./components/Login/page.jsx";
import Chat from "./components/Chat/page.jsx";
import "./App.css";

const AppContent = () => {
  const { user } = useChat();

  return (
    <div className="app-container">
      <div className="app-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      <div className="app-content">
        {!user ? <Login /> : <Chat />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default App;

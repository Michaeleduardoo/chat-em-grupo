import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ChatContext = createContext();

const getInitialState = () => {
  localStorage.removeItem("chatUser");

  return {
    user: null,
    messages: [],
    loading: false,
    error: null,
    onlineUsers: [],
    totalUsersCount: 0,
    stats: {
      totalMessages: 0,
      onlineUsersCount: 0,
      totalUsersCount: 0,
      fileStats: {
        totalFiles: 0,
        imageFiles: 0,
        audioFiles: 0,
        totalSize: 0,
        uploadsToday: 0,
      },
      activityStats: {
        messagesPerHour: 0,
        recentMessagesCount: 0,
      },
      uniqueUsersList: [],
    },
    socket: null,
    notifications: [],
  };
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      if (action.payload) {
        localStorage.setItem("chatUser", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("chatUser");
      }
      return { ...state, user: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_ONLINE_USERS":
      return { ...state, onlineUsers: action.payload };
    case "SET_TOTAL_USERS_COUNT":
      return { ...state, totalUsersCount: action.payload };
    case "SET_STATS":
      return { ...state, stats: action.payload };
    case "SET_SOCKET":
      return { ...state, socket: action.payload };
    case "UPDATE_USERS":
      return {
        ...state,
        onlineUsers: action.payload.onlineUsers,
        totalUsersCount: action.payload.totalUsersCount,
        stats: {
          ...state.stats,
          onlineUsersCount: action.payload.onlineUsers?.length || 0,
        },
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, getInitialState());

  const fetchMessages = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.get("/messages");
      dispatch({ type: "SET_MESSAGES", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erro ao carregar mensagens" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const sendMessage = async (content, type) => {
    try {
      const message = {
        content,
        sender: state.user,
        type,
      };

      const response = await axios.post("/messages", message);
      dispatch({ type: "ADD_MESSAGE", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erro ao enviar mensagem" });
      throw error;
    }
  };

  const editMessage = async (messageId, newContent) => {
    try {
      const response = await axios.put(`/messages/${messageId}`, {
        content: newContent,
        sender: state.user,
      });

      const updatedMessages = state.messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, edited: true }
          : msg
      );

      dispatch({ type: "SET_MESSAGES", payload: updatedMessages });
      return response.data;
    } catch (error) {
      console.error("Erro ao editar mensagem:", error);
      dispatch({ type: "SET_ERROR", payload: "Erro ao editar mensagem" });
      throw error;
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erro no upload do arquivo" });
      throw error;
    }
  };

  const setUser = (user) => {
    dispatch({ type: "SET_USER", payload: user });

    if (user && !state.socket) {
      const socket = io("http://localhost:3000");
      dispatch({ type: "SET_SOCKET", payload: socket });

      socket.emit("user-join", user);

      socket.on("users-updated", (data) => {
        dispatch({ type: "UPDATE_USERS", payload: data });

        dispatch({
          type: "SET_STATS",
          payload: {
            ...state.stats,
            onlineUsersCount: data.onlineUsers?.length || 0,
          },
        });
      });

      const heartbeatInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit("user-heartbeat", user);
        }
      }, 30000);

      socket.on("disconnect", () => {
        clearInterval(heartbeatInterval);
      });
    }

    if (!user && state.socket) {
      state.socket.disconnect();
      dispatch({ type: "SET_SOCKET", payload: null });
    }
  };

  const logout = () => {
    localStorage.removeItem("chatUser");
    dispatch({ type: "SET_USER", payload: null });

    dispatch({ type: "SET_MESSAGES", payload: [] });
    dispatch({ type: "SET_ONLINE_USERS", payload: [] });
    dispatch({ type: "SET_NOTIFICATIONS", payload: [] });

    if (state.socket) {
      state.socket.disconnect();
      dispatch({ type: "SET_SOCKET", payload: null });
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await axios.get("/users/online");
      const onlineUsers = response.data?.onlineUsers || [];
      dispatch({ type: "SET_ONLINE_USERS", payload: onlineUsers });

      dispatch({
        type: "SET_STATS",
        payload: {
          ...state.stats,
          onlineUsersCount: onlineUsers.length,
        },
      });
    } catch (error) {
      dispatch({ type: "SET_ONLINE_USERS", payload: [] });
      dispatch({
        type: "SET_STATS",
        payload: {
          ...state.stats,
          onlineUsersCount: 0,
        },
      });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("/stats");
      const stats = response.data || {};
      dispatch({ type: "SET_STATS", payload: stats });
    } catch (error) {
      dispatch({
        type: "SET_STATS",
        payload: {
          totalMessages: 0,
          onlineUsersCount: 0,
          totalUsersCount: 0,
          uniqueUsersList: [],
          fileStats: {
            totalFiles: 0,
            imageFiles: 0,
            audioFiles: 0,
            totalSize: 0,
            uploadsToday: 0,
          },
          activityStats: {
            messagesPerHour: 0,
            recentMessagesCount: 0,
          },
        },
      });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const addNotification = (message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration,
    };
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });

    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  useEffect(() => {
    if (state.user) {
      fetchMessages();
      fetchOnlineUsers();
      fetchStats();

      const interval = setInterval(() => {
        fetchMessages();
        fetchStats();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [state.user]);

  const value = {
    ...state,
    fetchMessages,
    sendMessage,
    editMessage,
    uploadFile,
    setUser,
    logout,
    clearError,
    fetchOnlineUsers,
    fetchStats,
    addNotification,
    removeNotification,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat deve ser usado dentro de um ChatProvider");
  }
  return context;
};

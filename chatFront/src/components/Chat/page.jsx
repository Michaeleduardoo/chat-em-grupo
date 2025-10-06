import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import MessageList from "../MessageList/page.jsx";
import FileUploadModal from "../FileUploadModal/page.jsx";
import Popconfirm from "../Popconfirm/page.jsx";
import LogoutLoading from "../LogoutLoading/page.jsx";
import OnlineUsers from "../OnlineUsers/page.jsx";
import ChatStats from "../ChatStats/page.jsx";
import MobileMenu from "../MobileMenu/page.jsx";
import TypingIndicator from "../TypingIndicator/page.jsx";
import EmojiPicker from "../EmojiPicker/page.jsx";
import ToastNotification from "../ToastNotification/page.jsx";
import {
  MdChat,
  MdLogout,
  MdLightMode,
  MdDarkMode,
  MdSend,
  MdAttachFile,
  MdCheckCircle,
  MdMessage,
  MdEmojiEmotions,
  MdKeyboardArrowDown,
  MdMenu,
} from "react-icons/md";
import "./style.css";
import "../MobileMenu/style.css";

const Chat = () => {
  const {
    user,
    messages,
    loading,
    error,
    clearError,
    sendMessage,
    logout,
    uploadFile,
    onlineUsers,
    stats,
    notifications,
    removeNotification,
  } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isUserScrolling]);

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    setIsUserScrolling(true);

    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1500);
  };

  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;

    const container = messagesContainerRef.current;
    const threshold = 100;
    return (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - threshold
    );
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (isNearBottom() || !isUserScrolling) {
        scrollToBottom();
      }
    }
  }, [messages, isUserScrolling, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isLight = savedTheme === "light";
    setIsLightMode(isLight);
    document.documentElement.setAttribute(
      "data-theme",
      isLight ? "light" : "dark"
    );
  }, []);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    try {
      let content = messageText;

      if (replyToMessage) {
        content = `Respondendo a ${replyToMessage.sender}: ${messageText}`;
      }

      await sendMessage(content, "text");
      setInputValue("");
      setReplyToMessage(null);
      setTypingUsers([]);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyToMessage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = {
      "image/jpeg": "image",
      "image/png": "image",
      "audio/mpeg": "audio",
      "audio/wav": "audio",
    };

    if (!allowedTypes[file.type]) {
      alert("Tipo de arquivo não permitido. Use JPG, PNG, MP3 ou WAV.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    setSelectedFile(file);
    setShowFileModal(true);
    e.target.value = "";
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const fileUrl = await uploadFile(selectedFile);
      const fileType = selectedFile.type.startsWith("image/")
        ? "image"
        : "audio";
      await sendMessage(fileUrl, fileType);
      setShowFileModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar arquivo. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setShowFileModal(false);
    setSelectedFile(null);
  };

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "light" : "dark"
    );
    localStorage.setItem("theme", newTheme ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("theme");
  };

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);

    logoutTimeoutRef.current = setTimeout(() => {
      handleLogout();
    }, 2000);
  };

  const handleLogoutCancel = () => {
    console.log("Logout cancelado");
  };

  const handleCancelLogout = () => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    setIsLoggingOut(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEmojiSelect = (emoji) => {
    setInputValue((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() && !typingUsers.includes(user)) {
      setTypingUsers((prev) => [...prev, user]);
    } else if (!value.trim() && typingUsers.includes(user)) {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    }
  };

  const handleInputFocus = () => {
    setShowEmojiPicker(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (loading && messages.length === 0) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando mensagens...</div>
      </div>
    );
  }

  return (
    <div className="modern-chat-container">
      <div className="chat-navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <MdChat size={24} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">ChatGrupo</h1>
            <p className="brand-subtitle">Conecte-se com sua equipe</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="user-profile-mini">
            <div className="avatar avatar-sm">{getInitials(user)}</div>
            <span className="user-name-mini">{user}</span>
            <div className="status-dot status-online"></div>
          </div>

          <div className="navbar-buttons">
            <button
              className="nav-btn mobile-menu-btn"
              onClick={toggleMobileMenu}
              title="Abrir menu"
              aria-label="Abrir menu"
            >
              <MdMenu size={20} />
            </button>

            <button
              className="nav-btn"
              onClick={toggleTheme}
              title="Alternar tema"
              aria-label="Alternar tema"
            >
              {isLightMode ? (
                <MdDarkMode size={20} />
              ) : (
                <MdLightMode size={20} />
              )}
            </button>

            <Popconfirm
              title="Deseja sair do chat?"
              onConfirm={handleLogoutConfirm}
              onCancel={handleLogoutCancel}
              confirmText="Sair"
              cancelText="Cancelar"
              placement="bottom"
            >
              <button
                className="nav-btn logout-btn"
                title="Sair do chat"
                aria-label="Sair do chat"
              >
                <MdLogout size={18} />
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>

      <div className="chat-layout">
        <div className="chat-sidebar-modern">
          <div className="sidebar-section">
            <OnlineUsers onlineUsers={onlineUsers} currentUser={user} />
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <MdMessage size={20} />
              Estatísticas
            </h3>
            <ChatStats
              stats={stats}
              messagesCount={messages.length}
              onlineUsers={onlineUsers}
              messages={messages}
            />
          </div>
        </div>

        <div className="chat-main-modern">
          <div className="chat-header-modern">
            <div className="chat-info">
              <h2 className="chat-room-title"># Geral</h2>
            </div>

            <div className="chat-actions-modern">
              <p className="chat-room-desc">
                {onlineUsers.length} membros online • {messages.length}{" "}
                mensagens
              </p>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <span className="error-text">{error}</span>
              <button
                onClick={clearError}
                className="error-close"
                aria-label="Fechar erro"
              >
                ×
              </button>
            </div>
          )}

          <div
            className="messages-container-modern"
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {messages.length === 0 ? (
              <div className="welcome-state">
                <div className="welcome-illustration">
                  <button
                    className="welcome-icon welcome-icon-btn"
                    onClick={scrollToTop}
                    title="Ir para o início das mensagens"
                  >
                    <MdMessage size={64} />
                    <div className="scroll-indicator">
                      <MdKeyboardArrowDown size={24} />
                    </div>
                  </button>
                  <div className="welcome-particles">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                  </div>
                </div>
                <h3 className="welcome-title">Bem-vindo ao ChatGrupo!</h3>
                <p className="welcome-description">
                  Seja o primeiro a enviar uma mensagem e comece uma conversa
                  incrível com sua equipe.
                </p>
                <p className="welcome-hint">
                  💡 Clique no ícone acima para começar a digitar
                </p>
                <div className="welcome-tips">
                  <div className="tip">💡 Use @nome para mencionar alguém</div>
                  <div className="tip">📎 Anexe imagens e áudios</div>
                  <div className="tip">
                    😊 Adicione emojis para expressar-se
                  </div>
                </div>
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUser={user}
                onReply={handleReply}
              />
            )}

            <div className="typing-indicator-modern">
              <TypingIndicator users={typingUsers} />
            </div>
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-modern">
            {replyToMessage && (
              <div className="reply-bar">
                <div className="reply-content">
                  <div className="reply-header">
                    <span className="reply-label">
                      Respondendo a {replyToMessage.sender}
                    </span>
                    <button
                      type="button"
                      className="reply-cancel"
                      onClick={cancelReply}
                      title="Cancelar resposta"
                    >
                      ×
                    </button>
                  </div>
                  <div className="reply-text">
                    {replyToMessage.content.length > 80
                      ? `${replyToMessage.content.substring(0, 80)}...`
                      : replyToMessage.content}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="input-form">
              <div className="input-container">
                <textarea
                  id="chat-message-input"
                  name="chat-message-input"
                  ref={inputRef}
                  className="message-input-modern-field"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  maxLength={200}
                  disabled={isUploading}
                  aria-label="Digite sua mensagem"
                  autoComplete="off"
                />

                <div className="input-actions">
                  <button
                    type="button"
                    className="input-action-btn"
                    title="Escolher emoji"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    disabled={isUploading}
                    aria-label="Escolher emoji"
                  >
                    <MdEmojiEmotions size={20} />
                  </button>

                  <button
                    type="button"
                    className="input-action-btn"
                    title="Anexar arquivo"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    aria-label="Anexar arquivo"
                  >
                    {isUploading ? (
                      <MdCheckCircle size={20} />
                    ) : (
                      <MdAttachFile size={20} />
                    )}
                  </button>

                  <button
                    type="submit"
                    className="input-action-btn send-btn"
                    disabled={!inputValue.trim() || isUploading}
                    title="Enviar mensagem"
                    aria-label="Enviar mensagem"
                  >
                    <MdSend size={18} />
                  </button>
                </div>
              </div>

              <div className="char-limit">
                {inputValue.length > 180 && (
                  <span
                    className={`char-warning ${
                      inputValue.length > 190 ? "critical" : ""
                    }`}
                  >
                    {200 - inputValue.length} caracteres restantes
                  </span>
                )}
              </div>
            </form>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,audio/mpeg,audio/wav"
              style={{ display: "none" }}
              aria-label="Selecionar arquivo"
            />
          </div>
        </div>
      </div>

      <FileUploadModal
        file={selectedFile}
        isOpen={showFileModal}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
        isUploading={isUploading}
      />

      <LogoutLoading isVisible={isLoggingOut} onCancel={handleCancelLogout} />

      <EmojiPicker
        isOpen={showEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        onClose={() => setShowEmojiPicker(false)}
      />

      {notifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          isVisible={true}
          message={notification.message}
          type={notification.type}
          duration={0}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <MobileMenu
        onlineUsers={onlineUsers}
        currentUser={user}
        stats={stats}
        messagesCount={messages.length}
        messages={messages}
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </div>
  );
};

export default Chat;

import { useState } from "react";
import {
  MdContentCopy,
  MdReply,
  MdEdit,
  MdCheck,
  MdClose,
  MdCheckCircle,
} from "react-icons/md";
import AudioPlayer from "../AudioPlayer/page.jsx";
import { useChat } from "../../context/useChat.jsx";
import "./style.css";

const Message = ({
  message,
  isOwn,
  showAvatar = true,
  showTime = true,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onReply,
}) => {
  const { addNotification } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [copySuccess, setCopySuccess] = useState(false);
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      addNotification("Mensagem copiada!", "success", 2000);
    } catch (err) {
      console.error("Erro ao copiar mensagem:", err);
      const textArea = document.createElement("textarea");
      textArea.value = message.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      addNotification("Mensagem copiada!", "success", 2000);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(message.content);
    onEdit && onEdit(message.id);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.content) {
      onSaveEdit && onSaveEdit(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(message.content);
    setIsEditing(false);
    onCancelEdit && onCancelEdit();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const renderContent = () => {
    if (isEditing && isOwn && message.type === "text") {
      return (
        <div className="message-edit-container">
          <textarea
            id="message-edit-input"
            name="message-edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="message-edit-input"
            maxLength={200}
            autoFocus
            rows={Math.min(editText.split("\n").length, 4)}
            autoComplete="off"
          />
          <div className="message-edit-actions">
            <button
              onClick={handleSaveEdit}
              className="message-edit-btn message-edit-save"
              title="Salvar (Enter)"
            >
              <MdCheck />
            </button>
            <button
              onClick={handleCancelEdit}
              className="message-edit-btn message-edit-cancel"
              title="Cancelar (Esc)"
            >
              <MdClose />
            </button>
          </div>
        </div>
      );
    }

    switch (message.type) {
      case "text":
        return (
          <div className="message-text">
            {message.content.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        );

      case "image":
        return (
          <div className="message-media">
            <div className="message-image">
              <img
                src={message.content}
                alt="Imagem enviada"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div
                style={{
                  display: "none",
                  padding: "var(--space-4)",
                  textAlign: "center",
                  color: "var(--text-tertiary)",
                }}
              >
                Erro ao carregar imagem
              </div>
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="message-media">
            <div className="message-audio">
              <AudioPlayer
                src={message.content}
                fileName={message.fileName || "Áudio"}
              />
            </div>
          </div>
        );

      default:
        return <div className="message-text">{message.content}</div>;
    }
  };

  return (
    <div className={`message ${isOwn ? "own-message" : ""}`}>
      {showAvatar && (
        <div className="message-avatar">{getInitials(message.sender)}</div>
      )}

      <div className="message-content">
        {!isOwn && showAvatar && (
          <div className="message-header">
            <span className="message-sender">{message.sender}</span>
            {showTime && (
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
            )}
          </div>
        )}

        <div className="message-bubble">
          {renderContent()}

          {isOwn && showTime && (
            <div
              className="message-time"
              style={{ marginTop: "var(--space-2)", textAlign: "right" }}
            >
              {formatTime(message.timestamp)}
              {message.edited && (
                <span className="message-edited" title="Mensagem editada">
                  (editado)
                </span>
              )}
            </div>
          )}
        </div>

        <div className="message-actions">
          <button
            className={`message-action-btn ${
              copySuccess ? "copy-success" : ""
            }`}
            onClick={copyMessage}
            title={copySuccess ? "Mensagem copiada!" : "Copiar mensagem"}
          >
            {copySuccess ? <MdCheckCircle /> : <MdContentCopy />}
          </button>
          {!isOwn && (
            <button
              className="message-action-btn"
              onClick={handleReply}
              title="Responder"
            >
              <MdReply />
            </button>
          )}
          {isOwn && message.type === "text" && !isEditing && (
            <button
              className="message-action-btn"
              onClick={handleEdit}
              title="Editar mensagem"
            >
              <MdEdit />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;

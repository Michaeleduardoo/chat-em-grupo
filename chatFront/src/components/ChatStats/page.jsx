import React from "react";
import {
  MdMessage,
  MdPeople,
  MdAttachFile,
  MdStorage,
  MdTrendingUp,
  MdPerson,
} from "react-icons/md";
import "./style.css";

const ChatStats = ({
  stats = {},
  messagesCount = 0,
  onlineUsers = [],
  messages = [],
}) => {
  const formatNumber = (num) => {
    const number = Number(num) || 0;
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const imageFiles =
    stats.fileStats?.imageFiles ||
    (Array.isArray(messages)
      ? messages.filter((msg) => msg.type === "image").length
      : 0);
  const audioFiles =
    stats.fileStats?.audioFiles ||
    (Array.isArray(messages)
      ? messages.filter((msg) => msg.type === "audio").length
      : 0);
  const totalFiles = stats.fileStats?.totalFiles || imageFiles + audioFiles;
  const messagesPerHour = stats.activityStats?.messagesPerHour || 0;

  const finalMessagesCount = stats.totalMessages || messagesCount || 0;

  const onlineCount =
    stats.onlineUsersCount !== undefined
      ? stats.onlineUsersCount
      : Array.isArray(onlineUsers)
      ? onlineUsers.length
      : 0;

  const statItems = [
    {
      icon: MdMessage,
      label: "Mensagens",
      value: finalMessagesCount,
      color: "rgb(15, 23, 42)",
      description: `Total de mensagens no chat`,
    },
    {
      icon: MdPeople,
      label: "Online",
      value: onlineCount,
      color: "#10b981",
      description: `Usuários conectados agora`,
    },
    {
      icon: MdAttachFile,
      label: "Arquivos",
      value: totalFiles,
      color: "#8b5cf6",
      description: `Total de arquivos compartilhados (${imageFiles} imagens, ${audioFiles} áudios)`,
    },
  ];

  return (
    <div className="chat-stats-section">
      <div className="stats-grid">
        {statItems.map((item, index) => (
          <div key={index} className="stat-item" title={item.description}>
            <div className="stat-icon" style={{ backgroundColor: item.color }}>
              <item.icon size={16} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatNumber(item.value)}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatStats;

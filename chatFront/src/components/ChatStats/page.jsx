import React from "react";
import { MdMessage, MdPeople, MdAttachFile, MdPerson } from "react-icons/md";
import "./style.css";

const ChatStats = ({
  stats = {},
  messagesCount = 0,
  messages = [],
  totalUsersCount = 0,
  uniqueUsersCount = 0,
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

  const finalMessagesCount = stats.totalMessages || messagesCount || 0;

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
      value: totalUsersCount,
      color: "#10b981",
      description: `Usuários conectados agora`,
    },
    {
      icon: MdPerson,
      label: "Total Usuários",
      value: uniqueUsersCount,
      color: "#f59e0b",
      description: `Usuários únicos que já entraram no chat`,
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

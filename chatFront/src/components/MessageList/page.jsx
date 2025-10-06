import React from 'react';
import { useChat } from '../../context/ChatContext.jsx';
import Message from '../Message/page.jsx';
import './style.css';

const MessageList = ({ messages, currentUser, onReply }) => {
  const { editMessage } = useChat();

  const handleEditMessage = (messageId, newContent) => {
    editMessage(messageId, newContent);
  };
  const groupMessagesByDay = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dayKey = date.toDateString();
      
      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      
      groups[dayKey].push(message);
    });
    
    return groups;
  };

  const formatDayLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const messageGroups = groupMessagesByDay(messages);
  const dayKeys = Object.keys(messageGroups).sort((a, b) => new Date(a) - new Date(b));

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="message-list">
      {dayKeys.map(dayKey => (
        <div key={dayKey}>
          <div className="day-separator">
            <span className="day-separator-text">
              {formatDayLabel(dayKey)}
            </span>
          </div>
          
          {messageGroups[dayKey].map((message, index) => {
            const isOwn = message.sender === currentUser;
            const prevMessage = index > 0 ? messageGroups[dayKey][index - 1] : null;
            const nextMessage = index < messageGroups[dayKey].length - 1 ? messageGroups[dayKey][index + 1] : null;
            
            const showAvatar = !prevMessage || prevMessage.sender !== message.sender;
            const showTime = !nextMessage || nextMessage.sender !== message.sender;
            
            return (
              <Message
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showTime={showTime}
                onSaveEdit={handleEditMessage}
                onReply={onReply}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
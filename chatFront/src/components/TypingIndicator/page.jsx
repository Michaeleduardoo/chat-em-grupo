import "./style.css";

const TypingIndicator = ({ users = [] }) => {
  if (!users || users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} está digitando...`;
    } else if (users.length === 2) {
      return `${users[0]} e ${users[1]} estão digitando...`;
    } else {
      return `${users[0]} e ${users.length - 1} outros estão digitando...`;
    }
  };

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
      <span className="typing-text">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;

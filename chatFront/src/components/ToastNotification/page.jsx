import { useEffect } from "react";
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdPersonAdd, MdPersonRemove } from "react-icons/md";
import "./style.css";

const ToastNotification = ({
  isVisible,
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <MdCheckCircle size={20} />;
      case "error":
        return <MdError size={20} />;
      case "warning":
        return <MdWarning size={20} />;
      case "info":
        return <MdInfo size={20} />;
      case "user-joined":
        return <MdPersonAdd size={20} />;
      case "user-left":
        return <MdPersonRemove size={20} />;
      default:
        return <MdCheckCircle size={20} />;
    }
  };

  return (
    <div className={`toast-notification toast-${type}`}>
      <div className="toast-content">
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-message">{message}</div>
        <button
          className="toast-close"
          onClick={onClose}
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;

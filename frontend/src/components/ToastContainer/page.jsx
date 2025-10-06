import React from "react";
import ToastNotification from "../ToastNotification/page.jsx";
import "./style.css";

const ToastContainer = ({ notifications, onRemoveNotification }) => {
  return (
    <div className="toast-container">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="toast-wrapper"
          style={{
            transform: `translateY(${index * 80}px)`,
            zIndex: 10000 - index,
          }}
        >
          <ToastNotification
            isVisible={true}
            message={notification.message}
            type={notification.type}
            duration={notification.duration || 0}
            onClose={() => onRemoveNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

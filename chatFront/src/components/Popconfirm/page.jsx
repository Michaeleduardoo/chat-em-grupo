import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const Popconfirm = ({ 
  children, 
  title, 
  onConfirm, 
  onCancel,
  confirmText = "Sim", 
  cancelText = "Não",
  placement = "top"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popupRef = useRef(null);

  const showConfirm = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 200;
      const popupHeight = 120;
      
      let top, left;
      
      switch (placement) {
        case 'top':
          top = rect.top - popupHeight - 10;
          left = rect.left + (rect.width - popupWidth) / 2;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width - popupWidth) / 2;
          break;
        case 'left':
          top = rect.top + (rect.height - popupHeight) / 2;
          left = rect.left - popupWidth - 10;
          break;
        case 'right':
          top = rect.top + (rect.height - popupHeight) / 2;
          left = rect.right + 10;
          break;
        default:
          top = rect.top - popupHeight - 10;
          left = rect.left + (rect.width - popupWidth) / 2;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 10) left = 10;
      if (left + popupWidth > viewportWidth - 10) left = viewportWidth - popupWidth - 10;
      if (top < 10) top = 10;
      if (top + popupHeight > viewportHeight - 10) top = viewportHeight - popupHeight - 10;

      setPosition({ top, left });
    }
    setIsVisible(true);
  };

  const hideConfirm = () => {
    setIsVisible(false);
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
    hideConfirm();
  };

  const handleCancel = () => {
    onCancel && onCancel();
    hideConfirm();
  };

  const handleKeyDown = (e) => {
    if (isVisible) {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter') {
        handleConfirm();
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', (e) => {
        if (!popupRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) {
          hideConfirm();
        }
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  return (
    <div className="popconfirm-container">
      <div 
        ref={triggerRef}
        onClick={showConfirm}
        className="popconfirm-trigger"
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={popupRef}
          className={`popconfirm-popup popconfirm-${placement}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          <div className="popconfirm-content">
            <div className="popconfirm-title">
              {title}
            </div>
            <div className="popconfirm-actions">
              <button 
                onClick={handleCancel}
                className="popconfirm-btn popconfirm-cancel"
              >
                {cancelText}
              </button>
              <button 
                onClick={handleConfirm}
                className="popconfirm-btn popconfirm-confirm"
              >
                {confirmText}
              </button>
            </div>
          </div>
          <div className={`popconfirm-arrow popconfirm-arrow-${placement}`}></div>
        </div>
      )}
    </div>
  );
};

export default Popconfirm;

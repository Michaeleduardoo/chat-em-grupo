import { MdWavingHand } from "react-icons/md";
import "./style.css";

const LogoutLoading = ({ isVisible, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="logout-loading-overlay">
      <div className="logout-loading-modal">
        <div className="logout-loading-content">
          <div className="logout-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="logout-text">
            <h3>Saindo do chat...</h3>
            <p>
              Até logo! <MdWavingHand />
            </p>
          </div>
          {onCancel && (
            <button
              className="logout-cancel-btn"
              onClick={onCancel}
              aria-label="Cancelar logout"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutLoading;

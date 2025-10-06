import { MdClose, MdPerson, MdMessage } from "react-icons/md";
import OnlineUsers from "../OnlineUsers/page.jsx";
import ChatStats from "../ChatStats/page.jsx";
import "./style.css";

const MobileMenu = ({
  onlineUsers = [],
  currentUser = null,
  stats = {},
  messagesCount = 0,
  messages = [],
  isOpen = false,
  onClose = () => {},
}) => {
  return (
    <>
      {isOpen && <div className="mobile-menu-overlay" onClick={onClose}></div>}

      <div className={`mobile-menu ${isOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-header">
          <h3 className="mobile-menu-title">Menu</h3>
          <button
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Fechar menu"
            title="Fechar menu"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <div className="mobile-menu-section">
            <div className="mobile-menu-section-header">
              <h4 className="mobile-menu-section-title">
                <MdPerson size={20} />
                Usuários Online
              </h4>
            </div>
            <div className="mobile-menu-section-content">
              <OnlineUsers
                onlineUsers={onlineUsers}
                currentUser={currentUser}
              />
            </div>
          </div>

          <div className="mobile-menu-section">
            <div className="mobile-menu-section-header">
              <h4 className="mobile-menu-section-title">
                <MdMessage size={20} />
                Estatísticas
              </h4>
            </div>
            <div className="mobile-menu-section-content">
              <ChatStats
                stats={stats}
                messagesCount={messagesCount}
                onlineUsers={onlineUsers}
                messages={messages}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

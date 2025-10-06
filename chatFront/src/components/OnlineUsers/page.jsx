import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { MdPerson, MdCircle } from "react-icons/md";
import "./style.css";

const OnlineUsers = ({ onlineUsers = [], currentUser = null }) => {
  const previousUsersRef = useRef([]);

  const getInitials = useCallback((name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const formatJoinTime = useCallback((joinedAt) => {
    if (!joinedAt) return "Agora";

    const now = new Date();
    const joinTime = new Date(joinedAt);
    const diffInMinutes = Math.floor((now - joinTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  }, []);


  const usersList = useMemo(
    () => (Array.isArray(onlineUsers) ? onlineUsers : []),
    [onlineUsers]
  );

  useEffect(() => {
    previousUsersRef.current = usersList;
  }, [usersList]);

  const displayUsers = useMemo(() => {
    // Sempre mostra a lista de usuários online, mesmo se estiver vazia
    return usersList;
  }, [usersList]);

  return (
    <div className="online-users-section">
      <div className="section-header">
        <h3 className="sidebar-title">
          <MdPerson size={20} />
          Usuários Online
        </h3>
        <span className="online-count">{displayUsers.length}</span>
      </div>


      <div className="online-users-list">
        {displayUsers.length === 0 ? (
          <div className="empty-users">
            <p>Nenhum usuário online</p>
          </div>
        ) : (
          displayUsers.map((user, index) => (
            <div key={user?.socketId || index} className="online-user-item">
              <div className="user-avatar-container">
                <div className="user-avatar">{getInitials(user?.username)}</div>
                <div className="status-indicator status-online"></div>
              </div>
              <div className="user-info">
                <div className="user-name">{user?.username || "Usuário"}</div>
                <div className="user-status">
                  {formatJoinTime(user?.joinedAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;

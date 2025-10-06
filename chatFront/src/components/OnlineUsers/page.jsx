import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { MdPerson, MdCircle } from "react-icons/md";
import "./style.css";

const OnlineUsers = ({ onlineUsers = [], currentUser = null }) => {
  const previousUsersRef = useRef([]);
  const [userChanges, setUserChanges] = useState([]);

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

  const clearNotification = useCallback((change) => {
    setUserChanges((prev) =>
      prev.filter(
        (c) =>
          !(
            c.type === change.type &&
            c.username === change.username &&
            c.timestamp === change.timestamp
          )
      )
    );
  }, []);

  const usersList = useMemo(
    () => (Array.isArray(onlineUsers) ? onlineUsers : []),
    [onlineUsers]
  );

  const currentUsernames = useMemo(
    () => usersList.map((user) => user.username).sort(),
    [usersList]
  );

  useEffect(() => {
    if (previousUsersRef.current.length === 0) {
      previousUsersRef.current = usersList;
      return;
    }

    const previousUsernames = previousUsersRef.current
      .map((user) => user.username)
      .sort();

    const hasChanged =
      JSON.stringify(currentUsernames) !== JSON.stringify(previousUsernames);

    if (!hasChanged) {
      previousUsersRef.current = usersList;
      return;
    }

    const newUsers = currentUsernames.filter(
      (username) => !previousUsernames.includes(username)
    );
    const leftUsers = previousUsernames.filter(
      (username) => !currentUsernames.includes(username)
    );

    if (newUsers.length > 0 || leftUsers.length > 0) {
      const changes = [];
      const now = Date.now();

      newUsers.forEach((username) => {
        if (username !== currentUser) {
          changes.push({ type: "joined", username, timestamp: now });
        }
      });
      leftUsers.forEach((username) => {
        if (username !== currentUser) {
          changes.push({ type: "left", username, timestamp: now });
        }
      });

      if (changes.length > 0) {
        setUserChanges((prev) => {
          const existingKeys = new Set(
            prev.map((change) => `${change.type}-${change.username}`)
          );
          const newChanges = changes.filter(
            (change) => !existingKeys.has(`${change.type}-${change.username}`)
          );
          return [...prev, ...newChanges];
        });

        changes.forEach((change) => {
          setTimeout(() => {
            setUserChanges((prev) =>
              prev.filter(
                (c) =>
                  !(
                    c.type === change.type &&
                    c.username === change.username &&
                    c.timestamp === change.timestamp
                  )
              )
            );
          }, 3000);
        });
      }
    }

    previousUsersRef.current = usersList;
  }, [currentUsernames, currentUser]);

  const displayUsers = useMemo(() => {
    return usersList.length > 0
      ? usersList
      : currentUser
      ? [
          {
            username: currentUser,
            joinedAt: new Date().toISOString(),
            socketId: "current-user",
          },
        ]
      : [];
  }, [usersList, currentUser]);

  return (
    <div className="online-users-section">
      <div className="section-header">
        <h3 className="sidebar-title">
          <MdPerson size={20} />
          Usuários Online
        </h3>
        <span className="online-count">{displayUsers.length}</span>
      </div>

      {userChanges.length > 0 && (
        <div className="user-changes-notification">
          {userChanges.map((change, index) => (
            <div
              key={`${change.type}-${change.username}-${change.timestamp}`}
              className={`change-notification ${change.type}`}
            >
              <span className="notification-content">
                {change.type === "joined" ? "✅" : "❌"} {change.username}{" "}
                {change.type === "joined" ? "entrou" : "saiu"}
              </span>
              <button
                className="close-notification"
                onClick={() => clearNotification(change)}
                aria-label="Fechar notificação"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

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

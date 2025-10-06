import { useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import { MdChat, MdAttachFile, MdEmojiEmotions } from "react-icons/md";
import "./style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser(username.trim());
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="modern-login-container">
      <div className="login-card-modern">
        <div className="login-header-modern">
          <div className="login-logo-modern">
            {username ? getInitials(username) : <MdChat size={40} />}
          </div>
          <div className="login-brand">
            <h1 className="login-title-modern">ChatGrupo</h1>
            <p className="login-subtitle-modern">
              Bem-vindo! Conecte-se com sua equipe
            </p>
          </div>
        </div>

        <div className="login-body-modern">
          <form className="login-form-modern" onSubmit={handleSubmit}>
            <div className="form-group-modern">
              <label htmlFor="username" className="form-label-modern">
                Seu nome
              </label>
              <div className="input-wrapper-modern">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                  disabled={loading}
                  minLength={2}
                  maxLength={50}
                  className="input-modern"
                  autoComplete="name"
                />
                <div className="input-glow"></div>
              </div>
            </div>

            <button
              type="submit"
              className={`btn-modern login-btn ${loading ? "loading" : ""}`}
              disabled={loading || !username.trim()}
            >
              <span className="btn-text">
                {loading ? "Conectando..." : "Entrar no ChatGrupo"}
              </span>
              {loading && <div className="btn-spinner"></div>}
            </button>
          </form>
        </div>

        <div className="login-footer-modern">
          <div className="features-preview">
            <div className="feature">
              <span className="feature-icon">
                <MdChat size={24} />
              </span>
              <span className="feature-text">Chat em tempo real</span>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <MdAttachFile size={24} />
              </span>
              <span className="feature-text">Compartilhe arquivos</span>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <MdEmojiEmotions size={24} />
              </span>
              <span className="feature-text">Expressões e emojis</span>
            </div>
          </div>
          <p className="terms-text">
            Ao entrar, você concorda com nossos termos de uso e política de
            privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

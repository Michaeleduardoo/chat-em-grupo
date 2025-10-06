import { useState, useRef } from "react";
import { useChat } from "../../context/useChat.jsx";
import FilePreview from "../FilePreview/page.jsx";
import { MdAttachFile, MdSend, MdHourglassEmpty } from "react-icons/md";
import "./style.css";

const MessageInput = ({
  onFilePreview,
  showFilePreview,
  previewFile,
  onCancelPreview,
}) => {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { sendMessage, uploadFile } = useChat();
  const fileInputRef = useRef(null);

  const MAX_TEXT_LENGTH = 200;
  const remainingChars = MAX_TEXT_LENGTH - text.length;

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() && !isUploading) {
      try {
        await sendMessage(text.trim(), "text");
        setText("");
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = {
      "image/jpeg": "image",
      "image/png": "image",
      "audio/mpeg": "audio",
      "audio/wav": "audio",
    };

    if (!allowedTypes[file.type]) {
      alert("Tipo de arquivo não permitido. Use JPG, PNG, MP3 ou WAV.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    onFilePreview(file);
    e.target.value = "";
  };

  const handleSendFile = async () => {
    if (!previewFile || isUploading) return;

    setIsUploading(true);
    try {
      const fileUrl = await uploadFile(previewFile);
      const fileType = previewFile.type.startsWith("image/")
        ? "image"
        : "audio";
      await sendMessage(fileUrl, fileType);
      onCancelPreview();
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar arquivo. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      {showFilePreview && (
        <FilePreview
          file={previewFile}
          onSend={handleSendFile}
          onCancel={onCancelPreview}
          isUploading={isUploading}
        />
      )}

      <form onSubmit={handleTextSubmit} className="message-input-form">
        <div className="input-group">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="file-button"
            disabled={isUploading}
            aria-label="Enviar arquivo"
          >
            <MdAttachFile />
          </button>

          <input
            id="file-input"
            name="file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,audio/mpeg,audio/wav"
            style={{ display: "none" }}
            aria-label="Selecionar arquivo"
          />

          <div className="text-input-container">
            <textarea
              id="message-text"
              name="message-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              maxLength={MAX_TEXT_LENGTH}
              disabled={isUploading}
              className="text-input"
              rows="1"
              aria-label="Digite sua mensagem"
              autoComplete="off"
            />

            <div className="char-counter">{remainingChars}</div>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || isUploading || remainingChars < 0}
            className="send-button"
            aria-label="Enviar mensagem"
          >
            {isUploading ? <MdHourglassEmpty /> : <MdSend />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;

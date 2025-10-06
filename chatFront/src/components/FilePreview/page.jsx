import React from "react";
import "./style.css";

const FilePreview = ({ file, onSend, onCancel, isUploading }) => {
  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="file-preview">
      <div className="preview-header">
        <h3>Preview do Arquivo</h3>
        <button
          onClick={onCancel}
          className="close-button"
          disabled={isUploading}
          aria-label="Fechar preview"
        >
          ×
        </button>
      </div>

      <div className="preview-content">
        <div className="file-info">
          <div className="file-name">{file.name}</div>
          <div className="file-size">{formatFileSize(file.size)}</div>
        </div>

        <div className="preview-area">
          {isImage && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview da imagem"
                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
              />
            </div>
          )}

          {isAudio && (
            <div className="audio-preview">
              <audio controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
                Seu navegador não suporta o elemento de áudio.
              </audio>
            </div>
          )}
        </div>
      </div>

      <div className="preview-actions">
        <button
          onClick={onCancel}
          className="cancel-button"
          disabled={isUploading}
        >
          Cancelar
        </button>
        <button onClick={onSend} className="send-button" disabled={isUploading}>
          {isUploading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default FilePreview;

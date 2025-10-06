import React from "react";
import {
  MdMusicNote,
  MdImage,
  MdDescription,
  MdVideoFile,
  MdAttachFile,
  MdCloudUpload,
  MdCheckCircle,
} from "react-icons/md";
import "./style.css";

const FileUploadModal = ({
  file,
  isOpen,
  onConfirm,
  onCancel,
  isUploading,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isUploading) {
      onCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !isUploading) {
      onCancel();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isUploading]);

  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");
  const isVideo = file.type.startsWith("video/");
  const isDocument =
    file.type.includes("pdf") ||
    file.type.includes("document") ||
    file.type.includes("text");

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = () => {
    if (isImage) return <MdImage size={48} />;
    if (isAudio) return <MdMusicNote size={48} />;
    if (isVideo) return <MdVideoFile size={48} />;
    if (isDocument) return <MdDescription size={48} />;
    return <MdAttachFile size={48} />;
  };

  const getFileTypeLabel = () => {
    if (isImage) return "Imagem";
    if (isAudio) return "Áudio";
    if (isVideo) return "Vídeo";
    if (isDocument) return "Documento";
    return "Arquivo";
  };

  return (
    <div className="file-modal-overlay" onClick={handleOverlayClick}>
      <div className="file-modal">
        <div className="file-modal-header">
          <div className="header-content">
            <div className="header-icon">
              <MdCloudUpload size={24} />
            </div>
            <div className="header-text">
              <h3>Deseja enviar este arquivo?</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="file-modal-close"
            disabled={isUploading}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className="file-modal-content">
          <div className="file-info-card">
            <div className="file-icon-container">{getFileIcon()}</div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-meta">
                <span className="file-size">
                  {formatFileSize(file.size)} • {getFileTypeLabel()}
                </span>
              </div>
            </div>
          </div>

          <div className="file-preview-area">
            {isImage && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview da imagem"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                </div>
                <div className="image-info">
                  <div className="image-name">{file.name}</div>
                  <div className="image-size">{formatFileSize(file.size)}</div>
                </div>
              </div>
            )}

            {isAudio && (
              <div className="audio-preview">
                <div className="audio-icon">
                  <MdMusicNote size={48} />
                </div>
                <audio controls>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            )}

            {!isImage && !isAudio && (
              <div className="generic-preview">
                <div className="generic-icon">{getFileIcon()}</div>
                <p className="preview-text">Preview não disponível</p>
              </div>
            )}
          </div>
        </div>

        <div className="file-modal-actions">
          <button
            onClick={onCancel}
            className="cancel-btn"
            disabled={isUploading}
          >
            <span>Cancelar</span>
          </button>
          <button
            onClick={onConfirm}
            className={`confirm-btn ${isUploading ? "loading" : ""}`}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <MdCloudUpload size={18} />
                <span>Enviar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;

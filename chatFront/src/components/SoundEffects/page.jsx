import { useRef, useEffect } from "react";

const SoundEffects = ({ playNotification = false, playMessage = false }) => {
  const notificationAudioRef = useRef(null);
  const messageAudioRef = useRef(null);

  useEffect(() => {
    if (!notificationAudioRef.current) {
      notificationAudioRef.current = new Audio();
      notificationAudioRef.current.src =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzqBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBS13yO/eizEIHWq+8+OWT";
    }

    if (!messageAudioRef.current) {
      messageAudioRef.current = new Audio();
      messageAudioRef.current.src =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzqBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBS13yO/eizEIHWq+8+OWT";
    }
  }, []);

  useEffect(() => {
    if (playNotification && notificationAudioRef.current) {
      notificationAudioRef.current.volume = 0.3;
      notificationAudioRef.current.play().catch((e) => {
        console.log("Erro ao reproduzir som de notificação:", e);
      });
    }
  }, [playNotification]);

  useEffect(() => {
    if (playMessage && messageAudioRef.current) {
      messageAudioRef.current.volume = 0.2;
      messageAudioRef.current.play().catch((e) => {
        console.log("Erro ao reproduzir som de mensagem:", e);
      });
    }
  }, [playMessage]);

  return null;
};

export default SoundEffects;

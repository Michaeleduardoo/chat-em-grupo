import React, { useState, useRef, useEffect } from 'react';
import { MdEmojiEmotions, MdClose } from 'react-icons/md';
import './style.css';

const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  const emojiPickerRef = useRef(null);

  const emojiCategories = {
    smileys: {
      name: 'Smileys',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
    },
    hearts: {
      name: 'Corações',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸']
    },
    gestures: {
      name: 'Gestos',
      emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸']
    },
    objects: {
      name: 'Objetos',
      emojis: ['🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁', '🍭', '🍬', '🍫', '🍩', '🍪', '🥧', '🍯', '🍮', '🍨', '🍧', '🍦', '🥤', '🍻', '🍺', '🍷', '🥂', '🍾', '🍶', '🍵', '☕', '🥃', '🍸', '🍹', '🍼', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪', '🍳', '🥚', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🥘', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯']
    }
  };

  const filteredEmojis = emojiCategories[selectedCategory]?.emojis.filter(emoji =>
    emoji.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="emoji-picker-overlay">
      <div ref={emojiPickerRef} className="emoji-picker">
        <div className="emoji-picker-header">
          <h3>Escolher Emoji</h3>
          <button className="emoji-picker-close" onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>

        <div className="emoji-picker-search">
          <input
            id="emoji-search"
            name="emoji-search"
            type="text"
            placeholder="Buscar emoji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="emoji-search-input"
            autoComplete="off"
          />
        </div>

        <div className="emoji-picker-categories">
          {Object.entries(emojiCategories).map(([key, category]) => (
            <button
              key={key}
              className={`emoji-category-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="emoji-picker-grid">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={index}
              className="emoji-btn"
              onClick={() => handleEmojiClick(emoji)}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;

import style from "./MessageInput.module.css";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { EmojiClickData } from "emoji-picker-react";

function MessageInput({ chatId }: { chatId: string | undefined }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Handle clicking outside of emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = useCallback((emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

  const handlerSendMessage = async (
    e: React.MouseEvent | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      formData.append("content", message);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chats/${chatId}/message`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: formData,
        }
      );

      if (res.ok) {
        setMessage("");
        setFile(null);
      }
    } catch (err) {
      console.error("Error sending message: ", err);
    }
  };

  return (
    <div className={style.inputContainer}>
      <div className={style.fileInputWrapper}>
        <input
          type="file"
          id="file-upload"
          className={style.fileInput}
          onChange={async (e) => {
            const uploadedFile = e.target.files?.[0];
            if (!uploadedFile) return;

            setFile(uploadedFile);
            if (!message) {
              setMessage(uploadedFile.name);
            }
          }}
        />
        <label htmlFor="file-upload" className={style.fileInputLabel}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 9h-3V3h-9v6h-3L12 16.5L19.5 9zm-6 0V6h3v3h-3z"
              fill="currentColor"
            />
            <path d="M5 19v2h14v-2H5z" fill="currentColor" />
          </svg>
          {file && <span className={style.fileName}>{file.name}</span>}
        </label>
      </div>
      <div className={style.emojiPickerWrapper}>
        <button
          ref={emojiButtonRef}
          className={style.emojiButton}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Open emoji picker"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5C14 10.3284 14.6716 11 15.5 11Z"
              fill="currentColor"
            />
            <path
              d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z"
              fill="currentColor"
            />
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 17.5C14.33 17.5 16.32 16.04 17.12 14H6.88C7.68 16.04 9.67 17.5 12 17.5Z"
              fill="currentColor"
            />
          </svg>
        </button>
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className={style.emojiPickerContainer}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
      <textarea
        className={style.messageInput}
        placeholder="Type a message..."
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            handlerSendMessage(e);
          }
        }}
      />
      <button
        className={style.sendButton}
        aria-label="Send message"
        onClick={(e) => handlerSendMessage(e)}
        disabled={message.length < 1}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}

export default MessageInput;

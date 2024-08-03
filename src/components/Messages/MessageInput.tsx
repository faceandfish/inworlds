import React, { KeyboardEvent, useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-5 w-full bg-white ">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="outline-none w-full h-16 bg-transparent"
        placeholder="输入消息..."
      />
      <div className="flex justify-end mb-5">
        <button
          onClick={handleSubmit}
          className="hover:text-orange-500 bg-orange-100 text-orange-400 py-2 px-8 rounded mt-auto"
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

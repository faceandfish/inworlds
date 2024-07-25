"use client";
import React, { useState } from "react";

export default function AuthorNote() {
  const [message, setMessage] = useState("");
  const maxLength = 500; // 设置最大字符数

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里添加提交留言的逻辑
    console.log("提交的留言:", message);
    // 可以在这里添加API调用来保存留言
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">作者留言</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            您的留言
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-orange-500"
            placeholder="请在这里写下您想对读者说的话..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={maxLength}
          ></textarea>
          <p className="text-sm text-gray-500 mt-2">
            {message.length}/{maxLength} 字符
          </p>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            提交留言
          </button>
        </div>
      </form>
    </div>
  );
}

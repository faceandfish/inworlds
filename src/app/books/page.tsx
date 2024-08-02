"use client";
import {
  BookHeader,
  BookDescription,
  ChapterList,
  ContentTabs,
} from "@/components/Book";
import Navbar from "@/components/Navbar";

import { mockBooks, mockUser, mockComments } from "@/mockData";

import React, { useState } from "react";
import { BookInfo, Comment, UserInfo } from "../lib/definitions";
import CommentItem from "@/components/CommentItem";

interface BookPageProps {
  book: BookInfo;
  author: UserInfo;
  comments: Comment[];
}

const page: React.FC<BookPageProps> = (
  {
    // 注释掉实际的 props
    // book,
    // author,
    // comments,
  }
) => {
  const [activeTab, setActiveTab] = useState<"comments" | "chapters">(
    "comments"
  );

  const handleLike = (id: number) => {
    console.log(`Like comment ${id}`);
    // 实现点赞逻辑
  };

  const handleReply = (id: number) => {
    console.log(`Reply to comment ${id}`);
    // 实现回复逻辑
  };
  // 使用假数据
  const book = mockBooks[0];
  const author = mockUser;
  const comments = mockComments;
  const chapters = [
    { number: "第一章", title: "椒鹽炸杏鮑菇" },
    { number: "第二章", title: "美味的冒險" },
    { number: "第三章", title: "神秘的食譜" },
    { number: "第四章", title: "廚房的魔法" },
  ];

  return (
    <>
      <Navbar />
      <div className="w-5/6 mx-auto">
        <BookHeader book={book} author={author} />
        <BookDescription book={book} />
        <div className="mt-10">
          <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="">
            {activeTab === "comments" && (
              <div className="divide-y">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    {...comment}
                    onLike={handleLike}
                    onReply={handleReply}
                    isAdminView={false}
                  />
                ))}
              </div>
            )}
            {activeTab === "chapters" && <ChapterList book={book} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

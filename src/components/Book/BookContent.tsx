// components/BookContent.tsx

"use client";

import React, { useState } from "react";
import { ChapterList, ContentTabs } from "@/components/Book";
import CommentItem from "@/components/CommentItem";
import { BookInfo, CommentInfo, ChapterInfo } from "@/app/lib/definitions";

interface BookContentProps {
  book: BookInfo;
  comments: CommentInfo[];
  chapters: ChapterInfo[];
}

export function BookContent({ book, comments, chapters }: BookContentProps) {
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

  return (
    <div className="mt-10 h-screen">
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
        {activeTab === "chapters" && (
          <ChapterList chapters={chapters} book={book} />
        )}
      </div>
    </div>
  );
}

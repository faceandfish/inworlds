"use client";

import React, { useState } from "react";
import { ChapterList, ContentTabs } from "@/components/Book";
import CommentItem from "@/components/CommentItem";
import {
  BookInfo,
  CommentInfo,
  ChapterInfo,
  PaginatedData
} from "@/app/lib/definitions";
import { likeComment, replyToComment } from "@/app/lib/action";

interface BookContentProps {
  book: BookInfo;
  comments: CommentInfo[];
  chapters: ChapterInfo[];
  chaptersPagination: PaginatedData<ChapterInfo>;
  commentsPagination: PaginatedData<CommentInfo>;
}

export function BookContent({
  book,
  comments,
  chapters
}: // chaptersPagination,
// commentsPagination
BookContentProps) {
  const [activeTab, setActiveTab] = useState<"comments" | "chapters">(
    "comments"
  );

  const handleLike = async (id: number) => {
    try {
      await likeComment(id);
      // 这里可以添加状态更新逻辑
      console.log(`Liked comment ${id}`);
    } catch (error) {
      console.error(`Error liking comment ${id}:`, error);
    }
  };

  const handleReply = async (id: number, content: string) => {
    try {
      await replyToComment(id, content);
      // 这里可以添加状态更新逻辑
      console.log(`Replied to comment ${id}`);
    } catch (error) {
      console.error(`Error replying to comment ${id}:`, error);
    }
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

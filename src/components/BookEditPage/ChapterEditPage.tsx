"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ChapterInfo, BookInfo } from "@/app/lib/definitions";
import ContentEditor from "../WritingPage/ContentEditor";

const ChapterEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const chapterId = params.chapterId as string;

  // 硬编码的书籍数据
  const book: BookInfo = {
    id: 1,
    title: "我的第一本小说",
    description: "这是一个关于冒险和友谊的故事。",
    authorName: "张三",
    authorId: 1,
    authorAvatarUrl: "/path/to/avatar.jpg",
    category: "children-story",
    ageRating: "allAges",
    coverImageUrl: "/path/to/cover.jpg",
    wordCount: 50000,
    lastSaved: "2023-08-23T12:00:00Z",
    createdAt: "2023-08-01T10:00:00Z",
    latestChapterNumber: 10,
    latestChapterTitle: "最新章节标题",
    followersCount: 100,
    commentsCount: 50,
    status: "ongoing",
    publishStatus: "published"
  };

  // 硬编码的章节数据
  const [chapter, setChapter] = useState<ChapterInfo>({
    id: 21,
    bookId: 1,
    chapterNumber: 1,
    title: "启程",
    content: "<p>在遥远的未来，人类已经开始了星际探索的伟大冒险...</p>",
    createdAt: "2023-06-01T00:00:00Z",
    lastModified: "2023-06-02T10:00:00Z",
    wordCount: 3000,
    authorNote: "希望读者能喜欢这个故事"
  });

  const handleChapterUpdate = (updatedChapter: ChapterInfo) => {
    setChapter(updatedChapter);
    // 在实际应用中，这里会调用 API 来保存更新
    console.log("Chapter updated:", updatedChapter);
  };

  const handleReturn = () => {
    // 在本地存储中设置一个标志
    localStorage.setItem("activeSection", "chapters");
    router.push(`/writing/${bookId}`);
  };

  return (
    <div className="container mx-auto bg-white   px-20 ">
      <div className=" py-6 px-10">
        <ContentEditor
          chapter={chapter}
          onChapterUpdate={handleChapterUpdate}
        />
      </div>

      <div className="my-10 flex justify-center gap-10">
        <button
          onClick={handleReturn}
          className="bg-neutral-400 hover:bg-neutral-500 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          返回章节列表
        </button>
        <div>
          <button
            onClick={() => console.log("Save draft")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 transition duration-300"
          >
            保存草稿
          </button>
          <button
            onClick={() => console.log("Publish chapter")}
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            发布章节
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditPage;

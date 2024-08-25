import React, { useState, useEffect } from "react";
import { BookInfo, ChapterInfo } from "@/app/lib/definitions";
import ContentEditor from "../WritingPage/ContentEditor";

interface NewChapterProps {
  book: BookInfo | null;
  bookId: string;
  onSave: (newChapter: ChapterInfo) => void;
  onCancel: () => void;
}

const NewChapter: React.FC<NewChapterProps> = ({
  book,
  bookId,
  onSave,

  onCancel
}) => {
  const [newChapter, setNewChapter] = useState<ChapterInfo>(() => ({
    id: 0,
    bookId: parseInt(bookId),
    chapterNumber: book?.latestChapterNumber ? book.latestChapterNumber + 1 : 1,
    title: "",
    content: "",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    wordCount: 0
  }));

  useEffect(() => {
    if (book) {
      setNewChapter((prevChapter) => ({
        ...prevChapter,
        chapterNumber: book.latestChapterNumber + 1
      }));
    }
  }, [book]);

  const handleNewChapterUpdate = (updatedChapter: ChapterInfo) => {
    setNewChapter(updatedChapter);
  };

  const handleSave = () => {
    onSave(newChapter);
  };

  return (
    <div className="transition-all duration-300 px-20 w-full">
      <ContentEditor
        chapter={newChapter}
        onChapterUpdate={handleNewChapterUpdate}
      />
      <div className=" flex gap-10 my-20 ">
        <button
          onClick={onCancel}
          className="bg-neutral-300 hover:bg-neutral-400 hover:text-white text-neutral-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          保存新章节
        </button>
      </div>
    </div>
  );
};

export default NewChapter;

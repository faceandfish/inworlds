"use client";
import React, { useState, useEffect, useCallback } from "react";
import { BookInfo, ChapterInfo } from "@/app/lib/definitions";
import ContentEditor from "../WritingPage/ContentEditor";
import Alert from "../Alert";
import { useRouter } from "next/navigation";

interface NewChapterProps {
  book: BookInfo | null;
  bookId: number;
  onSave: (
    newChapter: Partial<ChapterInfo>
  ) => Promise<{ success: boolean; data?: ChapterInfo }>;
}

const NewChapter: React.FC<NewChapterProps> = ({ book, bookId, onSave }) => {
  const [newChapter, setNewChapter] = useState<Partial<ChapterInfo>>({
    bookId,
    chapterNumber: book!.latestChapterNumber + 1,
    title: "",
    content: "",
    publishStatus: "draft"
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const router = useRouter();

  useEffect(() => {
    if (book) {
      setNewChapter((prev) => ({
        ...prev,
        chapterNumber: book.latestChapterNumber + 1
      }));
    }
  }, [book]);

  const handleContentChange = (updatedFields: Partial<ChapterInfo>) => {
    console.log("Content changed:", updatedFields);
    setNewChapter((prev) => ({ ...prev, ...updatedFields }));
  };

  const resetChapterContent = () => {
    console.log("Resetting chapter content");
    setNewChapter((prev) => ({
      ...prev,
      title: "",
      content: ""
    }));
  };
  const setAlertState = useCallback(
    (show: boolean, message: string, type: "success" | "error") => {
      console.log("Setting alert state:", { show, message, type });
      setShowAlert(show);
      setAlertMessage(message);
      setAlertType(type);
    },
    []
  );

  const saveChapterChanges = async (publishStatus: "draft" | "published") => {
    if (!newChapter.title || !newChapter.content) {
      console.log("Chapter title or content is empty");
      setAlertState(true, "章节标题和内容不能为空", "error");
      return;
    }

    const chapterToSave: Partial<ChapterInfo> = {
      ...newChapter,
      publishStatus,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount: newChapter.content?.length || 0
    };
    console.log("Chapter to save:", chapterToSave);

    try {
      const result = await onSave(chapterToSave);
      console.log("Save result:", result);

      if (result.success) {
        const message =
          publishStatus === "draft" ? "章节已保存为草稿" : "新章节发布成功";
        setAlertState(true, message, "success");
        resetChapterContent();
      } else {
        setAlertState(true, "保存章节失败", "error");
      }
    } catch (error) {
      console.error("Error saving chapter:", error);
      setAlertState(true, "保存章节时发生错误", "error");
    }
  };

  const handleSaveDraft = () => saveChapterChanges("draft");
  const handlePublishChapter = () => saveChapterChanges("published");

  return (
    <div className="transition-all duration-300 px-20 w-full">
      <ContentEditor
        chapter={newChapter as ChapterInfo}
        onContentChange={handleContentChange}
      />
      <div className="flex justify-end gap-10 mb-20">
        <button
          onClick={handlePublishChapter}
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          发布新章节
        </button>
        <button
          onClick={handleSaveDraft}
          className="bg-neutral-400 hover:bg-neutral-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          保存草稿箱
        </button>
      </div>
      {showAlert &&
        (console.log("Rendering Alert component"),
        (
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setShowAlert(false)}
          />
        ))}
    </div>
  );
};

export default NewChapter;

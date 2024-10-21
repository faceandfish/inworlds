"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChapterInfo, BookInfo } from "@/app/lib/definitions";
import ContentEditor from "../WritingPage/ContentEditor";
import Alert from "../Main/Alert";
import {
  getBookDetails,
  getChapterContent,
  updateChapter
} from "@/app/lib/action";
import { useTranslation } from "../useTranslation";

const ChapterEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const bookId = Number(params.bookId as string);
  const chapterNumber = Number(params.chapterNumber as string);
  const { t } = useTranslation("bookedit");

  const [book, setBook] = useState<BookInfo | null>(null);
  const [chapter, setChapter] = useState<ChapterInfo | null>(null);
  const [localChapter, setLocalChapter] = useState<ChapterInfo | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookResponse, chapterResponse] = await Promise.all([
          getBookDetails(bookId),
          getChapterContent(bookId, chapterNumber)
        ]);

        if (bookResponse.code === 200 && bookResponse.data) {
          setBook(bookResponse.data);
        } else {
          throw new Error(bookResponse.msg || "获取书籍信息失败");
        }

        if (chapterResponse.code === 200 && chapterResponse.data) {
          setChapter(chapterResponse.data);
          setLocalChapter(chapterResponse.data);
        } else {
          throw new Error(chapterResponse.msg || "获取章节内容失败");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "发生未知错误");
      }
    };

    fetchData();
  }, [bookId, chapterNumber]);

  const handleContentChange = (updatedFields: Partial<ChapterInfo>) => {
    if (localChapter) {
      setLocalChapter({ ...localChapter, ...updatedFields });
    }
  };

  const saveChapterChanges = async (publishStatus?: "draft" | "published") => {
    if (!localChapter) return;

    try {
      const updatedChapter = publishStatus
        ? { ...localChapter, publishStatus }
        : localChapter;

      const response = await updateChapter(
        bookId,
        chapterNumber,
        updatedChapter
      );
      if (response.code === 200) {
        setChapter(response.data);
        setLocalChapter(response.data);
        setAlert({ message: t("chapterEdit.updateSuccess"), type: "success" });

        if (publishStatus === "published") {
          // 设置一个短暂的延迟，以确保用户能看到成功消息
          setTimeout(() => {
            router.push(`/writing/${bookId}?section=chapters`);
          }, 1500); // 1.5秒后跳转
        }
      } else {
        throw new Error(response.msg || t("chapterEdit.updateFail"));
      }
    } catch (err) {
      setAlert({
        message:
          err instanceof Error ? err.message : t("chapterEdit.updateError"),
        type: "error"
      });
    }
  };

  const handleReturn = () => {
    router.push(`/writing/${bookId}?section=chapters`);
  };

  const handleSaveDraft = () => saveChapterChanges("draft");
  const handlePublishChapter = () => saveChapterChanges("published");

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!book || !localChapter) return null;
  return (
    <div className="container mx-auto bg-white px-20 py-20">
      <h1 className="text-2xl bg-orange-100 py-2 text-center text-neutral-600 font-bold mb-4">
        {book.title}
      </h1>
      <div className="py-6">
        <ContentEditor
          chapter={localChapter}
          onContentChange={handleContentChange}
        />
      </div>
      <div className="my-10 flex justify-between items-center">
        <button
          onClick={handleReturn}
          className="bg-neutral-400 hover:bg-neutral-500 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          {t("chapterList.returnToChapterList")}
        </button>
        <div>
          <button
            onClick={handleSaveDraft}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 transition duration-300"
          >
            {t("chapterEdit.saveAsDraft")}
          </button>
          <button
            onClick={handlePublishChapter}
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {t("chapterEdit.publish")}
          </button>
        </div>
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default ChapterEditPage;

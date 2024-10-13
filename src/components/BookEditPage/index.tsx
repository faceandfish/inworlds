"use client";
import React, { useEffect, useState } from "react";
import {
  BookInfo,
  ChapterInfo,
  FileUploadData,
  PaginatedData
} from "@/app/lib/definitions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "./Sidebar";
import BookDetails from "./BookDetails";
import ChapterList from "./ChapterList";
import Pagination from "../Pagination";
import CoverUpload from "../WritingPage/CoverUpload";
import StatusAndCategoryUpdate from "./StatusAndCategoryUpdate";
import NewChapter from "./NewChapter";
import {
  getBookDetails,
  getChapterList,
  updateBookDetails,
  updateBookCover,
  addNewChapter,
  updateChapter
} from "@/app/lib/action";
import { getImageUrl } from "@/app/lib/imageUrl";
import ExistingCoverUpload from "./ExistingCoverUpload";

const BookEditPage: React.FC = () => {
  const params = useParams();
  const bookId = Number(params.bookId as string);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [book, setBook] = useState<BookInfo | null>(null);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [coverImage, setCoverImage] = useState<FileUploadData["coverImage"]>();
  const [coverImageUrl, setCoverImageUrl] =
    useState<BookInfo["coverImageUrl"]>();
  const [activeSection, setActiveSection] = useState("details");

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookResponse = await getBookDetails(bookId);
        if (bookResponse.code === 200 && bookResponse.data) {
          setBook(bookResponse.data);
          if (bookResponse.data.coverImageUrl) {
            const fullCoverImageUrl = getImageUrl(
              bookResponse.data.coverImageUrl
            );
            setCoverImageUrl(fullCoverImageUrl);
          } else {
            console.warn("书籍没有封面图片 URL");
            // 这里可以设置一个默认的封面图片 URL 或者其他适当的处理
          }
        } else {
          console.error("获取书籍详情失败:", bookResponse.msg);
        }

        const chapterResponse = await getChapterList(bookId, currentPage);
        if (chapterResponse.code === 200 && chapterResponse.data) {
          setChapters(chapterResponse.data.dataList);
          setTotalPages(chapterResponse.data.totalPage);
        } else {
          console.error("获取章节列表失败:", chapterResponse.msg);
        }

        // 在数据加载完成后处理 URL 参数
        const section = searchParams.get("section");
        if (section === "chapters") {
          setActiveSection("chapters");
          // 移除 URL 参数，但不改变路由
          router.replace(`/writing/${bookId}`);
        }
      } catch (error) {
        console.error("获取书籍数据时出错:", error);
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId, currentPage]);

  const handleBookDetailsUpdate = async (
    updatedBook: Partial<Pick<BookInfo, "title" | "description">>
  ) => {
    if (book) {
      try {
        console.log("Updating book details with:", updatedBook);
        const response = await updateBookDetails(book.id, updatedBook);
        console.log("Update response:", response);

        if (response.code === 200) {
          setBook(response.data);
          return true;
        } else {
          console.error("更新书籍详情失败:", response.msg);
          return false;
        }
      } catch (error) {
        console.error("更新书籍详情时出错:", error);
        return false;
      }
    }
    return false;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCoverChange = (
    file: FileUploadData["coverImage"],
    url: BookInfo["coverImageUrl"]
  ) => {
    setCoverImage(file);
    // Don't update coverImageUrl here, only preview it
  };

  const handleCoverUpload = async (): Promise<boolean> => {
    if (coverImage && book) {
      try {
        const response = await updateBookCover(book.id, coverImage);
        if (response.code === 200) {
          const fullCoverImageUrl = getImageUrl(response.data);
          setCoverImageUrl(fullCoverImageUrl);
          return true;
        } else {
          console.error("更新书籍封面失败:", response.msg);
          return false;
        }
      } catch (error) {
        console.error("更新书籍封面时出错:", error);
        return false;
      }
    } else {
      console.error("请先选择一个新的封面图片");
      return false;
    }
  };

  const handleStartWriting = () => {
    setActiveSection("newChapter");
  };

  const handleSaveNewChapter = async (
    newChapter: Partial<ChapterInfo>
  ): Promise<{ success: boolean; data?: ChapterInfo }> => {
    try {
      if (!newChapter.title || !newChapter.content) {
        return { success: false };
      }
      type ChapterToSave = Omit<
        ChapterInfo,
        | "id"
        | "bookId"
        | "createdAt"
        | "lastModified"
        | "chapterNumber"
        | "wordCount"
        | "income24h"
        | "totalIncome"
        | "donationIncome"
      >;

      const chapterToSave: ChapterToSave = {
        title: newChapter.title,
        content: newChapter.content,
        publishStatus: newChapter.publishStatus || "draft",
        isPaid: newChapter.isPaid ?? false,
        price: newChapter.price ?? 0
      };

      const response = await addNewChapter(bookId, chapterToSave);

      if (response.code === 200) {
        setChapters((prevChapters) => [...prevChapters, response.data]);
        setBook((prevBook) => {
          if (prevBook) {
            return {
              ...prevBook,
              latestChapterNumber: response.data.chapterNumber ?? 0,
              latestChapterTitle: response.data.title
            };
          }
          return prevBook;
        });

        return { success: true, data: response.data };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("保存新章节时出错:", error);
      return { success: false };
    }
  };

  const handleStatusAndCategoryUpdate = async (
    updates: Partial<Pick<BookInfo, "status" | "category">>
  ) => {
    if (book) {
      try {
        const response = await updateBookDetails(book.id, updates);
        if (response.code === 200) {
          setBook(response.data);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const handleUpdateChapter = async (
    chapterId: number,
    updates: Partial<ChapterInfo>
  ): Promise<boolean> => {
    try {
      const response = await updateChapter(bookId, chapterId, updates);
      if (response.code === 200) {
        setChapters(
          chapters.map((chapter) =>
            chapter.id === chapterId
              ? { ...chapter, ...response.data }
              : chapter
          )
        );

        // 如果更新影响了书籍的最新章节信息，也更新书籍状态
        if (updates.publishStatus === "published" && book) {
          const updatedChapter = chapters.find((c) => c.id === chapterId);
          if (
            updatedChapter &&
            (!book.latestChapterNumber ||
              updatedChapter.chapterNumber! > book.latestChapterNumber)
          ) {
            setBook({
              ...book,
              latestChapterNumber: updatedChapter.chapterNumber ?? 0,
              latestChapterTitle: updatedChapter.title
            });
          }
        }

        console.log("章节更新成功");
        return true;
      } else {
        console.error("更新章节失败:", response.msg);
        return false;
      }
    } catch (error) {
      console.error("更新章节时出错:", error);
      return false;
    }
  };

  if (!book) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onStartWriting={handleStartWriting}
        className=" h-full fixed left-0 top-16 transition-all duration-300 w-64 opacity-100"
      />
      <div className="flex-1 overflow-auto bg-white h-screen p-8 transition-all duration-300 ml-64">
        {activeSection === "details" && (
          <BookDetails book={book} onSave={handleBookDetailsUpdate} />
        )}
        {activeSection === "status" && (
          <StatusAndCategoryUpdate
            book={book}
            onUpdate={handleStatusAndCategoryUpdate}
          />
        )}
        {activeSection === "cover" && (
          <div className="flex flex-col items-center space-y-10">
            <ExistingCoverUpload
              currentCoverUrl={coverImageUrl || ""}
              onCoverChange={(file, previewUrl) => {
                setCoverImage(file);
                setCoverImageUrl(previewUrl);
              }}
              onSubmit={handleCoverUpload}
            />
          </div>
        )}
        {activeSection === "chapters" && (
          <>
            <ChapterList
              chapters={chapters}
              book={book}
              onUpdateChapter={handleUpdateChapter}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
        {activeSection === "newChapter" && (
          <NewChapter
            book={book}
            bookId={bookId}
            onSave={handleSaveNewChapter}
          />
        )}
      </div>
    </div>
  );
};

export default BookEditPage;

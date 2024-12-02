"use client";
import React, { useEffect, useState } from "react";
import { BookInfo, ChapterInfo, FileUploadData } from "@/app/lib/definitions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "./Sidebar";
import BookDetails from "./BookDetails";
import ChapterList from "./ChapterList";
import Pagination from "../Main/Pagination";
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
import BookPreviewCardSkeleton from "../Book/skeleton/BookPreviewCardSkeleton";
import { logger } from "../Main/logger";

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
        if ("data" in bookResponse && bookResponse.code === 200) {
          setBook(bookResponse.data);
          if (bookResponse.data.coverImageUrl) {
            setCoverImageUrl(getImageUrl(bookResponse.data.coverImageUrl));
          }
        }

        const chapterResponse = await getChapterList(bookId, currentPage);
        if ("data" in chapterResponse && chapterResponse.code === 200) {
          setChapters(chapterResponse.data.dataList);
          setTotalPages(chapterResponse.data.totalPage);
        }

        const section = searchParams.get("section");
        if (section === "chapters") {
          setActiveSection("chapters");
          router.replace(`/writing/${bookId}`);
        }
      } catch (error) {
        logger.error("Data fetch error", error, {
          context: "fetchBookData"
        });
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId, currentPage, router, searchParams]);

  const handleBookDetailsUpdate = async (
    updatedBook: Partial<Pick<BookInfo, "title" | "description">>
  ) => {
    if (book) {
      try {
        const response = await updateBookDetails(book.id, updatedBook);
        if ("data" in response && response.code === 200) {
          setBook(response.data);
          return true;
        }
        return false;
      } catch (error) {
        logger.error("Book details update error", error, {
          context: "handleBookDetailsUpdate"
        });

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
  };

  const handleCoverUpload = async (): Promise<boolean> => {
    if (!coverImage || !book) return false;

    try {
      const response = await updateBookCover(book.id, coverImage);
      if ("data" in response && response.code === 200) {
        setCoverImageUrl(getImageUrl(response.data));
        return true;
      }
      return false;
    } catch (error) {
      logger.error("Cover upload error", error, {
        context: "handleCoverUpload"
      });
      return false;
    }
  };

  const handleStartWriting = () => {
    setActiveSection("newChapter");
  };

  const handleSaveNewChapter = async (
    newChapter: Partial<ChapterInfo>
  ): Promise<{ success: boolean; data?: ChapterInfo }> => {
    if (!newChapter.title || !newChapter.content) {
      return { success: false };
    }

    try {
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

      if ("data" in response && response.code === 200) {
        setChapters((prevChapters) => [...prevChapters, response.data]);
        setBook(
          (prevBook) =>
            prevBook && {
              ...prevBook,
              latestChapterNumber: response.data.chapterNumber ?? 0,
              latestChapterTitle: response.data.title
            }
        );
        return { success: true, data: response.data };
      }
      return { success: false };
    } catch (error) {
      logger.error("New chapter save error", error, {
        context: "handleSaveNewChapter"
      });
      return { success: false };
    }
  };

  const handleStatusAndCategoryUpdate = async (
    updates: Partial<Pick<BookInfo, "status" | "category">>
  ) => {
    if (book) {
      try {
        const response = await updateBookDetails(book.id, updates);
        if ("data" in response && response.code === 200) {
          setBook(response.data);
          return true;
        }
        return false;
      } catch (error) {
        logger.error("Status and category update error", error, {
          context: "handleStatusAndCategoryUpdate"
        });
        return false;
      }
    }
    return false;
  };

  const handleUpdateChapter = async (
    chapterNumber: number,
    updates: Partial<ChapterInfo>
  ): Promise<boolean> => {
    try {
      const response = await updateChapter(bookId, chapterNumber, updates);
      if ("data" in response && response.code === 200) {
        setChapters(
          chapters.map((chapter) =>
            chapter.chapterNumber === chapterNumber
              ? { ...chapter, ...response.data }
              : chapter
          )
        );

        if (updates.publishStatus === "published" && book) {
          const updatedChapter = chapters.find((c) => c.id === chapterNumber);
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

        return true;
      }
      return false;
    } catch (error) {
      logger.error("Chapter update error", error, {
        context: "handleUpdateChapter"
      });
      return false;
    }
  };

  if (!book) {
    return (
      <div>
        <BookPreviewCardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onStartWriting={handleStartWriting}
        className="h-full fixed left-0 top-16 transition-all duration-300 w-64 opacity-100"
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

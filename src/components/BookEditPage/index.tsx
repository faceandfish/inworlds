"use client";
import { useEffect, useState } from "react";
import { BookInfo, ChapterInfo, FileUploadData } from "@/app/lib/definitions";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import BookDetails from "./BookDetails";
import ChapterList from "./ChapterList";
import Pagination from "../Pagination";
import CoverUpload from "../WritingPage/CoverUpload";
import BookStatusSelector from "../WritingPage/BookStatusSelector";
import CategorySelect from "../WritingPage/CategorySelect";
import ContentEditor from "../WritingPage/ContentEditor";
import NewChapter from "./NewChapter";

const mockBook: BookInfo = {
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

const mockChapters: ChapterInfo[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  bookId: 1,
  chapterNumber: i + 1,
  title: `第${i + 1}章：章节标题`,
  content: "章节内容...",
  createdAt: "2023-08-01T10:00:00Z",
  lastModified: "2023-08-23T12:00:00Z",
  wordCount: 2000
}));

const BookEditPage: React.FC = () => {
  const params = useParams();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<BookInfo | null>(null);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [tempStatus, setTempStatus] = useState<BookInfo["status"]>(
    book?.status ?? "ongoing"
  );
  const [tempCategory, setTempCategory] = useState<BookInfo["category"]>(
    book?.category ?? "female-story"
  );

  const [coverImage, setCoverImage] =
    useState<FileUploadData["coverImage"]>(null);
  const [coverImageUrl, setCoverImageUrl] =
    useState<BookInfo["coverImageUrl"]>(null);

  const [activeSection, setActiveSection] = useState(() => {
    const storedSection = localStorage.getItem("activeSection");
    if (storedSection) {
      localStorage.removeItem("activeSection"); // 使用后立即清除
      return storedSection;
    }
    return "details"; // 默认值
  });

  useEffect(() => {
    if (bookId) {
      // Replace with actual API calls
      setBook(mockBook);

      const pageSize = 10;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      setChapters(mockChapters.slice(start, end));
      setTotalPages(Math.ceil(mockChapters.length / pageSize));
    }
  }, [bookId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCoverChange = (
    file: FileUploadData["coverImage"],
    url: BookInfo["coverImageUrl"]
  ) => {
    setCoverImage(file);
    setCoverImageUrl(url);
  };

  const handleSave = () => {
    console.log("Saving book details...");
    // Implement the save logic here
  };

  const [isWriting, setIsWriting] = useState(false);

  const handleStartWriting = () => {
    setIsWriting(true);
    setActiveSection("newChapter");
  };

  const handleSaveNewChapter = (newChapter: ChapterInfo) => {
    // 这里应该调用API来保存新章节
    console.log("Saving new chapter:", newChapter);

    // 保存成功后，更新chapters数组和book对象
    setChapters((prevChapters) => [...prevChapters, newChapter]);
    setBook((prevBook) => {
      if (prevBook) {
        return {
          ...prevBook,
          latestChapterNumber: newChapter.chapterNumber ?? 0,
          latestChapterTitle: newChapter.title
        };
      }
      return prevBook;
    });

    // 停止写作模式
    handleStopWriting();

    // 切换activeSection到"chapters"
    setActiveSection("chapters");
  };

  // 确保handleStopWriting函数正确定义
  const handleStopWriting = () => {
    setIsWriting(false);
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
        className={`w-64 h-full fixed left-0 top-16 transition-all duration-300 ${
          isWriting ? "w-0 opacity-0" : "w-64 opacity-100"
        }`}
      />
      <div
        className={`flex-1 overflow-auto bg-white h-screen  p-8 transition-all duration-300 ${
          isWriting ? "ml-0" : "ml-64"
        }`}
      >
        {activeSection === "details" && (
          <BookDetails book={book} onSave={handleSave} />
        )}
        {activeSection === "status" && (
          <div className="space-y-10">
            <BookStatusSelector
              status={tempStatus}
              onStatusChange={(newStatus) => setTempStatus(newStatus)}
            />
            <CategorySelect
              value={tempCategory}
              onChange={(newCategory) => setTempCategory(newCategory)}
            />
            <button
              onClick={() => {
                setBook((prevBook) => ({
                  ...prevBook!,
                  status: tempStatus,
                  category: tempCategory
                }));
                // TODO: 在这里添加 API 调用来保存更改
                console.log("保存状态和分类更改");
              }}
              className="mt-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              保存更改
            </button>
          </div>
        )}
        {activeSection === "cover" && (
          <div className="flex flex-col items-center space-y-10">
            <CoverUpload
              coverImage={coverImage}
              coverImageUrl={coverImageUrl}
              onCoverChange={handleCoverChange}
            />
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              提交封面
            </button>
          </div>
        )}
        {activeSection === "chapters" && (
          <>
            <ChapterList chapters={chapters} book={book} />
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
            onCancel={handleStopWriting}
          />
        )}
      </div>
    </div>
  );
};

export default BookEditPage;

import { BookInfo, CreatorUserInfo } from "@/app/lib/definitions";
import { AuthorInfo } from "./AuthorInfo";

interface BookHeaderProps {
  book: BookInfo;
  author: CreatorUserInfo;
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book, author }) => {
  const status = book.status ? "已完結" : "連載中";
  const latestChapter = `第${book.latestChapterNumber}章 ${book.latestChapterTitle}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-between mt-10 w-full h-56">
      <div className="flex gap-10">
        <div className="w-44 h-56 bg-orange-400 rounded-xl"></div>
        <div className="flex flex-col justify-around">
          <h2>{book.title}</h2>
          <p>{status}</p>
          <p>最新章節：{latestChapter}</p>
          <p>最後更新：{formatDate(book.lastSaved)}</p>
          <div>
            <button className="hover:bg-orange-500 bg-orange-400 px-5 py-2 rounded text-white mr-10">
              立即閱讀
            </button>
            <button className="hover:text-orange-400">訂閱本書</button>
          </div>
        </div>
      </div>
      <AuthorInfo author={author} />
    </div>
  );
};

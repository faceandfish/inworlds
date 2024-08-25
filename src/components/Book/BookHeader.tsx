import { BookInfo } from "@/app/lib/definitions";
import AuthorInfo from "./AuthorInfo";
import { getImageUrl } from "@/app/lib/imageUrl";

interface BookHeaderProps {
  book: BookInfo;
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book }) => {
  const status =
    book.status === "ongoing"
      ? "连载中"
      : book.status === "completed"
      ? "已完结"
      : "";

  const latestChapter = `第${book.latestChapterNumber}章 ${book.latestChapterTitle}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}月${String(date.getDate()).padStart(2, "0")}日`;
  };

  return (
    <div className="flex justify-between mt-10 w-full h-56">
      <div className="flex gap-10">
        <div className="w-44 h-56 shadow-md rounded-xl overflow-hidden">
          <img
            src={getImageUrl(book.coverImageUrl)}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover "
          />
        </div>

        <div className="flex flex-col justify-around">
          <h2
            className="
          text-3xl font-bold "
          >
            {book.title}
          </h2>
          <p className="text-neutral-500 text-sm">
            更新时间: {formatDate(book.lastSaved!)}
          </p>
          <div className="flex gap-5 text-neutral-500">
            <p>最新章节: {latestChapter}</p>
            <p>{status}</p>
          </div>

          <div>
            <button className="hover:bg-orange-500 bg-orange-400 px-5 py-2 rounded text-white mr-10">
              立即阅读
            </button>
            <button className="hover:text-orange-400">收藏本书</button>
          </div>
        </div>
      </div>
      <AuthorInfo book={book} />
    </div>
  );
};

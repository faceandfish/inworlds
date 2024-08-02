import { BookInfo } from "@/app/lib/definitions";
import Link from "next/link";

interface ChapterListProps {
  book: BookInfo;
}
export const ChapterList: React.FC<ChapterListProps> = ({ book }) => (
  <div className="w-full ">
    <div className=" flex flex-wrap ">
      {book.chapters.map((chapter) => (
        <Link
          //   href={`/book/${book.id}/chapter/${chapter.id}`}
          href="#"
          key={chapter.id}
          className=" py-5 w-1/3 group [&:nth-last-child(-n+3)]:border-b-0  flex gap-5"
        >
          <p className="font-semibold text-gray-600 group-hover:text-orange-500">
            {chapter.number}
          </p>
          <p className="text-gray-500 group-hover:text-orange-400 truncate">
            {chapter.title}
          </p>
        </Link>
      ))}
    </div>
  </div>
);

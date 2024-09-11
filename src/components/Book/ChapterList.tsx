import { BookInfo, ChapterInfo } from "@/app/lib/definitions";
import Link from "next/link";

interface ChapterListProps {
  chapters: ChapterInfo[];
  book: BookInfo;
  className?: string;
}
export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  book,
  className
}) => {
  return (
    <div className="w-full ">
      <div className={` ${className}`}>
        {chapters.map((chapter) => {
          return (
            <Link
              href={`/book/${book.id}/chapter/${chapter.chapterNumber}`}
              key={chapter.id}
              className="py-2 px-3 hover:bg-neutral-100 group [&:nth-last-child(-n+3)]:border-b-0  flex gap-5"
            >
              <p className="font-semibold text-gray-600 group-hover:text-orange-500">
                {chapter.chapterNumber}
              </p>
              <p className="text-gray-500 group-hover:text-orange-400 ">
                {chapter.title}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

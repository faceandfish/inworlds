import { BookInfo, ChapterInfo } from "@/app/lib/definitions";
import Link from "next/link";
import { useTranslation } from "../useTranslation";
import { usePurchasedChapters } from "../PurchasedChaptersProvider.tsx";
import { useUser } from "../UserContextProvider";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

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
  const { t } = useTranslation("book");
  const { isChapterPurchased } = usePurchasedChapters();
  const { user } = useUser();
  const isAuthor = user?.id === book.authorId;

  return (
    <div className="w-full">
      <div className={`${className}`}>
        {chapters.map((chapter) => {
          const isPaid = Boolean(chapter.price) && chapter.price > 0;
          const isPurchased = isChapterPurchased(book.id, chapter.id);

          return (
            <Link
              href={`/book/${book.id}/chapter/${chapter.chapterNumber}`}
              key={chapter.id}
              className="py-2 px-3 hover:bg-neutral-100 group [&:nth-last-child(-n+3)]:border-b-0 flex gap-5 items-center justify-between"
            >
              <div className="flex gap-5 items-center flex-grow">
                <p className="font-semibold text-gray-600 group-hover:text-orange-500">
                  {chapter.chapterNumber}
                </p>
                <div className="flex-grow">
                  <p className="text-neutral-600 group-hover:text-orange-400">
                    {chapter.title}
                    {isPaid && !isAuthor && (
                      <span className="ml-2 text-sm text-orange-500 font-semibold">
                        ({chapter.price} {t("coins")})
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {isPaid && (isPurchased || isAuthor) && (
                <span className="flex items-center text-green-500 text-sm">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  {isAuthor ? t("author") : t("purchased")}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

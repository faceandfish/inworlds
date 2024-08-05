import { useRouter } from "next/router";

import { getMockBooks, getMockChapters } from "@/mockData";
import ChapterContent from "@/components/Book/ChapterContent";
import { BookInfo, ChapterInfo } from "@/app/lib/definitions";

interface ChapterPageProps {
  params: {
    bookId: string;
    chapterId: string;
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapterId } = params;

  console.log("Page params:", params);

  const allBooks = getMockBooks();
  const allChapters = getMockChapters();

  console.log("All books:", allBooks);
  console.log("All chapters:", allChapters);

  const book = allBooks.find((b) => b.id.toString() === bookId) as
    | BookInfo
    | undefined;
  const chapter = allChapters.find((c) => c.id.toString() === chapterId) as
    | ChapterInfo
    | undefined;

  console.log("Found book:", book);
  console.log("Found chapter:", chapter);

  if (!chapter || !book) {
    console.log("Chapter or book not found");
    return <div>章节或书籍不存在</div>;
  }

  return <ChapterContent chapter={chapter} book={book} />;
}

import { notFound } from "next/navigation";
import ChapterContent from "@/components/Book/ChapterContent";
import { getBookDetails, getChapterContent } from "@/app/lib/action";

interface ChapterPageProps {
  params: {
    bookId: string;
    chapterNumber: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapterNumber } = params;

  try {
    const [bookResponse, chapterResponse] = await Promise.all([
      getBookDetails(parseInt(bookId, 10)),
      getChapterContent(parseInt(bookId, 10), parseInt(chapterNumber, 10))
    ]);

    const book = bookResponse.data;
    const chapter = chapterResponse.data;

    if (!chapter || !book) {
      notFound();
    }

    return <ChapterContent chapter={chapter} book={book} />;
  } catch (error) {
    console.error("Error fetching chapter data:", error);
    notFound();
  }
}

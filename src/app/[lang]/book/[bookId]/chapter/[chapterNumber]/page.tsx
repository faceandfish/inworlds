import { notFound } from "next/navigation";
import ChapterContent from "@/components/Book/ChapterContent";
import { getBookDetails, getPublicChapterContent } from "@/app/lib/action";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { logger } from "@/components/Main/logger";
export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: {
    bookId: string;
    chapterNumber: string;
  };
}

// Cache data fetching function
const getCachedChapterData = unstable_cache(
  async (bookId: number, chapterNumber: number) => {
    const [bookResponse, chapterResponse] = await Promise.all([
      getBookDetails(bookId),
      getPublicChapterContent(bookId, chapterNumber)
    ]);

    if (
      bookResponse.code === 200 &&
      "data" in bookResponse &&
      chapterResponse.code === 200 &&
      "data" in chapterResponse
    ) {
      return {
        book: bookResponse.data,
        chapter: chapterResponse.data
      };
    }
    return { book: null, chapter: null };
  },
  ["chapter-data"],
  { revalidate: 60 } // 1 minute cache
);

export async function generateMetadata({
  params
}: ChapterPageProps): Promise<Metadata> {
  try {
    const bookId = parseInt(params.bookId, 10);
    const chapterNumber = parseInt(params.chapterNumber, 10);

    if (isNaN(bookId) || isNaN(chapterNumber)) {
      return { title: "Invalid Chapter" };
    }

    const { book, chapter } = await getCachedChapterData(bookId, chapterNumber);
    if (!book || !chapter) {
      return { title: "Chapter Not Found" };
    }

    return {
      title: `${chapter.title} - ${book.title}`,
      description: `Read ${chapter.title} from ${book.title} on InWorlds.`,
      openGraph: {
        title: `${chapter.title} - ${book.title}`,
        description: `Read ${chapter.title} from ${book.title} on InWorlds.`,
        images: book.coverImageUrl
          ? [
              {
                url: book.coverImageUrl,
                width: 800,
                height: 600,
                alt: `${book.title} - ${chapter.title}`
              }
            ]
          : undefined
      }
    };
  } catch (error) {
    logger.error("Error generating metadata", error, {
      context: "ChapterPage"
    });
    return { title: "Error Loading Chapter" };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const bookId = parseInt(params.bookId, 10);
  const chapterNumber = parseInt(params.chapterNumber, 10);

  if (isNaN(bookId) || isNaN(chapterNumber)) {
    notFound();
  }

  try {
    const { book, chapter } = await getCachedChapterData(bookId, chapterNumber);

    if (!chapter || !book) {
      notFound();
    }

    return <ChapterContent chapter={chapter} book={book} />;
  } catch (error) {
    logger.error("Error fetching chapter data", error, {
      context: "ChapterPage"
    });
    throw error;
  }
}

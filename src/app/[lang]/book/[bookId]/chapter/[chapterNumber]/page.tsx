import { notFound } from "next/navigation";
import ChapterContent from "@/components/Book/ChapterContent";
import { getBookDetails, getPublicChapterContent } from "@/app/lib/action";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";

interface ChapterPageProps {
  params: {
    bookId: string;
    chapterNumber: string;
  };
}

// 缓存数据获取
const getCachedChapterData = unstable_cache(
  async (bookId: number, chapterNumber: number) => {
    const [bookResponse, chapterResponse] = await Promise.all([
      getBookDetails(bookId),
      getPublicChapterContent(bookId, chapterNumber)
    ]);
    return {
      book: bookResponse.data,
      chapter: chapterResponse.data
    };
  },
  ["chapter-data"],
  { revalidate: 60 } // 1分钟缓存
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
  } catch {
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
    console.error("Error fetching chapter data:", error);
    throw error;
  }
}

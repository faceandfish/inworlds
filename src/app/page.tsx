import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import Category from "@/components/Category";
import Navbar from "@/components/Navbar";

import { getMockBooks } from "@/mockData";

function Home() {
  const books = getMockBooks();
  return (
    <>
      <Navbar />
      <div className="w-10/12 mx-auto">
        <Category />
        <div className="grid grid-cols-3 gap-10">
          {books.map((book) => (
            <BookPreviewCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;

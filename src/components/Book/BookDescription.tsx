import { BookInfo } from "@/app/lib/definitions";

interface BookDescriptionProps {
  book: BookInfo;
}

export const BookDescription: React.FC<BookDescriptionProps> = ({ book }) => (
  <div className="w-full h-32 my-16">
    <p className="text-xl pb-2 border-b border-gray-100">作品簡介</p>
    <p className="font-light mt-2 px-10">{book.description}</p>
  </div>
);

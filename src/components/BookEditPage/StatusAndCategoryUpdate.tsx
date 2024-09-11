import React, { useState } from "react";
import { BookInfo } from "@/app/lib/definitions";
import BookStatusSelector from "../WritingPage/BookStatusSelector";
import CategorySelect from "../WritingPage/CategorySelect";
import Alert from "../Alert";

interface StatusAndCategoryUpdateProps {
  book: BookInfo;
  onUpdate: (
    updatedBook: Partial<Pick<BookInfo, "status" | "category">>
  ) => Promise<boolean>;
}

const StatusAndCategoryUpdate: React.FC<StatusAndCategoryUpdateProps> = ({
  book,
  onUpdate
}) => {
  const [status, setStatus] = useState<BookInfo["status"]>(book.status);
  const [category, setCategory] = useState<BookInfo["category"]>(book.category);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleUpdate = async () => {
    try {
      const success = await onUpdate({ status, category });
      if (success) {
        setAlert({ message: "书籍状态和分类更新成功", type: "success" });
      } else {
        setAlert({ message: "更新书籍状态和分类失败", type: "error" });
      }
    } catch (error) {
      setAlert({ message: "更新书籍状态和分类时出错", type: "error" });
    }
  };

  return (
    <div className="space-y-10">
      <BookStatusSelector status={status} onStatusChange={setStatus} />
      <CategorySelect value={category} onChange={setCategory} />
      <button
        onClick={handleUpdate}
        className="mt-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        保存修改
      </button>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default StatusAndCategoryUpdate;

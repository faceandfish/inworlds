import React from "react";

function Category() {
  return (
    <div className="w-full my-10 border-gray-200 border-b">
      <ul className="flex col">
        <li className="w-20 h-10 hover:bg-orange-400 hover:text-white flex items-center justify-center">
          關注
        </li>
        <li className="w-20 h-10 hover:text-white hover:bg-orange-400 flex items-center justify-center">
          推薦
        </li>
        <li className="w-20 h-10 hover:text-white hover:bg-orange-400 flex items-center justify-center">
          熱門
        </li>
        <li className="w-20 h-10 hover:text-white hover:bg-orange-400 flex items-center justify-center">
          最新
        </li>
        <li className="w-28 h-10 hover:text-white hover:bg-orange-400 flex items-center justify-center">
          作者專區
        </li>
        <li className="w-28 h-10 hover:text-white hover:bg-orange-400 flex items-center justify-center">
          版權交易
        </li>
      </ul>
    </div>
  );
}

export default Category;

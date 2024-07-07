import Link from "next/link";
import React from "react";

function Clip() {
  return (
    <Link href="/books">
      <div className="flex  w-96s h-56 flex-1 bg-gray-100">
        <div className="w-44 h-56 bg-orange-400 rounded flex-shrink-0">
          封面
        </div>
        <div className="flex flex-col mx-5  justify-around ">
          <div className="text-xl">書的名字</div>
          <div className=" line-clamp-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad quis
            magni ut neque, earum ratione, reiciendis sequi dolores omnis quia
            aliquid? Omnis autem asperiores id? Doloremque veniam aut omnis
            beatae?
          </div>
          <div>
            <p>作者</p>
            <p>1024人推薦</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Clip;

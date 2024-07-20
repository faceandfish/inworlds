"use client";
import { logout } from "@/app/lib/action";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await logout();
      if (result.code === 200) {
        console.log("登出成功:", result.msg);
        // 清除客户端的状态（如果有的话）

        router.push("/");
        router.refresh(); // 刷新页面以更新服务器组件
      } else {
        console.error("登出失败:", result.msg);
      }
    } catch (error) {
      console.error("登出过程中发生错误:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className="flex items-center group/item hover:bg-gray-100 w-full p-2 rounded"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <AiOutlineLogout className="text-2xl mr-5" />
      <div className="text-base mr-32">退出帳號</div>
      <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000 ease-in-out ml-auto" />
    </button>
  );
};

export default LogoutButton;

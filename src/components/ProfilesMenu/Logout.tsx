"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";
import { logout } from "@/app/lib/action";
import { userInfo } from "../UserContext";

const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = userInfo();

  const handleLogout = useCallback(async () => {
    console.log("handleLogout called");
    const confirmed = window.confirm("确定要退出吗？");
    if (!confirmed) {
      console.log("Logout cancelled by user");
      return;
    }

    setIsLoading(true);
    try {
      const result = await logout();
      console.log("登出结果:", result.msg);

      // 清除用户状态
      setUser(null);

      // 清除localStorage中的token（如果有的话）
      localStorage.removeItem("token");

      // 重定向到首页或登录页
      //await router.push("/");

      // 强制刷新页面以确保所有状态都被重置
      window.location.reload();
    } catch (error) {
      console.error("登出过程中发生错误:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser]);

  return (
    <button
      className="flex items-center group/item hover:bg-gray-100 w-full px-4 py-2 rounded"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <AiOutlineLogout className="text-2xl mr-5" />
      <div className="text-base mr-32">
        {isLoading ? "正在退出" : "退出帳號"}
      </div>
      <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000 ease-in-out ml-auto" />
    </button>
  );
};

export default LogoutButton;

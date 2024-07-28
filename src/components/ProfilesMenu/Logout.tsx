"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";
import { logout } from "@/app/lib/action";
import UserInfo, { useUserInfo } from "../useUserInfo";
import { removeToken } from "@/app/lib/token";

const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, refetch } = useUserInfo(); // 使用你的 UserInfo 函数

  const handleLogout = useCallback(async () => {
    console.log("handleLogout called");
    const confirmed = window.confirm("确定要退出吗？");
    if (!confirmed) {
      console.log("Logout cancelled by user");
      return;
    }

    setIsLoading(true);
    try {
      const result = await logout(); // 调用后端的登出 API
      console.log("登出结果:", result.msg);
      // 重新获取用户信息，这应该会将用户状态设置为 null
      await refetch();

      // 重定向到首页或登录页
      router.push("/login");
    } catch (error) {
      console.error("登出过程中发生错误:", error);
      alert("登出失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  }, [router, refetch]);

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

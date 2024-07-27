"use client";

import { EditProfileForm } from "@/components/PersonPage/EditProfileForm";
import { User } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/components/UserContext";

export default function EditProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const { user } = useUserInfo();
    if (user) {
      setCurrentUser(user);
    } else {
      // 如果没有用户信息，重定向到登录页面
      router.push("/login");
    }
  }, [router]);

  if (!currentUser) {
    return <div>加载中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">编辑个人资料</h1>
      <EditProfileForm user={currentUser} />
    </div>
  );
}

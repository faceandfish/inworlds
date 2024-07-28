import React from "react";
import { notFound, useParams } from "next/navigation";
import PersonPage from "@/components/PersonPage";
import UserInfo from "@/components/UserInfo";
import { getUserInfo } from "@/app/lib/action";

const ProfilePage = async () => {
  const { data } = await getUserInfo();
  if (!data) {
    return <div>User not found</div>;
  }
  console.log("ProfilePage received user:", data);
  const { username } = useParams();

  // 检查 URL 中的 username 是否匹配用户的 loginAct 或 name
  if (
    typeof username === "string" &&
    data.loginAct.toLowerCase() !== username.toLowerCase()
  ) {
    notFound();
  }

  return <PersonPage user={data} />;
};

export default ProfilePage;

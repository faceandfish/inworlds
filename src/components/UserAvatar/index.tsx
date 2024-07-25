import React, { useMemo } from "react";
import Image from "next/image";
import { User } from "@/app/lib/definitions";

interface UserAvatarProps {
  user: User;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  onClick,
  className = "",
}) => {
  // 基于字符串生成哈希值
  const hashCode = () => {
    const str = user.loginAct;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      console.log("str:", str.length);

      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  // 生成基于用户名的固定颜色
  const generatePastelColor = () => {
    const hue = hashCode() % 360; // 使用哈希值来确定色相
    return `hsl(${hue}, 50%, 30%)`; // 保持低饱和度和高亮度
  };

  // 使用 useMemo 来确保颜色只生成一次
  const backgroundColor = generatePastelColor();

  // 文字颜色固定为白色
  const textColor = "white";

  const textSizeClass =
    className.split(" ").find((cls) => cls.startsWith("text-")) || "text-xl";

  // 使用 loginAct 的第一个字符
  const initial = user.loginAct.charAt(0).toUpperCase();

  return (
    <div
      className={`relative w-10 h-10 rounded-full overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div
        style={{ backgroundColor, color: textColor }}
        className={`w-full h-full flex items-center justify-center  ${textSizeClass}  font-bold cursor-pointer`}
      >
        {initial}
      </div>
    </div>
  );
};

export default UserAvatar;

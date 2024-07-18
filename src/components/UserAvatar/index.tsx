import React from "react";
import Image from "next/image";

interface UserAvatarProps {
  user: {
    name: string;
    avatar?: string;
  };
  onClick?: () => void;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  onClick,
  className = "",
}) => {
  // 生成随机颜色
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  // 获取对比色
  const getContrastColor = (hexcolor: string) => {
    // 将十六进制颜色转换为RGB
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    // 计算亮度
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // 返回黑色或白色
    return yiq >= 128 ? "black" : "white";
  };

  const backgroundColor = getRandomColor();
  const textColor = getContrastColor(backgroundColor);
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div
      className={`relative w-10 h-10 rounded-full overflow-hidden ${className}`}
      onClick={onClick}
    >
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          layout="fill"
          className="object-cover rounded-full"
        />
      ) : (
        <div
          style={{ backgroundColor, color: textColor }}
          className="w-full h-full flex items-center justify-center text-xl font-bold"
        >
          {initial}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

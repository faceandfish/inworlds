import React, { useMemo } from "react";
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
  // 基于字符串生成哈希值
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  // 生成基于用户名的固定颜色
  const generatePastelColor = (name: string) => {
    const hash = hashCode(name);
    const hue = hash % 360; // 使用哈希值来确定色相
    return `hsl(${hue}, 70%, 80%)`; // 保持低饱和度和高亮度
  };

  // 使用 useMemo 来确保颜色只生成一次
  const backgroundColor = useMemo(
    () => generatePastelColor(user.name),
    [user.name]
  );

  // 对比色生成函数，生成低饱和度的文字颜色
  const getContrastColor = (bgColor: string) => {
    const [h, s, l] = bgColor.match(/\d+/g)!.map(Number);
    const textHue = (h + 180) % 360; // 对比色
    const textLightness = l > 50 ? 30 : 70; // 根据背景亮度调整文字亮度
    return `hsl(${textHue}, 30%, ${textLightness}%)`; // 降低饱和度
  };

  const textColor = useMemo(
    () => getContrastColor(backgroundColor),
    [backgroundColor]
  );
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

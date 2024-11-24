export const NotificationBadge: React.FC<{
  count: number;
  className?: string; // 添加自定义类名支持
}> = ({ count, className = "" }) => {
  if (count <= 0) return null;

  return (
    <span
      className={`bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

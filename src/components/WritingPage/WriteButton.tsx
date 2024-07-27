import React from "react";

interface WriteButtonProps {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
  disabled?: boolean;
}

const WriteButton: React.FC<WriteButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyle =
    "font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400",
    secondary:
      "bg-transparent border-2 border-orange-400 text-orange-500 hover:bg-orange-100 focus:ring-orange-400",
    tertiary:
      "bg-orange-200 hover:bg-orange-300 text-orange-800 focus:ring-orange-300",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default WriteButton;

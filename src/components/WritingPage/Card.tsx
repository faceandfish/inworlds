import React from "react";
import WriteButton from "./WriteButton";
import { useRouter } from "next/navigation";

interface CardProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
  className?: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  buttonText,
  onClick,
  link,
  className = "",
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`w-full md:w-[calc(33.33%-1rem)] mb-6 bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      {/* {icon && <div className="text-4xl mb-4">{icon}</div>} */}
      <h2 className="text-2xl mb-4 text-gray-800">{title}</h2>
      <p className="mb-6 text-gray-600">{description}</p>
      {buttonText && (
        <WriteButton
          variant="secondary"
          onClick={(e: any) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {buttonText}
        </WriteButton>
      )}
    </div>
  );
};

export default Card;

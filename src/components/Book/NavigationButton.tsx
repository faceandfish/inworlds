import React from "react";

type ButtonVariant = "disabled" | "previous" | "next";

interface NavigationButtonProps {
  isDisabled: boolean;
  onClick: () => void;
  variant: ButtonVariant;
  children: React.ReactNode;
}

interface ChapterNavigationProps {
  isFirstChapter: boolean;
  isLastChapter: boolean;
  handlePreviousChapter: () => void;
  handleNextChapter: () => void;
  t: (key: string) => string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  isDisabled,
  onClick,
  variant,
  children
}) => {
  const baseStyles =
    "px-8 md:px-20 py-2 rounded-full transition duration-300 text-sm md:text-base";

  const variants: Record<ButtonVariant, string> = {
    disabled: "bg-neutral-400 text-white cursor-not-allowed",
    previous: "bg-neutral-200 hover:bg-neutral-300 text-neutral-600",
    next: "bg-orange-400 hover:bg-orange-500 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  isFirstChapter,
  isLastChapter,
  handlePreviousChapter,
  handleNextChapter,
  t
}) => {
  return (
    <div className="space-x-4 md:space-x-10 pb-16 md:pb-28 pt-6 md:pt-10 flex justify-center">
      <NavigationButton
        isDisabled={isFirstChapter}
        onClick={handlePreviousChapter}
        variant={isFirstChapter ? "disabled" : "previous"}
      >
        {isFirstChapter ? t("firstChapter") : t("previousChapter")}
      </NavigationButton>

      <NavigationButton
        isDisabled={isLastChapter}
        onClick={handleNextChapter}
        variant={isLastChapter ? "disabled" : "next"}
      >
        {isLastChapter ? t("lastChapter") : t("nextChapter")}
      </NavigationButton>
    </div>
  );
};

export default ChapterNavigation;

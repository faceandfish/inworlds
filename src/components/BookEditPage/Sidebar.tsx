"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";

interface NavItem {
  id: string;
  label: string;
  action: () => void;
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onStartWriting: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onStartWriting,
  className = ""
}) => {
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation("bookedit");

  const navItems: NavItem[] = [
    {
      id: "details",
      label: t("sidebar.titleAndIntro"),
      action: () => setActiveSection("details")
    },
    {
      id: "status",
      label: t("sidebar.statusAndCategory"),
      action: () => setActiveSection("status")
    },
    {
      id: "cover",
      label: t("sidebar.bookCover"),
      action: () => setActiveSection("cover")
    },
    {
      id: "chapters",
      label: t("sidebar.chapterList"),
      action: () => setActiveSection("chapters")
    },
    {
      id: "newChapter",
      label: t("sidebar.addNewChapter"),
      action: () => setActiveSection("newChapter")
    }
  ];

  const handleBackToStudio = () => {
    router.push(`/studio/${user?.id}`);
  };

  return (
    <nav className={`w-64 px-8 bg-neutral-50 ${className}`}>
      <p className="text-2xl text-neutral-600 text-center border-b py-5">
        {t("sidebar.editWork")}
      </p>
      <ul className="space-y-4 mt-4">
        {navItems.map((item) => (
          <li
            key={item.id}
            onClick={item.action}
            className={`
              ${item.id === "new-chapter" ? "flex justify-center" : ""}
            `}
          >
            <p
              className={`
                text-center p-2 cursor-pointer transition-colors duration-200
                ${
                  item.id === "new-chapter"
                    ? "inline-block px-6 rounded-full bg-orange-400 text-white hover:bg-orange-500"
                    : "w-full " +
                      (activeSection === item.id
                        ? "bg-orange-400 text-white"
                        : "hover:bg-orange-100 text-neutral-600")
                }
              `}
            >
              {item.label}
            </p>
          </li>
        ))}
      </ul>
      <div
        onClick={handleBackToStudio}
        className="text-center mx-8 mt-8 py-2 hover:bg-neutral-300 text-neutral-600 bg-neutral-200 rounded-full cursor-pointer"
      >
        {t("sidebar.returnToStudio")}
      </div>
    </nav>
  );
};

export default Sidebar;

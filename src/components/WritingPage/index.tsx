"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookInfo,
  ChapterInfo,
  FileUploadData,
  UserInfo
} from "@/app/lib/definitions";

import WritingSidebar from "@/components/WritingPage/WritingSidebar";
import BookIntro from "@/components/WritingPage/BookIntro";
import CoverUpload from "@/components/WritingPage/CoverUpload";
import CategorySelect from "@/components/WritingPage/CategorySelect";
import AgeRating from "@/components/WritingPage/AgeRating";
import ContentEditor from "@/components/WritingPage/ContentEditor";
import AuthorNote from "@/components/WritingPage/AuthorNote";

import { publishBook, uploadBookDraft } from "@/app/lib/action";

import BookStatusSelector from "./BookStatusSelector";
import { getToken } from "@/app/lib/token";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";
import MobileWritingNotice from "./MobileWritingNotice";
import Alert from "../Main/Alert";

const WritingPage: React.FC = () => {
  const router = useRouter();
  const { user, loading, error: userError, updateUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [bookData, setBookData] = useState<Partial<BookInfo>>({
    title: "",
    description: "",
    category: "female-story",
    ageRating: "allAges",
    status: "ongoing",
    publishStatus: "draft",
    chapters: [],
    authorName: user?.displayName || "",
    authorId: user?.id
  });

  const { t } = useTranslation("book");
  const [fileData, setFileData] = useState<FileUploadData>({
    coverImage: undefined
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (user) {
      setBookData((prev) => ({
        ...prev,
        authorName: user.displayName || "",
        authorId: user.id
      }));
    }
  }, [user]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 假设小于 768px 为移动设备
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showError = (message: string) => {
    setAlertMessage(message);
    setAlertType("error");
    setShowAlert(true);
  };

  const showSuccess = (message: string) => {
    setAlertMessage(message);
    setAlertType("success");
    setShowAlert(true);
  };

  const validateForm = () => {
    if (!bookData.title?.trim()) {
      showError(t("writingPage.enterTitle"));
      document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!bookData.description?.trim()) {
      showError(t("writingPage.enterDescription"));
      document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!fileData.coverImage && !bookData.coverImageUrl) {
      showError(t("writingPage.uploadCover"));
      document.getElementById("cover")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!bookData.category) {
      showError(t("writingPage.selectCategory"));
      document.getElementById("cover")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!bookData.status) {
      showError(t("writingPage.selectBookStatus"));
      document.getElementById("cover")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!bookData.ageRating) {
      showError(t("writingPage.selectAgeRating"));
      document.getElementById("cover")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!bookData.chapters || bookData.chapters.length === 0) {
      showError(t("writingPage.addChapter"));
      document
        .getElementById("content")
        ?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!bookData.chapters[0].title?.trim()) {
      showError(t("writingPage.enterChapterTitle"));
      document
        .getElementById("content")
        ?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    if (!bookData.chapters[0].content?.trim()) {
      showError(t("writingPage.enterChapterContent"));
      document
        .getElementById("content")
        ?.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    return true;
  };

  const handleBookDataChange = (field: keyof BookInfo, value: any) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChapterUpdate = (updatedChapter: Partial<ChapterInfo>) => {
    setBookData((prev) => {
      const existingChapterIndex = prev.chapters?.findIndex(
        (chapter) => chapter.id === updatedChapter.id
      );

      if (existingChapterIndex === -1 || existingChapterIndex === undefined) {
        return {
          ...prev,
          chapters: [...(prev.chapters || []), updatedChapter as ChapterInfo]
        };
      } else {
        return {
          ...prev,
          chapters: prev.chapters!.map((chapter, index) =>
            index === existingChapterIndex
              ? { ...chapter, ...updatedChapter }
              : chapter
          )
        };
      }
    });
  };

  const saveOrPublishBook = async (publishStatus: "draft" | "published") => {
    console.log("Starting saveOrPublishBook function", { publishStatus });

    if (validateForm()) {
      try {
        if (!user) {
          throw new Error("用户未登录");
        }

        const token = getToken();
        if (!token) {
          throw new Error("未找到认证token");
        }

        let coverImageFile: File | null = null;
        let coverImageUrl: string | undefined = undefined;
        if (fileData.coverImage) {
          coverImageFile = fileData.coverImage;
        } else if (bookData.coverImageUrl) {
          coverImageUrl = bookData.coverImageUrl;
        } else {
          throw new Error(t("writingPage.uploadCover"));
        }

        const bookDataToSave: Omit<
          BookInfo,
          | "id"
          | "lastSaved"
          | "createdAt"
          | "latestChapterNumber"
          | "latestChapterTitle"
          | "followersCount"
          | "commentsCount"
          | "authorAvatarUrl"
          | "favoritesCount"
          | "authorFollowersCount"
          | "income24h"
          | "totalIncome"
          | "donationIncome"
          | "adIncome"
          | "monthlyIncome"
          | "wordCount"
          | "tags"
          | "authorIntroduction"
        > = {
          title: bookData.title || "",
          description: bookData.description || "",
          category: bookData.category!,
          ageRating: bookData.ageRating!,
          status: bookData.status!,
          publishStatus,
          authorName: user.displayName || "",
          authorId: user.id,
          chapters: bookData.chapters,
          coverImageUrl: coverImageUrl
        };

        const saveFunction =
          publishStatus === "draft" ? uploadBookDraft : publishBook;
        const response = await saveFunction(
          coverImageFile,
          bookDataToSave,
          token
        );

        if (response.code === 200) {
          setBookData((prev) => ({
            ...prev,
            ...response.data,
            publishStatus
          }));
          showSuccess(
            publishStatus === "draft"
              ? t("writingPage.draftSaved")
              : t("writingPage.contentPublished")
          );
          setTimeout(() => {
            router.push(`/studio/${user.id}`);
          }, 2000);
        } else {
          throw new Error(
            publishStatus === "draft"
              ? t("writingPage.saveDraftFailed")
              : t("writingPage.publishContentFailed")
          );
        }
      } catch (error) {
        // 总是使用国际化的错误消息
        showError(
          publishStatus === "draft"
            ? t("writingPage.saveDraftFailed")
            : t("writingPage.publishContentFailed")
        );

        // 可以在这里记录实际的错误，以便于调试
        console.error("Error in saveOrPublishBook:", error);
      }
    }
  };

  const handleSaveDraft = () => saveOrPublishBook("draft");
  const handlePublish = () => saveOrPublishBook("published");

  const handleStatusChange = (status: BookInfo["status"]) => {
    handleBookDataChange("status", status);
  };

  if (userError) {
    return <div>{t("writingPage.userError", { error: userError })}</div>;
  }

  if (!user) {
    return <div>{t("writingPage.noUserInfo")}</div>;
  }

  if (isMobile) {
    return <MobileWritingNotice />;
  }
  return (
    <div className="font-sans">
      <div className="flex  bg-white">
        <WritingSidebar
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          publishStatus={bookData.publishStatus as BookInfo["publishStatus"]}
        />
        <div className="w-full px-20 flex justify-center  ">
          <form className="" onSubmit={(e) => e.preventDefault()}>
            <div id="intro" className="py-16  ">
              <BookIntro
                book={{
                  title: bookData.title || "",
                  description: bookData.description || ""
                }}
                onBookChange={(updates) =>
                  setBookData((prev) => ({ ...prev, ...updates }))
                }
              />
            </div>
            <div id="cover" className="pt-16">
              <CoverUpload
                bookTitle={bookData.title || ""}
                coverImage={fileData.coverImage || undefined}
                coverImageUrl={bookData.coverImageUrl || ""}
                onCoverChange={(file, url) => {
                  setFileData((prev) => ({ ...prev, coverImage: file }));
                  setBookData((prev) => ({ ...prev, coverImageUrl: url }));
                }}
              />
              <div className="py-16">
                <CategorySelect
                  value={bookData.category || "female-story"}
                  onChange={(category) =>
                    handleBookDataChange("category", category)
                  }
                />
              </div>
              <BookStatusSelector
                status={bookData.status || "ongoing"}
                onStatusChange={handleStatusChange}
              />
              <div className="py-6">
                <AgeRating
                  value={bookData.ageRating || "allAges"}
                  onChange={(ageRating) =>
                    handleBookDataChange("ageRating", ageRating)
                  }
                />
              </div>
            </div>
            <div id="content" className="pt-16">
              <ContentEditor
                chapter={
                  bookData.chapters?.[0] ??
                  ({
                    bookId: bookData.id!,
                    title: "",
                    content: ""
                  } as ChapterInfo)
                }
                onContentChange={handleChapterUpdate}
              />
            </div>
            <div id="authornote" className="h-screen pt-16">
              <AuthorNote
                authorNote={bookData.chapters?.[0]?.authorNote || ""}
                onAuthorNoteChange={(newNote) =>
                  handleChapterUpdate({
                    ...bookData.chapters?.[0],
                    authorNote: newNote
                  })
                }
              />
            </div>
          </form>
        </div>
      </div>

      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
          autoClose={true}
        />
      )}
    </div>
  );
};

export default WritingPage;

"use client";
import React, { useState, useEffect } from "react";
import { BookInfo, ChapterInfo, CreatorUserInfo } from "@/app/lib/definitions";
import Navbar from "@/components/Navbar";
import WritingSidebar from "@/components/WritingPage/WritingSidebar";
import BookIntro from "@/components/WritingPage/BookIntro";
import CoverUpload from "@/components/WritingPage/CoverUpload";
import CategorySelect from "@/components/WritingPage/CategorySelect";
import AgeRating from "@/components/WritingPage/AgeRating";
import ContentEditor from "@/components/WritingPage/ContentEditor";
import AuthorNote from "@/components/WritingPage/AuthorNote";

import { updateUserType, uploadBookDraft } from "@/app/lib/action";
import { toast } from "react-toastify";
import { NewUserView } from "./NewUserView";
import useUserInfo from "../useUserInfo";
import BookStatusSelector from "./BookStatusSelector";

const WritingPage: React.FC = () => {
  const { user, loading, error, refetch, updateUser } = useUserInfo();
  const [bookData, setBookData] = useState<Partial<BookInfo>>({
    title: "",
    description: "",
    category: "female-story",
    ageRating: "allAges",
    authorNote: "",
    status: "ongoing",
    wordCount: 0
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [chapters, setChapters] = useState<ChapterInfo[]>([
    {
      id: 1,
      chapterNumber: 1,
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount: 0
    }
  ]);
  const [bookStatus, setBookStatus] = useState<BookInfo["status"]>("ongoing");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 新增 validateForm 函数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookData.title?.trim()) newErrors.title = "请输入标题";
    if (!bookData.coverImage) newErrors.coverImage = "请上传封面图片";
    if (!bookData.category) newErrors.category = "请选择类别";
    if (!bookData.status) newErrors.status = "请选择书籍状态";
    if (!bookData.ageRating) newErrors.ageRating = "请选择年龄分级";
    if (chapters.length === 0 || !chapters[0].content?.trim())
      newErrors.content = "请输入正文内容";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStatusChange = (newStatus: BookInfo["status"]) => {
    setBookStatus(newStatus);
    // 这里可以添加其他逻辑，比如更新服务器等
  };

  const handleBookDataChange = (field: keyof BookInfo, value: any) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChapterUpdate = (updatedChapter: Partial<ChapterInfo>) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === updatedChapter.id
          ? { ...chapter, ...updatedChapter }
          : chapter
      )
    );
  };

  const handleSaveDraft = async () => {
    if (validateForm())
      try {
        await handleUpload("draft");
        toast.success("草稿已保存");
      } catch (error) {
        toast.error("保存草稿失败，请重试");
      }
    else {
      toast.error("请填写所有必填字段");
    }
  };

  const handlePublish = async () => {
    if (validateForm()) {
      try {
        await handleUpload("published");
        toast.success("内容已发布");
      } catch (error) {
        console.error("发布内容失败:", error);
        toast.error("发布内容失败，请重试");
      }
    } else {
      toast.error("请填写所有必填字段");
    }
  };

  const handleUpload = async (status: "draft" | "published") => {
    if (!coverImage) {
      toast.error("请上传封面图片");
      return;
    }

    try {
      const response = await uploadBookDraft(
        coverImage,
        {
          ...bookData,
          wordCount: chapters.reduce(
            (total, chapter) => total + (chapter.wordCount || 0),
            0
          )
        } as Omit<
          BookInfo,
          | "id"
          | "coverImageUrl"
          | "coverImage"
          | "authorId"
          | "createdAt"
          | "lastSaved"
          | "latestChapterNumber"
          | "latestChapterTitle"
          | "followersCount"
          | "chapters"
        >,
        status
      );

      setBookData(response.data);
      toast.success(status === "draft" ? "草稿已保存" : "文章已发布");
    } catch (error) {
      console.error("上传失败:", error);
      toast.error("上传失败，请重试");
    }
  };
  const handleUserTypeChange = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("未找到认证token");
      }

      if (!user) {
        throw new Error("未找到用户信息");
      }

      const response = await updateUserType(user.id, token);

      // 更新本地用户状态
      if (response.data.userType === "creator") {
        const updatedUser: CreatorUserInfo = {
          ...user,
          userType: "creator",
          articlesCount: 0,
          followersCount: 0,
          followingCount: 0,
          favoritesCount: 0
        };
        // 假设你有一个更新用户信息的函数
        updateUser(updatedUser);
      }

      toast.success("成功成为创作者！");
    } catch (error) {
      console.error("更新用户类型失败:", error);
      toast.error("更新用户类型失败，请重试");
    }
  };

  // [新增] 处理加载状态
  if (loading) {
    return <div>Loading...</div>;
  }

  // [新增] 处理错误状态
  if (error) {
    return <div>Error: {error}</div>;
  }

  // [新增] 处理无用户信息的情况
  if (!user) {
    return <div>No user information available</div>;
  }

  return (
    <div className="font-sans">
      <Navbar />
      {user.userType === "regular" ? (
        <NewUserView user={user} onUserTypeChange={handleUserTypeChange} />
      ) : (
        <div className="flex">
          <WritingSidebar
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            publishStatus={bookData.status as BookInfo["publishStatus"]}
          />
          <div className=" w-2/3 px-20 ">
            <form className="space-y-10">
              <div id="intro">
                <BookIntro
                  book={{
                    title: bookData.title || "",
                    description: bookData.description || ""
                  }}
                  error={errors.title}
                  onBookChange={(updates) =>
                    setBookData((prev) => ({ ...prev, ...updates }))
                  }
                />
              </div>
              <div id="cover">
                <CoverUpload
                  coverImage={coverImage}
                  coverImageUrl={bookData.coverImageUrl || null}
                  onCoverChange={(file, url) => {
                    setCoverImage(file);
                    handleBookDataChange("coverImageUrl", url);
                  }}
                  error={errors.coverImage}
                />
                <CategorySelect
                  value={bookData.category || "female-story"}
                  onChange={(category) =>
                    handleBookDataChange("category", category)
                  }
                  error={errors.category}
                />
                <BookStatusSelector
                  status={bookStatus}
                  onStatusChange={handleStatusChange}
                  error={errors.status}
                />
                <AgeRating
                  value={bookData.ageRating || "allAges"}
                  onChange={(ageRating) =>
                    handleBookDataChange("ageRating", ageRating)
                  }
                  error={errors.ageRating}
                />
              </div>
              <div id="content">
                <ContentEditor
                  chapter={chapters[0]}
                  onChapterUpdate={handleChapterUpdate}
                  error={errors.content}
                />
              </div>
              <div id="authornote">
                <AuthorNote
                  authorNote={bookData.authorNote || ""}
                  onAuthorNoteChange={(newNote) =>
                    handleBookDataChange("authorNote", newNote)
                  }
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingPage;

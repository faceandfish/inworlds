"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookInfo,
  ChapterInfo,
  CreatorUserInfo,
  FileUploadData
} from "@/app/lib/definitions";

import WritingSidebar from "@/components/WritingPage/WritingSidebar";
import BookIntro from "@/components/WritingPage/BookIntro";
import CoverUpload from "@/components/WritingPage/CoverUpload";
import CategorySelect from "@/components/WritingPage/CategorySelect";
import AgeRating from "@/components/WritingPage/AgeRating";
import ContentEditor from "@/components/WritingPage/ContentEditor";
import AuthorNote from "@/components/WritingPage/AuthorNote";

import { publishBook, updateUserType, uploadBookDraft } from "@/app/lib/action";
import { toast } from "react-toastify";
import { NewUserView } from "./NewUserView";
import { useUserInfo } from "../useUserInfo";
import BookStatusSelector from "./BookStatusSelector";
import { getToken } from "@/app/lib/token";

const WritingPage: React.FC = () => {
  const router = useRouter();
  // 使用自定义钩子获取用户信息
  const { user, loading, error, updateUser } = useUserInfo();

  // 书籍数据状态
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

  const [fileData, setFileData] = useState<FileUploadData>({
    coverImage: undefined
  });

  // 表单错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 表单验证函数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookData.title?.trim()) {
      console.log("Title is empty");
      newErrors.title = "请输入标题";
    }
    if (!fileData.coverImage) {
      console.log("Cover image is missing");
      newErrors.coverImage = "请上传封面图片";
    }
    if (!bookData.category) {
      console.log("Category is not selected"); // 新增：日志
      newErrors.category = "请选择类别";
    }
    if (!bookData.status) {
      console.log("Book status is not selected"); // 新增：日志
      newErrors.status = "请选择书籍状态";
    }
    if (!bookData.ageRating) newErrors.ageRating = "请选择年龄分级";
    if (!bookData.chapters || bookData.chapters.length === 0) {
      console.log("No chapters found");
      newErrors.content = "请输入正文内容";
    } else if (!bookData.chapters[0].content?.trim()) {
      console.log("First chapter content is empty");
      newErrors.content = "正文内容不能为空";
    }
    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    if (user) {
      setBookData((prev) => ({
        ...prev,
        authorName: user.displayName || "",
        authorId: user.id
      }));
    }
  }, [user]);

  // 处理书籍数据变化
  const handleBookDataChange = (field: keyof BookInfo, value: any) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  // 处理章节更新
  const handleChapterUpdate = (updatedChapter: Partial<ChapterInfo>) => {
    setBookData((prev) => {
      const existingChapterIndex = prev.chapters?.findIndex(
        (chapter) => chapter.id === updatedChapter.id
      );

      if (existingChapterIndex === -1 || existingChapterIndex === undefined) {
        // 如果章节不存在，创建新章节
        console.log("Creating new chapter:", updatedChapter); // 新增：日志
        return {
          ...prev,
          chapters: [...(prev.chapters || []), updatedChapter as ChapterInfo]
        };
      } else {
        // 更新现有章节
        console.log("Updating existing chapter:", updatedChapter); // 新增：日志
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
    console.log("Attempting to save or publish book:", bookData, fileData); // 新增：日志
    if (validateForm()) {
      try {
        if (!fileData.coverImage) {
          throw new Error("请上传封面图片");
        }

        // 确保所有必需字段都有值
        if (
          !bookData.title ||
          !bookData.category ||
          !bookData.ageRating ||
          !bookData.status
        ) {
          throw new Error("缺少必要的书籍信息");
        }

        if (!user) {
          throw new Error("用户未登录");
        }

        const token = getToken();
        if (!token) {
          throw new Error("未找到认证token");
        }

        const bookDataToSave: Omit<
          BookInfo,
          | "id"
          | "coverImageUrl"
          | "lastSaved"
          | "createdAt"
          | "latestChapterNumber"
          | "latestChapterTitle"
          | "followersCount"
          | "commentsCount"
          | "authorAvatarUrl"
        > = {
          title: bookData.title,
          description: bookData.description || "",
          category: bookData.category,
          ageRating: bookData.ageRating,
          status: bookData.status,
          publishStatus,
          authorName: user.displayName || "",
          authorId: user.id,
          wordCount: bookData.wordCount,
          tags: bookData.tags,
          chapters: bookData.chapters
        };

        const saveFunction =
          publishStatus === "draft" ? uploadBookDraft : publishBook;
        const response = await saveFunction(
          fileData.coverImage,
          bookDataToSave,
          token
        );

        if (response.code === 200 || response.msg === "成功") {
          console.log("保存成功:", response.data);
          setBookData((prev) => ({
            ...prev,
            ...response.data,
            publishStatus
          }));
          toast.success(
            publishStatus === "draft" ? "草稿已保存" : "内容已发布"
          );
          // 根据操作类型跳转到不同的页面
          if (publishStatus === "draft") {
            router.push(`/studio/${user.id}`); // 假设草稿页面的路径是 /my-drafts
          } else {
            router.push(`/studio/${user.id}`); // 假设已发布书籍页面的路径是 /my-books
          }
        } else {
          throw new Error(
            response.msg ||
              `${publishStatus === "draft" ? "保存草稿" : "发布内容"}失败`
          );
        }
      } catch (error) {
        console.error(
          `${publishStatus === "draft" ? "保存草稿" : "发布内容"}失败:`,
          error
        );
        toast.error(
          error instanceof Error
            ? error.message
            : `${
                publishStatus === "draft" ? "保存草稿" : "发布内容"
              }失败，请重试`
        );
      }
    } else {
      console.log("Form validation failed"); // 新增：日志
      toast.error("请填写所有必填字段");
    }
  };

  const handleSaveDraft = () => saveOrPublishBook("draft");
  const handlePublish = () => saveOrPublishBook("published");

  // 处理用户类型变更（普通用户变为创作者）
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
        // 更新用户信息
        updateUser(updatedUser);
      }

      toast.success("成功成为创作者！");
    } catch (error) {
      console.error("更新用户类型失败:", error);
      toast.error("更新用户类型失败，请重试");
    }
  };

  const handleStatusChange = (status: BookInfo["status"]) => {
    handleBookDataChange("status", status);
  };

  // 处理加载状态
  if (loading) {
    return <div>Loading...</div>;
  }

  // 处理错误状态
  if (error) {
    return <div>Error: {error}</div>;
  }

  // 处理无用户信息的情况
  if (!user) {
    return <div>No user information available</div>;
  }

  return (
    <div className="font-sans">
      {user.userType === "regular" ? (
        // 显示新用户视图，提示用户成为创作者
        <NewUserView user={user} onUserTypeChange={handleUserTypeChange} />
      ) : (
        // 显示创作页面
        <div className="flex">
          <WritingSidebar
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            publishStatus={bookData.publishStatus as BookInfo["publishStatus"]}
          />
          <div className=" w-2/3 px-20 bg-white pt-10">
            <form className="space-y-20 " onSubmit={(e) => e.preventDefault()}>
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
                  coverImage={fileData.coverImage || undefined}
                  coverImageUrl={bookData.coverImageUrl!}
                  onCoverChange={(file, url) => {
                    setFileData((prev) => ({ ...prev, coverImage: file }));
                    setBookData((prev) => ({ ...prev, coverImageUrl: url }));
                  }}
                />
                <CategorySelect
                  value={bookData.category || "female-story"}
                  onChange={(category) =>
                    handleBookDataChange("category", category)
                  }
                  error={errors.category}
                />
                <BookStatusSelector
                  status={bookData.status || "ongoing"}
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
              <div id="authornote">
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
      )}
    </div>
  );
};

export default WritingPage;

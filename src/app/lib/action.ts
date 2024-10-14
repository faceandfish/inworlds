import {
  CreateUserRequest,
  LoginRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserInfo,
  ApiResponse,
  BookInfo,
  PaginatedData,
  ChapterInfo,
  CommentInfo,
  AnalyticsData,
  Conversation,
  SystemNotification,
  Message,
  FileUploadData,
  PublicUserInfo,
  SearchResult,
  PasswordChangeResponse,
  PayPalOrderRequest,
  PayPalOrderResponse,
  ConfirmPayPalOrderResponse,
  ConfirmPayPalOrderRequest,
  DonationHistory,
  PurchaseHistory,
  UserBalance,
  SponsorInfo,
  TipResponse,
  ChapterPaymentResponse,
  PurchasedChapterInfo
} from "./definitions";
import { getToken, removeToken, setToken } from "./token";
import axios, { AxiosError, AxiosResponse } from "axios";

let token: string | null = null;

// 创建 axios 实例
const api = axios.create({
  baseURL: "http://13.208.244.92:8088/inworlds/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// 设置认证 token
export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// 移除认证 token
export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

// 登录函数
export const login = async (
  username: string,
  password: string
): Promise<ApiResponse<string>> => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response: AxiosResponse<ApiResponse<string>> = await api.post(
      "/login",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const handleGoogleLogin = async (
  email: string,
  name: string,
  picture: string
): Promise<ApiResponse<string>> => {
  try {
    const response: AxiosResponse<ApiResponse<string>> = await api.post(
      "/login/google",
      {
        email,
        name,
        picture
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Google 登录失败");
    }

    return response.data;
  } catch (error) {
    console.error("Google 登录处理出错:", error);
    throw error;
  }
};

export const getUserInfo = async (
  token: string
): Promise<ApiResponse<UserInfo>> => {
  try {
    const response: AxiosResponse<ApiResponse<UserInfo>> = await api.get(
      "/user/principal",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error("获取用户信息失败，请登录");
    }

    return response.data;
  } catch (error) {
    console.error("获取用户信息时出错:", error);
    return {
      code: error instanceof Error && error.message ? 400 : 500,
      msg: error instanceof Error ? error.message : "获取用户信息时出错",
      data: null as unknown as UserInfo // 类型断言以满足返回类型要求
    };
  }
};

export async function logout(): Promise<{ code: number; msg: string }> {
  const token = getToken();
  if (!token) {
    console.error("在localStorage中未找到token");
    throw new Error("未找到证token");
  }

  try {
    console.log("尝试从API获取数据");
    const response = await api.post<{ code: number; msg: string }>(
      "/logout",
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("收到API响应，状态:", response.status);

    const result = response.data;
    console.log("API结果:", result);

    removeToken();

    return result;
  } catch (error) {
    removeToken();

    return { code: 500, msg: "Logout failed, but local session cleared" };
  }
}

export async function register(
  credentials: CreateUserRequest
): Promise<ApiResponse<string>> {
  try {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("rePassword", credentials.rePassword);
    formData.append("email", credentials.email);

    const response: AxiosResponse<ApiResponse<string>> = await api.post(
      "/register",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const responseData = error.response.data as ApiResponse<string>;
      if (responseData.code === 701 || responseData.code === 702) {
        return responseData;
      }
    }
    console.error("注册失败:", error);
    throw error;
  }
}

export const updateProfile = async (
  updateData: UpdateUserRequest
): Promise<ApiResponse<UserInfo>> => {
  console.log("Sending update request with:", updateData);
  try {
    const token = getToken();
    const response = await api.put<ApiResponse<UserInfo>>(
      "/user/profile",
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "更新个人资料失败");
    }

    return response.data;
  } catch (error) {
    console.error("更新个人资料时出错:", error);
    throw error;
  }
};

export const uploadAvatar = async (
  fileData: FileUploadData
): Promise<ApiResponse<string>> => {
  try {
    const token = getToken();
    const formData = new FormData();
    if (fileData.avatarImage) {
      formData.append("avatarImage", fileData.avatarImage);
    }

    const response = await api.post<ApiResponse<string>>(
      "/user/avatar",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "上传头像失败");
    }

    return response.data;
  } catch (error) {
    console.error("上传头像时出错:", error);
    throw error;
  }
};

export const changePassword = async (
  passwordData: ChangePasswordRequest
): Promise<PasswordChangeResponse> => {
  try {
    const token = getToken();
    const response = await api.put<PasswordChangeResponse>(
      "/user/password",
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 无论响应码如何，都返回响应数据
    return response.data;
  } catch (error) {
    console.error("修改密码时出错:", error);
    // 如果发生网络错误或其他异常，返回一个格式化的错误响应
    return {
      code: 500,
      msg: error instanceof Error ? error.message : "修改密码时发生未知错误",
      data: null
    };
  }
};

export const uploadBookDraft = async (
  coverImage: File,
  bookData: Omit<
    BookInfo,
    | "id"
    | "coverImageUrl"
    | "createdAt"
    | "lastSaved"
    | "latestChapterNumber"
    | "latestChapterTitle"
    | "followersCount"
    | "commentsCount"
    | "authorAvatarUrl"
    | "income24h"
    | "totalIncome"
    | "donationIncome"
    | "adIncome"
    | "monthlyIncome"
  >,
  token: string
): Promise<ApiResponse<BookInfo>> => {
  try {
    const formData = new FormData();
    formData.append("coverImage", coverImage);

    const bookDataWithStatus = {
      ...bookData,
      publishStatus: "draft"
    };

    formData.append("bookData", JSON.stringify(bookDataWithStatus));

    const response = await api.post<ApiResponse<BookInfo>>(
      "/book/draft",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code === 200 && response.data.msg === "成功") {
      return response.data;
    } else {
      // 如果code不是200，或者没有data，才抛出错误
      throw new Error(response.data.msg || "服务器返回的数据无效");
    }
  } catch (error) {
    console.error("Error uploading book draft:", error);
    throw error;
  }
};

export const updateUserType = async (
  userId: UserInfo["id"], // 使用 UserInfo['id'] 来确保类型一致性
  token: string
): Promise<ApiResponse<UserInfo>> => {
  try {
    const response = await api.put<ApiResponse<UserInfo>>(
      `/user/${userId}/type`,
      { userType: "creator" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "更新用户类型失败");
    }

    return response.data;
  } catch (error) {
    console.error("更新用户类型时出错:", error);
    throw error;
  }
};

export const publishBook = async (
  coverImage: File,
  bookData: Omit<
    BookInfo,
    | "id"
    | "coverImageUrl"
    | "createdAt"
    | "lastSaved"
    | "latestChapterNumber"
    | "latestChapterTitle"
    | "followersCount"
    | "commentsCount"
    | "authorAvatarUrl"
    | "income24h"
    | "totalIncome"
    | "donationIncome"
    | "adIncome"
    | "monthlyIncome"
  >,
  token: string
): Promise<ApiResponse<BookInfo>> => {
  try {
    const formData = new FormData();
    formData.append("coverImage", coverImage);

    const bookDataWithStatus = {
      ...bookData,
      publishStatus: "published"
    };

    formData.append("bookData", JSON.stringify(bookDataWithStatus));

    const response = await api.post<ApiResponse<BookInfo>>(
      "/book/publish",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code === 200 && response.data.msg === "���功") {
      return response.data;
    } else {
      // 如果code不是200，或者没有data，才抛出错误
      throw new Error(response.data.msg || "服务器返回的数据无效");
    }
  } catch (error) {
    console.error("Error uploading book draft:", error);
    throw error;
  }
};

export const fetchBooksList = async (
  userId: number,
  currentPage: number,
  pageSize: number,
  checkStatus: string
): Promise<ApiResponse<PaginatedData<BookInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const params = new URLSearchParams({
      currentPage: currentPage.toString(),
      pageSize: pageSize.toString(),
      checkStatus: checkStatus
    });

    const url = `/user/${userId}/books?${params.toString()}`;

    const response = await api.get<ApiResponse<PaginatedData<BookInfo>>>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("API 原始响应:", response);

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取作品列表失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取作品列表时出错:", error);
    throw error;
  }
};

export const fetchPublicBooksList = async (
  authorId: string
): Promise<ApiResponse<BookInfo[]>> => {
  try {
    const response = await api.get(`/public/books/${authorId}`);
    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取作品列表失败");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching public books list:", error);
    throw error;
  }
};

export const deleteBook = async (
  bookId: number
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(`/book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (response.data.code === 200) {
      return response.data;
    } else {
      throw new Error(response.data.msg || "删除作品失败");
    }
  } catch (error) {
    console.error("删除作品时出错:", error);
    if (error instanceof Error) {
      throw new Error(`删除作品失败: ${error.message}`);
    } else {
      throw new Error("删除作品时发生未知错误");
    }
  }
};

// 获取书籍详情
export const getBookDetails = async (
  bookId: number
): Promise<ApiResponse<BookInfo>> => {
  try {
    const response = await api.get<ApiResponse<BookInfo>>(`/book/${bookId}`);

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取书籍详情失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取书籍详情时出错:", error);
    throw error;
  }
};

// 获取章节列表
export const getChapterList = async (
  bookId: number,
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedData<ChapterInfo>>> => {
  try {
    const response = await api.get<ApiResponse<PaginatedData<ChapterInfo>>>(
      `/book/${bookId}/chapters`,
      {
        params: { currentPage, pageSize }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取章节列表失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取章节列表时出错:", error);
    throw error;
  }
};

// 获取章节内容
export const getChapterContent = async (
  bookId: number,
  chapterNumber: number
): Promise<ApiResponse<ChapterInfo>> => {
  try {
    const response = await api.get<ApiResponse<ChapterInfo>>(
      `/book/${bookId}/chapter/${chapterNumber}`
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取章节内容失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取章节内容时出错:", error);
    throw error;
  }
};

//获取书籍评论
export const getBookComments = async (
  bookId: number,
  currentPage: number,
  pageSize: number
): Promise<ApiResponse<PaginatedData<CommentInfo>>> => {
  try {
    const response = await api.get<ApiResponse<PaginatedData<CommentInfo>>>(
      `/book/${bookId}/comments`,
      {
        params: { currentPage, pageSize }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取评论失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取评论时出错:", error);
    throw error;
  }
};

// 点赞评论
export const likeComment = async (
  commentId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post<ApiResponse<void>>(
      `/comment/${commentId}/like`
    );
    return response.data;
  } catch (error) {
    console.error("点赞评论失败:", error);
    throw error;
  }
};

// 回复评论或添加评论
export const addCommentOrReply = async (
  bookId: number,
  content: string,
  parentCommentId?: number
): Promise<ApiResponse<CommentInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const url = parentCommentId
      ? `/comment/${parentCommentId}/reply`
      : `/book/${bookId}/comment`;

    const response = await api.post<ApiResponse<CommentInfo>>(
      url,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to add comment or reply");
    }

    return response.data;
  } catch (error) {
    console.error("Error adding comment or reply:", error);
    throw error;
  }
};

// 删除评论
export const deleteComment = async (
  commentId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `/comment/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("删除评论失败:", error);
    throw error;
  }
};

// 拉黑用户
export const blockUserInBook = async (
  userId: number,
  bookId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post<ApiResponse<void>>(
      `/book/${bookId}/user/${userId}/block`
    );
    return response.data;
  } catch (error) {
    console.error(
      `拉黑用户失败 (用户ID: ${userId}, 书籍ID: ${bookId}):`,
      error
    );
    throw error;
  }
};

//获取书籍观看数据
export const fetchSingleBookAnalytics = async (
  bookId: number
): Promise<ApiResponse<AnalyticsData>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const url = `/book/${bookId}/analytics`;

    const response = await api.get<ApiResponse<AnalyticsData>>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("API 原始响应:", response);

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取书籍分析数据失败");
    }

    return response.data;
  } catch (error) {
    console.error(`获取书籍 ${bookId} 的分析数据时出错:`, error);
    throw error;
  }
};

//首页内容api

export const fetchHomepageBooks = async (
  page: number,
  limit: number = 20
): Promise<ApiResponse<PaginatedData<BookInfo>>> => {
  try {
    const url = `/books/homepage`;

    const response = await api.get<ApiResponse<PaginatedData<BookInfo>>>(url, {
      params: { page, limit }
    });

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取书籍列表失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取书籍列表时出错:", error);
    throw error;
  }
};

//message:
// // 获取对话列表
// export const fetchConversations = async (
//   page: number = 1,
//   pageSize: number = 20
// ): Promise<PaginatedData<Conversation>> => {
//   const response = await api.get<ApiResponse<PaginatedData<Conversation>>>(
//     "/conversations",
//     {
//       params: { page, pageSize },
//       headers: { Authorization: `Bearer ${getToken()}` }
//     }
//   );
//   return response.data.data;
// };

// // 获取特定对话的消息
// export const fetchMessages = async (
//   conversationId: number,
//   page: number = 1,
//   pageSize: number = 20
// ): Promise<PaginatedData<Message>> => {
//   const response = await api.get<ApiResponse<PaginatedData<Message>>>(
//     `/conversations/${conversationId}/messages`,
//     {
//       params: { page, pageSize },
//       headers: { Authorization: `Bearer ${getToken()}` }
//     }
//   );
//   return response.data.data;
// };

// // 发送新消息
// export const sendMessage = async (message: {
//   senderId: number;
//   receiverId: number;
//   content: string;
// }): Promise<Message> => {
//   const response = await api.post<ApiResponse<Message>>("/messages", message, {
//     headers: { Authorization: `Bearer ${getToken()}` }
//   });
//   return response.data.data;
// };

// // 获取当前用户信息
// export const getCurrentUser = async (): Promise<UserInfo> => {
//   const response = await api.get<ApiResponse<UserInfo>>("/user/principal");
//   return response.data.data;
// };

// // 标记对话为已读
// export const markConversationAsRead = async (
//   conversationId: number
// ): Promise<void> => {
//   await api.put<ApiResponse<void>>(`/conversations/${conversationId}/read`);
// };

// 获取其他用户的信息
export const getUserById = async (userId: number): Promise<PublicUserInfo> => {
  try {
    const response = await api.get<ApiResponse<PublicUserInfo>>(
      `/user/${userId}`
    );
    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取用户信息失败");
    }
    return response.data.data;
  } catch (error) {
    console.error("获取用户信息时出错:", error);
    throw error;
  }
};

// 获取系统通知
export const fetchSystemNotifications = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<PaginatedData<SystemNotification>> => {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token available");
  }

  try {
    const response = await api.get<
      ApiResponse<PaginatedData<SystemNotification>>
    >(`/system/notifications?currentPage=${currentPage}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.code !== 200) {
      throw new Error(
        response.data.msg || "Failed to fetch system notifications"
      );
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching system notifications:", error);
    throw error;
  }
};

// ... (existing code)

// Fetch followed authors
export const fetchFollowedAuthors = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedData<PublicUserInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.get<ApiResponse<PaginatedData<PublicUserInfo>>>(
      `/user/following?currentPage=${currentPage}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to fetch followed authors");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching followed authors:", error);
    throw error;
  }
};

//关注
export const followUser = async (
  userId: number
): Promise<ApiResponse<void>> => {
  try {
    const token = getToken();
    const response = await api.post<ApiResponse<void>>(
      `/user/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "关注用户失败");
    }

    return response.data;
  } catch (error) {
    console.error("关注用户时出错:", error);
    throw error;
  }
};

export const unfollowUser = async (
  userId: number
): Promise<ApiResponse<void>> => {
  try {
    const token = getToken();
    const response = await api.post<ApiResponse<void>>(
      `/user/${userId}/unfollow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "取消关注用户失败");
    }

    return response.data;
  } catch (error) {
    console.error("取消关注用户时出错:", error);
    throw error;
  }
};

export const checkFollowStatus = async (userId: number): Promise<boolean> => {
  try {
    const token = getToken();
    const response = await api.get<ApiResponse<{ isFollowing: boolean }>>(
      `/user/${userId}/followstatus`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取关注状态失败");
    }

    return response.data.data.isFollowing;
  } catch (error) {
    console.error("获取关注状态时出错:", error);
    throw error;
  }
};

// 获取公开用户信息
export const fetchUserInfo = async (
  userId: string
): Promise<ApiResponse<PublicUserInfo>> => {
  try {
    const response = await api.get<ApiResponse<PublicUserInfo>>(
      `/user/${userId}`
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取用户信息失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取用户信息时出错:", error);
    throw error;
  }
};

// 更新书籍基本信息
export const updateBookDetails = async (
  bookId: number,
  updateData: Partial<BookInfo>
): Promise<ApiResponse<BookInfo>> => {
  try {
    console.log(
      "Updating book details. BookId:",
      bookId,
      "UpdateData:",
      updateData
    );
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.put<ApiResponse<BookInfo>>(
      `/book/${bookId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("API response:", response.data);
    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "更新书籍信息失败");
    }

    return response.data;
  } catch (error) {
    console.error("更新书籍信息时出错:", error);
    throw error;
  }
};

// 更新书籍封面
export const updateBookCover = async (
  bookId: number,
  coverImage: File
): Promise<ApiResponse<string>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const formData = new FormData();
    formData.append("coverImage", coverImage);

    const response = await api.put<ApiResponse<string>>(
      `/book/${bookId}/cover`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "更新书籍封面失败");
    }

    return response.data;
  } catch (error) {
    console.error("更新书籍封面时出错:", error);
    throw error;
  }
};

// 更新章节内容
export const updateChapter = async (
  bookId: number,
  chapterId: number,
  chapterData: Partial<ChapterInfo>
): Promise<ApiResponse<ChapterInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.put<ApiResponse<ChapterInfo>>(
      `/book/${bookId}/chapter/${chapterId}`,
      chapterData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "更新章节内容失败");
    }

    return response.data;
  } catch (error) {
    console.error("更新章节内容时出错:", error);
    throw error;
  }
};

export const addNewChapter = async (
  bookId: number,
  chapterData: Omit<
    ChapterInfo,
    | "id"
    | "bookId"
    | "createdAt"
    | "lastModified"
    | "income24h"
    | "totalIncome"
    | "donationIncome"
  >
): Promise<ApiResponse<ChapterInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.post<ApiResponse<ChapterInfo>>(
      `/book/${bookId}/chapter`,
      chapterData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("[addNewChapter] Response received:", response);
    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to add new chapter");
    }

    return response.data;
  } catch (error) {
    console.error("Error adding new chapter:", error);
    throw error;
  }
};

export const fetchIncomeData = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedData<BookInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.get<ApiResponse<PaginatedData<BookInfo>>>(
      `/user/books/income`,
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to fetch income data");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching income data:", error);
    throw error;
  }
};

//收藏书籍
// 在 action.ts 文件中添加以下函数

export const favoriteBook = async (
  bookId: number
): Promise<ApiResponse<void>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.post<ApiResponse<void>>(
      `/book/${bookId}/favorite`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "收藏书籍失败");
    }

    return response.data;
  } catch (error) {
    console.error("收藏书籍时出错:", error);
    throw error;
  }
};

// 取消收藏书籍
export const unfavoriteBook = async (
  bookId: number
): Promise<ApiResponse<void>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.post<ApiResponse<void>>(
      `/book/${bookId}/unfavorite`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "取消收藏书籍失败");
    }

    return response.data;
  } catch (error) {
    console.error("取消收藏书籍时出错:", error);
    throw error;
  }
};

// 获取用户收藏列表
export const getUserFavorites = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedData<BookInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.get<ApiResponse<PaginatedData<BookInfo>>>(
      `/user/favorites?currentPage=${currentPage}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取收藏列表失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取收藏列表时出错:", error);
    throw error;
  }
};

export const checkBookFavoriteStatus = async (
  bookId: number
): Promise<ApiResponse<boolean>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    console.log("Checking favorite status for book:", bookId);

    const response = await api.get<ApiResponse<boolean>>(
      `/book/${bookId}/favorite-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Raw API response:", response);

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取书籍收藏状态失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取书籍收藏状态时出错:", error);
    throw error;
  }
};

// 搜索
export const searchBooks = async (
  query: string
): Promise<ApiResponse<SearchResult>> => {
  try {
    const response = await api.get<ApiResponse<SearchResult>>(`/search`, {
      params: { query }
    });

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "找不到相关内容");
    }

    return response.data;
  } catch (error) {
    console.error("搜索书籍时出错:", error);
    throw error;
  }
};

export const getSearchHistory = async (): Promise<ApiResponse<string[]>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.get<ApiResponse<string[]>>("/search/history", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to fetch search history");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching search history:", error);
    throw error;
  }
};

//paypal
export const createPayPalOrder = async (
  orderData: PayPalOrderRequest
): Promise<ApiResponse<PayPalOrderResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.post<ApiResponse<PayPalOrderResponse>>(
      "/create/order",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.code !== 200) {
      console.error("API Error Response:", response.data);
      throw new Error(response.data.msg || "Failed to create PayPal order");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
};

export const confirmPayPalOrder = async (
  orderData: ConfirmPayPalOrderRequest
): Promise<ApiResponse<ConfirmPayPalOrderResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.post<ApiResponse<ConfirmPayPalOrderResponse>>(
      "/confirm/order",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to confirm PayPal order");
    }

    return response.data;
  } catch (error) {
    console.error("Error confirming PayPal order:", error);
    throw error;
  }
};

// 获取用户余额
export const getUserBalance = async (): Promise<ApiResponse<UserBalance>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.get<ApiResponse<UserBalance>>("/user/balance", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取用户余额失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取用户余额时出错:", error);
    throw error;
  }
};

// 获取购买历史
export const getPurchaseHistory = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedData<PurchaseHistory>>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.get<ApiResponse<PaginatedData<PurchaseHistory>>>(
      "/user/purchase/history",
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取购买历史失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取购买历史时出错:", error);
    throw error;
  }
};

// 获取打赏历史
export const getDonationHistory = async (
  currentPage: number = 1,
  pageSize: number = 5
): Promise<ApiResponse<PaginatedData<DonationHistory>>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token 不可用，请重新登录");
    }

    const response = await api.get<ApiResponse<PaginatedData<DonationHistory>>>(
      "/user/donation/history",
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取打赏历史失败");
    }

    return response.data;
  } catch (error) {
    console.error("获取打赏历史时出错:", error);
    throw error;
  }
};

export const getSponsorList = async (
  userId: string,
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedData<SponsorInfo>>> => {
  try {
    const response: AxiosResponse<ApiResponse<PaginatedData<SponsorInfo>>> =
      await api.get(`/user/${userId}/sponsors`, {
        params: { currentPage, pageSize }
      });

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to fetch sponsor list");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching sponsor list:", error);
    throw error;
  }
};

// Pay for a chapter
export const payForChapter = async (
  bookId: number,
  chapterId: number
): Promise<ApiResponse<ChapterPaymentResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.post<ApiResponse<ChapterPaymentResponse>>(
      `/book/${bookId}/chapter/${chapterId}/pay`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    switch (response.data.code) {
      case 200:
        return response.data; // 付费成功
      case 601:
        return response.data; // 返回已购买的响应
      case 602:
        return response.data;
      default:
        throw new Error(response.data.msg || "Failed to pay for chapter");
    }
  } catch (error) {
    console.error("Error paying for chapter:", error);
    throw error;
  }
};

// Tip (donate to) an author
export const tipAuthor = async (
  authorId: number,
  coins: number,
  bookId?: number,
  chapterId?: number
): Promise<ApiResponse<TipResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const tipData = {
      coins,
      bookId,
      chapterId
    };

    console.log("Sending tip request:", { authorId, ...tipData });

    const response = await api.post<ApiResponse<TipResponse>>(
      `/user/${authorId}/tip`,
      tipData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Raw API response:", response);

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "Failed to tip author");
    }

    return response.data;
  } catch (error) {
    console.error("Error tipping author:", error);
    throw error;
  }
};

//章节购买记录
export const getBookPurchasedChapters = async (
  currentPage: number = 1,
  pageSize: number = 5,
  bookId?: number
): Promise<ApiResponse<PaginatedData<PurchasedChapterInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token not available. Please log in again.");
    }

    const response = await api.get<
      ApiResponse<PaginatedData<PurchasedChapterInfo>>
    >("/book/chapters/purchased", {
      params: { bookId, currentPage, pageSize },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.code !== 200) {
      throw new Error(
        response.data.msg || "Failed to fetch purchased chapters"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching purchased chapters:", error);
    throw error;
  }
};

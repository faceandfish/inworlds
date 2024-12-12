import { Locale } from "../i18n-config";
import https from "https";
import {
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserInfo,
  ApiResponse,
  ApiErrorResponse,
  ApiResult,
  BookInfo,
  PaginatedData,
  ChapterInfo,
  CommentInfo,
  AnalyticsData,
  SystemNotification,
  FileUploadData,
  PublicUserInfo,
  SearchResult,
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
  PurchasedChapterInfo,
  IncomeBookInfo,
  SearchHistoryItem,
  ReadingStats,
  TransferToWalletResponse,
  PaginatedTransferRecords,
  PaginatedBankCards,
  AddBankCardRequest,
  BankCard,
  WithdrawRequest,
  WithdrawResponse,
  PaginatedWithdrawRecords,
  LikeResponse
} from "./definitions";
import { getToken, removeToken, setToken } from "./token";
import axios, { AxiosResponse } from "axios";

// 统一的错误处理工具函数现在返回 ApiErrorResponse
const handleApiError = (error: any, context: string): ApiErrorResponse => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}] Error:`, error);
  }

  // 检查是否是预期的 API 错误响应
  if (axios.isAxiosError(error) && error.response?.data?.code) {
    return error.response.data;
  }

  // 返回通用错误响应
  return {
    code: 500,
    msg: "An unexpected error occurred"
  };
};

// 创建 axios 实例
const api = axios.create({
  //baseURL: "https://api.inworlds.xyz/inworlds/api",
  baseURL: "http://192.168.0.103:8088/inworlds/api",
  headers: {
    "Content-Type": "application/json"
  },
  httpsAgent: new https.Agent({
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.3",
    secureProtocol: "TLSv1_2_method"
  })
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      removeToken();
    }
    return Promise.reject(error);
  }
);

// 登录函数
export const login = async (
  username: string,
  password: string
): Promise<ApiResult<string>> => {
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

    if (response.data.code === 200) {
      setToken(response.data.data);
    }

    return response.data;
  } catch (error) {
    return handleApiError(error, "login");
  }
};

export const handleGoogleLogin = async (
  email: string,
  name: string,
  picture: string
): Promise<ApiResult<string>> => {
  try {
    const response = await api.post("/login/google", { email, name, picture });
    if (response.data.code === 200) {
      setToken(response.data.data);
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, "handleGoogleLogin");
  }
};

export const getUserInfo = async (): Promise<ApiResult<UserInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get("/user/principal", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "getUserInfo");
  }
};

export const logout = async (): Promise<ApiErrorResponse> => {
  const token = getToken();
  if (!token) {
    return {
      code: 200,
      msg: ""
    };
  }

  try {
    const response = await api.post<ApiErrorResponse>("/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = response.data;
    removeToken();
    return result;
  } catch (error) {
    removeToken();
    return handleApiError(error, "logout");
  }
};

export const register = async (
  credentials: CreateUserRequest
): Promise<ApiResult<string>> => {
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
    return handleApiError(error, "register");
  }
};

// 需要token验证的用户语言设置 - 会存储到数据库
export const updateUserLanguage = async (
  language: Locale
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.put<ApiResponse<void>>(
      "/user/language",
      { language },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateUserLanguage");
  }
};

export const updatePublicLanguage = async (
  language: Locale
): Promise<ApiResult<void>> => {
  try {
    const response = await api.put<ApiResponse<void>>("/user/public/language", {
      language
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "updatePublicLanguage");
  }
};

export const updateProfile = async (
  updateData: UpdateUserRequest
): Promise<ApiResult<UserInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

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

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateProfile");
  }
};

export const uploadAvatar = async (
  fileData: FileUploadData
): Promise<ApiResult<string>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateProfile");
  }
};

export const changePassword = async (
  passwordData: ChangePasswordRequest
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.put<ApiResponse<void>>(
      "/user/password",
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "changePassword");
  }
};

export const updateUserType = async (
  userId: UserInfo["id"],
  type: string
): Promise<ApiResult<UserInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.put<ApiResponse<UserInfo>>(
      `/user/${userId}/type`,
      { userType: type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateUserType");
  }
};

interface BookUploadData
  extends Omit<
    BookInfo,
    | "id"
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
    | "wordCount"
    | "tags"
    | "authorIntroduction"
    | "views"
  > {
  coverImageUrl?: string;
}

export const uploadBookDraft = async (
  coverImage: File | null,
  bookData: BookUploadData
): Promise<ApiResult<BookInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const formData = new FormData();
    const bookDataWithStatus = {
      ...bookData,
      publishStatus: "draft"
    };

    if (coverImage) {
      formData.append("coverImage", coverImage);
    } else if (bookData.coverImageUrl) {
      bookDataWithStatus.coverImageUrl = bookData.coverImageUrl;
    }

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

    return response.data;
  } catch (error) {
    return handleApiError(error, "uploadBookDraft");
  }
};

export const publishBook = async (
  coverImage: File | null,
  bookData: BookUploadData
): Promise<ApiResult<BookInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const formData = new FormData();
    const bookDataWithStatus = {
      ...bookData,
      publishStatus: "published"
    };

    if (coverImage) {
      formData.append("coverImage", coverImage);
    } else if (bookData.coverImageUrl) {
      bookDataWithStatus.coverImageUrl = bookData.coverImageUrl;
    }

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

    return response.data;
  } catch (error) {
    return handleApiError(error, "publishBook");
  }
};

export const fetchBooksList = async (
  currentPage: number,
  pageSize: number,
  checkStatus: string
): Promise<ApiResult<PaginatedData<BookInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const params = new URLSearchParams({
      currentPage: currentPage.toString(),
      pageSize: pageSize.toString(),
      checkStatus: checkStatus
    });

    const url = `/user/books?${params.toString()}`;

    const response = await api.get<ApiResponse<PaginatedData<BookInfo>>>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchBooksList");
  }
};

export const fetchPublicBooksList = async (
  authorId: string
): Promise<ApiResult<BookInfo[]>> => {
  try {
    const response = await api.get<ApiResponse<BookInfo[]>>(
      `/public/books/${authorId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchBooksList");
  }
};

export const deleteBook = async (bookId: number): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.delete<ApiResponse<void>>(`/book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "deleteBook");
  }
};

export const getBookDetails = async (
  bookId: number
): Promise<ApiResult<BookInfo>> => {
  try {
    const response = await api.get<ApiResponse<BookInfo>>(`/book/${bookId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "getBookDetails");
  }
};

export const getPublicChapterList = async (
  bookId: number,
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResult<PaginatedData<ChapterInfo>>> => {
  try {
    const response = await api.get<ApiResponse<PaginatedData<ChapterInfo>>>(
      `/book/public/${bookId}/chapters`,
      {
        params: { currentPage, pageSize }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "getPublicChapterList");
  }
};
export const getChapterList = async (
  bookId: number,
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResult<PaginatedData<ChapterInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.get<ApiResponse<PaginatedData<ChapterInfo>>>(
      `/book/${bookId}/chapters`,
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "getChapterList");
  }
};

export const getChapterContent = async (
  bookId: number,
  chapterNumber: number
): Promise<ApiResult<ChapterInfo>> => {
  try {
    const response = await api.get<ApiResponse<ChapterInfo>>(
      `/book/${bookId}/chapter/${chapterNumber}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getChapterContent");
  }
};

export const getPublicChapterContent = async (
  bookId: number,
  chapterNumber: number
): Promise<ApiResult<ChapterInfo>> => {
  try {
    const response = await api.get<ApiResponse<ChapterInfo>>(
      `/book/public/${bookId}/chapter/${chapterNumber}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getPublicChapterContent");
  }
};

export const getBookComments = async (
  bookId: number,
  currentPage: number,
  pageSize: number
): Promise<ApiResult<PaginatedData<CommentInfo>>> => {
  try {
    const response = await api.get<ApiResponse<PaginatedData<CommentInfo>>>(
      `/book/${bookId}/comments`,
      {
        params: { currentPage, pageSize }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getBookComments");
  }
};

export const likeComment = async (
  commentId: number,
  isLiked: boolean
): Promise<ApiResult<LikeResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.post<ApiResponse<LikeResponse>>(
      `/comment/${commentId}/like`,
      { isLiked },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "likeComment");
  }
};

export const addCommentOrReply = async (
  bookId: number,
  content: string,
  parentCommentId?: number
): Promise<ApiResult<CommentInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "addCommentOrReply");
  }
};

export const deleteComment = async (
  commentId: number
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.delete<ApiResponse<void>>(
      `/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "deleteComment");
  }
};

export const blockUserInBook = async (
  userId: number,
  bookId: number
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.post<ApiResponse<void>>(
      `/book/${bookId}/user/${userId}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "blockUserInBook");
  }
};

export const fetchSingleBookAnalytics = async (
  bookId: number
): Promise<ApiResult<AnalyticsData>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<AnalyticsData>>(
      `/book/${bookId}/analytics`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchSingleBookAnalytics");
  }
};

interface LanguageParams {
  preferredLanguage?: string | null;
  browserLanguage?: string | null;
}

export const fetchHomepageBooks = async (
  page: number,
  limit: number = 20,
  languages?: LanguageParams
): Promise<ApiResult<PaginatedData<BookInfo>>> => {
  try {
    const params: Record<string, any> = {
      page,
      limit
    };

    if (languages?.preferredLanguage) {
      params.language = languages.preferredLanguage;
    }

    const defaultLang = "en";
    const response = await api.get<ApiResponse<PaginatedData<BookInfo>>>(
      "/books/homepage",
      {
        params,
        headers: {
          "Accept-Language": [
            languages?.preferredLanguage,
            languages?.browserLanguage,
            defaultLang
          ]
            .filter(Boolean)
            .join(",")
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchHomepageBooks");
  }
};

export const getUserById = async (
  userId: number
): Promise<ApiResult<PublicUserInfo>> => {
  try {
    const response = await api.get<ApiResponse<PublicUserInfo>>(
      `/user/${userId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getUserById");
  }
};

export const fetchSystemNotifications = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResult<PaginatedData<SystemNotification>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<
      ApiResponse<PaginatedData<SystemNotification>>
    >(`/system/notifications`, {
      params: { currentPage, pageSize },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchSystemNotifications");
  }
};

export const markNotificationAsRead = async (): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.put<ApiResponse<void>>(
      "/system/notifications/read",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "markNotificationAsRead");
  }
};

export const getUnreadNotificationCount = async (): Promise<
  ApiResult<number>
> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<number>>(
      "/system/notifications/unread/count",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getUnreadNotificationCount");
  }
};

export const fetchFollowedAuthors = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResult<PaginatedData<PublicUserInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<PaginatedData<PublicUserInfo>>>(
      "/user/following",
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchFollowedAuthors");
  }
};
export const followUser = async (userId: number): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.post<ApiResponse<void>>(
      `/user/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "followUser");
  }
};

export const unfollowUser = async (
  userId: number
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.post<ApiResponse<void>>(
      `/user/${userId}/unfollow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "unfollowUser");
  }
};

export const checkFollowStatus = async (
  userId: number
): Promise<ApiResult<boolean>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 200,
        msg: "Unauthorized",
        data: false
      };
    }
    const response = await api.get<ApiResponse<{ isFollowing: boolean }>>(
      `/user/${userId}/followstatus`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.data || !response.data.data) {
      return {
        code: 200,
        msg: "No data",
        data: false
      };
    }
    return {
      code: response.data.code,
      msg: response.data.msg,
      data: response.data.data.isFollowing
    };
  } catch (error) {
    return handleApiError(error, "checkFollowStatus");
  }
};

export const fetchUserInfo = async (
  userId: string
): Promise<ApiResult<PublicUserInfo>> => {
  try {
    const response = await api.get<ApiResponse<PublicUserInfo>>(
      `/user/${userId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchUserInfo");
  }
};

export const updateBookDetails = async (
  bookId: number,
  updateData: Partial<BookInfo>
): Promise<ApiResult<BookInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateBookDetails");
  }
};

export const updateBookCover = async (
  bookId: number,
  coverImage: File
): Promise<ApiResult<string>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateBookCover");
  }
};

export const updateChapter = async (
  bookId: number,
  chapterNumber: number,
  chapterData: Partial<ChapterInfo>
): Promise<ApiResult<ChapterInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.put<ApiResponse<ChapterInfo>>(
      `/book/${bookId}/chapter/${chapterNumber}`,
      chapterData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateChapter");
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
): Promise<ApiResult<ChapterInfo>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "addNewChapter");
  }
};

export const getUserTotalIncome = async (): Promise<ApiResult<number>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.get<ApiResponse<number>>(
      "/user/wallet/earnings",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getUserTotalIncome");
  }
};

export const fetchIncomeData = async (
  currentPage: number = 1,
  pageSize: number = 5
): Promise<ApiResult<PaginatedData<IncomeBookInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<PaginatedData<IncomeBookInfo>>>(
      `/user/books/income`,
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "fetchIncomeData");
  }
};

export const favoriteBook = async (
  bookId: number
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "favoriteBook");
  }
};

export const unfavoriteBook = async (
  bookId: number
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "unfavoriteBook");
  }
};

export const getUserFavorites = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResult<PaginatedData<BookInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<PaginatedData<BookInfo>>>(
      "/user/favorites",
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "getUserFavorites");
  }
};

export const checkBookFavoriteStatus = async (
  bookId: number
): Promise<ApiResult<boolean>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<boolean>>(
      `/book/${bookId}/favorite-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "checkBookFavoriteStatus");
  }
};

export const publicSearchBooks = async (
  query: string
): Promise<ApiResult<SearchResult>> => {
  try {
    const response = await api.get<ApiResponse<SearchResult>>("/search", {
      params: { query: query }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "publicSearchBooks");
  }
};

export const searchBooks = async (
  query: string
): Promise<ApiResult<SearchResult>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.get<ApiResponse<SearchResult>>("/user/search", {
      params: { query: query },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "searchBooks");
  }
};

export const getSearchHistory = async (): Promise<
  ApiResult<SearchHistoryItem[]>
> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<SearchHistoryItem[]>>(
      "/search/history",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "getSearchHistory");
  }
};

export const createPayPalOrder = async (
  orderData: PayPalOrderRequest
): Promise<ApiResult<PayPalOrderResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "createPayPalOrder");
  }
};
export const confirmPayPalOrder = async (
  orderData: ConfirmPayPalOrderRequest
): Promise<ApiResult<ConfirmPayPalOrderResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "confirmPayPalOrder");
  }
};

export const getUserBalance = async (): Promise<ApiResult<UserBalance>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<UserBalance>>("/user/balance", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "getUserBalance");
  }
};

export const getPurchaseHistory = async (
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResult<PaginatedData<PurchaseHistory>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "getPurchaseHistory");
  }
};

export const getDonationHistory = async (
  currentPage: number = 1,
  pageSize: number = 5
): Promise<ApiResult<PaginatedData<DonationHistory>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "getDonationHistory");
  }
};

export const getSponsorList = async (
  userId: string,
  currentPage: number = 1,
  pageSize: number = 20
): Promise<ApiResult<PaginatedData<SponsorInfo>>> => {
  try {
    const response = await api.get<ApiResponse<PaginatedData<SponsorInfo>>>(
      `/user/${userId}/donation/list`,
      {
        params: { currentPage, pageSize }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "getSponsorList");
  }
};

export const payForChapter = async (
  bookId: number,
  chapterId: number
): Promise<ApiResult<ChapterPaymentResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
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

    return response.data;
  } catch (error) {
    return handleApiError(error, "payForChapter");
  }
};

export const tipAuthor = async (
  authorId: number,
  coins: number
): Promise<ApiResult<TipResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.post<ApiResponse<TipResponse>>(
      `/user/${authorId}/donation`,
      { coins },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "tipAuthor");
  }
};

export const tipChapter = async (
  coins: number,
  bookId: number,
  chapterId: number
): Promise<ApiResult<TipResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.post<ApiResponse<TipResponse>>(
      `/book/${bookId}/${chapterId}/donation`,
      { coins },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "tipChapter");
  }
};

export const getBookPurchasedChapters = async (
  currentPage: number = 1,
  pageSize: number = 5,
  bookId?: number
): Promise<ApiResult<PaginatedData<PurchasedChapterInfo>>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<
      ApiResponse<PaginatedData<PurchasedChapterInfo>>
    >("/book/chapters/purchased", {
      params: { bookId, currentPage, pageSize },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "getBookPurchasedChapters");
  }
};

// Reading progress APIs
const updateAnonymousReadingStats = async (
  data: ReadingStats & { isValidReading: boolean }
): Promise<ApiResult<void>> => {
  try {
    const isCompleted = data.isValidReading && data.readingProgress >= 95;

    const response = await api.post<ApiResponse<void>>("/reading/stats", {
      ...data,
      isCompleted
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, "updateAnonymousReadingStats");
  }
};

const updateUserReadingProgress = async (
  data: ReadingStats & { isValidReading: boolean }
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    const isCompleted = data.isValidReading && data.readingProgress >= 95;

    if (!token) {
      const storageKey = `reading_progress_${data.bookId}_${data.chapterId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...data,
          isCompleted,
          timestamp: Date.now()
        })
      );
      return {
        code: 200,
        msg: "Reading progress saved locally",
        data: undefined
      };
    }

    const response = await api.post<ApiResponse<void>>(
      "/reading/progress",
      {
        ...data,
        isCompleted
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "updateUserReadingProgress");
  }
};

export const getUserReadingProgress = async (
  bookId: number,
  chapterId: number
): Promise<ApiResult<ReadingStats>> => {
  try {
    const token = getToken();
    if (!token) {
      const storageKey = `reading_progress_${bookId}_${chapterId}`;
      const savedProgress = localStorage.getItem(storageKey);

      if (savedProgress) {
        return {
          code: 200,
          msg: "Reading progress retrieved from local storage",
          data: JSON.parse(savedProgress)
        };
      }

      return {
        code: 200,
        msg: "No reading progress found",
        data: {
          bookId,
          chapterId,
          startTime: 0,
          activeTime: 0,
          readingProgress: 0,
          totalWords: 0,
          isActive: false,
          isValidReading: false
        }
      };
    }

    const response = await api.get<ApiResponse<ReadingStats>>(
      "/reading/progress",
      {
        params: { bookId, chapterId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "getUserReadingProgress");
  }
};

const updateReadingStats = async (
  data: ReadingStats & { isValidReading: boolean }
): Promise<ApiResult<void>> => {
  try {
    // 1. 更新匿名统计数据
    await updateAnonymousReadingStats(data);
    // 2. 更新用户阅读进度
    const response = await updateUserReadingProgress(data);
    return response;
  } catch (error) {
    return handleApiError(error, "updateReadingStats");
  }
};

export const transferToWallet = async (
  amount: number
): Promise<ApiResult<TransferToWalletResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.post<ApiResponse<TransferToWalletResponse>>(
      "/user/transfer/wallet",
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "transferToWallet");
  }
};

export const getTransferRecords = async (
  page: number,
  pageSize: number
): Promise<ApiResult<PaginatedTransferRecords>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }

    const response = await api.get<ApiResponse<PaginatedTransferRecords>>(
      "/user/transfer/records",
      {
        params: { page, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getTransferRecords");
  }
};

export const getBankCards = async (): Promise<
  ApiResult<PaginatedBankCards>
> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.get<ApiResponse<PaginatedBankCards>>(
      "/user/bankcards",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getBankCards");
  }
};

export const addBankCard = async (
  card: AddBankCardRequest
): Promise<ApiResult<BankCard>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.post<ApiResponse<BankCard>>(
      "/user/bankcard",
      card,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "addBankCard");
  }
};

export const submitWithdrawRequest = async (
  request: WithdrawRequest
): Promise<ApiResult<WithdrawResponse>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.post<ApiResponse<WithdrawResponse>>(
      "/user/withdraw",
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "submitWithdrawRequest");
  }
};

export const getWithdrawHistory = async (
  currentPage: number = 1,
  pageSize: number = 10
): Promise<ApiResult<PaginatedWithdrawRecords>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.get<ApiResponse<PaginatedWithdrawRecords>>(
      "/user/withdraw/records",
      {
        params: { currentPage, pageSize },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getWithdrawHistory");
  }
};

export const deleteBankCard = async (
  cardId: string
): Promise<ApiResult<void>> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        code: 401,
        msg: "Unauthorized"
      };
    }
    const response = await api.delete<ApiResponse<void>>(
      `/user/bankcard/${cardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "deleteBankCard");
  }
};

export {
  updateReadingStats,
  updateAnonymousReadingStats,
  updateUserReadingProgress
};

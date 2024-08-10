import {
  CreateUserRequest,
  LoginRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserInfo,
  ApiResponse,
  BookInfo,
  PaginatedData,
  SearchRequest,
  SearchResponse,
  CreatorUserInfo
} from "./definitions";
import { getToken, removeToken, setToken } from "./token";
import axios, { AxiosResponse } from "axios";

let token: string | null = null;

// 创建 axios 实例
const api = axios.create({
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
  credentials: LoginRequest
): Promise<ApiResponse<string>> => {
  try {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response: AxiosResponse<ApiResponse<string>> = await api.post(
      "http://8.142.44.107:8088/inworlds/api/login",
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

// 获取用户信息
let originToken: string = "";

export const getUserInfo = async (
  token: string = originToken
): Promise<ApiResponse<UserInfo>> => {
  try {
    const response: AxiosResponse<ApiResponse<UserInfo>> = await api.get(
      "http://8.142.44.107:8088/inworlds/api/user/principal",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "获取用户信息失败");
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
  const token = getToken() as string;
  if (!token) {
    console.error("在localStorage中未找到token");
    throw new Error("未找到��证token");
  }

  try {
    console.log("尝试从API获取数据");
    const response = await api.post<{ code: number; msg: string }>(
      "http://8.142.44.107:8088/inworlds/api/logout",
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

    if (result.code === 200) {
      removeToken();
      originToken = "";
    } else {
      console.warn("注销API返回非200状态码:", result.code, result.msg);
    }

    return result;
  } catch (error) {
    console.error("注销过程中出错:", error);
    throw error;
  }
}

export async function register(
  credentials: CreateUserRequest
): Promise<ApiResponse<UserInfo>> {
  try {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("email", credentials.email);

    const response = await api.post<ApiResponse<UserInfo>>(
      "http://8.142.44.107:8088/inworlds/api/user/register",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    return response.data;
  } catch (error) {
    console.error("注册失败:", error);
    throw error;
  }
}

export const updateProfile = async (
  updateData: UpdateUserRequest,
  token: string
): Promise<ApiResponse<UserInfo>> => {
  try {
    const formData = new FormData();

    // 添加可选字段
    if (updateData.displayName)
      formData.append("displayName", updateData.displayName);
    if (updateData.email) formData.append("email", updateData.email);
    if (updateData.avatarImage)
      formData.append("avatarImage", updateData.avatarImage);
    if (updateData.avatarUrl)
      formData.append("avatarUrl", updateData.avatarUrl);
    if (updateData.introduction)
      formData.append("introduction", updateData.introduction);

    const response = await api.put<ApiResponse<UserInfo>>(
      "http://8.142.44.107:8088/inworlds/api/user/profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
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

export const changePassword = async (
  passwordData: ChangePasswordRequest,
  token: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.put<ApiResponse<void>>(
      "http://8.142.44.107:8088/inworlds/api/user/profile",
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || "修改密码失败");
    }

    return response.data;
  } catch (error) {
    console.error("修改密码时出错:", error);
    throw error;
  }
};
export const uploadBookDraft = async (
  coverImage: File,
  bookData: Omit<
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
  status: "draft" | "published"
): Promise<ApiResponse<BookInfo>> => {
  try {
    const formData = new FormData();
    formData.append("coverImage", coverImage);

    const bookDataWithStatus = {
      ...bookData,
      status
    };

    formData.append("bookData", JSON.stringify(bookDataWithStatus));

    const response = await api.post<ApiResponse<BookInfo>>(
      "http://8.142.44.107:8088/inworlds/api/book/draft",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (response.data.code !== 200 || !response.data.data) {
      throw new Error(response.data.msg || "服务器返回的数据无效");
    }

    return response.data;
  } catch (error) {
    console.error("Error uploading book draft:", error);
    throw error;
  }
};

export const updateUserType = async (
  userId: UserInfo["id"], // 使用 UserInfo['id'] 来确保类型一致性
  token: string
): Promise<ApiResponse<CreatorUserInfo>> => {
  try {
    const response = await api.put<ApiResponse<CreatorUserInfo>>(
      `http://8.142.44.107:8088/inworlds/api/user/${userId}/type`,
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

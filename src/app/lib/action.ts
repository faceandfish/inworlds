import {
  LoginCredentials,
  LoginResponse,
  UserResponse,
  RegisterCredentials,
  RegisterResponse,
  UpdateProfileCredentials,
  UpdateProfileResponse,
} from "./definitions";
import { getToken, removeToken, setToken } from "./token";

const API_BASE_URL = "http://8.142.44.107:8088/inworlds/api";

let token: string | null = null;

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    console.log("Login function called with credentials:", credentials);
    // 创建 FormData 对象
    const formData = new FormData();

    formData.append("loginAct", credentials.loginAct);
    formData.append("loginPwd", credentials.loginPwd);

    console.log("FormData contents:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    console.log("Sending request to:", `${API_BASE_URL}/login`);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      // 不需要设置 Content-Type，fetch 会自动设置正确的值
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Server response data:", data);

    if (data.code !== 200) {
      throw new Error(data.msg || "Login failed");
    }

    return data;
  } catch (error) {
    throw error; // 重新抛出错误，让调用者处理
  }
};

let originToken: string = "";

export async function getUserInfo(
  token: string = originToken
): Promise<UserResponse> {
  if (!token) {
    return { code: 401, msg: "Not authenticated", data: null };
  } else {
    originToken = token;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/principal`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("🚀 ~ getUserInfo ~ data:", data);

    if (data.code === 200) {
      return data;
    } else {
      console.error("Unexpected response:", data);
      return { code: data.code, msg: data.msg, data: null };
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { code: 500, msg: "Error fetching user info", data: null };
  }
}

export async function logout(): Promise<{ code: number; msg: string }> {
  console.log("Logout function called");
  console.log("All localStorage items:", { ...localStorage });

  const token = getToken();
  console.log("🚀 ~ logout ~ token:", token);

  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("No authentication token found");
  }

  try {
    console.log("Attempting to fetch from API");
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API response received, status:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Logout failed with status ${response.status}. Response body:`,
        errorBody
      );
      throw new Error(
        `Logout failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("API result:", result);

    if (result.code === 200) {
      removeToken();
      originToken = "";
    } else {
      console.warn(
        "Logout API returned non-200 code:",
        result.code,
        result.msg
      );
    }

    return result;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

export async function register(
  credentials: RegisterCredentials
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

export const updateProfile = async (
  credentials: UpdateProfileCredentials,
  token: string
): Promise<UpdateProfileResponse> => {
  try {
    const formData = new FormData();

    // 添加必需的 id 字段
    formData.append("id", credentials.id.toString());

    // 添加可选字段
    if (credentials.loginPwd) formData.append("loginPwd", credentials.loginPwd);
    if (credentials.reLoginPwd)
      formData.append("reLoginPwd", credentials.reLoginPwd);
    if (credentials.name) formData.append("name", credentials.name);
    if (credentials.introduction)
      formData.append("introduction", credentials.introduction);
    if (credentials.avatarFile)
      formData.append("avatarFile", credentials.avatarFile);

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // 正确的 token 格式
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UpdateProfileResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(data.msg || "Profile update failed");
    }

    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

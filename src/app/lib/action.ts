import {
  LoginCredentials,
  LoginResponse,
  UserResponse,
  RegisterCredentials,
  RegisterResponse,
} from "./definitions";

const API_BASE_URL = "http://8.142.44.107:8088/inworlds/api";

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    // 创建 FormData 对象
    const formData = new FormData();
    formData.append("loginAct", credentials.loginAct);
    formData.append("loginPwd", credentials.loginPwd);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      // 不需要设置 Content-Type，fetch 会自动设置正确的值
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 200) {
      throw new Error(data.msg || "Login failed");
    }

    return data;
  } catch (error) {
    throw error; // 重新抛出错误，让调用者处理
  }
};

export async function getUserInfo(): Promise<UserResponse> {
  if (typeof window === "undefined") {
    return { code: 401, msg: "Not authenticated", data: null };
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return { code: 401, msg: "Not authenticated", data: null };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/principal`, {
      method: "GET", // 明确指定方法
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("🚀 ~ getUserInfo ~ data:", data);

    return { code: 200, msg: "Success", data: data.data };
  } catch (error) {
    return { code: 500, msg: "Error fetching user info", data: null };
  }
}

export async function logout(): Promise<{ code: number; msg: string }> {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
    });

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

    if (result.code === 200) {
      localStorage.removeItem("token");
      console.log("Logout successful, token removed from localStorage");
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

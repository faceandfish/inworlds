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
    console.log("Sending login request...");
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("Received response:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Parsed response data:", data);

    if (data.code !== 200) {
      throw new Error(data.msg || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Error in login function:", error);
    throw error; // 重新抛出错误，让调用者处理
  }
};

export async function getUserInfo(): Promise<UserResponse> {
  const token = localStorage.getItem("token"); // 假设我们在登录后将 token 存储在 localStorage
  const response = await fetch(`${API_BASE_URL}/user/principal`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}

export async function logout(): Promise<{ code: number; msg: string }> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST", // 使用 POST 方法，但 GET 也应该可以工作
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  const result = await response.json();

  if (result.code === 200) {
    // 清除本地存储的 token
    localStorage.removeItem("token");
  }

  return result;
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

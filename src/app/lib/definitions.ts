// types/user.ts
export interface User {
  // 根据API返回的实际用户信息定义字段
  id: number;
  loginAct: string;
  name: string;
  email: string;
  // ... 其他字段
}

export interface LoginCredentials {
  loginAct: string;
  loginPwd: string;
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface LoginResponse extends ApiResponse<string> {
  // data 字段是 JWT token
  data: string;
}

export interface UserResponse extends ApiResponse<User> {
  // data 字段是用户信息
  data: User;
}

export interface RegisterCredentials {
  loginAct: string;
  email: string;
  loginPwd: string;
  reLoginPwd: string;
}

export interface RegisterResponse {
  code: number;
  msg: string;
}

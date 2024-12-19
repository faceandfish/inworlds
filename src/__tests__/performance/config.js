export const BASE_URL = "http://localhost:3000"; // 本地测试环境
// export const BASE_URL = 'https://dev.inworlds.xyz';  // 开发环境

export const SLEEP_DURATION = 1; // 请求间隔时间(秒)

// 测试用户信息
export const TEST_USER = {
  email: "test@example.com",
  password: "password123"
};

// 常用的测试路径
export const PATHS = {
  HOME: "/",
  BOOKS: "/books",
  LOGIN: "/login",
  API: {
    BOOKS: "/api/books",
    COMMENTS: "/api/comments",
    SEARCH: "/api/search"
  }
};

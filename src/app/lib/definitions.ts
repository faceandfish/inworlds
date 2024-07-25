export interface User {
  // 基本信息
  id: string;
  loginAct: string;
  avatarUrl: string;
  bio: string;
  mail: string;

  // 计数
  articlesCount: number;
  followersCount: number;
  followingCount: number;
  favoritesCount: number;

  // 文章
  articles: {
    items: Array<{
      id: string;
      title: string;
      summary: string;
      createdAt: string;
      // 其他文章相关字段
    }>;
    page: number;
    hasMore: boolean;
  };

  // 粉丝
  followers: {
    items: Array<{
      id: string;
      loginAct: string;
      avatarUrl: string;
      // 其他需要的粉丝信息
    }>;
    page: number;
    hasMore: boolean;
  };

  // 关注
  following: {
    items: Array<{
      id: string;
      loginAct: string;
      avatarUrl: string;
      // 其他需要的关注用户信息
    }>;
    page: number;
    hasMore: boolean;
  };

  // 收藏
  favorites: {
    items: Array<{
      id: string;
      itemType: "article" | "comment" | "user";
      itemId: string;
      // 其他收藏相关字段
    }>;
    page: number;
    hasMore: boolean;
  };
}

export interface BookInfo {
  id: number;
  title: string;
  description: string;
  category:
    | "female-story"
    | "male-story"
    | "children-story"
    | "literature-story"
    | "biography";
  ageRating: "under18" | "adult" | "allAges";
  coverImage: File | null;
  content: string;
  authorNote?: string;
  wordCount: number;
  lastSaved: string;
  onSaveDraft: () => void;
  onPublish: () => void;
  updateSectionContent: (id: number, content: string) => void;
}
export interface TotalPages {
  totalPages: number;
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

export type UserResponse =
  | { code: 200; msg: string; data: User }
  | { code: 401; msg: string; data: null }
  | { code: 500; msg: string; data: null };

export interface LoginResponse extends ApiResponse<string> {
  // data 字段是 JWT token
  data: string;
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

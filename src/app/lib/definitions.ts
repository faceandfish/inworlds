export interface UserInfo {
  // 基本信息
  id: number;
  name?: string; //昵称 最好是修改成 displayName
  authorname?: string; //作者名
  loginAct: string; // 用户名 最好是修改成 userName
  avatarFile?: string; //头像  最好是改成 avatarUrl
  introduction?: string; //简介
  email: string; //邮箱
  createdAt: string; //注册时间

  // 计数
  articlesCount?: number; //文章数量
  followersCount: number; //粉丝数量
  followingCount: number; //关注人数
  favoritesCount: number; //收藏数量

  // 文章
  articles?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      createdAt: string; //创建时间
      // 其他文章相关字段
    }>;
    page: number;
  };

  // 粉丝
  followers: {
    items: Array<{
      id: string;
      loginAct: string;
      avatarFile: string;
      // 其他需要的粉丝信息
    }>;
  };

  // 关注
  following: {
    items: Array<{
      id: string;
      loginAct: string;
      avatarFile: string;
      // 其他需要的关注用户信息
    }>;
  };

  // 收藏
  favorites: {
    items: Array<{
      id: string;
      coverImage: File | null; //封面
      title: string;
      // 其他收藏相关字段
    }>;
  };
}

export interface Chapter {
  id: number;
  number: string; // 例如: "第一章", "第二章" 等
  title: string;
  content?: string; // 章节内容，可选
}

//一本书的内容
export interface BookInfo {
  id: number;
  title: string; //书名
  description: string; //简介
  category: //分类
  | "female-story"
    | "male-story"
    | "children-story"
    | "literature-story"
    | "biography";
  ageRating: "under18" | "adult" | "allAges"; //年龄分级
  coverImage: File | null; //封面
  content: string; //小说内容
  authorNote?: string; //作者留言
  wordCount: number; //字数统计
  lastSaved: string; //最后保存时间
  createdAt: string;
  onSaveDraft: () => void; //保存到草稿箱
  onPublish: () => void; //公开发布
  updateSectionContent: (id: number, content: string) => void; // 修改内容
  status: boolean; // 书籍状态，是否完结
  latestChapterNumber: number; //最近章节
  latestChapterTitle: string; //最新章节名
  chapters: Chapter[]; // 章节列表
}

//留言
export interface Comment {
  id: number;
  content: string; //留言内容
  username: string; // 用户名
  createdAt: string; //留言时间
  likes: number; // 喜欢
  bookId: number;
}

export interface MonthlyIncome {
  month: string;
  income: number;
}

//收入
export interface IncomeData {
  totalIncome: number;
  adIncome: number;
  donationIncome: number;
  copyrightIncome: number;
  monthlyIncome: MonthlyIncome[];
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
  | { code: 200; msg: string; data: UserInfo }
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

export interface UpdateProfileCredentials {
  id: number;
  loginPwd?: string;
  reLoginPwd?: string;
  name?: string;
  avatarFile?: string;
  introduction?: string;
}

export interface UpdateProfileResponse {
  code: number;
  msg: string;
  data: null;
}

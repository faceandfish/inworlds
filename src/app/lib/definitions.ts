// 基础用户信息
interface BaseUserInfo {
  id: number;
  username: string;
  displayName?: string;
  email: string;
  avatarUrl?: string | null;
  avatarImage?: File | null;
  introduction?: string;
  createdAt: string;
}

// 用于创建新用户的接口
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  introduction?: string;
}

// 用于用户登录的接口
export interface LoginRequest {
  username: string;
  password: string;
}

// 用于更新用户信息的接口
export interface UpdateUserRequest {
  displayName?: string;
  email?: string;
  avatarImage?: File | null;
  avatarUrl?: string | null;
  introduction?: string;
}

// 用于更改密码的接口
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 普通用户信息
export interface RegularUserInfo extends BaseUserInfo {
  userType: "regular";
}

// 创作者用户信息
export interface CreatorUserInfo extends BaseUserInfo {
  userType: "creator";
  articlesCount: number;
  followersCount: number;
  followingCount: number;
  favoritesCount: number;
}

// 统一的用户信息类型
export type UserInfo = RegularUserInfo | CreatorUserInfo;

// 用户关系信息
export interface UserRelationInfo {
  id: string;
  username: string;
  avatarUrl: string | null;
  relationshipType: "follower" | "following";
}

// 收藏信息
export interface FavoriteInfo {
  id: string;
  coverImageUrl: string | null;
  title: string;
  type: "book" | "article"; // 区分收藏的是书籍还是文章
  creatorId: number; // 创作者ID
}

// 分页数据
export interface PaginatedData<T> {
  currentPage: number; // 当前页码
  pageSize: number; // 每页数据量
  totalPage: number; // 总页数
  totalRecord: number; // 总记录数
  dataList: T[]; // 当前页的数据列表
}

// 图片上传请求
export interface ImageUploadRequest {
  file: File;
  type: "avatar" | "bookCover";
}

// 图片上传响应
export interface ImageUploadResponse {
  url: string;
  fileId: string; // 可能需要的文件标识符
}

// 章节信息
export interface ChapterInfo {
  id: number;
  bookId?: number; // 添加这个字段来关联到特定的书
  chapterNumber: number; // 添加章节序号
  title: string;
  content?: string;
  createdAt: string;
  lastModified: string;
  wordCount: number;
}

// 书籍信息
export interface BookInfo {
  id: number;
  title: string;
  description: string;
  authorName: string;
  authorNote?: string;
  authorId: number; // 添加作者ID

  category:
    | "female-story"
    | "male-story"
    | "children-story"
    | "literature-story"
    | "personal-story";
  ageRating: "under18" | "adult" | "allAges";
  coverImageUrl: string | null;
  coverImage: File | null;

  wordCount: number;
  lastSaved: string;
  createdAt: string;
  latestChapterNumber: number;
  latestChapterTitle: string;

  tags?: string[]; // 可选的标签
  followersCount: number; //收藏本书的人数
  chapters?: ChapterInfo[];

  status: "ongoing" | "completed"; // 书籍的连载状态：连载中或已完结
  publishStatus: "draft" | "published"; // 书籍的发布状态：草稿（仅作者可见）或已发布（所有人可见）
}

// 评论信息
export interface CommentInfo {
  id: number;
  content: string;
  replyCount: number;
  username: string;
  createdAt: string;
  likes: number;
  bookId: number;
  parentCommentId?: number; // 用于回复功能
  userId: number; // 评论者ID
}

// 收入数据
export interface IncomeData {
  totalIncome: number;
  adIncome: number;
  donationIncome: number;
  copyrightIncome: number;
  monthlyIncome: { month: string; income: number }[];
  currency: string; // 添加货币类型
}

// 定义分析数据接口
export interface AnalyticsData {
  bookId: number;
  views: number;
  viewsLast24h: number;
  likes: number;
  comments: number;
  totalIncome: number;
  incomeLast24h: number;
}

// API 响应接口
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 登录凭证
export interface LoginCredentials {
  username: string;
  password: string;
}

// 注册凭证
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 更新用户资料凭证
export interface UpdateProfileCredentials {
  id: number;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
  introduction?: string;
  avatarImage?: File | null;
  avatarUrl: string | null;
}

// 消息系统相关接口
export interface SystemNotification {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  type: "info" | "warning" | "error"; // 添加通知类型
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  isRead: boolean; // 添加已读状态
}

export interface Conversation {
  id: number;
  participants: number[];
  lastMessage: Message;
  unreadCount: number;
  systemNotifications?: SystemNotification[];
  createdAt: string; // 添加对话创建时间
}

export interface MessagingState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  systemNotifications: SystemNotification[];
}

export interface SendMessageRequest {
  senderId: number;
  receiverId: number;
  content: string;
}

// 搜索请求接口
export interface SearchRequest {
  query: string;
  type: "book" | "article" | "user";
  filters?: {
    category?: string;
    ageRating?: string;
    dateRange?: { start: string; end: string };
  };
  page: number;
  pageSize: number;
}

// 搜索响应接口
export interface SearchResponse<T> extends ApiResponse<PaginatedData<T>> {}
